import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  TrendingUp,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Check,
  DollarSign,
  MessageSquare,
  Sparkles,
  Zap,
  Tag,
  ArrowRight,
  ChevronRight,
  ThumbsUp,
  RotateCcw
} from "lucide-react";

interface TradeListing {
  id: string;
  farmerName: string;
  distance: string;
  resourceType: "seeds" | "fertilizers" | "tools";
  name: string;
  quantity: string;
  soughtResource: string;
  status: "available" | "negotiating" | "completed";
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  type: "text" | "offer" | "accept" | "reject";
  offerAmount?: number;
  offerUnit?: string;
}

interface TradeSession {
  listingId: string;
  buyerName: string;
  messages: ChatMessage[];
  currentOfferAmount?: number;
  currentOfferUnit?: string;
  status: "open" | "accepted" | "rejected";
}

interface NegotiationChatProps {
  selectedListing: TradeListing;
  activeSession: TradeSession;
  userAlias: string;
  onSendMessage: (text: string) => void;
  onSendOffer: (amount: number, unit: string) => void;
  onAcceptOffer: () => void;
  onRejectOffer: () => void;
}

export default function NegotiationChat({
  selectedListing,
  activeSession,
  userAlias,
  onSendMessage,
  onSendOffer,
  onAcceptOffer,
  onRejectOffer
}: NegotiationChatProps) {
  const [chatInput, setChatInput] = useState<string>("");
  const [offerValue, setOfferValue] = useState<string>("");
  const [offerUnit, setOfferUnit] = useState<string>("Rs.");
  const [isOfferPanelOpen, setIsOfferPanelOpen] = useState<boolean>(false);
  const [activeQuickTab, setActiveQuickTab] = useState<"text" | "offers">("text");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession.messages]);

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim());
    setChatInput("");
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(offerValue);
    if (isNaN(val) || val <= 0) return;
    onSendOffer(val, offerUnit);
    setOfferValue("");
    setIsOfferPanelOpen(false);
  };

  // Quick responses for messages
  const quickTexts = [
    { text: "Is this still available for barter?", icon: "🌾" },
    { text: "I can swap this for organic vermicompost.", icon: "🍃" },
    { text: "Would you accept premium mustard seeds instead?", icon: "🌱" },
    { text: "Can you deliver to our block co-op office?", icon: "📍" },
    { text: "I am ready to close this deal immediately.", icon: "🤝" },
    { text: "Can you do a slight cash discount?", icon: "💸" }
  ];

  // Quick preset offers
  const quickOffers = [
    { label: "Rs. 500 Cash", value: 500, unit: "Rs." },
    { label: "Rs. 1,000 Cash", value: 1000, unit: "Rs." },
    { label: "Rs. 1,500 Cash", value: 1500, unit: "Rs." },
    { label: "10 Kg seeds", value: 10, unit: "Kg Seeds" },
    { label: "20 Kg seeds", value: 20, unit: "Kg Seeds" },
    { label: "1 Day Rent", value: 1, unit: "Days Tool Rent" },
    { label: "2 Days Rent", value: 2, unit: "Days Tool Rent" },
    { label: "50 Kg Fertilizer", value: 50, unit: "Kg Fertilizer" }
  ];

  // Bargaining health score / status indicator
  const getBargainStage = () => {
    if (activeSession.status === "accepted") return { text: "Deal Finalized!", color: "bg-emerald-500 text-white" };
    if (activeSession.status === "rejected") return { text: "Offer Declined", color: "bg-rose-500 text-white" };
    if (activeSession.currentOfferAmount) return { text: "Active Proposal", color: "bg-amber-500 text-slate-900" };
    return { text: "Discovery Phase", color: "bg-indigo-500 text-white" };
  };

  const stageInfo = getBargainStage();

  return (
    <div id="negotiation-chat-panel" className="bg-white rounded-2xl border border-slate-200/85 overflow-hidden flex flex-col shadow-xs h-[520px] md:h-[580px]">
      {/* Header Panel */}
      <div className="bg-slate-950 text-white p-3 md:p-4 flex justify-between items-center shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-indigo-950 p-2 rounded-xl border border-indigo-800 shrink-0">
            <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${stageInfo.color}`}>
                {stageInfo.text}
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">• Live sync</span>
            </div>
            <h4 className="text-xs md:text-sm font-black text-slate-100 truncate mt-0.5">
              {selectedListing.name}
            </h4>
            <p className="text-[9px] md:text-[10px] text-slate-400 truncate mt-0.5">
              Negotiation with <span className="text-indigo-300 font-extrabold">{selectedListing.farmerName}</span> (Criteria: {selectedListing.soughtResource})
            </p>
          </div>
        </div>

        {/* Highlighted current offer banner */}
        <div className="shrink-0 text-right">
          {activeSession.currentOfferAmount ? (
            <div className="bg-indigo-950/80 px-2 md:px-3 py-1 rounded-xl border border-indigo-500/30 text-[10px] text-indigo-100 font-mono shadow-inner">
              <span className="font-extrabold block text-[6px] text-indigo-400 uppercase tracking-widest leading-none mb-0.5">Last Proposal</span>
              <strong>{activeSession.currentOfferAmount} {activeSession.currentOfferUnit}</strong>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 italic">No offer yet</span>
          )}
        </div>
      </div>

      {/* Message Log Panel */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto bg-slate-50/60 space-y-3 scrollbar-thin flex flex-col">
        {/* Helper banner */}
        <div className="bg-slate-100/80 border border-slate-200/50 rounded-xl p-2.5 text-center text-[10px] text-slate-500 font-semibold mb-2">
          💡 This negotiation room is synced. Agree on a barter rate, tap <strong className="text-indigo-600">Make Offer</strong>, and once both parties accept, the trade locks!
        </div>

        {/* Message elements */}
        <div className="space-y-3 flex-1">
          {activeSession.messages.map((msg) => {
            const isMe = msg.sender === userAlias;

            if (msg.type === "offer" || msg.type === "accept" || msg.type === "reject") {
              return (
                <div key={msg.id} className="flex justify-center my-2 animate-fade-in">
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-2xs ${
                    msg.type === "accept"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : msg.type === "reject"
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : "bg-indigo-50 border-indigo-200 text-indigo-800"
                  }`}>
                    {msg.type === "accept" && <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                    {msg.type === "reject" && <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />}
                    {msg.type === "offer" && <TrendingUp className="h-3.5 w-3.5 text-indigo-600 shrink-0" />}
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-2.5 md:p-3 text-xs leading-relaxed shadow-3xs transition-all ${
                  isMe
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                }`}>
                  {!isMe && (
                    <span className="font-extrabold text-[9px] text-indigo-600 block mb-1">
                      {msg.sender}
                    </span>
                  )}
                  <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                  <span className={`text-[8px] block text-right mt-1.5 font-semibold ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Dynamic Pending Offer Banner */}
      {activeSession.status === "open" && activeSession.currentOfferAmount && (
        <div className="bg-amber-50 border-t border-b border-amber-200/80 p-2.5 px-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-amber-900 text-[10px] min-w-0">
            <Clock className="h-4 w-4 text-amber-600 shrink-0 animate-pulse" />
            <span className="font-bold truncate">
              Active Offer: <strong className="text-amber-800 font-extrabold">{activeSession.currentOfferAmount} {activeSession.currentOfferUnit}</strong>
            </span>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={onRejectOffer}
              className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all active:scale-95"
            >
              Decline
            </button>
            <button
              onClick={onAcceptOffer}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-[10px] font-black shadow-xs cursor-pointer flex items-center gap-1 transition-all active:scale-95"
            >
              <Check className="h-3 w-3" />
              Accept Deal
            </button>
          </div>
        </div>
      )}

      {/* Accepted / Rejected Ledger Banners */}
      {activeSession.status === "accepted" && (
        <div className="bg-emerald-50 border-t border-emerald-200 p-3 text-center text-[10px] text-emerald-800 font-bold shrink-0 flex items-center justify-center gap-1.5 animate-pulse">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Barter deal successfully concluded &amp; recorded on the local co-op ledger.</span>
        </div>
      )}
      {activeSession.status === "rejected" && (
        <div className="bg-rose-50 border-t border-rose-200 p-2.5 text-center text-[10px] text-rose-800 font-semibold shrink-0">
          Previous proposal was declined. Propose a counter-offer below.
        </div>
      )}

      {/* Quick Responses & Instant Bidding Drawer */}
      {activeSession.status === "open" && (
        <div className="bg-slate-100/80 border-t border-slate-200 p-2 md:p-2.5 shrink-0 space-y-2">
          {/* Tabs for quick categories */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveQuickTab("text")}
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded transition-all cursor-pointer ${
                  activeQuickTab === "text"
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Quick Messages
              </button>
              <button
                type="button"
                onClick={() => setActiveQuickTab("offers")}
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded transition-all cursor-pointer ${
                  activeQuickTab === "offers"
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Instant Proposals
              </button>
            </div>
            <span className="text-[9px] text-indigo-600 font-bold flex items-center gap-1">
              <Zap className="h-3 w-3 text-indigo-500 shrink-0 fill-indigo-500" />
              One-click response
            </span>
          </div>

          {/* Quick responses display */}
          <div className="overflow-x-auto whitespace-nowrap py-1 scrollbar-none flex gap-1.5">
            {activeQuickTab === "text" ? (
              quickTexts.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSendMessage(item.text)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-full px-3 py-1.5 text-[10px] font-bold inline-flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-3xs shrink-0"
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </button>
              ))
            ) : (
              quickOffers.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSendOffer(item.value, item.unit)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-850 border border-indigo-150 rounded-full px-3 py-1.5 text-[10px] font-extrabold inline-flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-3xs shrink-0"
                >
                  <TrendingUp className="h-3 w-3 text-indigo-500" />
                  <span>{item.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Interactive Controls Panel (Send / Propose Custom Offer) */}
      <div className="bg-slate-50 border-t border-slate-200 p-2.5 md:p-3 shrink-0 space-y-2">
        {/* Custom Bidding Sub-Panel */}
        <AnimatePresence>
          {isOfferPanelOpen && activeSession.status === "open" && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onSubmit={handleSubmitOffer}
              className="flex items-center gap-2 bg-indigo-50 border border-indigo-150 p-2.5 rounded-xl animate-fade-in"
            >
              <div className="flex items-center gap-1 text-[10px] font-extrabold text-indigo-900 shrink-0">
                <DollarSign className="h-3.5 w-3.5 text-indigo-600" />
                <span>Value:</span>
              </div>
              <input
                type="number"
                placeholder="e.g. 800"
                value={offerValue}
                onChange={(e) => setOfferValue(e.target.value)}
                className="w-16 md:w-20 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-center focus:outline-none focus:border-indigo-500"
                required
              />
              <select
                value={offerUnit}
                onChange={(e) => setOfferUnit(e.target.value)}
                className="bg-white border border-slate-200 rounded text-xs py-1 px-1 focus:outline-none font-bold"
              >
                <option value="Rs.">Rs. Cash</option>
                <option value="Kg Seeds">Kg Seeds</option>
                <option value="Kg Fertilizer">Kg Fertilizer</option>
                <option value="Days Tool Rent">Days Tool Rent</option>
              </select>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-3 py-1.5 text-[10px] font-black ml-auto cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                Propose
              </button>
              <button
                type="button"
                onClick={() => setIsOfferPanelOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Text messaging submission */}
        <form onSubmit={handleSubmitMessage} className="flex gap-2">
          {activeSession.status === "open" && !isOfferPanelOpen && (
            <button
              type="button"
              onClick={() => setIsOfferPanelOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-3 text-[10px] font-black shrink-0 flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Make Offer
            </button>
          )}

          <input
            type="text"
            placeholder={activeSession.status === "open" ? "Type a message to negotiate details..." : "Room locked - deal completed"}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={activeSession.status !== "open"}
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
          />

          <button
            type="submit"
            disabled={!chatInput.trim() || activeSession.status !== "open"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer flex items-center justify-center shrink-0 transition-all active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
