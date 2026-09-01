import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Award,
  Tag,
  Eye,
  ChevronRight,
  X,
  AlertCircle,
  RefreshCw,
  FileCheck,
  Building,
  Phone,
  User,
  CreditCard,
  Check,
  Printer,
  Download,
  FileText
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
  date?: string; // e.g., "2026-07-04"
  cropType?: string; // For filtering
  location?: string;
  pickupAddress: string;
  trackingNumber?: string;
  refundStatus?: "Not Requested" | "Pending Approval" | "Approved" | "Refunded";
  refundReason?: string;
  refundDescription?: string;
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

export default function BuyerOrderDashboard() {
  // Load and initialize orders
  const [orders, setOrders] = useState<WonOrder[]>(() => {
    const saved = localStorage.getItem("agriconnect_buyer_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          // Normalize existing orders to make sure they have all necessary fields
          return parsed.map((order: any, idx: number) => ({
            ...order,
            date: order.date || (order.paymentDeadline ? new Date(order.paymentDeadline).toISOString().split("T")[0] : `2026-07-0${5 - idx}`),
            cropType: order.cropType || (order.cropName.includes("Rice") ? "Rice" : order.cropName.includes("Wheat") ? "Wheat" : order.cropName.includes("Mustard") ? "Mustard" : order.cropName.includes("Cotton") ? "Cotton" : "Other"),
            location: order.location || "North India Logistics Center",
            farmerPhone: order.farmerPhone || "+91 98711 04291",
            farmerEmail: order.farmerEmail || "cooperative.farmer@agri-hub.org",
            pickupAddress: order.pickupAddress || "Plot No. 44-B, Grain Market Cooperative Complex, Jalandhar Main Highway, Punjab",
            trackingNumber: order.trackingNumber || `AGRI-TRK-${order.id ? order.id.split("-")[2] : 9000 + idx}`,
            paymentStatus: order.paymentStatus || "Paid",
            refundStatus: order.refundStatus || "Not Requested"
          }));
        }
      } catch (e) {
        // ignore
      }
    }

    // Default pre-populated list matching all requested active order fields and statuses
    const defaultOrders: WonOrder[] = [
      {
        id: "ORD-2026-9102",
        lotId: "LOT-9102",
        cropName: "Premium Basmati Rice (Pusa-1121)",
        variety: "Pusa-1121 Long Grain",
        farmerName: "Sukhdev Singh Farms",
        farmerPhone: "+91 94140 23811",
        farmerEmail: "sukhdev.singh@gurdaspurcoop.in",
        quantity: 15,
        qualityGrade: "Premium",
        finalBidAmount: 62000, // ₹62,000 per Ton
        paymentDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
        paymentStatus: "Pending",
        pickupStatus: "Unscheduled",
        orderConfirmationNumber: "CONF-9102-X9P",
        paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-9102",
        date: "2026-07-05",
        cropType: "Rice",
        location: "Gurdaspur, Punjab",
        pickupAddress: "Mandi Gate No. 3, Gurdaspur Grain Yard, Gurdaspur, Punjab - 143521",
        trackingNumber: "AGRI-TRK-9102",
        refundStatus: "Not Requested"
      },
      {
        id: "ORD-2026-3104",
        lotId: "LOT-3104",
        cropName: "Organic Yellow Mustard Seeds",
        variety: "M-27 Bold Hybrid",
        farmerName: "Rajender Singh Cooperatives",
        farmerPhone: "+91 98822 11044",
        farmerEmail: "rajender.singh@moga-farmers.org",
        quantity: 12,
        qualityGrade: "Premium",
        finalBidAmount: 45000,
        paymentDeadline: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        paymentStatus: "Paid",
        pickupStatus: "Unscheduled",
        orderConfirmationNumber: "CONF-3104-Y8W",
        paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-3104",
        date: "2026-07-04",
        cropType: "Mustard",
        location: "Moga, Punjab",
        pickupAddress: "Cooperative Warehouse No. 4, Malout Road, Moga, Punjab - 142001",
        trackingNumber: "AGRI-TRK-3104",
        refundStatus: "Not Requested"
      },
      {
        id: "ORD-2026-5123",
        lotId: "LOT-5123",
        cropName: "Golden Delicious Apples",
        variety: "Standard Shimla Red",
        farmerName: "Devender Sharma Orchards",
        farmerPhone: "+91 98160 84310",
        farmerEmail: "d.sharma@shimlafresh.co.in",
        quantity: 6,
        qualityGrade: "Grade A",
        finalBidAmount: 92000,
        paymentDeadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        paymentStatus: "Paid",
        pickupStatus: "Scheduled",
        orderConfirmationNumber: "CONF-5123-A4T",
        paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-5123",
        date: "2026-07-02",
        cropType: "Apple",
        location: "Shimla, Himachal Pradesh",
        pickupAddress: "Apple Logistics Depot, Bypass Road, Theog, Shimla District, HP - 171201",
        trackingNumber: "AGRI-TRK-5123",
        refundStatus: "Not Requested",
        pickupDetails: {
          modeOfTransport: "Refrigerated Cold Chain Carrier",
          pickupDate: "2026-07-09",
          pickupTime: "09:30",
          driverName: "Gurcharan Singh",
          driverPhone: "+91 98112 04512",
          vehicleNumber: "HP-63-TR-8422",
          targetWarehouse: "Adani Fresh Cold Storage Hub (Chandigarh)"
        }
      },
      {
        id: "ORD-2026-2041",
        lotId: "LOT-2041",
        cropName: "Premium Long-Staple Cotton",
        variety: "MCU-5 Fine Quality",
        farmerName: "Gurnam Singh Cotton Farms",
        farmerPhone: "+91 94142 83012",
        farmerEmail: "gurnam.singh@haryana-cotton.org",
        quantity: 18,
        qualityGrade: "Grade A",
        finalBidAmount: 88500,
        paymentDeadline: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        paymentStatus: "Paid",
        pickupStatus: "In Transit",
        orderConfirmationNumber: "CONF-2041-K4L",
        paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-2041",
        date: "2026-06-28",
        cropType: "Cotton",
        location: "Karnal, Haryana",
        pickupAddress: "Karnal Agriculture Development Mandi Yard, Gate 2, Karnal, Haryana - 132001",
        trackingNumber: "AGRI-TRK-2041",
        refundStatus: "Not Requested",
        pickupDetails: {
          modeOfTransport: "Standard Open Cargo Carrier",
          pickupDate: "2026-07-05",
          pickupTime: "11:00",
          driverName: "Sohan Singh Brar",
          driverPhone: "+91 94142 83012",
          vehicleNumber: "PB-12-FG-7431",
          targetWarehouse: "Adani Agri-Logistics Terminal (Moga)"
        }
      },
      {
        id: "ORD-2026-1082",
        lotId: "LOT-1082",
        cropName: "Non-GMO Feed Corn (Yellow Dent)",
        variety: "Hybrid HQPM-1",
        farmerName: "Baldev Mann Farms",
        farmerPhone: "+91 98722 11099",
        farmerEmail: "baldev.mann@rohtak-corn.in",
        quantity: 30,
        qualityGrade: "Grade B",
        finalBidAmount: 18500,
        paymentDeadline: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
        paymentStatus: "Paid",
        pickupStatus: "Delivered",
        orderConfirmationNumber: "CONF-1082-P7M",
        paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-1082",
        date: "2026-06-24",
        cropType: "Corn",
        location: "Rohtak, Haryana",
        pickupAddress: "Mann Farms Storage silos, Jind Road, Rohtak District, Haryana - 124001",
        trackingNumber: "AGRI-TRK-1082",
        refundStatus: "Not Requested",
        pickupDetails: {
          modeOfTransport: "Bulk Tipper Dumper",
          pickupDate: "2026-06-29",
          pickupTime: "14:00",
          driverName: "Jaswant Gill",
          driverPhone: "+91 98722 11099",
          vehicleNumber: "HR-55-XY-3810",
          targetWarehouse: "Cargill Feed Milling Plant (Kurukshetra)"
        }
      }
    ];
    localStorage.setItem("agriconnect_buyer_orders", JSON.stringify(defaultOrders));
    return defaultOrders;
  });

  // Sync back to local storage whenever orders change
  useEffect(() => {
    localStorage.setItem("agriconnect_buyer_orders", JSON.stringify(orders));
  }, [orders]);

  // Filters State
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [filterCropType, setFilterCropType] = useState<string>("All");
  const [filterFarmerName, setFilterFarmerName] = useState<string>("");

  // Sub-tab selection state (All, Active, Past/History)
  const [activeSubTab, setActiveSubTab] = useState<"all" | "active" | "past">("all");
  // PDF Report preview state
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);

  // Selected Order for Details Drawer
  const [selectedOrder, setSelectedOrder] = useState<WonOrder | null>(null);

  // Simulated Escrow Action Loading States
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Cancellation and Refund/Return States
  const [showCancelPrompt, setShowCancelPrompt] = useState<boolean>(false);
  const [cancelReasonText, setCancelReasonText] = useState<string>("Contract details changed");
  
  const [showRefundPrompt, setShowRefundPrompt] = useState<boolean>(false);
  const [refundReasonType, setRefundReasonType] = useState<string>("Quality Grade Mismatch");
  const [refundDescription, setRefundDescription] = useState<string>("");

  // GPS Simulation variables
  const [gpsProgressPercent, setGpsProgressPercent] = useState<number>(45);
  const [gpsSimulating, setGpsSimulating] = useState<boolean>(true);

  // Simulated live movement
  useEffect(() => {
    let interval: any;
    if (gpsSimulating) {
      interval = setInterval(() => {
        setGpsProgressPercent((prev) => {
          if (prev >= 100) return 20; // reset
          return prev + 4;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gpsSimulating]);

  // Form states for scheduling pickup inside drawer
  const [scheduleDate, setScheduleDate] = useState<string>("2026-07-12");
  const [scheduleTime, setScheduleTime] = useState<string>("10:00");
  const [scheduleDriverName, setScheduleDriverName] = useState<string>("Satnam Pal");
  const [scheduleDriverPhone, setScheduleDriverPhone] = useState<string>("+91 94632 99812");
  const [scheduleVehicleNumber, setScheduleVehicleNumber] = useState<string>("PB-02-CD-5290");
  const [scheduleWarehouse, setScheduleWarehouse] = useState<string>("Global Aggregations Depo Jalandhar");

  // Reset filter triggers
  const handleClearFilters = () => {
    setFilterStatus("All");
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterCropType("All");
    setFilterFarmerName("");
  };

  // Helper to calculate Display Status of order based on DB parameters
  const getDisplayStatus = (order: WonOrder): "Pending Payment" | "Paid" | "Ready for Pickup" | "In Transit" | "Delivered" | "Cancelled" => {
    if (order.paymentStatus === "Cancelled") {
      return "Cancelled";
    }
    if (order.paymentStatus === "Pending") {
      return "Pending Payment";
    }
    if (order.paymentStatus === "Paid") {
      if (order.pickupStatus === "Unscheduled") {
        return "Paid";
      }
      if (order.pickupStatus === "Scheduled") {
        return "Ready for Pickup";
      }
      if (order.pickupStatus === "Dispatched" || order.pickupStatus === "In Transit") {
        return "In Transit";
      }
      if (order.pickupStatus === "Delivered") {
        return "Delivered";
      }
    }
    return "Pending Payment";
  };

  // Get color configurations for each status badge
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Pending Payment":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Paid":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Ready for Pickup":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "In Transit":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Extract unique crop types for the filters dropdown
  const uniqueCropTypes = useMemo(() => {
    const types = new Set<string>();
    orders.forEach((o) => {
      if (o.cropType) types.add(o.cropType);
    });
    return ["All", ...Array.from(types)];
  }, [orders]);

  // Compute filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const displayStatus = getDisplayStatus(order);

      // Sub-tab Filter (Active vs Past/History)
      const isPast = order.pickupStatus === "Delivered" || order.paymentStatus === "Cancelled" || order.refundStatus === "Approved" || order.refundStatus === "Refunded";
      if (activeSubTab === "active" && isPast) {
        return false;
      }
      if (activeSubTab === "past" && !isPast) {
        return false;
      }

      // Status Filter
      if (filterStatus !== "All" && displayStatus !== filterStatus) {
        return false;
      }

      // Crop Type Filter
      if (filterCropType !== "All" && order.cropType !== filterCropType) {
        return false;
      }

      // Farmer Name Filter (case-insensitive text contains)
      if (
        filterFarmerName.trim() !== "" &&
        !order.farmerName.toLowerCase().includes(filterFarmerName.toLowerCase())
      ) {
        return false;
      }

      // Date Range Filter
      if (order.date) {
        const orderDate = new Date(order.date);
        if (filterStartDate) {
          const start = new Date(filterStartDate);
          if (orderDate < start) return false;
        }
        if (filterEndDate) {
          const end = new Date(filterEndDate);
          if (orderDate > end) return false;
        }
      }

      return true;
    });
  }, [orders, filterStatus, filterCropType, filterFarmerName, filterStartDate, filterEndDate, activeSubTab]);

  // Handle Simulated Escrow Payment Action
  const handleProcessPayment = (orderId: string) => {
    setActionLoading(true);
    setActionSuccess(null);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? {
                ...ord,
                paymentStatus: "Paid",
                paymentDetails: {
                  method: "Corporate Escrow Ledger Direct-Debit",
                  paidAt: new Date().toISOString(),
                  transactionId: `TXN-ESC-${Math.random().toString().substring(2, 10).toUpperCase()}`
                }
              }
            : ord
        )
      );
      // Update selectedOrder view instantly
      setSelectedOrder((prev) =>
        prev && prev.id === orderId
          ? {
              ...prev,
              paymentStatus: "Paid",
              paymentDetails: {
                method: "Corporate Escrow Ledger Direct-Debit",
                paidAt: new Date().toISOString(),
                transactionId: `TXN-ESC-${Math.random().toString().substring(2, 10).toUpperCase()}`
              }
            }
          : prev
      );
      setActionLoading(false);
      setActionSuccess("Escrow Deposition Cleared Successfully! Digital Smart Contract Activated.");
    }, 1500);
  };

  // Handle Simulated Schedule Logistics Action
  const handleScheduleLogisticDispatch = (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    setActionLoading(true);
    setActionSuccess(null);
    setTimeout(() => {
      const details = {
        modeOfTransport: "Standard Freight Trucking",
        pickupDate: scheduleDate,
        pickupTime: scheduleTime,
        driverName: scheduleDriverName,
        driverPhone: scheduleDriverPhone,
        vehicleNumber: scheduleVehicleNumber,
        targetWarehouse: scheduleWarehouse
      };

      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? {
                ...ord,
                pickupStatus: "Scheduled",
                pickupDetails: details
              }
            : ord
        )
      );

      setSelectedOrder((prev) =>
        prev && prev.id === orderId
          ? {
              ...prev,
              pickupStatus: "Scheduled",
              pickupDetails: details
            }
          : prev
      );

      setActionLoading(false);
      setActionSuccess("Logistics Carrier Dispatch Approved! Pickup Bay Slot reserved.");
    }, 1200);
  };

  // Move order from "Ready for Pickup" to "In Transit"
  const handleMarkAsDispatched = (orderId: string) => {
    setActionLoading(true);
    setActionSuccess(null);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? {
                ...ord,
                pickupStatus: "In Transit"
              }
            : ord
        )
      );

      setSelectedOrder((prev) =>
        prev && prev.id === orderId
          ? {
              ...prev,
              pickupStatus: "In Transit"
            }
          : prev
      );

      setActionLoading(false);
      setActionSuccess("Lot Dispatched! GPS Trackers loaded. Vehicle is In Transit.");
    }, 1000);
  };

  // Complete Order (Mark as Delivered & Release Escrow)
  const handleConfirmDelivery = (orderId: string) => {
    setActionLoading(true);
    setActionSuccess(null);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? {
                ...ord,
                pickupStatus: "Delivered"
              }
            : ord
        )
      );

      setSelectedOrder((prev) =>
        prev && prev.id === orderId
          ? {
              ...prev,
              pickupStatus: "Delivered"
            }
          : prev
      );

      setActionLoading(false);
      setActionSuccess("Cargo Delivered! Escrow funds released instantly to Farmer Cooperative Wallet.");
    }, 1400);
  };

  // Cancel Order handler
  const handleCancelOrder = (orderId: string) => {
    setActionLoading(true);
    setActionSuccess(null);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? {
                ...ord,
                paymentStatus: "Cancelled",
                refundStatus: ord.paymentStatus === "Paid" ? "Approved" : "Not Requested"
              }
            : ord
        )
      );

      setSelectedOrder((prev) =>
        prev && prev.id === orderId
          ? {
              ...prev,
              paymentStatus: "Cancelled",
              refundStatus: prev.paymentStatus === "Paid" ? "Approved" : "Not Requested"
            }
          : prev
      );

      setActionLoading(false);
      setShowCancelPrompt(false);
      setActionSuccess("Order Cancelled. The escrow deposit ledger has been reversed, and funds are returned to your balance.");
    }, 1200);
  };

  // Return & Refund request handler
  const handleRequestRefund = (orderId: string) => {
    setActionLoading(true);
    setActionSuccess(null);
    setTimeout(() => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? {
                ...ord,
                refundStatus: "Pending Approval",
                refundReason: refundReasonType,
                refundDescription: refundDescription
              }
            : ord
        )
      );

      setSelectedOrder((prev) =>
        prev && prev.id === orderId
          ? {
              ...prev,
              refundStatus: "Pending Approval",
              refundReason: refundReasonType,
              refundDescription: refundDescription
            }
          : prev
      );

      setActionLoading(false);
      setShowRefundPrompt(false);
      setRefundDescription("");
      setActionSuccess("Return & Refund Ticket raised successfully. Inspector scheduled for physical validation.");
    }, 1500);
  };

  // Export Orders as CSV File
  const handleExportCSV = () => {
    const headers = [
      "Order Number",
      "Date",
      "Crop Name",
      "Variety",
      "Quantity (Tons)",
      "Price/Ton (INR)",
      "Total Amount (INR)",
      "Farmer Cooperative",
      "Location",
      "Escrow Status",
      "Logistics Status"
    ];

    const rows = filteredOrders.map((o) => {
      const displayStatus = getDisplayStatus(o);
      const totalAmount = o.finalBidAmount * o.quantity;
      return [
        o.id,
        o.date || "",
        `"${o.cropName.replace(/"/g, '""')}"`,
        `"${(o.variety || "").replace(/"/g, '""')}"`,
        o.quantity,
        o.finalBidAmount,
        totalAmount,
        `"${o.farmerName.replace(/"/g, '""')}"`,
        `"${(o.location || "").replace(/"/g, '""')}"`,
        o.paymentStatus,
        o.pickupStatus
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `agriconnect_orders_${activeSubTab}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Orders as Microsoft Excel compatible format
  const handleExportExcel = () => {
    const headers = [
      "Order Number",
      "Date",
      "Crop Name",
      "Variety",
      "Quantity (Tons)",
      "Price/Ton (INR)",
      "Total Amount (INR)",
      "Farmer Cooperative",
      "Location",
      "Escrow Status",
      "Logistics Status"
    ];

    const rows = filteredOrders.map((o) => {
      const displayStatus = getDisplayStatus(o);
      const totalAmount = o.finalBidAmount * o.quantity;
      return [
        o.id,
        o.date || "",
        o.cropName,
        o.variety || "",
        o.quantity,
        o.finalBidAmount,
        totalAmount,
        o.farmerName,
        o.location || "",
        o.paymentStatus,
        o.pickupStatus
      ].join("\t");
    });

    const excelContent =
      "data:application/vnd.ms-excel;charset=utf-8,\uFEFF" +
      [headers.join("\t"), ...rows].join("\n");

    const encodedUri = encodeURI(excelContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `agriconnect_orders_${activeSubTab}_${new Date().toISOString().split("T")[0]}.xls`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="order-dashboard-view">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded text-[9px] uppercase font-black">
            <ShoppingBag className="h-3 w-3" /> Secure Escrow Settlements
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-1">📦 Order Sourcing & Logistics Dashboard</h2>
          <p className="text-xs text-slate-500">
            Monitor active contracts, clear payments, schedule cold-chain logistics, and verify instant ledger settlements.
          </p>
        </div>

        <button
          onClick={handleClearFilters}
          className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" /> Reset Filter Matrix
        </button>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-3xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Filter 1: Display Status */}
        <div className="space-y-1">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-teal-600" /> Contract Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-teal-500"
          >
            <option value="All">📋 All Order Statuses</option>
            <option value="Pending Payment">💳 Pending Payment</option>
            <option value="Paid">💰 Paid (Deposited)</option>
            <option value="Ready for Pickup">🚛 Ready for Pickup</option>
            <option value="In Transit">🛣️ In Transit</option>
            <option value="Delivered">✅ Delivered</option>
          </select>
        </div>

        {/* Filter 2: Crop Type */}
        <div className="space-y-1">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <Tag className="h-3 w-3 text-teal-600" /> Crop Classification
          </label>
          <select
            value={filterCropType}
            onChange={(e) => setFilterCropType(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-teal-500"
          >
            <option value="All">🌾 All Crop Classes</option>
            {uniqueCropTypes.filter(c => c !== "All").map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Filter 3: Farmer Name */}
        <div className="space-y-1">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <Building className="h-3 w-3 text-teal-600" /> Farmer Cooperative
          </label>
          <div className="relative">
            <input
              type="text"
              value={filterFarmerName}
              onChange={(e) => setFilterFarmerName(e.target.value)}
              placeholder="Search farmer / coop..."
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-1.5 pl-7 pr-2.5 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Filter 4: Start Date */}
        <div className="space-y-1">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <Calendar className="h-3 w-3 text-teal-600" /> Contract Start
          </label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Filter 5: End Date */}
        <div className="space-y-1">
          <label className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <Calendar className="h-3 w-3 text-teal-600" /> Contract End
          </label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-1.5 px-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* ORDERS LIST CONTAINER */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
        {/* Sub-tabs and Export utility bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3.5 mb-4.5 gap-3">
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveSubTab("all")}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                activeSubTab === "all"
                  ? "bg-white text-teal-800 shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              📋 All ({orders.length})
            </button>
            <button
              onClick={() => setActiveSubTab("active")}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                activeSubTab === "active"
                  ? "bg-white text-teal-800 shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              🚚 Active ({orders.filter(o => {
                const isPast = o.pickupStatus === "Delivered" || o.paymentStatus === "Cancelled" || o.refundStatus === "Approved" || o.refundStatus === "Refunded";
                return !isPast;
              }).length})
            </button>
            <button
              onClick={() => setActiveSubTab("past")}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                activeSubTab === "past"
                  ? "bg-white text-teal-800 shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              📜 Past History ({orders.filter(o => {
                const isPast = o.pickupStatus === "Delivered" || o.paymentStatus === "Cancelled" || o.refundStatus === "Approved" || o.refundStatus === "Refunded";
                return isPast;
              }).length})
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase mr-1">Export Board:</span>
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
              title="Export as Comma Separated Values"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" /> CSV
            </button>
            <button
              onClick={handleExportExcel}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
              title="Export to Microsoft Excel"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600" /> Excel
            </button>
            <button
              onClick={() => setShowPdfPreview(true)}
              className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg text-[9px] font-black uppercase tracking-wider text-teal-700 transition-colors flex items-center gap-1 cursor-pointer"
              title="Generate Printable PDF Report"
            >
              <Printer className="h-3.5 w-3.5 text-teal-600" /> Download PDF
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-black uppercase text-slate-700">No Matching Orders Found</h4>
            <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
              No orders found matching your selected filters, status, crop, or date range. Try clearing criteria or switching sub-tabs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="active-orders-table">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Order No.</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Crop Variety</th>
                  <th className="pb-3 text-center">Volume</th>
                  <th className="pb-3 text-right">Escrow Amount</th>
                  <th className="pb-3 pl-6">Status State</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map((ord) => {
                  const displayStatus = getDisplayStatus(ord);
                  const totalEstVal = ord.finalBidAmount * ord.quantity;

                  return (
                    <tr
                      key={ord.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4 pl-2 font-mono font-bold text-slate-400 text-[11px]">
                        {ord.id}
                      </td>
                      <td className="py-4 text-slate-500 font-medium font-mono">
                        {ord.date}
                      </td>
                      <td className="py-4 font-bold text-slate-800">
                        <div className="space-y-0.5">
                          <p className="text-slate-800 font-bold text-xs">{ord.cropName}</p>
                          <p className="text-[9px] text-slate-400 font-semibold">{ord.farmerName}</p>
                        </div>
                      </td>
                      <td className="py-4 text-center font-bold font-mono text-slate-600">
                        {ord.quantity} Tons
                      </td>
                      <td className="py-4 text-right font-black font-mono text-teal-700">
                        ₹{totalEstVal.toLocaleString()}
                      </td>
                      <td className="py-4 pl-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusBadgeStyles(displayStatus)}`}>
                          <span className={`w-1 h-1 rounded-full ${
                            displayStatus === "Pending Payment" ? "bg-amber-500" :
                            displayStatus === "Paid" ? "bg-indigo-500" :
                            displayStatus === "Ready for Pickup" ? "bg-teal-500" :
                            displayStatus === "In Transit" ? "bg-purple-500" :
                            displayStatus === "Cancelled" ? "bg-rose-500" : "bg-emerald-500"
                          }`} />
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActionSuccess(null);
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ml-auto cursor-pointer shadow-3xs group-hover:shadow-xs"
                        >
                          <Eye className="h-3 w-3" /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL DRAWER OVERLAY */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-end z-50">
            <motion.div
              initial={{ x: "100%", opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400">LOT ATTACHMENT: {selectedOrder.lotId}</span>
                    <h3 className="text-sm font-black uppercase text-slate-800 flex items-center gap-1.5">
                      Order Ledger: <span className="text-teal-600 font-mono">{selectedOrder.id}</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors font-bold font-mono text-sm cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Status Progress Track Bar */}
                {selectedOrder.paymentStatus === "Cancelled" ? (
                  <div className="bg-rose-50 border border-rose-150 p-4 rounded-2xl flex items-center gap-3 text-xs text-rose-800">
                    <AlertCircle className="h-6 w-6 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="font-bold uppercase text-[10px] tracking-wider text-rose-900">Contract Terminated</h4>
                      <p className="mt-0.5 text-rose-700">
                        This procurement agreement has been cancelled. Any pledged escrow deposits have been refunded to your wallet ledger.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
                    <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Escrow Settlement Progress</span>
                    
                    <div className="grid grid-cols-5 gap-1 mt-3 relative text-center">
                      {/* Progress Connecting line */}
                      <div className="absolute top-2.5 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-0" />
                      
                      {/* Step 1: Pending */}
                      <div className="space-y-1 text-center shrink-0">
                        <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center text-[9px] font-bold relative z-10 ${
                          selectedOrder.paymentStatus === "Pending" ? "bg-amber-500 text-white" : "bg-teal-600 text-white"
                        }`}>
                          {selectedOrder.paymentStatus === "Pending" ? "1" : "✓"}
                        </div>
                        <p className={`text-[8px] font-black uppercase ${selectedOrder.paymentStatus === "Pending" ? "text-amber-600" : "text-teal-700"}`}>Draft</p>
                      </div>

                      {/* Step 2: Deposited */}
                      <div className="space-y-1 text-center shrink-0">
                        <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center text-[9px] font-bold relative z-10 ${
                          selectedOrder.paymentStatus === "Pending" ? "bg-slate-200 text-slate-400" :
                          selectedOrder.pickupStatus === "Unscheduled" ? "bg-indigo-500 text-white animate-pulse" : "bg-teal-600 text-white"
                        }`}>
                          {selectedOrder.paymentStatus === "Pending" ? "2" : "✓"}
                        </div>
                        <p className={`text-[8px] font-black uppercase ${selectedOrder.paymentStatus === "Pending" ? "text-slate-400" : "text-indigo-600"}`}>Deposited</p>
                      </div>

                      {/* Step 3: Verified / Scheduled */}
                      <div className="space-y-1 text-center shrink-0">
                        <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center text-[9px] font-bold relative z-10 ${
                          selectedOrder.paymentStatus === "Pending" || selectedOrder.pickupStatus === "Unscheduled" ? "bg-slate-200 text-slate-400" :
                          selectedOrder.pickupStatus === "Scheduled" ? "bg-teal-500 text-white font-black" : "bg-teal-600 text-white"
                        }`}>
                          {selectedOrder.pickupStatus === "Dispatched" || selectedOrder.pickupStatus === "In Transit" || selectedOrder.pickupStatus === "Delivered" ? "✓" : "3"}
                        </div>
                        <p className={`text-[8px] font-black uppercase ${
                          selectedOrder.pickupStatus === "Scheduled" ? "text-teal-600" : "text-slate-400"
                        }`}>Scheduled</p>
                      </div>

                      {/* Step 4: Dispatched */}
                      <div className="space-y-1 text-center shrink-0">
                        <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center text-[9px] font-bold relative z-10 ${
                          selectedOrder.pickupStatus === "Dispatched" || selectedOrder.pickupStatus === "In Transit" ? "bg-purple-500 text-white animate-bounce" :
                          selectedOrder.pickupStatus === "Delivered" ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-400"
                        }`}>
                          {selectedOrder.pickupStatus === "Delivered" ? "✓" : "4"}
                        </div>
                        <p className={`text-[8px] font-black uppercase ${
                          selectedOrder.pickupStatus === "In Transit" ? "text-purple-600" : "text-slate-400"
                        }`}>In Transit</p>
                      </div>

                      {/* Step 5: Delivered */}
                      <div className="space-y-1 text-center shrink-0">
                        <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center text-[9px] font-bold relative z-10 ${
                          selectedOrder.pickupStatus === "Delivered" ? "bg-emerald-50 text-white" : "bg-slate-200 text-slate-400"
                        }`}>
                          5
                        </div>
                        <p className={`text-[8px] font-black uppercase ${selectedOrder.pickupStatus === "Delivered" ? "text-emerald-600" : "text-slate-400"}`}>Settled</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status messages or alerts */}
                {actionSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 text-xs">
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="font-bold">{actionSuccess}</span>
                  </div>
                )}

                {/* Refund Status Timeline Bar */}
                {selectedOrder.refundStatus && selectedOrder.refundStatus !== "Not Requested" && (
                  <div className={`p-4 rounded-2xl border text-xs flex gap-3 ${
                    selectedOrder.refundStatus === "Pending Approval" 
                      ? "bg-amber-50 border-amber-200 text-amber-900" 
                      : "bg-emerald-50 border-emerald-200 text-emerald-900"
                  }`}>
                    <AlertCircle className={`h-6 w-6 shrink-0 mt-0.5 ${selectedOrder.refundStatus === "Pending Approval" ? "text-amber-600" : "text-emerald-600"}`} />
                    <div>
                      <h4 className="font-extrabold uppercase text-[10px] tracking-wider">
                        {selectedOrder.refundStatus === "Pending Approval" ? "⚠️ Return & Refund Claim Lodged" : "✅ Refund Disbursed & Settled"}
                      </h4>
                      <p className="mt-1 text-slate-700">
                        <strong>Reason:</strong> {selectedOrder.refundReason}<br />
                        <strong>Notes:</strong> {selectedOrder.refundDescription || "No notes provided."}
                      </p>
                      {selectedOrder.refundStatus === "Pending Approval" ? (
                        <p className="mt-2.5 text-[10px] text-amber-700 italic font-medium leading-relaxed">
                          Our quality inspection representative is scheduled to physically verify the stock quality discrepancy at your terminal warehouse.
                        </p>
                      ) : (
                        <p className="mt-2.5 text-[10px] text-emerald-700 italic font-medium leading-relaxed">
                          Refund of ₹{(selectedOrder.finalBidAmount * selectedOrder.quantity).toLocaleString()} has been reversed from the escrow account back to your wallet ledger.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Cancellation Form Panel */}
                {showCancelPrompt && (
                  <div className="border-2 border-rose-100 p-4 rounded-xl bg-rose-50/50 space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <h4 className="font-black text-rose-900 text-xs uppercase tracking-wider">Confirm Procurement Termination</h4>
                        <p className="text-[11px] text-rose-700">
                          {selectedOrder.paymentStatus === "Paid" 
                            ? "This order has been Paid. Cancelling now will initiate a reversal of escrow ledger funds back to your corporate wallet balance. No cancellation charges apply."
                            : "Are you sure you want to cancel this pending order? This action is irreversible."
                          }
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-rose-800 block">Select Cancellation Reason</label>
                      <select
                        value={cancelReasonText}
                        onChange={(e) => setCancelReasonText(e.target.value)}
                        className="w-full bg-white border border-rose-200 rounded-lg p-1.5 text-xs text-rose-900 font-bold focus:outline-none"
                      >
                        <option value="Contract details changed">Contract details changed / Renegotiated</option>
                        <option value="Logistics delay/issues">Logistics transport conflict</option>
                        <option value="Quality requirements altered">Sourcing quality standards altered</option>
                        <option value="Alternative source secured">Alternative cooperative secured</option>
                      </select>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setShowCancelPrompt(false)}
                        className="px-3 py-1.5 border border-rose-200 text-rose-800 bg-white hover:bg-rose-50 rounded-lg text-[10px] font-black uppercase cursor-pointer"
                      >
                        Keep Order
                      </button>
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        disabled={actionLoading}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black uppercase cursor-pointer disabled:bg-slate-300"
                      >
                        {actionLoading ? "Processing Reversal..." : "Confirm Terminate"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Refund Claim Form Panel */}
                {showRefundPrompt && (
                  <div className="border-2 border-amber-100 p-4 rounded-xl bg-amber-50/50 space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <h4 className="font-black text-amber-900 text-xs uppercase tracking-wider">Raise Return & Refund Dispute</h4>
                        <p className="text-[11px] text-amber-700">
                          Please file your claim accurately. Funds will remain locked in escrow until our Quality Arbitrator certifies the deviation.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-amber-800 block">Quality Mismatch Category</label>
                        <select
                          value={refundReasonType}
                          onChange={(e) => setRefundReasonType(e.target.value)}
                          className="w-full bg-white border border-amber-200 rounded-lg p-1.5 text-xs text-amber-900 font-bold focus:outline-none"
                        >
                          <option value="Quality Grade Mismatch">Quality Grade Mismatch (A vs B)</option>
                          <option value="High Moisture Content">Moisture Content Exceeds 14% Limit</option>
                          <option value="Infestation or Spoilage">Sprouted, Infested, or Decayed Grains</option>
                          <option value="Weight Discrepancy">Weight deficient from Contract Volume</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-amber-800 block">Arbitration Statement & Evidence Notes</label>
                        <textarea
                          rows={2}
                          value={refundDescription}
                          onChange={(e) => setRefundDescription(e.target.value)}
                          placeholder="Describe crop defect, grain size deviation, or moisture test results..."
                          className="w-full bg-white border border-amber-200 rounded-lg p-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => setShowRefundPrompt(false)}
                        className="px-3 py-1.5 border border-amber-200 text-amber-800 bg-white hover:bg-amber-50 rounded-lg text-[10px] font-black uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRequestRefund(selectedOrder.id)}
                        disabled={actionLoading || !refundDescription.trim()}
                        className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-black uppercase cursor-pointer disabled:bg-slate-300"
                      >
                        {actionLoading ? "Filing Case..." : "File Arbitration Claim"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Section: Produce and Price Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 p-4 rounded-xl space-y-3 bg-slate-50/20">
                    <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Produce & Quality Specifications</span>
                    <div className="space-y-1.5 text-xs">
                      <p className="font-extrabold text-slate-800 leading-snug">{selectedOrder.cropName}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Classification: {selectedOrder.cropType}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Variety: {selectedOrder.variety || "Premium Hybrid"}</p>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-black uppercase tracking-tight">
                        <Award className="h-3 w-3" /> Grade: {selectedOrder.qualityGrade}
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-100 p-4 rounded-xl space-y-3 bg-slate-50/20">
                    <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Escrow Margin Audit</span>
                    <div className="space-y-1.5 text-xs font-semibold">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Won Bid Rate:</span>
                        <span className="font-mono text-slate-800">₹{selectedOrder.finalBidAmount.toLocaleString()} / Ton</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contract Volume:</span>
                        <span className="font-mono text-slate-800">{selectedOrder.quantity} Tons</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold">
                        <span className="text-slate-800">Net Escrow:</span>
                        <span className="font-mono text-teal-700 text-sm font-black">₹{(selectedOrder.finalBidAmount * selectedOrder.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Farmer Cooperative Card (Farmer details, location, contact) */}
                <div className="border border-slate-100 p-4 rounded-xl space-y-3 bg-slate-50/40">
                  <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Producer Farmer Cooperative</span>
                  <div className="flex items-start justify-between text-xs gap-4">
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-slate-800 text-sm">{selectedOrder.farmerName}</h4>
                      <p className="text-slate-500 flex items-center gap-1.5 text-[11px] font-medium">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {selectedOrder.location || "North India Region"}
                      </p>
                      <div className="pt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] border-t border-slate-200/50">
                        <div>
                          <p className="text-[8px] text-slate-400 font-extrabold uppercase">Contact Number</p>
                          <p className="font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3 text-slate-400" /> {selectedOrder.farmerPhone}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] text-slate-400 font-extrabold uppercase">Direct Email</p>
                          <p className="font-semibold text-slate-700 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                            {selectedOrder.farmerEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white px-2.5 py-1.5 border border-slate-150 rounded-lg text-center shrink-0">
                      <span className="text-[8px] text-slate-400 uppercase font-black block">Coop Trust</span>
                      <span className="text-xs font-black font-mono text-amber-500">★ 4.9 / 5</span>
                    </div>
                  </div>
                </div>

                {/* Section: Pickup Information */}
                <div className="border border-slate-100 p-4 rounded-xl space-y-3 bg-slate-50/40">
                  <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Mandi Yard Farm Pickup Address</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 leading-snug">{selectedOrder.pickupAddress}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Direct Farm Gate Loading Bay</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50">
                      <div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase">Pickup Loading Contact</p>
                        <p className="font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" /> {selectedOrder.farmerPhone}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase">Pickup Schedule Window</p>
                        <p className="font-bold text-slate-700 flex items-center gap-1 mt-0.5 font-mono">
                          <Clock className="h-3.5 w-3.5 text-slate-400" /> 
                          {selectedOrder.pickupDetails 
                            ? `${selectedOrder.pickupDetails.pickupDate} at ${selectedOrder.pickupDetails.pickupTime}`
                            : "Logistics Booking Required"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live GPS tracking map (Section 4.2 Logistics) */}
                {selectedOrder.pickupDetails && (
                  <div className="border border-slate-100 p-4 rounded-xl space-y-3 bg-slate-50/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600" /> GPS Real-time Telemetry Map
                      </span>
                      {selectedOrder.pickupStatus === "In Transit" ? (
                        <span className="inline-flex items-center gap-1 text-[8px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full uppercase font-black animate-pulse">
                          ● Satellite Live
                        </span>
                      ) : (
                        <span className="text-[8px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full uppercase font-black">
                          Telemetry Idle
                        </span>
                      )}
                    </div>

                    {/* Simulated Map Board */}
                    <div className="relative bg-slate-900 h-36 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-between p-3 shadow-inner">
                      {/* Grid overlay for tech look */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 animate-pulse" />

                      {/* Path line */}
                      <svg className="absolute inset-0 w-full h-full p-6" style={{ overflow: "visible" }}>
                        <defs>
                          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                        {/* Map Route representation */}
                        <path
                          d="M 20 60 Q 140 10, 240 70 T 440 40"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 20 60 Q 140 10, 240 70 T 440 40"
                          fill="none"
                          stroke="url(#pathGradient)"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          strokeLinecap="round"
                        />

                        {/* Truck locator dot along the path */}
                        {(selectedOrder.pickupStatus === "In Transit" || selectedOrder.pickupStatus === "Delivered") && (
                          <g style={{
                            transform: `translate(${Math.max(20, Math.min(420, ((selectedOrder.pickupStatus === "Delivered" ? 100 : gpsProgressPercent) / 100) * 380 + 20))}px, ${
                              45 + Math.sin(((selectedOrder.pickupStatus === "Delivered" ? 100 : gpsProgressPercent) / 100) * Math.PI) * -30
                            }px)`
                          }} className="transition-all duration-1000">
                            <circle r="10" fill="#6366f1" className="animate-ping opacity-45" />
                            <circle r="5" fill="#6366f1" />
                          </g>
                        )}
                      </svg>

                      {/* Source Pin */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full border border-white ring-4 ring-indigo-500/20" />
                        <span className="text-[8px] text-indigo-300 font-extrabold uppercase mt-1 font-mono">{selectedOrder.location?.split(",")[0] || "Origin"}</span>
                      </div>

                      {/* Destination Pin */}
                      <div className="absolute right-4 top-1/3 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white ring-4 ring-emerald-500/20" />
                        <span className="text-[8px] text-emerald-300 font-extrabold uppercase mt-1 font-mono">Terminal Hub</span>
                      </div>

                      {/* HUD Overlays */}
                      <div className="relative flex justify-between items-start text-white text-[9px] font-semibold font-mono pointer-events-none">
                        <div className="bg-slate-950/80 backdrop-blur-xs px-2 py-1 rounded border border-slate-800">
                          <p className="text-slate-400 text-[7px]">CARRIER VEHICLE</p>
                          <p className="font-extrabold text-teal-400">{selectedOrder.pickupDetails.vehicleNumber}</p>
                        </div>
                        <div className="bg-slate-950/80 backdrop-blur-xs px-2 py-1 rounded border border-slate-800 text-right">
                          <p className="text-slate-400 text-[7px]">ESTIMATED ETA</p>
                          <p className="font-extrabold text-teal-400 text-[9px]">
                            {selectedOrder.pickupStatus === "In Transit" 
                              ? `${Math.max(1, Math.round((100 - gpsProgressPercent) * 0.15))} hrs (Approaching)` 
                              : selectedOrder.pickupStatus === "Delivered" 
                              ? "Arrived & Cleared" 
                              : "Pending Dispatch"
                            }
                          </p>
                        </div>
                      </div>

                      <div className="relative flex justify-between items-end text-white text-[9px] font-semibold font-mono pointer-events-none">
                        <div className="bg-slate-950/80 backdrop-blur-xs px-2 py-1 rounded border border-slate-800">
                          <p className="text-slate-400 text-[7px]">TRACKING NO</p>
                          <p className="font-extrabold text-indigo-300 text-[8px]">{selectedOrder.trackingNumber || "N/A"}</p>
                        </div>
                        <div className="bg-slate-950/80 backdrop-blur-xs px-2 py-1 rounded border border-slate-800 text-right flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <p className="font-extrabold text-slate-100">
                            {selectedOrder.pickupStatus === "In Transit" 
                              ? `${gpsProgressPercent}% Routed` 
                              : selectedOrder.pickupStatus === "Delivered" 
                              ? "100% Arrived" 
                              : "0% Ready"
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Toggle movement or description */}
                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 font-mono">
                      <span>SPEED: {selectedOrder.pickupStatus === "In Transit" ? "62 km/h" : "0 km/h"}</span>
                      {selectedOrder.pickupStatus === "In Transit" && (
                        <button
                          onClick={() => setGpsSimulating(!gpsSimulating)}
                          className="text-[9px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                        >
                          {gpsSimulating ? "⏸ Pause Map Simulation" : "▶ Resume Map Simulation"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Section: Logistics/Driver details if scheduled */}
                {selectedOrder.pickupDetails ? (
                  <div className="border border-slate-100 p-4 rounded-xl space-y-3 bg-slate-50/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Logistical Dispatch Sheet</span>
                      <span className="text-[8px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.2 rounded uppercase font-black">
                        GPS Linked
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Designated Driver</p>
                        <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <User className="h-3.5 w-3.5 text-slate-400" /> {selectedOrder.pickupDetails.driverName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Contact Hot-Line</p>
                        <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" /> {selectedOrder.pickupDetails.driverPhone}
                        </p>
                      </div>
                      <div className="pt-1">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Fleet Vehicle No.</p>
                        <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 font-mono">
                          <Truck className="h-3.5 w-3.5 text-slate-400" /> {selectedOrder.pickupDetails.vehicleNumber}
                        </p>
                      </div>
                      <div className="pt-1">
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Pickup Slot Time</p>
                        <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 font-mono">
                          <Clock className="h-3.5 w-3.5 text-slate-400" /> {selectedOrder.pickupDetails.pickupDate} {selectedOrder.pickupDetails.pickupTime}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-200/50 pt-2 text-xs">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Destination Delivery Warehousing</p>
                      <p className="font-bold text-slate-700 mt-0.5">{selectedOrder.pickupDetails.targetWarehouse}</p>
                    </div>
                  </div>
                ) : (
                  selectedOrder.paymentStatus === "Paid" && (
                    <div className="border border-dashed border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/20">
                      <span className="text-[9px] uppercase font-extrabold text-slate-500 tracking-wider block">Schedule Logistic Fleet Transport</span>
                      
                      <form onSubmit={(e) => handleScheduleLogisticDispatch(e, selectedOrder.id)} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400 block">Fleet Class Vehicle No.</label>
                            <input
                              type="text"
                              value={scheduleVehicleNumber}
                              onChange={(e) => setScheduleVehicleNumber(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-mono font-bold"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400 block">Driver Full Name</label>
                            <input
                              type="text"
                              value={scheduleDriverName}
                              onChange={(e) => setScheduleDriverName(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-bold"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400 block">Driver Contact Number</label>
                            <input
                              type="text"
                              value={scheduleDriverPhone}
                              onChange={(e) => setScheduleDriverPhone(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-bold"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400 block">Delivery Terminal Hub</label>
                            <input
                              type="text"
                              value={scheduleWarehouse}
                              onChange={(e) => setScheduleWarehouse(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-bold"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400 block">Target Dispatch Date</label>
                            <input
                              type="date"
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400 block">Fleet Loading Time</label>
                            <input
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          {actionLoading ? "Locking Fleet Allocations..." : "Approve Logistics Fleet & Reserve Bay Slot"}
                        </button>
                      </form>
                    </div>
                  )
                )}
              </div>

              {/* Action Buttons Footer inside Drawer */}
              <div className="border-t border-slate-100 pt-4 bg-white space-y-2">
                {/* Scenario 1: PAYMENT PENDING */}
                {selectedOrder.paymentStatus === "Pending" && (
                  <button
                    onClick={() => handleProcessPayment(selectedOrder.id)}
                    disabled={actionLoading}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                  >
                    <CreditCard className="h-4.5 w-4.5" />
                    {actionLoading ? "Escrow Pledging Process..." : "Pay Now: Deposit Escrow Cash Settlement (₹" + (selectedOrder.finalBidAmount * selectedOrder.quantity).toLocaleString() + ")"}
                  </button>
                )}

                {/* Scenario 2: PAID but unscheduled */}
                {selectedOrder.paymentStatus === "Paid" && selectedOrder.pickupStatus === "Unscheduled" && (
                  <div className="text-center bg-teal-50 border border-teal-150 p-2.5 rounded-lg text-[11px] font-bold text-teal-800">
                    ℹ️ Escrow funds verified in ledger. Please fill out the Logistics Form above to arrange dispatch.
                  </div>
                )}

                {/* Scenario 3: Scheduled (Ready for Pickup) */}
                {selectedOrder.paymentStatus === "Paid" && selectedOrder.pickupStatus === "Scheduled" && (
                  <button
                    onClick={() => handleMarkAsDispatched(selectedOrder.id)}
                    disabled={actionLoading}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                  >
                    <Truck className="h-4.5 w-4.5" />
                    {actionLoading ? "Marking Dispatched..." : "Mark Cargo Lot as Dispatched (In Transit)"}
                  </button>
                )}

                {/* Scenario 4: In Transit */}
                {selectedOrder.pickupStatus === "In Transit" && (
                  <button
                    onClick={() => handleConfirmDelivery(selectedOrder.id)}
                    disabled={actionLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                  >
                    <CheckCircle className="h-4.5 w-4.5" />
                    {actionLoading ? "Confirming & Releasing Escrow..." : "Confirm Delivery Receipt (Release Escrow Ledger)"}
                  </button>
                )}

                {/* Scenario 5: Delivered (Settled) - Eligible for Returns/Refunds */}
                {selectedOrder.pickupStatus === "Delivered" && (
                  <div className="space-y-2">
                    <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-black text-emerald-800">
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                      COMPLETED AND SETTLED CONTRACT (ESCROW TRANSACTION TERMINATED)
                    </div>

                    {(!selectedOrder.refundStatus || selectedOrder.refundStatus === "Not Requested") && (
                      <button
                        onClick={() => {
                          setShowRefundPrompt(true);
                          setShowCancelPrompt(false);
                        }}
                        className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        ⚠️ Return / Request Refund Dispute Claim
                      </button>
                    )}
                  </div>
                )}

                {/* Eligibility Cancellation Button */}
                {selectedOrder.paymentStatus !== "Cancelled" && selectedOrder.pickupStatus !== "Delivered" && (
                  <button
                    onClick={() => {
                      setShowCancelPrompt(true);
                      setShowRefundPrompt(false);
                    }}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    🚫 Cancel Order Contract
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF REPORT PREVIEW MODAL */}
      <AnimatePresence>
        {showPdfPreview && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto no-print" id="printable-report-modal">
            {/* Style tag for printing */}
            <style>
              {`
                @media print {
                  body { background: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
                  header, footer, nav, aside, button, #order-dashboard-view, .no-print { display: none !important; }
                  #printable-pdf-report { display: block !important; position: absolute; top: 0; left: 0; width: 100%; height: auto; z-index: 99999; padding: 2.5rem !important; background: white !important; box-shadow: none !important; border: none !important; }
                }
              `}
            </style>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col no-print"
            >
              {/* Modal header (only visible on screen) */}
              <div className="p-4 border-b border-slate-150 flex items-center justify-between bg-slate-50 rounded-t-3xl no-print">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-600 text-white rounded-lg">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">PDF Report Generator</h3>
                    <p className="text-[10px] text-slate-400">Generate and print an official audit-ready procurement ledger statement.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
                  </button>
                  <button
                    onClick={() => setShowPdfPreview(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Document Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50">
                {/* Standard A4 sheet representation */}
                <div
                  id="printable-pdf-report"
                  className="bg-white border border-slate-250 p-10 shadow-md max-w-3xl mx-auto rounded-xs font-sans text-slate-800 relative min-h-[297mm]"
                >
                  {/* Decorative Security Border top */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500" />

                  {/* Header Block */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">AGRI<span className="text-teal-600">CONNECT</span></span>
                        <span className="text-[8px] bg-slate-950 text-white px-1.5 py-0.5 rounded font-mono font-black">LEDGER</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">National Agriculture Trading & Escrow Clearing</p>
                      <p className="text-[9px] text-slate-500 leading-relaxed font-semibold">
                        Government Sandbox Registry License: #AC-2026-X89B<br />
                        Ministry of Agriculture, Agri-Tech Digital Division
                      </p>
                    </div>
                    <div className="text-right space-y-1 text-slate-500 text-[10px] font-semibold">
                      <p className="font-extrabold text-slate-900 text-xs">PROCUREMENT STATEMENT</p>
                      <p>Report Date: July 6, 2026</p>
                      <p>Time Stamp: 06:14 UTC</p>
                      <p>Sourcing Node: <span className="font-bold text-slate-800">Buyer Terminal Node #1</span></p>
                    </div>
                  </div>

                  {/* Sourcing Summary Metrics */}
                  <div className="my-6 grid grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Total Sourced Volume</p>
                      <p className="text-xl font-black text-slate-800 font-mono">
                        {filteredOrders.reduce((sum, o) => sum + o.quantity, 0)} <span className="text-xs font-semibold">Tons</span>
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Total Financial Pledge</p>
                      <p className="text-xl font-black text-teal-700 font-mono">
                        ₹{filteredOrders.reduce((sum, o) => sum + (o.finalBidAmount * o.quantity), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Contract Count</p>
                      <p className="text-xl font-black text-slate-800 font-mono">
                        {filteredOrders.length} <span className="text-xs font-semibold">Agreements</span>
                      </p>
                    </div>
                  </div>

                  {/* Document Table */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Itemized Contract Ledger</h4>
                    <table className="w-full text-[10px] border-collapse text-left">
                      <thead>
                        <tr className="border-b-2 border-slate-800 text-slate-500 uppercase tracking-wider text-[8px] font-black">
                          <th className="py-2">Order No.</th>
                          <th className="py-2">Date</th>
                          <th className="py-2">Crop & Variety</th>
                          <th className="py-2 text-center">Volume</th>
                          <th className="py-2 text-right">Price/Ton</th>
                          <th className="py-2 text-right">Escrow Sum</th>
                          <th className="py-2 pl-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredOrders.map(o => (
                          <tr key={o.id} className="text-slate-800 font-semibold font-mono">
                            <td className="py-2.5 font-bold text-slate-900">{o.id}</td>
                            <td className="py-2.5 text-slate-500">{o.date || "2026-07-01"}</td>
                            <td className="py-2.5 font-sans font-bold">
                              <div>
                                <p className="text-[10px] text-slate-900 leading-snug">{o.cropName}</p>
                                <p className="text-[8px] text-slate-400 font-semibold">{o.farmerName}</p>
                              </div>
                            </td>
                            <td className="py-2.5 text-center font-bold">{o.quantity} T</td>
                            <td className="py-2.5 text-right">₹{o.finalBidAmount.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-black text-slate-900">₹{(o.finalBidAmount * o.quantity).toLocaleString()}</td>
                            <td className="py-2.5 pl-4 font-sans">
                              <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black ${
                                o.paymentStatus === "Cancelled" ? "bg-red-100 text-red-800" :
                                o.paymentStatus === "Pending" ? "bg-amber-100 text-amber-800" :
                                o.pickupStatus === "Delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }`}>
                                {o.paymentStatus === "Cancelled" ? "Cancelled" : o.pickupStatus === "Delivered" ? "Settled" : o.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Ledger Audit Footer Signature */}
                  <div className="absolute bottom-10 left-10 right-10 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-[9px] font-semibold text-slate-500">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase font-bold text-slate-400">Authentication Seal</p>
                        <div className="border border-emerald-300 bg-emerald-50 text-emerald-800 p-2.5 rounded-lg w-fit flex items-center gap-1.5 font-bold">
                          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-[7px] font-black uppercase leading-tight">LEDGER RECORD VALIDATED</p>
                            <p className="text-[6px] text-slate-400 leading-tight">DIGITAL ESCROW HASH VERIFIED</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-[7px] text-slate-400 leading-normal font-sans">
                        This document is a certified copy generated directly from the AgriConnect Government Escrow Network. Any alteration cancels the cryptographic signature.
                      </p>
                    </div>
                    <div className="text-right flex flex-col justify-end space-y-4 font-sans">
                      <div className="inline-block border-b border-slate-400 pb-1.5 w-48 ml-auto text-center font-mono italic text-[10px] text-slate-700">
                        *Cryptographic Signature Applied*
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-800 uppercase text-[8px]">AgriConnect Clearing Authority</p>
                        <p className="text-[7px]">Settlement Ledger Operations Division</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
