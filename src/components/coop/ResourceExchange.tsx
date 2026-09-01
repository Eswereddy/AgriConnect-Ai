import React, { useState, useEffect, useRef } from "react";
import {
  Handshake,
  Search,
  Plus,
  MessageSquare,
  DollarSign,
  Tag,
  MapPin,
  ArrowRight,
  TrendingUp,
  X,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Check,
  Package,
  Wrench,
  Sprout,
  Users
} from "lucide-react";
import NegotiationChat from "./NegotiationChat";

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

export default function ResourceExchange() {
  // Co-op Member Alias
  const [userAlias, setUserAlias] = useState<string>("Ramesh Kumar");
  const [isAliasSet, setIsAliasSet] = useState<boolean>(true);

  // Lists & State
  const [listings, setListings] = useState<TradeListing[]>([]);
  const [sessions, setSessions] = useState<TradeSession[]>([]);
  const [selectedListing, setSelectedListing] = useState<TradeListing | null>(null);
  const [activeSession, setActiveSession] = useState<TradeSession | null>(null);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<"browse" | "chats" | "create">("browse");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "seeds" | "fertilizers" | "tools">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Create Listing Form
  const [newListingName, setNewListingName] = useState<string>("");
  const [newListingQty, setNewListingQty] = useState<string>("");
  const [newListingType, setNewListingType] = useState<"seeds" | "fertilizers" | "tools">("seeds");
  const [newListingSought, setNewListingSought] = useState<string>("");
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);

  // Chat/Negotiation Form
  const [chatInput, setChatInput] = useState<string>("");
  const [offerValue, setOfferValue] = useState<string>("");
  const [offerUnit, setOfferUnit] = useState<string>("Rs.");
  const [isOfferPanelOpen, setIsOfferPanelOpen] = useState<boolean>(false);

  // Connection State
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch listings initially over HTTP
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/resource-exchange/listings");
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error("Failed to load initial listings via API:", err);
    }
  };

  // 2. Establish WebSocket connection
  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/api/resource-exchange/ws`;
    
    console.log("Connecting to Co-op Exchange WebSocket...", wsUrl);
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected!");
      // Request initial listings and sessions
      ws.send(JSON.stringify({ type: "init" }));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log("WebSocket client received payload:", payload);

        switch (payload.type) {
          case "init_data": {
            if (payload.listings) setListings(payload.listings);
            if (payload.sessions) {
              setSessions(payload.sessions);
              // Sync current active session if open
              if (activeSession) {
                const updated = payload.sessions.find(
                  (s: TradeSession) => s.listingId === activeSession.listingId && s.buyerName === activeSession.buyerName
                );
                if (updated) setActiveSession(updated);
              }
            }
            break;
          }

          case "session_state": {
            setActiveSession(payload.session);
            // Add to session list if not present
            setSessions(prev => {
              const exists = prev.some(s => s.listingId === payload.session.listingId && s.buyerName === payload.session.buyerName);
              if (exists) {
                return prev.map(s => (s.listingId === payload.session.listingId && s.buyerName === payload.session.buyerName) ? payload.session : s);
              }
              return [...prev, payload.session];
            });
            break;
          }

          case "message_received": {
            const { listingId, buyerName, message } = payload;
            
            // Append message to sessions list
            setSessions(prev => prev.map(s => {
              if (s.listingId === listingId && s.buyerName === buyerName) {
                return { ...s, messages: [...s.messages, message] };
              }
              return s;
            }));

            // Sync active session view
            if (activeSession && activeSession.listingId === listingId && activeSession.buyerName === buyerName) {
              setActiveSession(prev => prev ? { ...prev, messages: [...prev.messages, message] } : null);
            }
            break;
          }

          case "offer_received": {
            const { listingId, buyerName, offerAmount, offerUnit, message } = payload;
            setSessions(prev => prev.map(s => {
              if (s.listingId === listingId && s.buyerName === buyerName) {
                return {
                  ...s,
                  currentOfferAmount: offerAmount,
                  currentOfferUnit: offerUnit,
                  messages: [...s.messages, message]
                };
              }
              return s;
            }));

            if (activeSession && activeSession.listingId === listingId && activeSession.buyerName === buyerName) {
              setActiveSession(prev => prev ? {
                ...prev,
                currentOfferAmount: offerAmount,
                currentOfferUnit: offerUnit,
                messages: [...prev.messages, message]
              } : null);
            }
            break;
          }

          case "offer_response": {
            const { listingId, buyerName, status, message, listings: updatedListings } = payload;
            if (updatedListings) setListings(updatedListings);

            setSessions(prev => prev.map(s => {
              if (s.listingId === listingId && s.buyerName === buyerName) {
                return {
                  ...s,
                  status,
                  messages: [...s.messages, message]
                };
              }
              return s;
            }));

            if (activeSession && activeSession.listingId === listingId && activeSession.buyerName === buyerName) {
              setActiveSession(prev => prev ? {
                ...prev,
                status,
                messages: [...prev.messages, message]
              } : null);
            }
            break;
          }

          case "trade_finalized": {
            const { listingId, buyerName, status, message, listings: updatedListings } = payload;
            if (updatedListings) setListings(updatedListings);

            setSessions(prev => prev.map(s => {
              if (s.listingId === listingId && s.buyerName === buyerName) {
                return {
                  ...s,
                  status,
                  messages: [...s.messages, message]
                };
              }
              return s;
            }));

            if (activeSession && activeSession.listingId === listingId && activeSession.buyerName === buyerName) {
              setActiveSession(prev => prev ? {
                ...prev,
                status,
                messages: [...prev.messages, message]
              } : null);
            }
            break;
          }
        }
      } catch (err) {
        console.error("Error processing incoming WebSocket packet:", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket connection closed. Retrying in 5 seconds...");
    };

    return () => {
      ws.close();
    };
  }, [activeSession]);

  // Scroll to bottom on new chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  // Join or Open a trade room
  const startNegotiation = (listing: TradeListing) => {
    setSelectedListing(listing);
    setActiveTab("chats");
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "join_room",
        listingId: listing.id,
        buyerName: userAlias
      }));
    }
  };

  // Switch to an existing chat room
  const openChatRoom = (session: TradeSession) => {
    const listing = listings.find(l => l.id === session.listingId);
    if (listing) setSelectedListing(listing);
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "join_room",
        listingId: session.listingId,
        buyerName: session.buyerName
      }));
    }
  };

  // Send Text Message
  const handleSendMessage = (text: string) => {
    if (!text.trim() || !selectedListing) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "send_message",
        listingId: selectedListing.id,
        buyerName: userAlias,
        sender: userAlias,
        text: text.trim()
      }));
    }
  };

  // Submit Counter Offer
  const handleSendOffer = (amount: number, unit: string) => {
    if (!selectedListing) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "send_offer",
        listingId: selectedListing.id,
        buyerName: userAlias,
        sender: userAlias,
        offerAmount: amount,
        offerUnit: unit
      }));
    }
  };

  // Accept Trade
  const handleAcceptOffer = () => {
    if (!selectedListing) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "accept_offer",
        listingId: selectedListing.id,
        buyerName: userAlias,
        sender: userAlias
      }));
    }
  };

  // Reject Trade
  const handleRejectOffer = () => {
    if (!selectedListing) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "reject_offer",
        listingId: selectedListing.id,
        buyerName: userAlias,
        sender: userAlias
      }));
    }
  };

  // Submit New Trade Listing
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListingName || !newListingQty || !newListingSought) return;

    try {
      const res = await fetch("/api/resource-exchange/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerName: userAlias,
          resourceType: newListingType,
          name: newListingName,
          quantity: newListingQty,
          soughtResource: newListingSought
        })
      });

      if (res.ok) {
        setCreateSuccess(true);
        setNewListingName("");
        setNewListingQty("");
        setNewListingSought("");
        
        // Refresh local list and notify server
        fetchListings();
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: "init" }));
        }

        setTimeout(() => {
          setCreateSuccess(false);
          setActiveTab("browse");
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating listing:", err);
    }
  };

  // Filter listings based on category filter and search term
  const filteredListings = listings.filter(listing => {
    const matchesCategory = categoryFilter === "all" || listing.resourceType === categoryFilter;
    const matchesSearch =
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.soughtResource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="resource-exchange-coop" className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 lg:p-6 space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Handshake className="h-3 w-3 text-indigo-700" />
            Cooperative Resource Hub
          </span>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mt-1 flex items-center gap-2">
            Resource Exchange &amp; Barter Network
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Trade excess high-grade seeds, premium organic fertilizers, and farm machinery with nearby cooperative members via real-time counter-offers.
          </p>
        </div>

        {/* Alias Identity setting */}
        <div className="flex items-center gap-2.5 bg-white border border-slate-200 p-2 rounded-xl text-xs shadow-xs">
          <Users className="h-4 w-4 text-slate-500 shrink-0" />
          {isAliasSet ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Trading as: <span className="font-extrabold text-indigo-700">{userAlias}</span></span>
              <button
                onClick={() => setIsAliasSet(false)}
                className="text-[10px] text-slate-400 hover:text-indigo-600 font-bold underline cursor-pointer"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={userAlias}
                onChange={(e) => setUserAlias(e.target.value)}
                placeholder="Enter your name..."
                className="border border-slate-200 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:border-indigo-500 w-32"
              />
              <button
                onClick={() => {
                  if (userAlias.trim()) setIsAliasSet(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-2.5 py-1 text-[10px] font-black cursor-pointer"
              >
                Save
              </button>
            </div>
          )}
          <span className={`h-2 w-2 rounded-full ml-1 ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-450"}`} title={isConnected ? "Real-time sync active" : "Offline / Reconnecting"} />
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200/80 p-0.5 space-x-1 bg-slate-200/50 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab("browse")}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "browse" ? "bg-white text-slate-800 shadow-xs border border-slate-200/50" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          Browse Exchange
        </button>
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
            activeTab === "chats" ? "bg-white text-slate-800 shadow-xs border border-slate-200/50" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Active Rooms
          {sessions.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-mono text-[8px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
              {sessions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "create" ? "bg-white text-slate-800 shadow-xs border border-slate-200/50" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
          List a Resource
        </button>
      </div>

      {/* Workspace Area based on tabs */}
      <div className="grid grid-cols-1 gap-6">

        {/* TAB 1: BROWSE LISTINGS */}
        {activeTab === "browse" && (
          <div className="space-y-5">
            {/* Filter and Search Bar */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search seeds, fertilizer, machinery, or farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category Quick Filter */}
              <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {(["all", "seeds", "fertilizers", "tools"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer capitalize flex items-center gap-1 shrink-0 ${
                      categoryFilter === cat
                        ? "bg-slate-800 text-white border border-slate-800"
                        : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat === "all" && <Filter className="h-3 w-3" />}
                    {cat === "seeds" && <Sprout className="h-3 w-3" />}
                    {cat === "fertilizers" && <Package className="h-3 w-3" />}
                    {cat === "tools" && <Wrench className="h-3 w-3" />}
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List Grid */}
            {filteredListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/60 p-6">
                <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-bold">No resource exchange listings found</p>
                <p className="text-slate-400 text-xs mt-1">Try tweaking your search keywords or category filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                      listing.status === "completed"
                        ? "border-emerald-100 bg-emerald-50/10 opacity-75"
                        : "border-slate-200"
                    }`}
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          listing.resourceType === "seeds"
                            ? "bg-emerald-50 text-emerald-700"
                            : listing.resourceType === "fertilizers"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-indigo-50 text-indigo-700"
                        }`}>
                          {listing.resourceType === "seeds" && <Sprout className="h-3 w-3" />}
                          {listing.resourceType === "fertilizers" && <Package className="h-3 w-3" />}
                          {listing.resourceType === "tools" && <Wrench className="h-3 w-3" />}
                          {listing.resourceType}
                        </span>

                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          listing.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-50 text-blue-800"
                        }`}>
                          {listing.status === "completed" ? "Deal Finalized" : "Available"}
                        </span>
                      </div>

                      {/* Content */}
                      <h3 className="text-sm font-extrabold text-slate-800 tracking-tight leading-snug">
                        {listing.name}
                      </h3>
                      <p className="text-[11px] font-mono font-bold text-slate-500 mt-1 flex items-center gap-1">
                        <Tag className="h-3 w-3" /> Quantity: <span className="text-slate-700">{listing.quantity}</span>
                      </p>

                      {/* Barter/Exchange criteria */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 my-3">
                        <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">Sought Exchange / Barter</span>
                        <p className="text-xs font-bold text-slate-700 mt-0.5 leading-snug">
                          {listing.soughtResource}
                        </p>
                      </div>
                    </div>

                    {/* Footer block */}
                    <div className="border-t border-slate-100 pt-3 mt-1 flex items-center justify-between">
                      <div className="text-[10px]">
                        <p className="font-extrabold text-slate-700">{listing.farmerName}</p>
                        <p className="text-slate-400 flex items-center gap-0.5 font-semibold">
                          <MapPin className="h-3 w-3 inline text-slate-400" /> {listing.distance}
                        </p>
                      </div>

                      {listing.status !== "completed" && (
                        <button
                          onClick={() => startNegotiation(listing)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3.5 py-1.5 text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
                        >
                          Negotiate
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE NEGOTIATION ROOMS */}
        {activeTab === "chats" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active chat rooms roster (Left column) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 h-fit">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Users className="h-4 w-4 text-indigo-600" />
                Negotiation Rooms
              </h3>
              <p className="text-[10px] text-slate-400">Select any active discussion with cooperative listing owners.</p>
              
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  No active negotiation rooms yet. Start one from the Browse tab!
                </div>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {sessions.map((session) => {
                    const listing = listings.find(l => l.id === session.listingId);
                    const lastMessage = session.messages[session.messages.length - 1];
                    const isSelected = selectedListing?.id === session.listingId;

                    return (
                      <button
                        key={`${session.listingId}:${session.buyerName}`}
                        onClick={() => openChatRoom(session)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50/50 border-indigo-200 text-indigo-950 shadow-xs"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100/50 text-slate-700"
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="font-extrabold block truncate pr-2">
                            {listing ? listing.name : "Co-op Resource"}
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 uppercase ${
                            session.status === "accepted"
                              ? "bg-emerald-100 text-emerald-800"
                              : session.status === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                          Owner: {listing?.farmerName || "Co-op Member"}
                        </span>
                        {lastMessage && (
                          <p className="text-[10px] text-slate-400 font-medium truncate mt-2 border-t border-slate-200/50 pt-1.5 w-full italic">
                            {lastMessage.sender === userAlias ? "You" : lastMessage.sender}: {lastMessage.text}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Negotiation Workspace & Chat Box (Right column) */}
            <div className="lg:col-span-8 flex flex-col">
              {selectedListing && activeSession ? (
                <NegotiationChat
                  selectedListing={selectedListing}
                  activeSession={activeSession}
                  userAlias={userAlias}
                  onSendMessage={handleSendMessage}
                  onSendOffer={handleSendOffer}
                  onAcceptOffer={handleAcceptOffer}
                  onRejectOffer={handleRejectOffer}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 text-xs font-semibold h-[480px] flex flex-col items-center justify-center">
                  <Handshake className="h-12 w-12 text-slate-300 mb-3 animate-pulse" />
                  No chat selected. Select or start a negotiation from Browse or the Active Rooms sidebar!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CREATE NEW TRADE LISTING */}
        {activeTab === "create" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl mx-auto shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-indigo-600" />
              Publish a New Barter / Sale Listing
            </h3>
            
            {createSuccess && (
              <div className="my-4 bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-pulse">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                Resource listing posted and synced across cooperative network! Redirecting...
              </div>
            )}

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs mt-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Category selection */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Resource Category</label>
                  <select
                    value={newListingType}
                    onChange={(e) => setNewListingType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="seeds">Seeds (Wheat, Rice, Veg...)</option>
                    <option value="fertilizers">Organic Fertilizers / Compost</option>
                    <option value="tools">Agricultural Tools / Machinery</option>
                  </select>
                </div>

                {/* Resource Quantity */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Available Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 kg, 3-day rental"
                    value={newListingQty}
                    onChange={(e) => setNewListingQty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Resource Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Item / Resource Name</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Heirloom Tomato Seeds"
                  value={newListingName}
                  onChange={(e) => setNewListingName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Seeking Exchange item or cash */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Sought Barter Exchange / Price</label>
                <input
                  type="text"
                  placeholder="e.g. Seeds barter exchange OR Cash: Rs. 1,500"
                  value={newListingSought}
                  onChange={(e) => setNewListingSought(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Form Warning/Info */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-[10px] text-slate-500 leading-relaxed font-medium">
                Once posted, nearby members can view this listing and start a negotiation chat room. Always trade within fair co-op guidelines.
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("browse")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
