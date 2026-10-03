import React, { useState, useEffect, useRef } from "react";
import {
  Languages,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  FileText,
  Check,
  Loader2,
  Play,
  Square,
  Radio,
  HelpCircle,
  Compass,
  Search,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Navigation,
  BookOpen,
  Bell,
  CheckCircle,
  FileSearch,
  Upload,
  RefreshCw,
  Maximize2
} from "lucide-react";
import { SupportedLanguage, LANGUAGES_INFO, DIALECTS, TRANSLATIONS, t } from "../utils/translation";
import { UserRole } from "../types";

interface MultilingualVoiceManagerProps {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  onVoiceDataEntry?: (field: string, text: string) => void;
}

interface OCRResult {
  docType: string;
  detectedLanguage: string;
  parties: string[];
  keyDetails: string[];
  extractedSummary: string;
  confidenceScore: number;
}

interface VoiceCommand {
  phrase: string;
  action: string;
  category: "Navigation" | "Search" | "Alerts" | "Information";
}

export default function MultilingualVoiceManager({
  activeRole,
  setActiveRole,
  onVoiceDataEntry
}: MultilingualVoiceManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"translation" | "voice_assistant" | "ocr" | "help">("translation");
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("English");
  const [currentDialect, setCurrentDialect] = useState<string>("Standard");
  
  // Audio & Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceLogs, setVoiceLogs] = useState<string[]>([]);
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);

  // Voice Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ name: string; category: string; description: string }[]>([]);

  // OCR Document States
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [ocrError, setOcrError] = useState("");

  // Speech Recognition Reference
  const recognitionRef = useRef<any>(null);

  // Load user language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("agri_connect_lang") as SupportedLanguage;
    if (savedLang && LANGUAGES_INFO[savedLang]) {
      setCurrentLanguage(savedLang);
      // Notify parent components via standard window variable for automated translation
      (window as any).__currentLang = savedLang;
      // Trigger a custom event so other components can re-render if listening
      window.dispatchEvent(new CustomEvent("languageChange", { detail: savedLang }));
    }
    const savedDialect = localStorage.getItem("agri_connect_dialect");
    if (savedDialect) {
      setCurrentDialect(savedDialect);
    } else if (savedLang) {
      setCurrentDialect(DIALECTS[savedLang]?.[0] || "Standard");
    }
  }, []);

  // Update language settings
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem("agri_connect_lang", lang);
    const defaultDialect = DIALECTS[lang]?.[0] || "Standard";
    setCurrentDialect(defaultDialect);
    localStorage.setItem("agri_connect_dialect", defaultDialect);

    // Dynamic global translation hook
    (window as any).__currentLang = lang;
    window.dispatchEvent(new CustomEvent("languageChange", { detail: lang }));

    addVoiceLog(`Language switched to ${lang} (${LANGUAGES_INFO[lang].native})`);
    speakText(`Language updated to ${lang}`);
  };

  const handleDialectChange = (dialect: string) => {
    setCurrentDialect(dialect);
    localStorage.setItem("agri_connect_dialect", dialect);
    addVoiceLog(`Dialect adapted to: ${dialect}`);
  };

  const addVoiceLog = (log: string) => {
    setVoiceLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${log}`,
      ...prev.slice(0, 15)
    ]);
  };

  // Web Speech Synthesis (TTS)
  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis is not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt language and dialect matching
    const info = LANGUAGES_INFO[currentLanguage];
    if (info) {
      utterance.lang = info.code;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.warn("Speech error handled", e);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Web Speech Recognition (STT) Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        addVoiceLog(`Transcribed: "${resultText}"`);
        processVoiceCommand(resultText);
      };

      rec.onerror = (event: any) => {
        console.warn("Speech Recognition Error handled", event);
        addVoiceLog(`Speech Error: ${event.error || "failed to listen"}`);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [currentLanguage]);

  // Trigger mic listening
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = LANGUAGES_INFO[currentLanguage].code;
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Error starting recognition handled", e);
          addVoiceLog("Mic access error or already active");
        }
      } else {
        addVoiceLog("Microphone API not supported or blocked. Try manual simulation!");
      }
    }
  };

  // Command Processing Engine (Voice-based navigation, Voice search, Audio alerts, Voice data entry)
  const processVoiceCommand = async (command: string) => {
    const lower = command.toLowerCase().trim();
    addVoiceLog(`Analyzing query: "${command}"`);

    // 1. Voice Navigation
    const navMapping: Record<string, UserRole> = {
      farmer: UserRole.FARMER,
      రైతు: UserRole.FARMER,
      किसान: UserRole.FARMER,
      விவசாயி: UserRole.FARMER,
      ರೈತ: UserRole.FARMER,
      शेतकरी: UserRole.FARMER,
      ખેડૂત: UserRole.FARMER,
      কৃষক: UserRole.FARMER,
      ਕਿਸਾਨ: UserRole.FARMER,
      കർഷകൻ: UserRole.FARMER,

      buyer: UserRole.BUYER,
      కొనుగోలు: UserRole.BUYER,
      खरीदार: UserRole.BUYER,
      வாங்குபவர்: UserRole.BUYER,
      ಖರೀದಿದಾರ: UserRole.BUYER,
      खरेदीदार: UserRole.BUYER,
      ખરીદનાર: UserRole.BUYER,
      ক্রেতা: UserRole.BUYER,
      ਖਰੀਦਦਾਰ: UserRole.BUYER,
      വാങ്ങുന്നയാൾ: UserRole.BUYER,

      government: UserRole.GOVERNMENT,
      ప్రభుత్వం: UserRole.GOVERNMENT,
      सरकार: UserRole.GOVERNMENT,
      அரசாங்கம்: UserRole.GOVERNMENT,
      ಸರ್ಕಾರ: UserRole.GOVERNMENT,
      शासन: UserRole.GOVERNMENT,
      സംസ്ഥാനം: UserRole.GOVERNMENT,
      ਸਰਕਾਰ: UserRole.GOVERNMENT,

      supplier: UserRole.SUPPLIER,
      సరఫరా: UserRole.SUPPLIER,
      आपूर्तिकर्ता: UserRole.SUPPLIER,
      வழங்குநர்: UserRole.SUPPLIER,
      ಪೂರೈಕೆದಾರ: UserRole.SUPPLIER,
      पुरवठादार: UserRole.SUPPLIER,

      expert: UserRole.EXPERT,
      నిపుణుడు: UserRole.EXPERT,
      विशेषज्ञ: UserRole.EXPERT,
      நிபுணர்: UserRole.EXPERT,
      ತಜ್ಞ: UserRole.EXPERT,
      तज्ञ: UserRole.EXPERT,

      logistics: UserRole.LOGISTICS,
      రవాణా: UserRole.LOGISTICS,
      रसद: UserRole.LOGISTICS,
      போக்குவரத்து: UserRole.LOGISTICS,
      ಸಾರಿಗೆ: UserRole.LOGISTICS,

      warehouse: UserRole.WAREHOUSE,
      వేర్‌హౌస్: UserRole.WAREHOUSE,
      गोदाम: UserRole.WAREHOUSE,
      கிடங்கு: UserRole.WAREHOUSE,
      ಉಗ್ರಾಣ: UserRole.WAREHOUSE,

      insurance: UserRole.INSURANCE,
      భీమా: UserRole.INSURANCE,
      बीमा: UserRole.INSURANCE,
      காப்பீடு: UserRole.INSURANCE,
      ವಿಮೆ: UserRole.INSURANCE,

      bank: UserRole.BANK,
      బ్యాంక్: UserRole.BANK,
      बैंक: UserRole.BANK,
      வங்கி: UserRole.BANK,
      ಬ್ಯಾಂಕ್: UserRole.BANK,

      researcher: UserRole.RESEARCHER,
      పరిశోధన: UserRole.RESEARCHER,
      शोधकर्ता: UserRole.RESEARCHER,
      ஆராய்ச்சியாளர்: UserRole.RESEARCHER,

      extension: UserRole.EXTENSION,
      విస్తరణ: UserRole.EXTENSION,
      विस्तार: UserRole.EXTENSION,

      admin: UserRole.ADMIN,
      అడ్మిన్: UserRole.ADMIN,
      प्रशासक: UserRole.ADMIN,
    };

    let matchedRole: UserRole | null = null;
    for (const key of Object.keys(navMapping)) {
      if (lower.includes(key)) {
        matchedRole = navMapping[key];
        break;
      }
    }

    if (matchedRole) {
      setActiveRole(matchedRole);
      addVoiceLog(`[ACTION] Voice Navigation triggered: Switched to ${matchedRole}`);
      speakText(`Navigated to ${matchedRole} workspace`);
      return;
    }

    // 2. Voice Search
    if (
      lower.includes("search") ||
      lower.includes("find") ||
      lower.includes("వెతుకు") ||
      lower.includes("खोज") ||
      lower.includes("தேடு") ||
      lower.includes("ಹುಡುಕು")
    ) {
      const q = lower
        .replace("search", "")
        .replace("find", "")
        .replace("వెతుకు", "")
        .replace("खोजें", "")
        .replace("खोज", "")
        .replace("தேடு", "")
        .replace("ಹುಡುಕು", "")
        .trim();
      
      setSearchQuery(q);
      executeVoiceSearch(q);
      return;
    }

    // 3. Audio Alert Request
    if (lower.includes("alert") || lower.includes("warning") || lower.includes("హెచ్చరిక") || lower.includes("चेतावनी")) {
      addVoiceLog(`[ACTION] Broadcasted audio alerts`);
      speakText(
        `Weather Alert: Cyclone warning in coastal zone. Expected heavy rainfall. Crop price updates: Basmati Rice wholesale demand remains high at Grade A standards.`
      );
      return;
    }

    // 4. Voice Data Entry Trigger
    if (lower.includes("symptom") || lower.includes("soil") || lower.includes("enter") || lower.includes("నమోదు")) {
      if (onVoiceDataEntry) {
        onVoiceDataEntry("symptoms", command);
        addVoiceLog(`[ACTION] Filled symptoms field with: "${command}"`);
        speakText(`Captured symptoms data successfully`);
        return;
      }
    }

    // 5. General Voice Assistant Conversational Query
    await submitVoiceAssistantQuery(command);
  };

  // Voice Assistant API call
  const submitVoiceAssistantQuery = async (query: string) => {
    setIsGenerating(true);
    setAssistantResponse("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: query }],
          activeRole,
          language: currentLanguage,
          dialect: currentDialect
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setAssistantResponse(data.text);
        addVoiceLog(`AI Voice Assistant answered in ${currentLanguage}`);
        if (audioAlertsEnabled) {
          speakText(data.text);
        }
      } else {
        setAssistantResponse("AI Voice Assistant temporarily offline.");
      }
    } catch (err) {
      console.error(err);
      setAssistantResponse("Failed to connect to AI. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Voice Search Processor
  const executeVoiceSearch = (query: string) => {
    if (!query) return;
    addVoiceLog(`[ACTION] Voice Search executing for: "${query}"`);

    const DATABASE = [
      // Farmers
      { name: "Amir Patel", category: "Farmer", description: "Registered organic farmer in Krishna block. Manages 5.2 acres of Certified Organic Basmati Rice and high-yield pulses." },
      { name: "Vikram Singh", category: "Farmer", description: "Progressive grain cultivator in Guntur block. Manages 12 acres of hybrid wheat and maize crops under precision drip systems." },
      { name: "Rajesh Grewal", category: "Farmer", description: "Smallholder farmer enrolled in solar well programs. Active credit record with 740 score." },
      { name: "Siddharth Roy", category: "Farmer", description: "Horticulture specialist using real-time IoT N-P-K soil sensors and remote drone spray logs." },
      { name: "Lalita Bai", category: "Farmer", description: "Organic tomato cultivator in Bapatla Block. Features 3.5 acres of certified drip irrigated vegetable plots." },
      { name: "Gurpreet Singh", category: "Farmer", description: "Sustainable agriculture advocate. Runs basmati rice blocks with sub-surface watering under drought intervals." },

      // Schemes
      { name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)", category: "Government Scheme", description: "Direct Benefit Transfer (DBT) scheme providing ₹6,000 per year in three installments to farmer bank accounts." },
      { name: "PM-FBY (Pradhan Mantri Fasal Bima Yojana)", category: "Government Scheme", description: "National crop insurance protection program shielding farmers from severe flood, drought, pest, and hail losses." },
      { name: "PM-KUSUM (Solar Water Pumps Subsidy)", category: "Government Scheme", description: "Provides 60% capital subsidy (30% Central, 30% State) for installing off-grid solar-powered water irrigation pumps." },
      { name: "SMAM (Sub-Mission on Agricultural Mechanization)", category: "Government Scheme", description: "Subsidizes agricultural drones, custom tractors, tillage equipment, and localized high-tech custom hiring hubs." },
      { name: "Smallholder Solar Drip Irrigation Subsidy", category: "Government Scheme", description: "Capital backing providing 80% funding for integrated micro-irrigation drip lines and solar kits." },
      { name: "Organic Bio-Fertilizer Transition Program", category: "Government Scheme", description: "Grants enabling cooperative societies to construct village-level vermicomposting pits and transition off synthetic urea." },

      // Reports
      { name: "Monthly Agricultural Executive Briefing", category: "Report", description: "Briefing generated for the Agriculture Minister: Crop Health Index is 84%, total DBT disbursed is ₹24.2 Cr, solar installs at 92%." },
      { name: "Crop Yield Projection Report", category: "Report", description: "Granular district crop performance data: Basmati Rice yields 3.6 tons/acre, Wheat yields 2.8 tons/acre. Stable 4.2% YoY increase." },
      { name: "Disaster Assistance Block Allocation Report", category: "Report", description: "Damage loss report: Guntur West block requires ₹18.5 Crores, Tenali block needs ₹8.2 Cr, Bapatla block requires ₹4.1 Cr." },
      { name: "Soil Health Card Matrix Report", category: "Report", description: "Comprehensive laboratory soil summary: District average pH is 6.4, moisture is 42%, N-P-K balance is stable." },
      { name: "Crop Diagnostics Summary Report", category: "Report", description: "AI image pathology report: Tomato Early Blight verified at 94% confidence, Rice Bacterial Leaf Streak at 88%." },

      // Existing Items
      { name: "Certified Organic Basmati Seeds", category: "Seeds", description: "Grade A high-yield heirloom premium seeds with resistance to blight." },
      { name: "Precision IoT N-P-K Soil Sensor", category: "IoT Sensors", description: "Soil telemetry probes featuring 5-year battery life and real-time cellular links." },
      { name: "Solar Drip Well Submersible Pump System", category: "Machinery", description: "850W solar kit enabling sub-surface watering under drought intervals." }
    ];

    const filtered = DATABASE.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);

    if (filtered.length > 0) {
      speakText(`Found ${filtered.length} matching entries for ${query}`);
    } else {
      speakText(`No direct matches found for ${query}. Displaying close recommendations.`);
    }
  };

  // OCR Document Process
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setOcrError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      setFileBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleOcrSubmit = async () => {
    if (!fileBase64) {
      setOcrError("Please upload or select a document first.");
      return;
    }

    setIsOcrLoading(true);
    setOcrResult(null);
    setOcrError("");

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentBase64: fileBase64,
          documentMime: selectedFile?.type || "image/jpeg",
          targetLanguage: currentLanguage
        })
      });

      const data = await response.json();
      if (response.ok && !data.error) {
        setOcrResult(data);
        addVoiceLog(`OCR parsed land deed/invoice successfully. Conf: ${data.confidenceScore}%`);
        speakText(`Document analyzed successfully. Detected ${data.docType} in ${data.detectedLanguage}.`);
      } else {
        setOcrError(data.error || "OCR temporary offline.");
      }
    } catch (err) {
      setOcrError("Network error. Could not process document.");
    } finally {
      setIsOcrLoading(false);
    }
  };

  // Broadcast Audio Alert System
  const triggerAudioAlert = (title: string, msg: string) => {
    addVoiceLog(`[ALERT] ${title}`);
    if (audioAlertsEnabled) {
      speakText(`${title}: ${msg}`);
    }
  };

  // Core translation dictionary helper for localized tab labels
  const ui = (key: string) => t(key, currentLanguage);

  return (
    <>
      {/* Persistent Button in Header or Global floating toggle */}
      <button
        id="multilingual-hub-toggle-btn"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-cyan-900/10 hover:bg-cyan-950/20 text-cyan-800 border border-cyan-200 rounded-xl transition-all font-semibold cursor-pointer text-xs"
      >
        <Languages className="h-4.5 w-4.5 text-cyan-600 animate-pulse" />
        <span>{LANGUAGES_INFO[currentLanguage].flag} {currentLanguage} Hub</span>
        <ChevronDown className="h-3.5 w-3.5 text-cyan-500" />
      </button>

      {/* Flyout Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-200">
          <div
            id="multilingual-voice-panel"
            className="w-full max-w-lg bg-white h-screen shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-cyan-900 via-teal-900 to-emerald-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Languages className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base tracking-tight font-display">Multilingual & Voice Hub</h2>
                  <p className="text-[11px] text-cyan-200">Regional dialects, voice entry, alerts & OCR</p>
                </div>
              </div>
              <button
                id="multilingual-hub-close-btn"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Maximize2 className="h-5 w-5 text-cyan-100 rotate-45" />
              </button>
            </div>

            {/* Quick Preferences Ribbon */}
            <div className="px-6 py-3.5 bg-cyan-950 text-cyan-100 text-xs flex justify-between items-center border-t border-cyan-800/40">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-cyan-400" />
                <span>Active Profile: <strong>{activeRole}</strong></span>
              </div>
              <button
                id="voice-alerts-toggle-btn"
                onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                {audioAlertsEnabled ? (
                  <>
                    <Volume2 className="h-4 w-4 text-emerald-400" />
                    <span>TTS Audio: <strong>Enabled</strong></span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4 text-red-400" />
                    <span>TTS Audio: <strong>Muted</strong></span>
                  </>
                )}
              </button>
            </div>

            {/* Hub Menu Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50">
              <button
                onClick={() => setActiveTab("translation")}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "translation"
                    ? "border-cyan-600 text-cyan-800 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Languages className="h-4 w-4" />
                <span>Translate & Dialect</span>
              </button>
              <button
                onClick={() => setActiveTab("voice_assistant")}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "voice_assistant"
                    ? "border-cyan-600 text-cyan-800 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Mic className="h-4 w-4" />
                <span>Voice Portal</span>
              </button>
              <button
                onClick={() => setActiveTab("ocr")}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "ocr"
                    ? "border-cyan-600 text-cyan-800 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Doc OCR</span>
              </button>
              <button
                onClick={() => setActiveTab("help")}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "help"
                    ? "border-cyan-600 text-cyan-800 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Commands</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: Translation & Dialect */}
              {activeTab === "translation" && (
                <div className="space-y-6">
                  {/* Select Language */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      Select Primary Language
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(LANGUAGES_INFO).map((langName) => {
                        const info = LANGUAGES_INFO[langName as SupportedLanguage];
                        const isSelected = currentLanguage === langName;
                        return (
                          <button
                            key={langName}
                            onClick={() => handleLanguageChange(langName as SupportedLanguage)}
                            className={`px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? "bg-cyan-50 border-cyan-400 text-cyan-900 ring-2 ring-cyan-100"
                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">{info.flag}</span>
                              <span className="text-xs font-extrabold">{langName}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{info.native}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Regional Dialect Adaptation */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-cyan-600 animate-pulse" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Regional Dialect Adaptation</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Tune your AgriConnect AI Advisor's vernacular phrasing and local idioms to match specific farming communities.
                    </p>

                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] font-bold text-slate-600 block">Available Dialects for {currentLanguage}</label>
                      <div className="flex flex-wrap gap-1.5">
                        {DIALECTS[currentLanguage]?.map((dl) => {
                          const isSel = currentDialect === dl;
                          return (
                            <button
                              key={dl}
                              onClick={() => handleDialectChange(dl)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                isSel
                                  ? "bg-cyan-600 border-cyan-600 text-white shadow-sm"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {dl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Automated Page Translation */}
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Automated translation state</h4>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed font-semibold">
                      Your choice has been successfully applied! AgriConnect's layout headers, roles list, action menus, and AI responses will render localized terms.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Voice Portal */}
              {activeTab === "voice_assistant" && (
                <div className="space-y-6">
                  {/* Interactive Voice Console */}
                  <div className="bg-slate-900 rounded-3xl p-5 text-white space-y-4 shadow-xl relative overflow-hidden">
                    {/* Glowing ambiance background */}
                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-cyan-600/10 blur-xl"></div>
                    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-600/10 blur-xl"></div>

                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Radio className={`h-4 w-4 ${isListening ? "text-red-500 animate-ping" : "text-cyan-400"}`} />
                        <span className="text-[10px] text-slate-300 font-mono uppercase tracking-widest">
                          {isListening ? "System Listening..." : "Speech Engine Ready"}
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md font-mono text-cyan-300">
                        LANG: {LANGUAGES_INFO[currentLanguage].code}
                      </span>
                    </div>

                    {/* Waveform Visualization */}
                    <div className="h-16 flex items-center justify-center gap-1.5 py-2">
                      {isListening ? (
                        Array.from({ length: 14 }).map((_, i) => {
                          const delay = (i % 4) * 0.15;
                          return (
                            <span
                              key={i}
                              style={{ animationDelay: `${delay}s` }}
                              className="w-1 bg-gradient-to-t from-cyan-400 to-emerald-400 rounded-full h-8 animate-[pulse_1.2s_infinite]"
                            ></span>
                          );
                        })
                      ) : isSpeaking ? (
                        Array.from({ length: 14 }).map((_, i) => (
                          <span
                            key={i}
                            className="w-1 bg-yellow-400 rounded-full h-3"
                          ></span>
                        ))
                      ) : (
                        <div className="text-slate-500 text-xs font-mono">Microphone inactive</div>
                      )}
                    </div>

                    {/* Live Transcript Panel */}
                    <div className="bg-slate-950 rounded-2xl p-4 min-h-[70px] border border-slate-800 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">LIVE VOICE TRANSCRIPT</span>
                      <p className="text-xs text-slate-200 leading-relaxed font-semibold italic">
                        {transcript || "Speak now or select a simulation command below..."}
                      </p>
                    </div>

                    {/* Mic Button Row */}
                    <div className="flex justify-center gap-3">
                      <button
                        id="mic-listening-btn"
                        onClick={toggleListening}
                        className={`p-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                          isListening
                            ? "bg-red-600 text-white hover:bg-red-700 ring-4 ring-red-950"
                            : "bg-cyan-600 text-white hover:bg-cyan-700 ring-4 ring-cyan-950"
                        }`}
                      >
                        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                      </button>

                      {isSpeaking && (
                        <button
                          onClick={stopSpeaking}
                          className="px-4 py-2 bg-slate-800 text-yellow-400 hover:text-white rounded-xl text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                        >
                          <Square className="h-3.5 w-3.5" />
                          <span>Stop Speech</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Voice Simulator Sandbox (For offline verification/iframe safety) */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      Interactive Command Tester
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Iframe environments may limit microphone capture. Click below to simulate sending these vocal phrases instantly:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => processVoiceCommand("Navigate to Buyer View")}
                        className="p-3 text-left bg-white border border-slate-200 rounded-xl hover:border-cyan-500 text-xs text-slate-700 hover:bg-slate-50 flex flex-col gap-1 cursor-pointer"
                      >
                        <span className="font-extrabold text-cyan-700 flex items-center gap-1">
                          <Navigation className="h-3.5 w-3.5" /> Navigation
                        </span>
                        <span>"Navigate to Buyer View"</span>
                      </button>

                      <button
                        onClick={() => processVoiceCommand("Search farmer Amir Patel")}
                        className="p-3 text-left bg-white border border-slate-200 rounded-xl hover:border-cyan-500 text-xs text-slate-700 hover:bg-slate-50 flex flex-col gap-1 cursor-pointer"
                      >
                        <span className="font-extrabold text-amber-700 flex items-center gap-1">
                          <Search className="h-3.5 w-3.5" /> Voice Search: Farmer
                        </span>
                        <span>"Search Amir Patel"</span>
                      </button>

                      <button
                        onClick={() => processVoiceCommand("Search scheme PM-KISAN")}
                        className="p-3 text-left bg-white border border-slate-200 rounded-xl hover:border-cyan-500 text-xs text-slate-700 hover:bg-slate-50 flex flex-col gap-1 cursor-pointer"
                      >
                        <span className="font-extrabold text-amber-700 flex items-center gap-1">
                          <Search className="h-3.5 w-3.5" /> Voice Search: Scheme
                        </span>
                        <span>"Search PM-KISAN"</span>
                      </button>

                      <button
                        onClick={() => processVoiceCommand("Search crop yield report")}
                        className="p-3 text-left bg-white border border-slate-200 rounded-xl hover:border-cyan-500 text-xs text-slate-700 hover:bg-slate-50 flex flex-col gap-1 cursor-pointer"
                      >
                        <span className="font-extrabold text-amber-700 flex items-center gap-1">
                          <Search className="h-3.5 w-3.5" /> Voice Search: Report
                        </span>
                        <span>"Search yield report"</span>
                      </button>

                      <button
                        onClick={() => processVoiceCommand("Broadcast latest climate alerts")}
                        className="p-3 text-left bg-white border border-slate-200 rounded-xl hover:border-cyan-500 text-xs text-slate-700 hover:bg-slate-50 flex flex-col gap-1 cursor-pointer"
                      >
                        <span className="font-extrabold text-rose-700 flex items-center gap-1">
                          <Bell className="h-3.5 w-3.5" /> Audio Alerts
                        </span>
                        <span>"Read climate alerts"</span>
                      </button>

                      <button
                        onClick={() => processVoiceCommand("Organic treatment for tomato blight")}
                        className="p-3 text-left bg-white border border-slate-200 rounded-xl hover:border-cyan-500 text-xs text-slate-700 hover:bg-slate-50 flex flex-col gap-1 cursor-pointer"
                      >
                        <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" /> AI Consultant
                        </span>
                        <span>"Treatment for tomato blight"</span>
                      </button>
                    </div>
                  </div>

                  {/* Voice Search Results Render block */}
                  {searchResults.length > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 animate-in fade-in">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-amber-200 text-amber-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Voice Search Matches
                        </span>
                        <button
                          onClick={() => setSearchResults([])}
                          className="text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="divide-y divide-amber-100">
                        {searchResults.map((item, idx) => (
                          <div key={idx} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                            <h5 className="text-xs font-bold text-slate-800">{item.name}</h5>
                            <p className="text-[11px] text-slate-600 leading-relaxed">{item.description}</p>
                            <span className="text-[10px] text-amber-700 font-bold uppercase">{item.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conversation Response block */}
                  {assistantResponse && (
                    <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-2xl space-y-2 animate-in fade-in">
                      <span className="text-[10px] bg-cyan-200 text-cyan-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                        AI Vocal Response
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {assistantResponse}
                      </p>
                      <button
                        onClick={() => speakText(assistantResponse)}
                        className="flex items-center gap-1.5 text-xs text-cyan-700 font-bold hover:text-cyan-900 cursor-pointer"
                      >
                        <Volume2 className="h-4 w-4" />
                        <span>Re-play Audio Response</span>
                      </button>
                    </div>
                  )}

                  {/* Voice Command Logs */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Voice Hub Activity Log</span>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 max-h-[120px] overflow-y-auto space-y-1 font-mono text-[10px] text-slate-500">
                      {voiceLogs.length > 0 ? (
                        voiceLogs.map((log, idx) => (
                          <div key={idx} className="truncate">{log}</div>
                        ))
                      ) : (
                        <div className="text-slate-400 italic">No activity recorded yet</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: OCR Document Processor */}
              {activeTab === "ocr" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Multi-Language OCR Document Scanner</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Upload pesticide bills, land deeds, crop sale invoices, or certificates in any language (Telugu, Hindi, English, Tamil, etc.). Gemini will audit the document and extract key agricultural summaries.
                    </p>
                  </div>

                  {/* File Upload Zone */}
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-cyan-500 transition-all bg-slate-50 space-y-3 relative">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex justify-center">
                      <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
                        <Upload className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-700">
                        {selectedFile ? selectedFile.name : "Drag & drop files or click to choose"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Supports JPEG, PNG, or PDF format documents
                      </p>
                    </div>
                  </div>

                  {/* Standard pre-populated crop sale invoice/receipt simulator for verification */}
                  {!selectedFile && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <label className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">
                        Quick Demo: Seed Invoice Simulator
                      </label>
                      <p className="text-[11px] text-slate-500">
                        No file handy? Instantly load an Indian Regional Agriculture Receipt to verify translation and extraction accuracy:
                      </p>
                      <button
                        onClick={() => {
                          // Standard base64 representation of small image
                          setFileBase64("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");
                          setSelectedFile(new File([], "Andhra_Mandi_Crop_Bill.jpg", { type: "image/jpeg" }));
                        }}
                        className="w-full py-2 bg-white hover:bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
                      >
                        Load Mandi Invoice (Telugu & English)
                      </button>
                    </div>
                  )}

                  {selectedFile && (
                    <button
                      onClick={handleOcrSubmit}
                      disabled={isOcrLoading}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isOcrLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>AI Scanning & Translating...</span>
                        </>
                      ) : (
                        <>
                          <FileSearch className="h-4 w-4" />
                          <span>Analyze Document & Summarize</span>
                        </>
                      )}
                    </button>
                  )}

                  {ocrError && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-100">
                      {ocrError}
                    </div>
                  )}

                  {/* OCR Results Block */}
                  {ocrResult && (
                    <div className="p-5 bg-gradient-to-br from-slate-50 to-cyan-50/20 border border-slate-200/60 rounded-3xl space-y-4 animate-in fade-in">
                      <div className="flex justify-between items-start border-b border-slate-200/60 pb-3">
                        <div>
                          <span className="text-[9px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Document Analysis Complete
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-800 mt-1">{ocrResult.docType}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-600 font-extrabold block">
                            Confidence: {ocrResult.confidenceScore}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Lang: {ocrResult.detectedLanguage}
                          </span>
                        </div>
                      </div>

                      {/* Summary field */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Summary ({currentLanguage})</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {ocrResult.extractedSummary}
                        </p>
                      </div>

                      {/* Parties field */}
                      {ocrResult.parties?.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Extracted Entities / Parties</span>
                          <div className="flex flex-wrap gap-1">
                            {ocrResult.parties.map((p, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-semibold">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Key Details list */}
                      {ocrResult.keyDetails?.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Detailed Specifications</span>
                          <ul className="space-y-1 text-xs text-slate-600">
                            {ocrResult.keyDetails.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-cyan-500 font-bold mt-0.5">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Voice Commands Help Info */}
              {activeTab === "help" && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Voice Control Reference</h3>
                    <p className="text-[11px] text-slate-500">
                      Speak these exact keywords or local equivalents to activate voice actions:
                    </p>
                  </div>

                  <div className="space-y-3 divide-y divide-slate-100">
                    <div className="py-2 space-y-1">
                      <span className="text-xs font-bold text-cyan-800">1. Navigation (Roles)</span>
                      <p className="text-[11px] text-slate-600">
                        Switch roles instantly by speaking the role name. Supports all 10 languages:
                      </p>
                      <div className="bg-slate-50 p-2.5 rounded-xl space-y-1.5 text-[10px] font-mono text-slate-600 border border-slate-100">
                        <div>English: "Go to Farmer", "Buyer view", "Open Government"</div>
                        <div>Telugu: "రైతు" (Farmer), "కొనుగోలుదారు" (Buyer)</div>
                        <div>Hindi: "किसान" (Farmer), "सरकार" (Government)</div>
                      </div>
                    </div>

                    <div className="py-3 space-y-1">
                      <span className="text-xs font-bold text-amber-800">2. Smart Search</span>
                      <p className="text-[11px] text-slate-600">
                        Search seeds, sensors, or welfare schemes inside our database:
                      </p>
                      <div className="bg-slate-50 p-2.5 rounded-xl space-y-1 text-[10px] font-mono text-slate-600 border border-slate-100">
                        <div>English: "Search Basmati Rice Seeds"</div>
                        <div>Telugu: "వెతుకు సోలార్ పంప్" (Search Solar Pump)</div>
                        <div>Hindi: "खोजें जैव खाद" (Search Bio-fertilizer)</div>
                      </div>
                    </div>

                    <div className="py-3 space-y-1">
                      <span className="text-xs font-bold text-emerald-800">3. Voice Data Entry</span>
                      <p className="text-[11px] text-slate-600">
                        Dictate values directly into active form fields (e.g. crop health symptom text):
                      </p>
                      <div className="bg-slate-50 p-2.5 rounded-xl space-y-1 text-[10px] font-mono text-slate-600 border border-slate-100">
                        <div>"Enter symptoms tomato blight and yellow leaves"</div>
                      </div>
                    </div>

                    <div className="py-3 space-y-1">
                      <span className="text-xs font-bold text-indigo-800">4. AI Voice Assistant</span>
                      <p className="text-[11px] text-slate-600">
                        Ask any conversational question about agriculture to receive vocal answers in your regional dialect:
                      </p>
                      <div className="bg-slate-50 p-2.5 rounded-xl space-y-1 text-[10px] font-mono text-slate-600 border border-slate-100">
                        <div>"What crop rotation matches clayey soil?"</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
