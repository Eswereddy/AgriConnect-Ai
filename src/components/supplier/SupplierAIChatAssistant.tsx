import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  language?: string;
}

const SUPPORTED_LANGUAGES = [
  { name: "English", code: "en-IN", native: "English (India)" },
  { name: "Hindi", code: "hi-IN", native: "हिन्दी" },
  { name: "Punjabi", code: "pa-IN", native: "ਪੰਜਾਬੀ" },
  { name: "Marathi", code: "mr-IN", native: "मराठी" },
  { name: "Telugu", code: "te-IN", native: "తెలుగు" },
  { name: "Tamil", code: "ta-IN", native: "தமிழ்" },
  { name: "Bengali", code: "bn-IN", native: "বাংলা" },
  { name: "Gujarati", code: "gu-IN", native: "ગુજરાતી" },
  { name: "Kannada", code: "kn-IN", native: "ಕನ್ನಡ" },
  { name: "Malayalam", code: "ml-IN", native: "മലയാളం" }
];

const SAMPLE_QUESTIONS = [
  { text: "What products should I stock for the upcoming season?", icon: "📦" },
  { text: "What price should I sell wheat seeds at?", icon: "🌾" },
  { text: "Which customer segment is most profitable?", icon: "📊" },
  { text: "When should I reorder inventory?", icon: "⏰" },
  { text: "What certifications do I need for export?", icon: "🛡️" },
  { text: "How do I improve my product listing?", icon: "✨" }
];

interface SupplierAIChatAssistantProps {
  onClose?: () => void;
}

