import React, { useState, useMemo } from "react";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Truck,
  Image as ImageIcon,
  Search,
  MessageSquare,
  Calendar,
  DollarSign,
  X,
  ChevronRight,
  ShieldCheck,
  FileText,
  ExternalLink,
  ChevronLeft
} from "lucide-react";

interface ReturnsRefundsManagerProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setFeedback: (msg: string) => void;
}

interface ReturnRequest {
  id: string;
  orderId: string;
  buyerName: string;
  buyerCompany: string;
  reason: string;
  proofImage: string;
  status: "Pending Review" | "Approved" | "Rejected" | "Refunded" | "Return Requested";
  date: string;
  rejectionReason?: string;
  refundAmount: number;
}

export default function ReturnsRefundsManager({
  orders,
  setOrders,
  setFeedback
}: ReturnsRefundsManagerProps) {
  // Initialize return requests with local storage or high-fidelity seed data
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(() => {
    const stored = localStorage.getItem("agriconnect_supplier_returns");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      {
        id: "RET-2940",
        orderId: "ORD-9831",
        buyerName: "Siddharth Roy",
        buyerCompany: "Sahyadri Agro-Tech Pvt Ltd",
        reason: "The Solar-Powered Deep Well Submersible Pump has a noticeable hairline fracture on the primary water intake seal, causing micro-leaks and loss of pressure.",
        proofImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
        status: "Pending Review",
        date: "2026-07-07",
        refundAmount: 71400 // ORD-9831: 1 unit * 850 USD * 84 INR/USD = ₹71,400
      },
      {
        id: "RET-2941",
        orderId: "ORD-9839",
        buyerName: "Devendra Singh",
        buyerCompany: "Kurnool Cooperative Society",
        reason: "Ordered 50 compost bags, but received 25 bags of alternative brand showing higher sulfur contents which is unsafe for our test crops.",
        proofImage: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=600",
        status: "Approved",
        date: "2026-07-06",
        refundAmount: 105000 // 50 * 25 USD * 84 = ₹105,000
      },
      {
        id: "RET-2942",
        orderId: "ORD-9844",
        buyerName: "Sunita Rao",
        buyerCompany: "Belgaum Growers Federation",
        reason: "Moisture meter display glass arrived shattered. The LCD screen is glitching on startup and showing high-frequency telemetry lines.",
        proofImage: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600",
        status: "Refunded",
        date: "2026-07-05",
        refundAmount: 37800 // 1 unit * 450 * 84 = ₹37,800
      }
    ];
  });

  // Persist returns to localStorage
  const saveReturns = (updated: ReturnRequest[]) => {
    setReturnRequests(updated);
    localStorage.setItem("agriconnect_supplier_returns", JSON.stringify(updated));
  };

  // UI state
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  
  // Rejection dialog state
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionInput, setRejectionInput] = useState("");

  // Lightbox for proof image
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Find linked order details for selected return
  const linkedOrder = useMemo(() => {
    if (!selectedReturn) return null;
    return orders.find(o => o.id === selectedReturn.orderId) || null;
  }, [selectedReturn, orders]);

  // Filter computation
  const filteredReturns = useMemo(() => {
    return returnRequests.filter(req => {
      const matchSearch =
        req.id.toLowerCase().includes(filterSearch.toLowerCase()) ||
        req.orderId.toLowerCase().includes(filterSearch.toLowerCase()) ||
        req.buyerName.toLowerCase().includes(filterSearch.toLowerCase()) ||
        req.buyerCompany.toLowerCase().includes(filterSearch.toLowerCase()) ||
        req.reason.toLowerCase().includes(filterSearch.toLowerCase());
      
      const matchStatus = filterStatus === "All" || req.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [returnRequests, filterSearch, filterStatus]);

  // Handle Return Approval
  const handleApprove = (reqId: string) => {
    const updated = returnRequests.map(r => 
      r.id === reqId ? { ...r, status: "Approved" as const } : r
    );
    saveReturns(updated);
    
    // Update selected view
    if (selectedReturn?.id === reqId) {
      setSelectedReturn(prev => prev ? { ...prev, status: "Approved" } : null);
    }

    setFeedback(`✓ Return ${reqId} approved! Buyer has been notified to ship the item.`);
  };

  // Handle Request Product Return
  const handleRequestReturnShipment = (reqId: string) => {
    const updated = returnRequests.map(r => 
      r.id === reqId ? { ...r, status: "Return Requested" as const } : r
    );
    saveReturns(updated);
    
    if (selectedReturn?.id === reqId) {
      setSelectedReturn(prev => prev ? { ...prev, status: "Return Requested" } : null);
    }

    setFeedback(`📦 Shipping label and return instructions sent to the buyer for Return ${reqId}.`);
  };

  // Handle Refund Initiation
  const handleInitiateRefund = (reqId: string, orderId: string, amount: number) => {
    // 1. Update Return Request status
    const updatedReturns = returnRequests.map(r => 
      r.id === reqId ? { ...r, status: "Refunded" as const } : r
    );
    saveReturns(updatedReturns);

    if (selectedReturn?.id === reqId) {
      setSelectedReturn(prev => prev ? { ...prev, status: "Refunded" } : null);
    }

    // 2. Update linked order payment status to "Refunded" in local storage & React state
    setOrders(prevOrders => {
      const newOrders = prevOrders.map(o => 
        o.id === orderId ? { ...o, paymentStatus: "Refunded" } : o
      );
      localStorage.setItem("agriconnect_supplier_orders", JSON.stringify(newOrders));
      return newOrders;
    });

    setFeedback(`💸 Refund of ₹${amount.toLocaleString()} initiated successfully via instant escrow gateway!`);
  };

  // Handle Return Rejection Submit
  const handleRejectSubmit = () => {
    if (!selectedReturn || !rejectionInput.trim()) return;

    const updated = returnRequests.map(r => 
      r.id === selectedReturn.id 
        ? { ...r, status: "Rejected" as const, rejectionReason: rejectionInput } 
        : r
    );
    saveReturns(updated);

    setSelectedReturn(prev => prev ? { ...prev, status: "Rejected", rejectionReason: rejectionInput } : null);
    setIsRejectDialogOpen(false);
    setRejectionInput("");
    setFeedback(`✗ Return ${selectedReturn.id} has been rejected.`);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col space-y-4 text-left">
      {/* Search and filter controls */}
      <div className="bg-slate-50/70 border border-slate-150 rounded-2xl p-4 shrink-0 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        <div className="sm:col-span-6 space-y-1">
          <label className="block text-[10px] font-black uppercase text-slate-500">Search Returns</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Order, Buyer, Reason..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 font-bold text-slate-700 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="sm:col-span-3 space-y-1">
          <label className="block text-[10px] font-black uppercase text-slate-500">Status State</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 font-bold text-slate-700 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Requests</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Return Requested">Return Requested</option>
            <option value="Refunded">Refunded</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-end">
          <button
            onClick={() => {
              setFilterSearch("");
              setFilterStatus("All");
            }}
            className="w-full py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-3xs"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Main Split-Pane Content */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4">
        {/* Left List Pane */}
        <div className={`flex-1 overflow-y-auto pr-1 space-y-2.5 min-w-0 ${selectedReturn ? "hidden md:block md:w-1/2" : "w-full"}`}>
          {filteredReturns.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-semibold flex flex-col items-center justify-center space-y-3 h-full">
              <AlertCircle className="h-8 w-8 text-slate-300 animate-pulse" />
              <div>
                <p className="font-extrabold text-sm text-slate-700">No Return Requests Found</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Either no returns are initiated, or they do not match search parameters.</p>
              </div>
            </div>
          ) : (
            filteredReturns.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReturn(req)}
                className={`p-4 rounded-2xl border transition-all text-xs text-left cursor-pointer flex flex-col justify-between gap-3 ${
                  selectedReturn?.id === req.id
                    ? "bg-indigo-50/50 border-indigo-300 shadow-xs"
                    : "bg-white border-slate-200/85 hover:border-slate-350"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-800 text-xs">{req.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold">• Order: {req.orderId}</span>
                    </div>
                    <p className="font-extrabold text-slate-800 text-xs">
                      {req.buyerName}
                    </p>
                    <p className="text-[10.5px] text-slate-500 font-bold leading-normal line-clamp-2">
                      &ldquo;{req.reason}&rdquo;
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      req.status === "Pending Review"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : req.status === "Approved"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : req.status === "Return Requested"
                        ? "bg-sky-100 text-sky-800 border border-sky-200"
                        : req.status === "Refunded"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">{req.date}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10px]">
                  <div className="font-bold text-slate-500">
                    Est. Refund: <span className="text-indigo-600 font-black">₹{req.refundAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-bold">
                    <span>Inspect Attachment</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Detail Inspector Pane */}
        {selectedReturn ? (
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 overflow-y-auto space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-4">
              {/* Inspector Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedReturn(null)}
                    className="md:hidden p-1 bg-slate-200 hover:bg-slate-300 rounded-full mr-1 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-700" />
                  </button>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Return Inspector</span>
                      <span className="text-[10px] text-slate-400 font-bold">ID: {selectedReturn.id}</span>
                    </div>
                    <h4 className="font-black text-slate-800 text-sm mt-0.5">
                      Requested by {selectedReturn.buyerName}
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className="hidden md:flex p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer bg-transparent border-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status State Ribbon */}
              <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                selectedReturn.status === "Pending Review"
                  ? "bg-amber-50 text-amber-800 border-amber-200/80"
                  : selectedReturn.status === "Approved"
                  ? "bg-blue-50 text-blue-800 border-blue-200/80"
                  : selectedReturn.status === "Return Requested"
                  ? "bg-sky-50 text-sky-800 border-sky-200/80"
                  : selectedReturn.status === "Refunded"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                  : "bg-rose-50 text-rose-800 border-rose-200/80"
              }`}>
                {selectedReturn.status === "Pending Review" && <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0" />}
                {selectedReturn.status === "Approved" && <CheckCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />}
                {selectedReturn.status === "Return Requested" && <Truck className="h-4.5 w-4.5 text-sky-600 shrink-0" />}
                {selectedReturn.status === "Refunded" && <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />}
                {selectedReturn.status === "Rejected" && <XCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />}

                <div className="text-xs">
                  <p className="font-black uppercase tracking-wider text-[9.5px]">
                    Current Status: {selectedReturn.status}
                  </p>
                  <p className="text-[10px] opacity-90 font-semibold mt-0.5">
                    {selectedReturn.status === "Pending Review" && "Pending internal audit verification of buyer claims and photo uploads."}
                    {selectedReturn.status === "Approved" && "Return authorized. Buyer has been notified to return the defective units."}
                    {selectedReturn.status === "Return Requested" && "Requested buyer to ship the product. Pre-paid label generated."}
                    {selectedReturn.status === "Refunded" && `Settlement complete. ₹${selectedReturn.refundAmount.toLocaleString()} credited back.`}
                    {selectedReturn.status === "Rejected" && `Request denied. Reason: ${selectedReturn.rejectionReason || "Criteria not met."}`}
                  </p>
                </div>
              </div>

              {/* Order Context Details */}
              <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3 shadow-3xs">
                <h5 className="text-[10px] uppercase font-black text-indigo-700 tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  Linked Order Information
                </h5>

                <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold text-slate-600">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-black block">Order Number</span>
                    <span className="text-slate-800 font-extrabold">{selectedReturn.orderId}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-black block">Order Date</span>
                    <span className="text-slate-800 font-extrabold">{linkedOrder?.date || "2026-07-01"}</span>
                  </div>
                  <div className="col-span-2 border-t border-slate-100 pt-1.5 mt-0.5">
                    <span className="text-[9px] text-slate-400 uppercase font-black block">Buyer Entity Details</span>
                    <span className="text-slate-800 font-extrabold block">{selectedReturn.buyerName}</span>
                    <span className="text-[10px] text-slate-500 block">{selectedReturn.buyerCompany}</span>
                    <span className="text-[9.5px] text-slate-400 font-mono block mt-0.5">{linkedOrder?.buyerContact || "+91 98450-12345"} | {linkedOrder?.buyerEmail || "buyer@agriconnect.org"}</span>
                  </div>
                  <div className="col-span-2 border-t border-slate-100 pt-1.5">
                    <span className="text-[9px] text-slate-400 uppercase font-black block">Products Ordered & SKU</span>
                    <span className="text-slate-800 font-black block">
                      {linkedOrder?.productName || "Submersible Solar Pump"}
                    </span>
                    <span className="text-[9px] text-indigo-600 font-mono block mt-0.5">
                      SKU ID: {linkedOrder?.sku || "PUMP-SOLAR-05"}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Qty: <span className="font-extrabold text-slate-800">{linkedOrder?.quantity || 1} units</span> | Price: <span className="font-extrabold text-slate-800">₹{((linkedOrder?.unitPrice || 850) * 84).toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="col-span-2 border-t border-slate-100 pt-1.5 flex justify-between text-xs font-black">
                    <span className="text-slate-500">Aggregate Value:</span>
                    <span className="text-indigo-600">₹{(selectedReturn.refundAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Buyer's Reason for Return */}
              <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-2.5 shadow-3xs">
                <h5 className="text-[10px] uppercase font-black text-indigo-700 tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                  Buyer's Stated Dispute Reason
                </h5>
                <blockquote className="border-l-3 border-indigo-400 pl-3.5 py-1 text-slate-700 font-semibold italic text-xs leading-relaxed bg-slate-50/55 rounded-r-lg">
                  &ldquo;{selectedReturn.reason}&rdquo;
                </blockquote>
              </div>

              {/* Proof Image Attachment */}
              <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3.5 shadow-3xs">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] uppercase font-black text-indigo-700 tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                    Buyer Verifiable Proof Image
                  </h5>
                  <span className="text-[9px] bg-indigo-50 text-indigo-600 font-extrabold px-1.5 py-0.5 rounded border border-indigo-150 flex items-center gap-1 font-sans">
                    <ShieldCheck className="h-3 w-3" /> GPS & Metadata Verified
                  </span>
                </div>

                <div className="relative group overflow-hidden rounded-xl border border-slate-250 cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                  <img
                    src={selectedReturn.proofImage}
                    alt="Defect proof"
                    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-extrabold gap-1.5">
                    <ExternalLink className="h-4 w-4" />
                    View High-Resolution Image
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 text-center font-semibold">Click on the image attachment to open full lightbox view</p>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="border-t border-slate-200 pt-4 mt-5 flex flex-col gap-2 shrink-0">
              <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Management Action Console</span>

              <div className="flex flex-wrap gap-2">
                {selectedReturn.status === "Pending Review" && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedReturn.id)}
                      className="flex-1 min-w-[120px] py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center shadow-xs"
                    >
                      Approve Return
                    </button>
                    <button
                      onClick={() => setIsRejectDialogOpen(true)}
                      className="flex-1 min-w-[120px] py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center shadow-xs"
                    >
                      Reject Return
                    </button>
                  </>
                )}

                {selectedReturn.status === "Approved" && (
                  <>
                    <button
                      onClick={() => handleRequestReturnShipment(selectedReturn.id)}
                      className="flex-1 min-w-[150px] py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center shadow-xs"
                    >
                      Request Product Return
                    </button>
                    <button
                      onClick={() => handleInitiateRefund(selectedReturn.id, selectedReturn.orderId, selectedReturn.refundAmount)}
                      className="flex-1 min-w-[150px] py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center shadow-xs"
                    >
                      Direct Instant Refund
                    </button>
                  </>
                )}

                {selectedReturn.status === "Return Requested" && (
                  <button
                    onClick={() => handleInitiateRefund(selectedReturn.id, selectedReturn.orderId, selectedReturn.refundAmount)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center shadow-xs"
                  >
                    Initiate Refund (Product Received)
                  </button>
                )}

                {(selectedReturn.status === "Refunded" || selectedReturn.status === "Rejected") && (
                  <div className="w-full text-center p-3 bg-slate-100 rounded-xl border text-[11px] font-extrabold text-slate-500">
                    This ticket is finalized and archive locked. No further actions required.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 bg-slate-50 border border-slate-200 border-dashed rounded-2xl items-center justify-center p-8 text-slate-400 text-xs font-semibold">
            <div className="text-center space-y-2">
              <RotateCcw className="h-8 w-8 text-slate-300 mx-auto animate-spin" style={{ animationDuration: '6s' }} />
              <p className="font-extrabold text-slate-600 text-sm">Select Return Request</p>
              <p className="text-[10px] text-slate-400">Choose a claim entry from the list to trigger active inspection and claim auditing.</p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedReturn && (
        <div className="fixed inset-0 z-100 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/15 hover:bg-white/30 text-white rounded-full transition-colors cursor-pointer border-0"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="max-w-4xl w-full max-h-[80vh] flex items-center justify-center">
            <img
              src={selectedReturn.proofImage}
              alt="High-resolution defect claim proof"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="text-center mt-4 text-white max-w-xl">
            <span className="text-[10px] bg-indigo-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest inline-block">Dispute ID: {selectedReturn.id}</span>
            <p className="text-xs font-extrabold mt-2 text-slate-200">Claim Reason: {selectedReturn.reason}</p>
          </div>
        </div>
      )}

      {/* Rejection Dialog Modal */}
      {isRejectDialogOpen && selectedReturn && (
        <div className="fixed inset-0 z-100 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5 text-rose-600">
                <XCircle className="h-5 w-5" />
                <h4 className="font-black text-slate-800 text-sm">Reject Return Claim</h4>
              </div>
              <button
                onClick={() => setIsRejectDialogOpen(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-500 font-semibold">
                Please specify the criteria or inspection reason for rejecting return <span className="font-extrabold text-slate-800">{selectedReturn.id}</span>. This explanation will be logged and dispatched to the buyer.
              </p>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-slate-500">Denial Justification Reason</label>
                <textarea
                  placeholder="e.g., The proof image does not demonstrate an authentic item defect, or user error matches manual calibration logs."
                  value={rejectionInput}
                  onChange={(e) => setRejectionInput(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-250 rounded-xl p-3 font-bold text-slate-700 placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-500 min-h-[90px]"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setIsRejectDialogOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!rejectionInput.trim()}
                onClick={handleRejectSubmit}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
