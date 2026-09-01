import React, { useState, useEffect } from "react";
import {
  Truck,
  Calendar,
  MapPin,
  Map,
  User,
  Phone,
  Navigation,
  Compass,
  DollarSign,
  CheckCircle,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  Send,
  X,
  RefreshCw,
  Search,
  Check,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WonOrder {
  id: string;
  lotId: string;
  cropName: string;
  variety?: string;
  farmerName: string;
  farmerPhone: string;
  farmerEmail: string;
  quantity: number;
  qualityGrade: string;
  finalBidAmount: number;
  paymentDeadline: string;
  paymentStatus: "Pending" | "Paid" | "Cancelled";
  pickupStatus: "Unscheduled" | "Scheduled" | "Dispatched" | "In Transit" | "Delivered";
  orderConfirmationNumber: string;
  paymentLink: string;
  date?: string;
  cropType?: string;
  location?: string;
  pickupAddress: string;
  trackingNumber?: string;
  refundStatus?: "Not Requested" | "Pending Approval" | "Approved" | "Refunded";
  pickupDetails?: {
    modeOfTransport: string;
    pickupDate: string;
    pickupTime: string;
    driverName: string;
    driverPhone: string;
    vehicleNumber: string;
    targetWarehouse: string;
  };
}

export default function BuyerLogisticsDashboard() {
  // --- STATE ---
  const [orders, setOrders] = useState<WonOrder[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  // Booking Form State
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [deliveryWarehouse, setDeliveryWarehouse] = useState<string>("Adani Agri-Logistics Terminal (Moga)");
  const [customWarehouse, setCustomWarehouse] = useState<string>("");
  const [selectedTruckType, setSelectedTruckType] = useState<"mini" | "medium" | "large" | "refrigerated">("medium");
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [bookingTime, setBookingTime] = useState<string>("10:00");
  
  // UI states
  const [activeSegment, setActiveSegment] = useState<"book" | "track" | "optimize">("book");
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookedOrderInfo, setBookedOrderInfo] = useState<{ ids: string[]; count: number; totalTons: number; cost: number } | null>(null);
  
  // AI Logistics Optimizer States
  const [optPickupAddress, setOptPickupAddress] = useState<string>("Gurdaspur Cooperative Mandi Yard, Gurdaspur, Punjab");
  const [optDeliveryAddress, setOptDeliveryAddress] = useState<string>("Adani Agri-Logistics Terminal, Moga, Punjab");
  const [optQuantity, setOptQuantity] = useState<number>(12);
  const [optUrgency, setOptUrgency] = useState<"Low" | "Medium" | "High" | "Immediate">("Medium");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    optimalRoute: string;
    routeSteps: string[];
    bestTruckType: string;
    estimatedCost: number;
    estimatedHours: number;
    distanceKm: number;
    explanation: string;
    alternativeRoutes: Array<{
      name: string;
      hours: number;
      cost: number;
      reason: string;
    }>;
  } | null>(null);
  
  // Tracking & Map state
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string | null>(null);
  const [simulatedProgress, setSimulatedProgress] = useState<number>(35);
  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(false);
  
  // Simulated Driver Chat state
  const [showDriverChat, setShowDriverChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: "buyer" | "driver"; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [driverIsTyping, setDriverIsTyping] = useState<boolean>(false);

  // Load orders from LocalStorage
  const loadOrders = () => {
    const saved = localStorage.getItem("agriconnect_buyer_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
          
          // Auto-select first active tracking order if there is one
          const activeTracking = parsed.find(o => o.pickupStatus === "Scheduled" || o.pickupStatus === "In Transit");
          if (activeTracking) {
            setSelectedTrackingOrderId(activeTracking.id);
          }
        }
      } catch (e) {
        console.error("Error loading orders in logistics", e);
      }
    }
  };

  useEffect(() => {
    loadOrders();
    
    // Listen for storage events to sync across tabs automatically
    const handleStorageChange = () => {
      loadOrders();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync back to local storage
  const saveOrdersToStorage = (updatedOrders: WonOrder[]) => {
    localStorage.setItem("agriconnect_buyer_orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    // Dispatch storage event to notify other components/tabs
    window.dispatchEvent(new Event("storage"));
  };

  // Populate farm pickup address automatically when selected orders change
  useEffect(() => {
    if (selectedOrderIds.length > 0) {
      const firstSelected = orders.find(o => o.id === selectedOrderIds[0]);
      if (firstSelected) {
        setPickupAddress(firstSelected.pickupAddress);
      }
    } else {
      setPickupAddress("");
    }
  }, [selectedOrderIds, orders]);

  // --- TRUCK CONFIGURATIONS ---
  const truckTypes = {
    mini: {
      name: "Mini Cargo Van",
      capacity: "Up to 3 Tons",
      basePrice: 1500,
      ratePerKm: 15,
      description: "Ideal for small lots, fruits, and perishable seeds",
      icon: "🚚"
    },
    medium: {
      name: "Medium Tipper Truck",
      capacity: "Up to 10 Tons",
      basePrice: 3500,
      ratePerKm: 25,
      description: "Standard carriage for medium-sized cereal bags",
      icon: "🚛"
    },
    large: {
      name: "Heavy Duty Multi-Axle",
      capacity: "Up to 25 Tons",
      basePrice: 6500,
      ratePerKm: 38,
      description: "Designed for massive grain silos and commercial operations",
      icon: "🛞"
    },
    refrigerated: {
      name: "Refrigerated Cold-Chain",
      capacity: "Up to 15 Tons",
      basePrice: 5000,
      ratePerKm: 48,
      description: "Enclosed climate control for delicate high-value crops",
      icon: "❄️"
    }
  };

  // Eligible orders: Paid and Unscheduled
  const eligibleOrders = orders.filter(
    (o) => o.paymentStatus === "Paid" && o.pickupStatus === "Unscheduled"
  );

  // Active delivery orders (Scheduled, In Transit)
  const activeDeliveries = orders.filter(
    (o) => o.pickupStatus === "Scheduled" || o.pickupStatus === "In Transit" || o.pickupStatus === "Dispatched"
  );

  const selectedTrackingOrder = orders.find(o => o.id === selectedTrackingOrderId);

  // Calculate simulated distance based on order location
  const getSimulatedDistance = () => {
    if (selectedOrderIds.length === 0) return 240; // Default fallback
    const firstSelected = orders.find(o => o.id === selectedOrderIds[0]);
    if (!firstSelected) return 240;
    
    // Let's return deterministic distance based on location
    const loc = firstSelected.location || "North India";
    if (loc.includes("Gurdaspur")) return 310;
    if (loc.includes("Shimla")) return 355;
    if (loc.includes("Rohtak")) return 95;
    if (loc.includes("Karnal")) return 145;
    if (loc.includes("Moga")) return 220;
    return 180;
  };

  // Calculate current invoice metrics
  const distanceKm = getSimulatedDistance();
  const truckConfig = truckTypes[selectedTruckType];
  const totalQuantityTons = selectedOrderIds.reduce((sum, id) => {
    const o = orders.find(ord => ord.id === id);
    return sum + (o ? o.quantity : 0);
  }, 0);

  // Booking pricing model
  const subtotalBase = truckConfig.basePrice;
  const subtotalDistance = distanceKm * truckConfig.ratePerKm;
  const surchargeFuel = Math.round((subtotalBase + subtotalDistance) * 0.08);
  const taxesGst = Math.round((subtotalBase + subtotalDistance + surchargeFuel) * 0.18);
  const totalLogisticsCost = subtotalBase + subtotalDistance + surchargeFuel + taxesGst;

  // Toggle order selection for multi-order transport
  const handleToggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  // Select all eligible orders
  const handleSelectAllEligible = () => {
    if (selectedOrderIds.length === eligibleOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(eligibleOrders.map(o => o.id));
    }
  };

  // Handle Book Truck Submit
  const handleBookTruck = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrderIds.length === 0) return;
    if (!pickupAddress.trim()) return;

    // Standardized driver directory for simulated dispatching
    const drivers = [
      { name: "Satnam Pal Singh", phone: "+91 94632 99812", vehicle: "PB-02-CD-5290" },
      { name: "Jasbir Gurcharan Gill", phone: "+91 98112 04512", vehicle: "PB-12-FG-7431" },
      { name: "Sohan Singh Brar", phone: "+91 94142 83012", vehicle: "HR-55-XY-3810" },
      { name: "Harpreet Singh Mann", phone: "+91 98722 11099", vehicle: "PB-10-CZ-8941" },
      { name: "Maninder Jit Sandhu", phone: "+91 94140 23811", vehicle: "HP-63-TR-8422" }
    ];

    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    const finalDeliveryWarehouse = deliveryWarehouse === "Custom Warehouse" ? customWarehouse || "Buyer Private Depot" : deliveryWarehouse;

    // Map through existing orders and update the selected ones
    const updatedOrders = orders.map((o) => {
      if (selectedOrderIds.includes(o.id)) {
        return {
          ...o,
          pickupStatus: "Scheduled" as const,
          pickupDetails: {
            modeOfTransport: truckConfig.name,
            pickupDate: bookingDate,
            pickupTime: bookingTime,
            driverName: randomDriver.name,
            driverPhone: randomDriver.phone,
            vehicleNumber: randomDriver.vehicle,
            targetWarehouse: finalDeliveryWarehouse
          }
        };
      }
      return o;
    });

    saveOrdersToStorage(updatedOrders);

    // Save info for success screen
    setBookedOrderInfo({
      ids: [...selectedOrderIds],
      count: selectedOrderIds.length,
      totalTons: totalQuantityTons,
      cost: totalLogisticsCost
    });

    // Reset selection and form
    setSelectedOrderIds([]);
    setBookingSuccess(true);
    
    // Automatically select the first booked order for tracking view
    if (selectedOrderIds.length > 0) {
      setSelectedTrackingOrderId(selectedOrderIds[0]);
    }
  };

  // GPS Route live simulation interval
  useEffect(() => {
    let timer: any;
    if (isSimulatingGps && selectedTrackingOrderId) {
      timer = setInterval(() => {
        setSimulatedProgress((prev) => {
          if (prev >= 100) {
            setIsSimulatingGps(false);
            
            // Auto mark the selected tracking order as Delivered
            const updatedOrders = orders.map(o => {
              if (o.id === selectedTrackingOrderId) {
                return {
                  ...o,
                  pickupStatus: "Delivered" as const
                };
              }
              return o;
            });
            saveOrdersToStorage(updatedOrders);
            
            return 100;
          }
          return prev + 5;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isSimulatingGps, selectedTrackingOrderId, orders]);

  // Handle manual tracking select changes
  const handleSelectTrackingOrder = (orderId: string) => {
    setSelectedTrackingOrderId(orderId);
    
    // Generate standard coordinates progress based on order status
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      if (targetOrder.pickupStatus === "Scheduled") {
        setSimulatedProgress(0);
      } else if (targetOrder.pickupStatus === "In Transit") {
        setSimulatedProgress(45);
      } else if (targetOrder.pickupStatus === "Delivered") {
        setSimulatedProgress(100);
      } else {
        setSimulatedProgress(15);
      }
    }
    
    // Reset driver chat log for this order
    setChatMessages([
      {
        sender: "driver",
        text: `Sat Sri Akal! I am preparing the truck for Order ${orderId}. All security seals are verified. Let me know if you have any dispatch queries.`,
        time: "Just now"
      }
    ]);
    setShowDriverChat(false);
  };

  // Toggle delivery status manually for developer testing
  const handleAdvanceDeliveryStatus = (orderId: string, currentStatus: string) => {
    let nextStatus: "Unscheduled" | "Scheduled" | "Dispatched" | "In Transit" | "Delivered" = "Scheduled";
    let nextProgress = 0;

    if (currentStatus === "Scheduled") {
      nextStatus = "In Transit";
      nextProgress = 45;
    } else if (currentStatus === "In Transit") {
      nextStatus = "Delivered";
      nextProgress = 100;
    } else if (currentStatus === "Delivered") {
      nextStatus = "Unscheduled";
      nextProgress = 0;
    }

    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          pickupStatus: nextStatus
        };
      }
      return o;
    });

    saveOrdersToStorage(updatedOrders);
    setSimulatedProgress(nextProgress);
  };

  // Handle Driver Chat message submission
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedTrackingOrder) return;

    const newMsg = {
      sender: "buyer" as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setDriverIsTyping(true);

    // Simulated response triggers
    setTimeout(() => {
      let driverReplyText = "Understood. Proceeding along the national highway network. The temperature values are steady.";
      
      const lower = chatInput.toLowerCase();
      if (lower.includes("where") || lower.includes("location") || lower.includes("eta")) {
        driverReplyText = `Currently navigating near Karnal Toll Plaza. The GPS terminal indicates approximately ${100 - simulatedProgress}% remaining. ETA is about ${Math.max(1, Math.round((100 - simulatedProgress) * 0.1))} hours.`;
      } else if (lower.includes("temp") || lower.includes("cold") || lower.includes("refrigerated")) {
        driverReplyText = "Monitoring sensors now. The container digital thermostat reads a steady 4.2°C with 65% humidity. Safe range confirmed.";
      } else if (lower.includes("speed") || lower.includes("slow") || lower.includes("fast")) {
        driverReplyText = "Maintaining a safe regulatory speed limit of 55 km/h. Highway traffic is moderate.";
      } else if (lower.includes("seal") || lower.includes("security") || lower.includes("safe")) {
        driverReplyText = "Yes, government digital seals and RFID tag are checked and secure. No anomalies detected.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "driver",
          text: driverReplyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setDriverIsTyping(false);
    }, 1500);
  };

  const handleOptimizeLogistics = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!optPickupAddress.trim() || !optDeliveryAddress.trim()) return;

    setIsOptimizing(true);
    try {
      const response = await fetch("/api/buyer/logistics-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupAddress: optPickupAddress,
          deliveryAddress: optDeliveryAddress,
          quantity: optQuantity,
          urgency: optUrgency
        })
      });
      if (response.ok) {
        const data = await response.json();
        setOptimizationResult(data);
      } else {
        console.error("Failed to call optimization endpoint");
      }
    } catch (err) {
      console.error("Error optimizing logistics:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview stats top row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unscheduled Lots</p>
            <p className="text-xl font-black text-slate-800 font-mono mt-0.5">{eligibleOrders.length} Contracts</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl animate-pulse">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">In Transit Cargo</p>
            <p className="text-xl font-black text-amber-700 font-mono mt-0.5">
              {orders.filter(o => o.pickupStatus === "In Transit").length} Fleets
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Dispatched</p>
            <p className="text-xl font-black text-emerald-700 font-mono mt-0.5">
              {orders.filter(o => o.pickupStatus === "Delivered").length} Settled
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-700 to-cyan-800 rounded-2xl p-4.5 text-white shadow-xs flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl">
            <Compass className="h-5 w-5 text-teal-200" />
          </div>
          <div>
            <p className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">Active Sourcing Nodes</p>
            <p className="text-sm font-black tracking-tight mt-0.5">North-West Mandi Corridor</p>
          </div>
        </div>
      </div>

      {/* SEGMENT TOGGLE CONTROLS */}
      <div className="flex border-b border-slate-100 pb-px">
        <button
          onClick={() => {
            setActiveSegment("book");
            setBookingSuccess(false);
          }}
          className={`pb-3.5 text-[11px] font-black uppercase tracking-wider border-b-2 px-8 transition-all cursor-pointer flex items-center gap-2 ${
            activeSegment === "book"
              ? "border-teal-600 text-teal-700 font-black"
              : "border-transparent text-slate-400 hover:text-slate-700 font-bold"
          }`}
        >
          🔑 Book Farm Fleets ({eligibleOrders.length})
        </button>
        <button
          onClick={() => {
            setActiveSegment("track");
            setBookingSuccess(false);
          }}
          className={`pb-3.5 text-[11px] font-black uppercase tracking-wider border-b-2 px-8 transition-all cursor-pointer flex items-center gap-2 ${
            activeSegment === "track"
              ? "border-teal-600 text-teal-700 font-black"
              : "border-transparent text-slate-400 hover:text-slate-700 font-bold"
          }`}
        >
          📍 Live Route GPS Tracking ({activeDeliveries.length})
        </button>
        <button
          onClick={() => {
            setActiveSegment("optimize");
            setBookingSuccess(false);
          }}
          className={`pb-3.5 text-[11px] font-black uppercase tracking-wider border-b-2 px-8 transition-all cursor-pointer flex items-center gap-2 ${
            activeSegment === "optimize"
              ? "border-teal-600 text-teal-700 font-black"
              : "border-transparent text-slate-400 hover:text-slate-700 font-bold"
          }`}
        >
          ✨ AI Logistics Optimizer
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================================= */}
        {/* BOOK TRUCK VIEW */}
        {/* ========================================================================= */}
        {activeSegment === "book" && (
          <>
            {bookingSuccess ? (
              <div className="lg:col-span-12 bg-white border border-teal-100 rounded-3xl p-10 text-center shadow-xs space-y-5">
                <div className="h-16 w-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto border-2 border-teal-100 shadow-xs animate-bounce">
                  <Check className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black uppercase text-slate-800 tracking-wider">Logistics Fleet Booked Successfully!</h3>
                  <p className="text-xs text-slate-500 max-w-xl mx-auto">
                    Your transport request has been validated. A certified local carrier has been dispatched to the farms to procure your crop contracts.
                  </p>
                </div>

                {bookedOrderInfo && (
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 max-w-2xl mx-auto grid grid-cols-3 gap-4 text-left font-mono text-[11px]">
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 font-bold font-sans uppercase">Contracts Secured</p>
                      <p className="font-bold text-slate-800 text-xs">{bookedOrderInfo.ids.join(", ")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 font-bold font-sans uppercase">Total Quantity</p>
                      <p className="font-bold text-slate-800 text-xs">{bookedOrderInfo.totalTons} Tons</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-400 font-bold font-sans uppercase">Total Fleet Invoice</p>
                      <p className="font-black text-teal-700 text-xs">₹{bookedOrderInfo.cost.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Book Another Truck
                  </button>
                  <button
                    onClick={() => {
                      setActiveSegment("track");
                      setBookingSuccess(false);
                    }}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <MapPin className="h-4 w-4" /> Go to Live Tracking
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Book Truck Form - Left 7 columns */}
                <form onSubmit={handleBookTruck} className="lg:col-span-7 space-y-6">
                  {/* Step 1: Select Orders */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 bg-teal-500 text-white font-mono text-[10px] font-black rounded-full flex items-center justify-center">1</span>
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Select Crops & Orders to Settle</h4>
                      </div>
                      {eligibleOrders.length > 0 && (
                        <button
                          type="button"
                          onClick={handleSelectAllEligible}
                          className="text-[9px] font-black uppercase tracking-wider text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded cursor-pointer"
                        >
                          {selectedOrderIds.length === eligibleOrders.length ? "Deselect All" : "Select All"}
                        </button>
                      )}
                    </div>

                    {eligibleOrders.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 space-y-2">
                        <AlertCircle className="h-6 w-6 text-slate-400 mx-auto" />
                        <h5 className="text-[10px] font-black uppercase text-slate-700">No Eligible Orders Found</h5>
                        <p className="text-[9px] text-slate-500 max-w-sm mx-auto">
                          You don't have any outstanding paid, unscheduled procurement contracts. Complete escrow payments in the **Order Dashboard** first.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {eligibleOrders.map((o) => {
                          const isSelected = selectedOrderIds.includes(o.id);
                          return (
                            <div
                              key={o.id}
                              onClick={() => handleToggleOrderSelection(o.id)}
                              className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? "border-teal-500 bg-teal-50/50 shadow-3xs"
                                  : "border-slate-150 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}} // toggled via parent div click
                                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-black text-slate-800">{o.id}</span>
                                    <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold font-mono">{o.lotId}</span>
                                  </div>
                                  <p className="text-xs font-black text-slate-800 leading-snug mt-0.5">{o.cropName}</p>
                                  <div className="flex items-center gap-3 text-[9px] text-slate-400 font-semibold mt-1">
                                    <span>🌾 Farmer: {o.farmerName}</span>
                                    <span>📍 Origin: {o.location}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right space-y-0.5">
                                <p className="text-xs font-black font-mono text-slate-800">{o.quantity} Tons</p>
                                <span className="inline-block text-[8px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase font-black tracking-wider">
                                  ✓ PAID
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Step 2: Addresses & Logistics Details */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="h-5 w-5 bg-teal-500 text-white font-mono text-[10px] font-black rounded-full flex items-center justify-center">2</span>
                      <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Set Sourcing & Warehousing Nodes</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Farm Pickup Location (Address)</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <textarea
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                            placeholder="Select an order to auto-populate the farm pickup yard address."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 min-h-[90px] text-slate-800 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Target Warehousing Terminal</label>
                          <select
                            value={deliveryWarehouse}
                            onChange={(e) => setDeliveryWarehouse(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-medium text-slate-800"
                          >
                            <option value="Adani Agri-Logistics Terminal (Moga)">Adani Agri-Logistics Terminal (Moga)</option>
                            <option value="Cargill Processing Facility (Kurukshetra)">Cargill Processing Facility (Kurukshetra)</option>
                            <option value="Adani Fresh Cold Storage Hub (Chandigarh)">Adani Fresh Cold Storage Hub (Chandigarh)</option>
                            <option value="Central Warehousing Corporation Depot (Delhi)">Central Warehousing Corporation Depot (Delhi)</option>
                            <option value="Custom Warehouse">Custom/Private Warehouse Address...</option>
                          </select>
                        </div>

                        {deliveryWarehouse === "Custom Warehouse" && (
                          <div className="space-y-1">
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Enter Private Warehouse Address</label>
                            <input
                              type="text"
                              value={customWarehouse}
                              onChange={(e) => setCustomWarehouse(e.target.value)}
                              placeholder="e.g. Plot No. 8, Okhla Industrial Area, New Delhi - 110020"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-medium"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Truck Fleet Selection */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="h-5 w-5 bg-teal-500 text-white font-mono text-[10px] font-black rounded-full flex items-center justify-center">3</span>
                      <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Select Sourcing Carrier Class</h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(Object.keys(truckTypes) as Array<keyof typeof truckTypes>).map((key) => {
                        const truck = truckTypes[key];
                        const isSelected = selectedTruckType === key;
                        return (
                          <div
                            key={key}
                            onClick={() => setSelectedTruckType(key)}
                            className={`p-3 border rounded-2xl cursor-pointer text-center transition-all ${
                              isSelected
                                ? "border-teal-500 bg-teal-50/40 shadow-3xs"
                                : "border-slate-150 hover:border-slate-250 bg-white"
                            }`}
                          >
                            <span className="text-2xl inline-block mt-1">{truck.icon}</span>
                            <h5 className="font-black text-slate-800 text-[10px] uppercase mt-2">{truck.name}</h5>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono mt-0.5">{truck.capacity}</p>
                            <p className="text-[8px] text-teal-700 font-extrabold mt-2 bg-slate-50 py-1 rounded">
                              ₹{truck.basePrice} base
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 4: Time & Schedule */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="h-5 w-5 bg-teal-500 text-white font-mono text-[10px] font-black rounded-full flex items-center justify-center">4</span>
                      <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Dispatch Schedule coordinates</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Date of Dispatch</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-mono text-slate-800 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Target Sourcing Time</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="time"
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-mono text-slate-800 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Shipping Invoice Breakdown - Right 5 columns */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4 relative overflow-hidden">
                    {/* Background seal watermarks */}
                    <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-slate-900">
                      <Truck className="h-48 w-48" />
                    </div>

                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
                      <span>Shipping Invoice Estimate</span>
                      <span className="text-[8px] bg-slate-150 text-slate-600 px-2 py-0.5 rounded-full font-mono">EST-5510</span>
                    </h4>

                    {selectedOrderIds.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 space-y-2">
                        <Compass className="h-8 w-8 mx-auto text-slate-200 animate-spin" />
                        <p className="text-[10px] font-bold uppercase tracking-wider">Awaiting Order Selection</p>
                        <p className="text-[9px] max-w-[200px] mx-auto text-slate-400">
                          Select one or more agricultural contracts to calculate routes, pricing, and fuel estimates.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Selected items chip list */}
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Consolidated Contracts</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedOrderIds.map(id => (
                              <span key={id} className="text-[9px] font-mono font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {id}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Route coordinates specs */}
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2 font-mono text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Route Distance:</span>
                            <span className="font-bold text-slate-800">{distanceKm} Kms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Carrier Model:</span>
                            <span className="font-bold text-slate-800">{truckConfig.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Load Capacity:</span>
                            <span className="font-bold text-slate-800">{totalQuantityTons} Tons</span>
                          </div>
                        </div>

                        {/* Invoice lines */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500">Fleet Base Fee:</span>
                            <span className="font-mono text-slate-800">₹{subtotalBase.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500">Distance Charge ({distanceKm}km * ₹{truckConfig.ratePerKm}):</span>
                            <span className="font-mono text-slate-800">₹{subtotalDistance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500">Fuel Surcharge (8% index):</span>
                            <span className="font-mono text-slate-800">₹{surchargeFuel.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-500">Central & State GST (18% rate):</span>
                            <span className="font-mono text-slate-800">₹{taxesGst.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Grand Total */}
                        <div className="pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-baseline">
                          <span className="text-xs font-black uppercase text-slate-800">Consolidated Sourcing Invoice</span>
                          <span className="text-xl font-mono font-black text-teal-700">
                            ₹{totalLogisticsCost.toLocaleString()}
                          </span>
                        </div>

                        {/* Guarantee disclaimer */}
                        <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 flex gap-2 text-[9px] text-teal-800 leading-normal">
                          <ShieldCheck className="h-4.5 w-4.5 text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-black uppercase tracking-wider">SLA Delivery Guarantee Active</p>
                            <p className="text-[8px] text-teal-700/80 font-medium">
                              Sourcing fees are escrow-linked. Any transport damage or delay exceeding 12 hours triggers automated 20% courier refunds.
                            </p>
                          </div>
                        </div>

                        {/* Booking Submit Button */}
                        <button
                          type="submit"
                          onClick={handleBookTruck}
                          disabled={!pickupAddress.trim()}
                          className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2 shadow-xs"
                        >
                          <Truck className="h-4 w-4" /> Book Transport & Dispatch Fleet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* LIVE GPS TRACKING VIEW */}
        {/* ========================================================================= */}
        {activeSegment === "track" && (
          <>
            {activeDeliveries.length === 0 ? (
              <div className="col-span-12 bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-3xs space-y-4">
                <Compass className="h-10 w-10 text-slate-300 mx-auto animate-pulse" />
                <h4 className="text-xs font-black uppercase text-slate-700">No Active Shipping Consignments</h4>
                <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
                  You do not have any active shipments scheduled. Please select pending paid orders under the **Book Farm Fleets** tab to schedule and dispatch carriers.
                </p>
                <button
                  onClick={() => setActiveSegment("book")}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Book Sourcing Fleet Now
                </button>
              </div>
            ) : (
              <>
                {/* Active Deliveries Directory - Left 4 columns */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs space-y-3">
                    <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-slate-500" /> Sourcing Cargo Manifests
                    </h4>

                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                      {activeDeliveries.map((o) => {
                        const isSelected = selectedTrackingOrderId === o.id;
                        return (
                          <div
                            key={o.id}
                            onClick={() => handleSelectTrackingOrder(o.id)}
                            className={`p-3 border rounded-xl cursor-pointer transition-all space-y-2 ${
                              isSelected
                                ? "border-teal-500 bg-teal-50/20 shadow-3xs"
                                : "border-slate-150 hover:border-slate-250 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono font-black text-slate-800">{o.id}</span>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                o.pickupStatus === "Delivered" ? "bg-green-100 text-green-800" :
                                o.pickupStatus === "In Transit" ? "bg-amber-100 text-amber-800 animate-pulse" :
                                "bg-blue-100 text-blue-800"
                              }`}>
                                {o.pickupStatus}
                              </span>
                            </div>

                            <div>
                              <p className="text-[11px] font-black text-slate-800 leading-snug">{o.cropName}</p>
                              <p className="text-[9px] text-slate-400 font-bold mt-0.5">🚚 {o.pickupDetails?.modeOfTransport || "Heavy Carrier"}</p>
                            </div>

                            <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold border-t border-slate-50 pt-2 font-mono">
                              <span>VOLUME: {o.quantity} Tons</span>
                              <span>DRIVER: {o.pickupDetails?.driverName.split(" ")[0]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tracking Details & Interactive Map - Right 8 columns */}
                <div className="lg:col-span-8 space-y-6">
                  {selectedTrackingOrder ? (
                    <div className="space-y-6">
                      
                      {/* Interactive Visual Map Card */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <Map className="h-4 w-4 text-teal-600" /> National Corridor Sourcing Node Route Map
                            </h4>
                            <p className="text-[9px] text-slate-400">Live GIS telemetry visualization tracking agricultural carriers.</p>
                          </div>
                          
                          {/* Map developer tools actions */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setIsSimulatingGps(!isSimulatingGps)}
                              className={`px-3 py-1.5 border rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                                isSimulatingGps
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100"
                              }`}
                            >
                              <RefreshCw className={`h-3 w-3 ${isSimulatingGps ? 'animate-spin' : ''}`} />
                              {isSimulatingGps ? "Pause GPS Simulation" : "Start Live GPS Route Simulation"}
                            </button>

                            <button
                              onClick={() => handleAdvanceDeliveryStatus(selectedTrackingOrder.id, selectedTrackingOrder.pickupStatus)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-black uppercase rounded-lg border border-slate-200 cursor-pointer"
                              title="Toggle status manually for testing"
                            >
                              ⌥ Step Status
                            </button>
                          </div>
                        </div>

                        {/* Simulated Visual Vector GIS Map Container */}
                        <div className="relative bg-slate-900 h-[280px] rounded-2xl overflow-hidden border border-slate-950 shadow-inner flex items-center justify-center">
                          {/* Map Background Grid Patterns */}
                          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40" />
                          
                          {/* Simulated Topographic Elevation Lines */}
                          <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 50 100 Q 200 80 400 120 T 700 90" fill="none" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="4 6" />
                            <path d="M -50 180 Q 150 150 350 190 T 750 160" fill="none" stroke="#2dd4bf" strokeWidth="1.5" />
                            <path d="M 20 250 Q 220 240 420 280 T 820 240" fill="none" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="2 4" />
                          </svg>

                          {/* Major Highway Corridors Paths */}
                          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            {/* Route lines */}
                            {/* Gurdaspur (x: 100, y: 50) to New Delhi (x: 450, y: 240) */}
                            <path d="M 120 60 Q 240 120 310 150 T 450 240" fill="none" stroke="#334155" strokeWidth="4" />
                            {/* Selected Live Path (Greened with Progress) */}
                            <path
                              id="active-gps-path"
                              d="M 120 60 Q 240 120 310 150 T 450 240"
                              fill="none"
                              stroke="#0d9488"
                              strokeWidth="4.5"
                              strokeDasharray="200"
                              strokeDashoffset={200 - (simulatedProgress * 2)}
                              className="transition-all duration-1000 ease-out"
                            />
                            {/* Flashing GPS dots */}
                          </svg>

                          {/* GIS City/Node Markers */}
                          {/* 1. Gurdaspur Sourcing Node */}
                          <div className="absolute left-[120px] top-[60px] text-center">
                            <div className="h-3 w-3 bg-teal-500 border border-white rounded-full mx-auto shadow-sm" />
                            <span className="text-[7px] text-slate-400 font-black font-mono uppercase bg-slate-950/80 px-1 py-0.5 rounded mt-1 block">Gurdaspur (Origin)</span>
                          </div>

                          {/* 2. Chandigarh Junction Node */}
                          <div className="absolute left-[310px] top-[140px] text-center">
                            <div className="h-2 w-2 bg-slate-400 border border-white rounded-full mx-auto" />
                            <span className="text-[7px] text-slate-500 font-bold font-mono uppercase bg-slate-950/60 px-1 py-0.5 rounded mt-1 block">Chandigarh Terminal</span>
                          </div>

                          {/* 3. Karnal Transit Point */}
                          <div className="absolute left-[370px] top-[180px] text-center">
                            <div className="h-2 w-2 bg-slate-400 border border-white rounded-full mx-auto" />
                            <span className="text-[7px] text-slate-500 font-bold font-mono uppercase bg-slate-950/60 px-1 py-0.5 rounded mt-1 block">Karnal Gate</span>
                          </div>

                          {/* 4. New Delhi Buyer Central Hub */}
                          <div className="absolute left-[450px] top-[230px] text-center">
                            <div className="h-3.5 w-3.5 bg-indigo-500 border-2 border-white rounded-full mx-auto shadow-md animate-pulse" />
                            <span className="text-[7px] text-slate-300 font-black font-mono uppercase bg-indigo-950/90 px-1.5 py-0.5 rounded mt-1 block">New Delhi Hub (Destination)</span>
                          </div>

                          {/* LIVE MOVE VEHICLE CARRIER */}
                          {/* Dynamic placement along path based on progress percent */}
                          <div
                            className="absolute transition-all duration-1000 ease-out z-10"
                            style={{
                              left: `${120 + ((450 - 120) * (simulatedProgress / 100))}px`,
                              top: `${60 + ((230 - 60) * (simulatedProgress / 100))}px`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <div className="relative">
                              <div className="absolute -inset-2 bg-teal-400/35 rounded-full blur-xs animate-ping" />
                              <div className="h-6 w-6 bg-teal-600 text-white rounded-full border-2 border-white flex items-center justify-center shadow-lg font-mono text-[10px]">
                                {selectedTrackingOrder.pickupDetails?.modeOfTransport.includes("Cold") ? "❄️" : "🚚"}
                              </div>
                            </div>
                          </div>

                          {/* HUD telemetry block in corner */}
                          <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 p-3 rounded-xl font-mono text-[8px] text-slate-400 space-y-1 z-10">
                            <p className="text-white font-extrabold uppercase text-[7px] tracking-wider border-b border-slate-800 pb-1">Corridor Telemetry HUD</p>
                            <p>CARRIER HASH: <span className="text-teal-400">#{selectedTrackingOrder.id}</span></p>
                            <p>TRANSIT PROGRESS: <span className="text-teal-400">{simulatedProgress}%</span></p>
                            <p>GIS VECTOR: <span className="text-teal-400">N-29.0142, E-77.1082</span></p>
                            <p>SIGNAL STATS: <span className="text-emerald-400">● SECURE DGPS</span></p>
                          </div>
                        </div>

                        {/* Shipment specifications panel */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl font-mono text-[11px]">
                          <div className="space-y-0.5">
                            <p className="text-[8px] text-slate-400 uppercase font-bold font-sans">Current Status</p>
                            <p className="font-bold text-slate-800 uppercase text-xs flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> {selectedTrackingOrder.pickupStatus}
                            </p>
                          </div>
                          
                          <div className="space-y-0.5">
                            <p className="text-[8px] text-slate-400 uppercase font-bold font-sans">Estimated Arrival (ETA)</p>
                            <p className="font-bold text-slate-800 text-xs">
                              {selectedTrackingOrder.pickupStatus === "Delivered" ? "Arrived!" : 
                               simulatedProgress >= 100 ? "Arrived!" :
                               `${Math.round(4 * (1 - simulatedProgress / 100))} hrs ${Math.round(60 * (1 - (simulatedProgress % 25) / 25))} mins`}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <p className="text-[8px] text-slate-400 uppercase font-bold font-sans">Sourcing Range Left</p>
                            <p className="font-bold text-slate-800 text-xs">
                              {selectedTrackingOrder.pickupStatus === "Delivered" ? "0 Kms" : `${Math.round(distanceKm * (1 - simulatedProgress / 100))} Kms`}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <p className="text-[8px] text-slate-400 uppercase font-bold font-sans">Assigned Destination</p>
                            <p className="font-bold text-slate-800 truncate text-[10px] font-sans">
                              {selectedTrackingOrder.pickupDetails?.targetWarehouse || "Delhi Terminus"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Driver Profile Card & Messenger Simulation */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Driver Profile Specs - Left 5 columns */}
                        <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs space-y-4">
                          <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-100 pb-2">
                            Driver Credentials Card
                          </h4>

                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl flex items-center justify-center font-black text-lg shadow-3xs">
                              👨🏽‍✈️
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800 leading-snug">
                                {selectedTrackingOrder.pickupDetails?.driverName || "Balwant Singh Gill"}
                              </p>
                              <span className="inline-block text-[8px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-black font-mono">
                                CERTIFIED AGRI-CARRIER
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2.5 pt-2 border-t border-slate-50 font-mono text-[10px]">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Driver Mobile:</span>
                              <span className="font-bold text-slate-800 flex items-center gap-1">
                                <Phone className="h-3 w-3 text-slate-400" /> {selectedTrackingOrder.pickupDetails?.driverPhone || "+91 94632 99812"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Vehicle Number:</span>
                              <span className="font-bold text-slate-800 uppercase bg-slate-100 px-1.5 py-0.5 rounded text-[9px]">
                                {selectedTrackingOrder.pickupDetails?.vehicleNumber || "PB-02-CD-5290"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Transport Model:</span>
                              <span className="font-bold text-slate-800">
                                {selectedTrackingOrder.pickupDetails?.modeOfTransport || "Medium Truck"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Sourcing Date:</span>
                              <span className="font-bold text-slate-800">
                                {selectedTrackingOrder.pickupDetails?.pickupDate || "2026-07-07"} ({selectedTrackingOrder.pickupDetails?.pickupTime || "10:00"})
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setShowDriverChat(true);
                              if (chatMessages.length === 0) {
                                setChatMessages([
                                  {
                                    sender: "driver",
                                    text: `Sat Sri Akal! I am preparing the truck for Order ${selectedTrackingOrder.id}. All security seals are verified. Let me know if you have any dispatch queries.`,
                                    time: "Just now"
                                  }
                                ]);
                              }
                            }}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> Initialize Telemetry Chat
                          </button>
                        </div>

                        {/* Interactive Chat Console - Right 7 columns */}
                        <div className="md:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs flex flex-col h-[320px]">
                          <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                            <div>
                              <h5 className="font-black text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active Driver Chat Terminal
                              </h5>
                              <p className="text-[8px] text-slate-400 font-medium">Secured encrypted communication line with {selectedTrackingOrder.pickupDetails?.driverName.split(" ")[0]}.</p>
                            </div>
                            
                            {showDriverChat && (
                              <button
                                onClick={() => setChatMessages([])}
                                className="text-[8px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-1 rounded hover:bg-rose-100 cursor-pointer"
                              >
                                Clear Logs
                              </button>
                            )}
                          </div>

                          {!showDriverChat ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-2">
                              <MessageSquare className="h-8 w-8 text-slate-200 animate-bounce" />
                              <h6 className="text-[10px] font-black uppercase text-slate-700">Driver Chat Console Ready</h6>
                              <p className="text-[9px] text-slate-400 max-w-xs mx-auto">
                                Click "Initialize Telemetry Chat" to open a live simulated text communication link with the fleet truck operator.
                              </p>
                            </div>
                          ) : (
                            <>
                              {/* Messages area */}
                              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-[11px]">
                                {chatMessages.map((m, idx) => {
                                  const isDriver = m.sender === "driver";
                                  return (
                                    <div
                                      key={idx}
                                      className={`flex flex-col ${isDriver ? 'items-start' : 'items-end'}`}
                                    >
                                      <div
                                        className={`max-w-[85%] p-3.5 rounded-2xl leading-normal text-xs ${
                                          isDriver
                                            ? 'bg-slate-100 text-slate-800 rounded-tl-none font-medium'
                                            : 'bg-teal-600 text-white rounded-tr-none font-semibold'
                                        }`}
                                      >
                                        {m.text}
                                      </div>
                                      <span className="text-[8px] text-slate-400 font-bold mt-1 font-mono">{m.time}</span>
                                    </div>
                                  );
                                })}

                                {driverIsTyping && (
                                  <div className="flex items-center gap-1 bg-slate-100 p-2 rounded-xl text-[9px] text-slate-500 font-bold w-fit italic animate-pulse">
                                    <span className="h-1 w-1 bg-slate-500 rounded-full animate-bounce" />
                                    <span className="h-1 w-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="h-1 w-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    {selectedTrackingOrder.pickupDetails?.driverName.split(" ")[0]} is typing route specs...
                                  </div>
                                )}
                              </div>

                              {/* Form Input */}
                              <form onSubmit={handleSendChatMessage} className="border-t border-slate-100 pt-3 flex gap-2">
                                <input
                                  type="text"
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                  placeholder="Ask about distance, location, speed, or temperature..."
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-medium"
                                />
                                <button
                                  type="submit"
                                  disabled={!chatInput.trim()}
                                  className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-3xs"
                                >
                                  <Send className="h-3.5 w-3.5" />
                                </button>
                              </form>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-3xs space-y-3">
                      <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                      <h4 className="text-xs font-black uppercase text-slate-700">No Manifest Loaded</h4>
                      <p className="text-[10px] text-slate-400">Please select an active shipping consignment from the manifest panel to visualize telemetry.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* AI LOGISTICS OPTIMIZER VIEW */}
        {/* ========================================================================= */}
        {activeSegment === "optimize" && (
          <div className="col-span-12 space-y-6">
            
            {/* AI Banner */}
            <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none w-1/3 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black tracking-wider uppercase">
                    <Sparkles className="h-3 w-3 text-teal-300 animate-pulse" /> Precision Logistics Intelligence
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight">AI Route & Dispatch Fleet Optimizer</h3>
                  <p className="text-xs text-teal-100/90 leading-relaxed font-sans">
                    Leverage neural routing models grounded in Indian National Highway registries to dynamically select route corridors, compute driver shifts, optimize fuel consumption index, and recommend the best-suited fleet vehicle.
                  </p>
                </div>
                <div className="shrink-0">
                  <button
                    onClick={() => {
                      setOptPickupAddress("Gurdaspur Cooperative Mandi Yard, Gurdaspur, Punjab");
                      setOptDeliveryAddress("Adani Agri-Logistics Terminal, Moga, Punjab");
                      setOptQuantity(15);
                      setOptUrgency("High");
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    ⚡ Load Demo Specs
                  </button>
                </div>
              </div>
            </div>

            {/* Split Screen Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* INPUT PARAMETERS - Left 5 columns */}
              <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-5">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-teal-600" /> Sourcing Constraints
                </h4>

                <form onSubmit={(e) => { e.preventDefault(); handleOptimizeLogistics(); }} className="space-y-4">
                  {/* Origin */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Pickup Origin Yard</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={optPickupAddress}
                        onChange={(e) => setOptPickupAddress(e.target.value)}
                        placeholder="Enter full sourcing origin or mandi address..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-medium text-slate-800"
                        required
                      />
                    </div>
                    {/* Quick suggestion pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-[8px] text-slate-400 font-bold self-center mr-1">QUICK ORIGINS:</span>
                      {[
                        { short: "Gurdaspur, PB", full: "Gurdaspur Cooperative Mandi Yard, Gurdaspur, Punjab" },
                        { short: "Shimla, HP", full: "Shimla Apple Sourcing Terminal, Shimla, Himachal Pradesh" },
                        { short: "Rohtak, HR", full: "Rohtak Central Wheat Yard, Rohtak, Haryana" },
                        { short: "Karnal, HR", full: "Karnal Basmati Sourcing Terminal, Karnal, Haryana" }
                      ].map((item) => (
                        <button
                          key={item.short}
                          type="button"
                          onClick={() => setOptPickupAddress(item.full)}
                          className="bg-slate-50 border border-slate-200 text-[8px] font-bold text-slate-600 px-2 py-0.5 rounded hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          📍 {item.short}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Delivery Destination Warehouse</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={optDeliveryAddress}
                        onChange={(e) => setOptDeliveryAddress(e.target.value)}
                        placeholder="Enter target warehouse or private depot address..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-medium text-slate-800"
                        required
                      />
                    </div>
                    {/* Quick suggestion pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-[8px] text-slate-400 font-bold self-center mr-1">QUICK TARGETS:</span>
                      {[
                        { short: "Moga Terminal", full: "Adani Agri-Logistics Terminal (Moga), Punjab" },
                        { short: "Kurukshetra Yard", full: "Cargill Processing Facility (Kurukshetra), Haryana" },
                        { short: "Chandigarh Hub", full: "Adani Fresh Cold Storage Hub (Chandigarh)" },
                        { short: "Delhi CWC Depot", full: "Central Warehousing Corporation Depot (Delhi)" }
                      ].map((item) => (
                        <button
                          key={item.short}
                          type="button"
                          onClick={() => setOptDeliveryAddress(item.full)}
                          className="bg-slate-50 border border-slate-200 text-[8px] font-bold text-slate-600 px-2 py-0.5 rounded hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          🏢 {item.short}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight Quantity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Consignment Mass (Quantity)</label>
                      <span className="text-xs font-black font-mono text-teal-700">{optQuantity} Tons</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={optQuantity}
                      onChange={(e) => setOptQuantity(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-[8px] text-slate-400 font-mono font-bold uppercase">
                      <span>1 Ton (Mini Van)</span>
                      <span>10 Tons (Medium Truck)</span>
                      <span>25+ Tons (Heavy Multi-Axle)</span>
                    </div>
                  </div>

                  {/* Urgency Priority */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Dispatch Urgency level</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(["Low", "Medium", "High", "Immediate"] as const).map((lvl) => {
                        const isSelected = optUrgency === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setOptUrgency(lvl)}
                            className={`py-2 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                              isSelected
                                ? "bg-teal-50 border-teal-500 text-teal-700 shadow-3xs"
                                : "bg-white border-slate-150 hover:border-slate-300 text-slate-500"
                            }`}
                          >
                            {lvl === "Low" ? "💤 Low" : lvl === "Medium" ? "☕ Med" : lvl === "High" ? "⚡ High" : "🔥 Urgent"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isOptimizing}
                    className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Neural Routing Calculation...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-teal-200" /> Calculate Route & Optimize Fleet
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* OUTPUT DISPLAY - Right 7 columns */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">
                  {!optimizationResult ? (
                    // Onboarding Empty State
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-3xs space-y-4 min-h-[460px] flex flex-col justify-center items-center"
                    >
                      <div className="h-14 w-14 bg-teal-50 text-teal-600 border border-teal-100 rounded-full flex items-center justify-center shadow-3xs mb-2">
                        <Compass className="h-7 w-7 text-teal-600 animate-spin [animation-duration:8s]" />
                      </div>
                      <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Awaiting Optimization parameters</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-sans">
                        Provide the sourcing origin yard, consignment weight, and urgency priority on the left. The neural optimizer will instantly trace premium highway pathways and allocate the most cost-efficient vehicle type.
                      </p>
                      <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                        <span className="text-[8px] bg-slate-100 text-slate-500 font-black font-mono uppercase px-2 py-1 rounded">🛡️ Toll Calculation</span>
                        <span className="text-[8px] bg-slate-100 text-slate-500 font-black font-mono uppercase px-2 py-1 rounded">🚚 Van & Tipper Sizing</span>
                        <span className="text-[8px] bg-slate-100 text-slate-500 font-black font-mono uppercase px-2 py-1 rounded">⛽ Fuel Indexing</span>
                      </div>
                    </motion.div>
                  ) : (
                    // Results Present Panel
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-6"
                    >
                      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-emerald-600" /> AI Logistics Output Manifest
                        </h4>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black tracking-wider uppercase">
                          ✓ COMPUTATION MATCHED
                        </span>
                      </div>

                      {/* Key metrics grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-50/70 border border-slate-150 rounded-xl p-3 space-y-1">
                          <p className="text-[8px] text-slate-400 font-bold uppercase">Optimal Route</p>
                          <p className="text-xs font-black text-slate-800 truncate" title={optimizationResult.optimalRoute}>
                            {optimizationResult.optimalRoute}
                          </p>
                        </div>
                        <div className="bg-slate-50/70 border border-slate-150 rounded-xl p-3 space-y-1">
                          <p className="text-[8px] text-slate-400 font-bold uppercase">Best Truck Type</p>
                          <p className="text-xs font-black text-slate-800">
                            🚚 {optimizationResult.bestTruckType}
                          </p>
                        </div>
                        <div className="bg-teal-50/30 border border-teal-100 rounded-xl p-3 space-y-1">
                          <p className="text-[8px] text-teal-600 font-bold uppercase">Estimated Cost</p>
                          <p className="text-xs font-black text-teal-700 font-mono">
                            ₹{optimizationResult.estimatedCost.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-slate-50/70 border border-slate-150 rounded-xl p-3 space-y-1">
                          <p className="text-[8px] text-slate-400 font-bold uppercase">Transit Duration</p>
                          <p className="text-xs font-black text-slate-800 font-mono">
                            ⏱️ {optimizationResult.estimatedHours} hrs ({optimizationResult.distanceKm} Kms)
                          </p>
                        </div>
                      </div>

                      {/* Route Timeline */}
                      <div className="space-y-3">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Optimized Highway waypoint Timeline</p>
                        <div className="relative pl-6 space-y-4 border-l border-teal-200">
                          {/* Origin Checkpoint */}
                          <div className="relative">
                            <span className="absolute -left-[29px] top-0.5 h-3.5 w-3.5 bg-teal-500 border-2 border-white rounded-full flex items-center justify-center font-mono text-[7px] text-white font-black">
                              A
                            </span>
                            <div>
                              <p className="text-[10px] font-black uppercase text-slate-800">Sourcing Origin Dispatch</p>
                              <p className="text-[9px] text-slate-500 font-medium truncate max-w-xl">{optPickupAddress}</p>
                            </div>
                          </div>

                          {/* Waypoint Steps */}
                          {optimizationResult.routeSteps.slice(1, -1).map((step, idx) => (
                            <div key={idx} className="relative">
                              <span className="absolute -left-[29px] top-1 h-2 w-2 bg-teal-400 border border-white rounded-full" />
                              <div>
                                <p className="text-[10px] font-bold text-slate-700">{step}</p>
                              </div>
                            </div>
                          ))}

                          {/* Destination Checkpoint */}
                          <div className="relative">
                            <span className="absolute -left-[29px] top-0.5 h-3.5 w-3.5 bg-indigo-500 border-2 border-white rounded-full flex items-center justify-center font-mono text-[7px] text-white font-black">
                              B
                            </span>
                            <div>
                              <p className="text-[10px] font-black uppercase text-slate-800">Warehouse Final Terminal</p>
                              <p className="text-[9px] text-slate-500 font-medium truncate max-w-xl">{optDeliveryAddress}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Explanation Justification Box */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1 leading-relaxed">
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider font-mono">Neural Engine Decision Analysis</p>
                        <p className="text-xs text-slate-600 font-medium font-sans">
                          {optimizationResult.explanation}
                        </p>
                      </div>

                      {/* Alternative route options comparison */}
                      <div className="space-y-3">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Alternative Routing strategies</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {optimizationResult.alternativeRoutes.map((route, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2">
                              <div className="flex justify-between items-baseline border-b border-slate-200/60 pb-1.5">
                                <h5 className="font-bold text-[10px] uppercase text-slate-700 truncate max-w-[70%]">{route.name}</h5>
                                <span className="text-[10px] font-black font-mono text-teal-700">₹{route.cost.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 font-mono">
                                <span>⏱️ Time: {route.hours} hrs</span>
                                <span className="bg-slate-150 px-1.5 py-0.5 rounded text-[8px] font-sans">⌥ Alternative</span>
                              </div>
                              <p className="text-[9px] text-slate-400 leading-tight font-medium font-sans">{route.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions footer */}
                      <div className="pt-2 border-t border-slate-100 flex gap-3">
                        <button
                          onClick={() => setOptimizationResult(null)}
                          className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase rounded-xl transition-colors cursor-pointer"
                        >
                          Clear Result
                        </button>
                        <button
                          onClick={() => {
                            // Apply parameters directly and book fleet
                            const newOptimizedOrder: WonOrder = {
                              id: `CON-${Math.floor(100000 + Math.random() * 900000)}`,
                              lotId: `LOT-${Math.floor(100 + Math.random() * 899)}`,
                              cropName: `Wheat (HD-2967) - AI Optimized Lot`,
                              farmerName: "Sardara Singh Sandhu",
                              farmerPhone: "+91 98451 02948",
                              farmerEmail: "sandhu.farms@agri.in",
                              quantity: optQuantity,
                              qualityGrade: "Grade-A Prime",
                              finalBidAmount: optQuantity * 21000,
                              paymentDeadline: new Date().toISOString().split("T")[0],
                              paymentStatus: "Paid",
                              pickupStatus: "Scheduled",
                              orderConfirmationNumber: `CONF-${Math.floor(100000 + Math.random() * 900000)}`,
                              paymentLink: "#",
                              pickupAddress: optPickupAddress,
                              location: optPickupAddress.split(",")[0],
                              pickupDetails: {
                                modeOfTransport: optimizationResult.bestTruckType,
                                pickupDate: new Date(Date.now() + 24*60*60*1000).toISOString().split("T")[0],
                                pickupTime: "08:30",
                                driverName: "Satnam Pal Singh",
                                driverPhone: "+91 94632 99812",
                                vehicleNumber: "PB-02-CD-5290",
                                targetWarehouse: optDeliveryAddress
                              }
                            };

                            const updated = [newOptimizedOrder, ...orders];
                            saveOrdersToStorage(updated);
                            setSelectedTrackingOrderId(newOptimizedOrder.id);
                            setSimulatedProgress(0);
                            setIsSimulatingGps(true);
                            setActiveSegment("track");
                            
                            // Reset driver chat log for this order
                            setChatMessages([
                              {
                                sender: "driver",
                                text: `Sat Sri Akal! AI optimization coordinates loaded. I am launching the ${optimizationResult.bestTruckType} along the ${optimizationResult.optimalRoute} corridor. Target delivery is ${optimizationResult.estimatedHours} hours. Telemetry tracking active.`,
                                time: "Just now"
                              }
                            ]);
                          }}
                          className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          Book & Apply Selected AI Configuration <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
