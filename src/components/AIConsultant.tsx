import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  X, 
  Send, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Database, 
  BookOpen, 
  CheckCircle2 
} from "lucide-react";
import { UserRole } from "../types";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: { key: string; content: string }[];
}

interface AIConsultantProps {
  activeRole: UserRole;
}

const QUICK_PROMPTS: Record<UserRole, string[]> = {
  [UserRole.FARMER]: [
    "What organic pesticide works best for rice stem borer?",
    "Suggest a crop rotation schedule for clayey soil.",
    "Draft a summer irrigation timing strategy."
  ],
  [UserRole.BUYER]: [
    "Draft a crop procurement contract with grain standards.",
    "Analyze seasonal rice price variations in Asia.",
    "What premium is Grade-A organic wheat currently fetching?"
  ],
  [UserRole.GOVERNMENT]: [
    "Outline a sustainable carbon credits reward template.",
    "How should we verify climate subsidy beneficiaries?",
    "Draft a drought emergency relief deployment notice."
  ],
  [UserRole.SUPPLIER]: [
    "Predict winter bio-fertilizer demand patterns.",
    "Draft a sales campaign for IoT Soil Probes.",
    "Compare shelf-life of hybrid seeds vs organic heirloom."
  ],
  [UserRole.EXPERT]: [
    "Analyze nitrogen toxicities on tomato crop leaves.",
    "Synthesize research on biocontrol of fusarium wilt.",
    "Provide a calibration formula for NPK sensors."
  ],
  [UserRole.LOGISTICS]: [
    "Draft a reefer transport safety protocol.",
    "Explain cargo safety with smart GPS tracking.",
    "How to manage ripening of mangoes during 7-day sea transit?"
  ],
  [UserRole.WAREHOUSE]: [
    "What are safe humidity zones for hermetic silo storage?",
    "Explain steps to prevent maize mold in a wet season.",
    "Draft a grain aeration schedule model."
  ],
  [UserRole.INSURANCE]: [
    "Calculate risk index for high-moisture sugarcane zones.",
    "Draft a dynamic crop-insurance policy outline.",
    "What satellite spectral indices indicate early drought?"
  ],
  [UserRole.BANK]: [
    "Draft an alternative credit-scoring matrix for smallholders.",
    "What are standard loan-to-value ratios for harvest loans?",
    "Suggest terms for a high-tech solar pump micro-loan."
  ],
  [UserRole.RESEARCHER]: [
    "Suggest an experimental design for high-yield millet.",
    "Analyze climate-resilient genomic traits in maize.",
    "Outline a scientific review of sub-surface drip irrigation."
  ],
  [UserRole.EXTENSION]: [
    "Create a 1-page workshop guide for drip irrigation.",
    "How can I teach organic vermicomposting to non-literate farmers?",
    "Design a mobile pest monitoring group checklist."
  ],
  [UserRole.ADMIN]: [
    "Draft a digital identity verification protocol for farmers.",
    "Outline safety rules for escrow bidding in crop trades.",
    "How to automate fraudulent bid pattern flagging?"
  ],
  [UserRole.AI_IOT]: [
    "How does the Random Forest crop recommendation model handle soil pH extremes?",
    "Explain the CNN + YOLOv8 disease classification confidence threshold.",
    "Show Kafka streaming partition setup for 1,000+ IoT nodes."
  ],
  [UserRole.BLOCKCHAIN]: [
    "How are ERC-721 crop batch NFTs minted on Polygon?",
    "Calculate carbon credits earned for 10 acres of no-till farming.",
    "Explain how smart contract escrow releases payments upon quality checks."
  ],
  [UserRole.MOBILE_APP]: [
    "How does WatermelonDB SQLite sync offline actions when internet returns?",
    "Explain how on-device TFLite runs crop disease classification offline.",
    "How does the React Native multilingual voice assistant support Telugu and Hindi?"
  ],
  [UserRole.PRECISION_FINTECH]: [
    "How do we calculate exact urea and DAP bag requirements from soil health card NPK?",
    "Explain the satellite NDVI weighting algorithm in alternative Kisan Credit Score (KCS).",
    "How does e-NWR warehouse pledge financing prevent distress selling?"
  ],
  [UserRole.STARTUP_HUB]: [
    "What is our projected Year 3 ARR across SaaS subscriptions and B2B transaction take rates?",
    "Explain AgriConnect's unit economics (LTV/CAC ratio and gross margins).",
    "How do we protect our competitive moat against legacy agri-supply intermediaries?"
  ],
  [UserRole.GEMINI_SUITE]: [
    "How does Google Maps Grounding fetch live verified mandi locations?",
    "Explain how Google Search Grounding verifies real-time MSP price updates.",
    "How does Cloud Firestore securely sync user farm parcels and soil health cards?"
  ]
};