export default function SupplierAIChatAssistant({ onClose }: SupplierAIChatAssistantProps = {}) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-IN");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Welcome to the AgriConnect Supplier AI Assistant! I can help you forecast input trends, advise on regional inventory stocking, audit pricing structures, analyze customer profitability, and walk you through agricultural certification guidelines. How can I help optimize your supply chain operations today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: "en-IN"
    }
  ]);
  const [inputValue, setInputValue] = useState<string>("" );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Clean speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? prev + " " + transcript : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setMicError("Microphone permission was denied. Please input text manually.");
        } else {
          setMicError(`Voice input error (${event.error}). Try manual input.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setMicError(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = selectedLanguage;
          recognitionRef.current.start();
        } catch (err) {
          console.error("Error starting speech recognition:", err);
          setMicError("Unable to activate microphone. Please try again or use text.");
        }
      } else {
        // Fallback simulated voice listening for environments with restricted iframe APIs
        setIsListening(true);
        setMicError("Voice Web API restricted in preview framing. Simulating voice telemetry input...");
        
        setTimeout(() => {
          setIsListening(false);
          const currentLangName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || "English";
          const defaultQuestion = "What products should I stock for the upcoming season?";
          setInputValue(`[Simulated ${currentLangName} Voice Input]: ${defaultQuestion}`);
          setMicError(null);
        }, 3000);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim() || isLoading) return;

    if (!textToSend) {
      setInputValue("");
    }

    // Stop current speech synthesizer
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }

    const userMsgId = `msg-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Map frontend messages format to backend Express /api/chat format
      const apiMessages = messages.concat(userMsg).map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      }));

      const langName = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.name || "English";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          activeRole: "Supplier",
          language: langName
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: data.text || "I was unable to formulate a response.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: selectedLanguage
        };
        setMessages((prev) => [...prev, assistantMsg]);
        
        // Auto Text-To-Speech if active language matches voice synthesis availability
        if (selectedLanguage === "en-IN" || selectedLanguage.startsWith("en")) {
          speakText(assistantMsg.content, assistantMsg.id);
        }
      } else {
        throw new Error("Failed to post chat API message");
      }
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback helpful response based on supplier questions
      let fallbackText = "I apologize, but I encountered a network timeout. Let me provide my offline supplier intelligence on this query:";
      const queryLower = messageText.toLowerCase();

      if (queryLower.includes("stock") || queryLower.includes("upcoming") || queryLower.includes("season")) {
        fallbackText += "\n\n📦 **Optimal Stocking for Upcoming Season:**\n- **Hybrid Paddy (Basmati Seeds)**: Regional weather forecasting signals an early monsoon onset. Increase Basmati sowing strains inventory by **25%** to capture peak early June demand.\n- **Neem-Coated Slow-Release Nitrogen**: Heavy precipitation trends risk higher fertilizer leaching. Local growers are rapidly shifting toward slower release water-soluble formulas.\n- **Bio-Insecticides**: Ensure immediate stock of organic blight and stem-borer defenses.";
      } else if (queryLower.includes("wheat") || queryLower.includes("sell") || queryLower.includes("price")) {
        fallbackText += "\n\n🌾 **Wheat Seeds Pricing Strategy:**\n- **Standard Strain (HD-2967)**: Recommended retail range of **₹28,500/Ton to ₹30,000/Ton** based on regional wholesale cost indices and transportation cost buffers.\n- **Premium Organic Strains**: Can command a premium up to **18%** higher (₹34,000/Ton) if fully backed by organic cultivation certification logs.\n- **Pricing Advice**: To maintain local distributor loyalty, consider a 3% early-season booking rebate for purchases exceeding 10 Tons.";
      } else if (queryLower.includes("segment") || queryLower.includes("profitable") || queryLower.includes("customer")) {
        fallbackText += "\n\n📊 **Most Profitable Customer Segments:**\n1. **FPO Cooperatives (Farmer Producer Organizations)**: While margins are tighter (8-10%), order quantities are vast, with cash-down settlement terms that yield high seasonal cash flow velocity.\n2. **Large Progressive Commercial Estates**: Require premium organic bio-nutrients and high-tech sensors. These premium lines command the highest gross margins (**24-28%**).\n3. **Individual Smallholders**: High transaction volume but carries increased localized delivery costs. Support them with micro-packaging formats to preserve margins.";
      } else if (queryLower.includes("reorder") || queryLower.includes("inventory") || queryLower.includes("when")) {
        fallbackText += "\n\n⏰ **Smart Inventory Reorder Guidelines:**\n- **Critical Safety Buffer**: Establish a baseline safety stock equivalent to **14 days** of regional supply to safeguard against transport expressway delays.\n- **Automated Reorder Thresholds**:\n  - *Basmati Seeds*: Reorder when current available stock falls below **1,500 kg**.\n  - *Chemical Nutrients*: Reorder when below **3,000 kg**.\n  - *IoT Equipment*: Trigger manufacturer dispatch when stock levels fall below **15 units**.";
      } else if (queryLower.includes("export") || queryLower.includes("certifications") || queryLower.includes("certification")) {
        fallbackText += "\n\n🛡️ **Export Certification Map:**\n1. **APEDA Registration**: Essential for exporting all primary agro-commodities outside of India.\n2. **Phytosanitary Certificate**: Issued by the Ministry of Agriculture to certify that shipment materials are fully free from quarantine-level crop pests.\n3. **Global GAP**: Required to access European and Middle Eastern premium supermarket chains.\n4. **NPOP / USDA Organic**: Mandatory to market products as 100% bio-organic.";
      } else if (queryLower.includes("listing") || queryLower.includes("improve") || queryLower.includes("product")) {
        fallbackText += "\n\n✨ **Storefront Product Listing Best Practices:**\n- **Use High-Resolution Media**: Ensure clean macro imagery of the physical product, seed germination progression charts, or clear laboratory testing certs.\n- **Optimize Title & Tags**: Use our integrated **AI Product Copywriter** tool to instantly formulate SEO-focused titles and hashtags.\n- **Clarify Agronomic Application Dosage**: Provide direct field-use dosage tables (e.g. 'Use 10 kg per acre' rather than vague descriptions) to build immediate grower trust.";
      } else {
        fallbackText += "\n\nI recommend utilizing the specific dashboards on your panel—such as the **AI Demand Predictor**, **AI Pricing Optimizer**, and **AI Product Copywriter**—to access dynamic, automated calculations calibrated to your live catalog.";
      }

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string, msgId: string) => {
    if (!window.speechSynthesis) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown characters from text for cleaner voice synthesis
    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .replace(/- /g, "")
      .replace(/`([^`]+)`/g, "$1");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Attempt to match selected language code
    utterance.lang = selectedLanguage;
    
    // Find matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.includes(selectedLanguage.split("-")[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
    };

    speechUtteranceRef.current = utterance;
    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setMessages([
      {
        id: "initial",
        role: "assistant",
        content: "Welcome to the AgriConnect Supplier AI Assistant! I can help you forecast input trends, advise on regional inventory stocking, audit pricing structures, analyze customer profitability, and walk you through agricultural certification guidelines. How can I help optimize your supply chain operations today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: "en-IN"
      }
    ]);
  };

  return (
    <div className="bg-slate-50 border border-slate-150 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[700px] relative">
      
      {/* Header Panel */}
      <div className="bg-white border-b border-slate-150 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-3xs">
            <Bot className="h-5.5 w-5.5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              AgriConnect Supplier Copilot <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase font-black">AI Active</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium font-sans">Voice & Text-driven Logistics, Inventory & Export advisory</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Language selector controls */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">Input Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 font-bold text-slate-700 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer border border-slate-200/60 shadow-3xs bg-white text-xs font-bold"
            title="Clear Chat History"
          >
            Clear
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Panel */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        
        {/* Sample Questions prompt box */}
        {messages.length === 1 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-3xs">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <HelpCircle className="h-4 w-4 text-slate-400" /> Frequently Asked Supplier Queries
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q.text}
                  onClick={() => handleSendMessage(q.text)}
                  className="bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-150 p-3 rounded-xl text-left text-xs text-slate-700 font-semibold transition-all cursor-pointer flex items-start gap-2.5 shadow-4xs group"
                >
                  <span className="text-sm shrink-0">{q.icon}</span>
                  <span className="group-hover:text-emerald-700 font-extrabold">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Bubble list */}
        <div className="space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 border shadow-3xs ${
                  isUser ? "bg-white border-slate-200 text-slate-700" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                }`}>
                  {isUser ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </div>

                {/* Bubble content */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                    isUser
                      ? "bg-slate-900 border-slate-950 text-white rounded-tr-none font-bold shadow-xs"
                      : "bg-white border-slate-200/80 text-slate-700 rounded-tl-none font-semibold shadow-4xs"
                  }`}>
                    {/* Render content with bullet points & headers */}
                    <div className="space-y-2">
                      {msg.content.split("\n").map((line, idx) => {
                        if (line.startsWith("###")) {
                          return <h4 key={idx} className="text-xs font-black text-slate-800 uppercase tracking-wider mt-3 first:mt-0">{line.replace("###", "").trim()}</h4>;
                        }
                        if (line.startsWith("####")) {
                          return <h5 key={idx} className="text-[11px] font-black text-emerald-700 mt-2">{line.replace("####", "").trim()}</h5>;
                        }
                        if (line.startsWith("-")) {
                          return <li key={idx} className="list-disc ml-4 font-semibold text-slate-600">{line.substring(2).trim()}</li>;
                        }
                        if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.")) {
                          return <div key={idx} className="pl-2 font-bold text-slate-700 mt-1">{line}</div>;
                        }
                        if (line.trim() === "") {
                          return <div key={idx} className="h-1.5" />;
                        }
                        return <p key={idx}>{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* Bubble Timestamp and Interaction details */}
                  <div className={`flex items-center gap-2 text-[9px] text-slate-400 font-bold ${isUser ? "justify-end" : ""}`}>
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="hover:text-emerald-600 flex items-center gap-0.5"
                          title="Copy message text"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-500" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" /> Copy
                            </>
                          )}
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => speakText(msg.content, msg.id)}
                          className="hover:text-emerald-600 flex items-center gap-0.5"
                          title={speakingId === msg.id ? "Stop voice synthesizer" : "Listen via voice synthesis"}
                        >
                          {speakingId === msg.id ? (
                            <>
                              <VolumeX className="h-3 w-3 text-rose-500" /> Stop
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3" /> Speak
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 border border-emerald-100 text-emerald-600">
                <Bot className="h-4.5 w-4.5 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none border border-slate-200 bg-white shadow-4xs">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Voice Warning Feedback if any */}
      {micError && (
        <div className="mx-6 my-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-[9px] font-bold text-amber-700 flex items-center justify-between shrink-0">
          <span>{micError}</span>
          <button onClick={() => setMicError(null)} className="text-amber-800 hover:text-amber-950 font-black">Dismiss</button>
        </div>
      )}

      {/* Bottom Message Input Panel */}
      <div className="p-4 bg-white border-t border-slate-150 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Micro option */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-3xs flex items-center justify-center ${
              isListening
                ? "bg-rose-500 border-rose-600 text-white animate-pulse"
                : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700"
            }`}
            title={isListening ? "Listening... click to stop" : "Use Voice Input"}
          >
            {isListening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? "Listening via microphone..." : "Ask Supplier Copilot..."}
            className="flex-1 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none transition-all shadow-4xs"
            disabled={isLoading}
          />

          {/* Send */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md shadow-emerald-600/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