// Precise list of suggested questions for the RAG evaluation as requested by user
const SUGGESTED_RAG_QUESTIONS = [
  "Which crop should I grow this season?",
  "What fertilizer should I use for wheat?",
  "My tomato leaves have brown spots - what to do?",
  "Am I eligible for PM-KISAN?",
  "When is the best time to sell my rice?",
  "Calculate my profit for this season",
  "Which scheme gives the highest subsidy?",
  "How to apply for KCC loan?",
  "What organic pesticide works for aphids?"
];

export default function AIConsultant({ activeRole }: AIConsultantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentLanguage, setCurrentLanguage] = useState<string>("English");
  const [currentDialect, setCurrentDialect] = useState<string>("Standard");

  // Speech assistant state variables
  const [isListening, setIsListening] = useState(false);
  const [speakResponses, setSpeakResponses] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Synchronize language and dialect choice dynamically
  useEffect(() => {
    const handleLangChange = (e: any) => {
      setCurrentLanguage(e.detail);
      const savedDialect = localStorage.getItem("agri_connect_dialect");
      if (savedDialect) setCurrentDialect(savedDialect);
    };
    window.addEventListener("languageChange", handleLangChange);
    
    const saved = localStorage.getItem("agri_connect_lang");
    if (saved) setCurrentLanguage(saved);
    
    const savedDialect = localStorage.getItem("agri_connect_dialect");
    if (savedDialect) setCurrentDialect(savedDialect);
    
    return () => {
      window.removeEventListener("languageChange", handleLangChange);
    };
  }, []);

  // Web Speech Recognition (STT) Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      const langMap: Record<string, string> = {
        English: "en-US",
        Telugu: "te-IN",
        Hindi: "hi-IN",
        Tamil: "ta-IN",
        Kannada: "kn-IN",
        Marathi: "mr-IN",
        Gujarati: "gu-IN",
        Bengali: "bn-IN",
        Punjabi: "pa-IN",
        Malayalam: "ml-IN"
      };
      rec.lang = langMap[currentLanguage] || "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          // Automatically trigger send for smooth voice-to-voice experience
          handleSend(transcript);
        }
      };

      rec.onerror = (err: any) => {
        console.warn("Speech Recognition Error handled:", err);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [currentLanguage]);

  // Initialize role-specific greeting when role or language changes
  useEffect(() => {
    const greetings: Record<string, string> = {
      English: `Hello! I am **AgriGuru AI Advisor**, your agricultural startup co-pilot. As a **${activeRole}**, how can I assist with your precision farming, crop protection, mandi prices, or farm decisions today?`,
      Telugu: `నమస్కారం! నేను మీ **AgriGuru AI సలహాదారుని**. ఒక **${activeRole}** గా, ఈ రోజు మీ వ్యవసాయం, పంటల రక్షణ, మార్కెట్ ధరలు లేదా ఇతర వ్యూహాత్మక నిర్ణయాలకు నేను ఎలా సహాయపడగలను?`,
      Hindi: `नमस्ते! मैं आपका **AgriGuru AI सलाहकार** हूँ। एक **${activeRole}** के रूप में, आज मैं आपकी सटीक कृषि, फसल सुरक्षा, मंडी भाव या रणनीतिक निर्णयों में कैसे सहायता कर सकता हूँ?`,
      Tamil: `வணக்கம்! நான் உங்கள் **AgriGuru AI ஆலோசகர்**. ஒரு **${activeRole}** ஆக, உங்கள் துல்லியமான விவசாயம், பயிர் பாதுகாப்பு, சந்தை விலைகள் அல்லது முடிவுகளுக்கு இன்று நான் எவ்வாறு உதவ முடியும்?`,
      Kannada: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **AgriGuru AI ಸಲಹೆಗಾರ**. ಒಬ್ಬ **${activeRole}** ಆಗಿ, ನಿಮ್ಮ ನಿಖರವಾದ ಕೃಷಿ, ಬೆಳೆ ರಕ್ಷಣೆ, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಅಥವಾ ನಿರ್ಧಾರಗಳಲ್ಲಿ ಇಂದು ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
      Marathi: `नमस्कार! मी तुमचा AgriGuru AI सल्लागार आहे. एक **${activeRole}** म्हणून, आज मी तुमच्या अचूक शेती, पिकांचे संरक्षण, मंडी भाव किंवा धोरणात्मक निर्णयांमध्ये कशी मदत करू शकतो?`,
      Gujarati: `નમસ્તે! હું તમારો AgriGuru AI સલાહકાર છું. એક **${activeRole}** તરીકે, આજે હું તમારી ચોક્કસ ખેતી, પાક સંરક્ષણ, મંડી ભાવ અથવા વ્યૂહાત્મક નિર્ણયોમાં કેવી રીતે મદદ કરી શકું?`,
      Bengali: `নমস্কার! আমি আপনার AgriGuru AI উপদেষ্টা। একজন **** হিসাবে, আজ আমি আপনার নির্ভুল কৃষি, ফসল সুরক্ষা, বাজার দর বা সিদ্ধান্তে কীভাবে সহায়তা করতে পারি?`,
      Punjabi: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AgriGuru AI ਸਲਾਹਕਾਰ ਹਾਂ। ਇੱਕ **${activeRole}** ਵਜੋਂ, ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਸਟੀਕ ਖੇਤੀਬਾੜੀ, ਫ਼ਸਲ ਸੁਰੱਖਿਆ, ਮੰਡੀ ਭਾਅ ਜਾਂ ਫੈਸਲਿਆਂ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`,
      Malayalam: `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ **AgriGuru AI ഉപദേശകനാണ്**. ഒരു **${activeRole}** എന്ന നിലയിൽ, നിങ്ങളുടെ കൃത്യമായ കൃഷി, വിള സംരക്ഷണം, വിപണി വിലകൾ അല്ലെങ്കിൽ തീരുമാനങ്ങളിൽ ഇന്ന് എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?`
    };

    const welcomeMsg = greetings[currentLanguage] || greetings["English"];
    setMessages([
      {
        role: "assistant",
        content: welcomeMsg
      }
    ]);
  }, [activeRole, currentLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice output generation using Web Speech Synthesis (TTS)
  const speakText = (text: string) => {
    if (!speakResponses) return;
    
    // Stop any current reading
    window.speechSynthesis.cancel();

    // Remove markdown clutter so reading is organic
    const plainText = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .replace(/`/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "");

    const utterance = new SpeechSynthesisUtterance(plainText);
    
    const langMap: Record<string, string> = {
      English: "en-US",
      Telugu: "te-IN",
      Hindi: "hi-IN",
      Tamil: "ta-IN",
      Kannada: "kn-IN",
      Marathi: "mr-IN",
      Gujarati: "gu-IN",
      Bengali: "bn-IN",
      Punjabi: "pa-IN",
      Malayalam: "ml-IN"
    };
    utterance.lang = langMap[currentLanguage] || "en-US";

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Cancel active TTS reading when sending a new message
    window.speechSynthesis.cancel();

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // High fidelity real-time simulated farm sensors & state for context injection
    const simulatedFarmData = {
      soilMoisture: "42%",
      soilNpk: "N=45, P=35, K=60",
      soilPh: "6.5",
      weather: "28°C, Humidity 80%, Rain forecast in adjacent districts within 48h",
      activeCrops: "Basmati Rice (Field 2), Tomatoes (Greenhouse Sector A)",
      subsidyStatus: "PM-KISAN active, KCC Credit Active (Timely Repayment Tier-1)"
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          activeRole,
          language: currentLanguage,
          dialect: currentDialect,
          farmData: simulatedFarmData
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev, 
          { 
            role: "assistant", 
            content: data.text, 
            sources: data.sources 
          }
        ]);
        
        // Speak out loud if TTS mode is toggled on (Voice-to-Voice)
        if (speakResponses) {
          speakText(data.text);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error || "Sorry, I am having trouble connecting to AgriConnect servers right now. Please ensure your Gemini API key is configured correctly in Secrets."
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please try again. Your developer server and Gemini API keys are active in the background."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported on this browser browser. Please try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis.cancel();
      recognitionRef.current.start();
    }
  };

  return (
    <div id="ai-consultant-widget" className="fixed bottom-6 right-6 z-50">
      {/* Closed Button */}
      {!isOpen && (
        <button
          id="ai-consultant-open-btn"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group font-medium"
        >
          <Bot className="h-5.5 w-5.5 animate-bounce" />
          <span className="text-sm font-semibold tracking-wide">Ask AgriConnect AI</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="ai-consultant-chat-window"
          className="w-96 h-[560px] bg-white rounded-2xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-emerald-600/30 rounded-lg">
                <Sparkles className="h-5 w-5 text-emerald-200 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-xs tracking-tight">AgriConnect Co-Pilot</h3>
                <p className="text-[10px] text-emerald-100/90 font-medium">
                  {activeRole} Agent • {currentLanguage} ({currentDialect})
                </p>
              </div>
            </div>
            
            {/* Audio Controls and Close Button */}
            <div className="flex items-center gap-2">
              {/* Speak Responses Toggle (TTS) */}
              <button
                onClick={() => {
                  const newMode = !speakResponses;
                  setSpeakResponses(newMode);
                  if (!newMode) {
                    window.speechSynthesis.cancel();
                  } else if (messages.length > 0) {
                    // Speak the last assistant message if newly toggled on
                    const lastAssistantMsg = [...messages].reverse().find(m => m.role === "assistant");
                    if (lastAssistantMsg) speakText(lastAssistantMsg.content);
                  }
                }}
                title={speakResponses ? "Mute responses" : "Read responses aloud (Voice-to-Voice)"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  speakResponses ? "bg-emerald-600/50 text-white border border-emerald-400/40" : "text-emerald-200 hover:bg-emerald-600/25"
                }`}
              >
                {speakResponses ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 opacity-75" />}
              </button>

              <button
                id="ai-consultant-close-btn"
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="p-1 hover:bg-emerald-600/25 rounded-md transition-colors"
              >
                <X className="h-5 w-5 text-emerald-100" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3.5 bg-slate-50/70 scrollbar-thin">
            
            {/* Suggested RAG queries panel at the top of the feed */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-100/70 rounded-xl p-2.5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen className="h-3.5 w-3.5 text-emerald-700" />
                <span className="text-[10px] font-bold text-emerald-800">💡 Quick Test Queries (RAG-Enabled)</span>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-0.5">
                {SUGGESTED_RAG_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(q);
                      handleSend(q);
                    }}
                    disabled={isLoading}
                    className="text-[9.5px] bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-800 hover:bg-emerald-50/50 px-2 py-1 rounded-lg text-slate-600 transition-all font-medium text-left truncate max-w-full cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chats */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200/50 rounded-tl-none whitespace-pre-wrap"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Grounded RAG Sources indicator badges */}
                {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1 items-center animate-in fade-in duration-300">
                    {msg.sources.map((src, srcIdx) => (
                      <span
                        key={srcIdx}
                        title={src.content}
                        className="text-[9px] bg-teal-50 border border-teal-200 text-teal-700 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 cursor-help hover:bg-teal-100 transition-colors"
                      >
                        <Database className="h-2.5 w-2.5 text-teal-600" />
                        RAG Reference: {src.key}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200/50 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  <span className="text-[11px] text-slate-400 font-medium">AgriConnect is fetching context...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Role-Specific Prompts Bar */}
          <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200/40 overflow-x-auto flex gap-1.5 scrollbar-none">
            {QUICK_PROMPTS[activeRole]?.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="flex-shrink-0 text-[9px] bg-white border border-slate-200/80 px-2 py-1 rounded-full text-slate-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors disabled:opacity-55 cursor-pointer max-w-[180px] truncate font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form with integrated Voice Assistant Mic */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-slate-200/60 flex items-center gap-2"
          >
            {/* STT Microphone Trigger Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? "Listening... click to cancel" : "Voice Command (Speech-to-Text)"}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                isListening 
                  ? "bg-red-500 text-white animate-pulse shadow-md" 
                  : "bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200/50"
              }`}
            >
              {isListening ? (
                <Mic className="h-4.5 w-4.5 animate-bounce" />
              ) : (
                <MicOff className="h-4.5 w-4.5" />
              )}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening... Speak now!" : `Ask about ${activeRole} optimization...`}
              disabled={isLoading}
              className="flex-grow bg-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-75"
            />
            
            <button
              id="ai-consultant-send-btn"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
