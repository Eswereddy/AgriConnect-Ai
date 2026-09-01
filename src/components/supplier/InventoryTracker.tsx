import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Mail,
  MessageSquare,
  RefreshCw,
  Plus,
  Minus,
  Check,
  Search,
  Bell,
  Sparkles,
  Sliders,
  AlertCircle,
  Activity,
  Trash2,
  Calendar,
  Hourglass,
  Layers,
  ArrowRight,
  Info,
  DollarSign,
  Clock,
  ShieldAlert
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { SupplierItem } from "../../types";
import { addAuditEntry } from "../../utils/auditLogger";

interface InventoryTrackerProps {
  items: SupplierItem[];
  setItems: React.Dispatch<React.SetStateAction<SupplierItem[]>>;
  onUpdateItem?: (id: string, updated: Partial<SupplierItem>) => void;
  setFeedback: (msg: string) => void;
}

interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  sku: string;
  type: "Inbound" | "Outbound" | "Adjustment" | "Return";
  quantity: number;
  reason: string;
  operator: string;
  batchNumber?: string;
}

interface StockAlertLog {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  sku: string;
  alertType: "Email" | "SMS" | "Advisory";
  recipient: string;
  message: string;
  status: "Sent" | "Failed";
}

interface StockBatch {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  initialQuantity: number;
  expiryDate: string; // "YYYY-MM-DD" or "" for non-perishable
  manufactureDate: string; // "YYYY-MM-DD"
  receivedDate: string; // "YYYY-MM-DD"
}

interface AuditItemReport {
  productId: string;
  productName: string;
  sku: string;
  systemStock: number;
  physicalStock: number;
  discrepancy: number; // physical - system
  status: "Match" | "Surplus" | "Deficit";
}

interface StockAuditReport {
  id: string;
  date: string;
  auditor: string;
  items: AuditItemReport[];
  notes?: string;
  totalDiscrepancy: number;
}

interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number; // unit price
}

interface PurchaseOrder {
  id: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  expectedDeliveryDate: string; // YYYY-MM-DD
  status: "Draft" | "Sent" | "Confirmed" | "Received" | "Cancelled";
  dateCreated: string; // YYYY-MM-DD
  notes?: string;
}

export default function InventoryTracker({
  items,
  setItems,
  onUpdateItem,
  setFeedback
}: InventoryTrackerProps) {
  // Main tabs: Stock Levels, Batches & Expiries, Ledger, Adjustments, Purchase Orders, Analytics
  const [activeSubTab, setActiveSubTab] = useState<"levels" | "batches" | "ledger" | "adjustments" | "purchase-orders" | "analytics">("levels");

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [alertFilter, setAlertFilter] = useState("All"); // All, Low Stock, Normal, Out of Stock
  const [expiryWarningFilter, setExpiryWarningFilter] = useState("All"); // All, Expired, Critical (7d), Warning (15d), Caution (30d), Perishable

  // Interactive FIFO Simulator States
  const [fifoProductId, setFifoProductId] = useState("");
  const [fifoQty, setFifoQty] = useState("35");

  // Local Stock Batches state
  const [batches, setBatches] = useState<StockBatch[]>(() => {
    const stored = localStorage.getItem("agriconnect_stock_batches");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    // Seed default batches matching current UTC date (2026-07-08)
    return [
      {
        id: "BAT-001",
        batchNumber: "BAT-POT-2601",
        productId: "1",
        productName: "Certified Organic Seed Potatoes (A-Grade)",
        sku: "SKU-SEE-CER-1",
        category: "Seeds",
        quantity: 40,
        initialQuantity: 100,
        manufactureDate: "2026-04-10",
        receivedDate: "2026-04-15",
        expiryDate: "2026-07-15" // Expires in 7 days! Critical Expiry Warning!
      },
      {
        id: "BAT-002",
        batchNumber: "BAT-POT-2602",
        productId: "1",
        productName: "Certified Organic Seed Potatoes (A-Grade)",
        sku: "SKU-SEE-CER-1",
        category: "Seeds",
        quantity: 60,
        initialQuantity: 120,
        manufactureDate: "2026-04-18",
        receivedDate: "2026-04-22",
        expiryDate: "2026-07-23" // Expires in 15 days! Warning Expiry!
      },
      {
        id: "BAT-003",
        batchNumber: "BAT-COM-2601",
        productId: "2",
        productName: "Nitrogen-Release Bio-Fertilizer Compost (25kg)",
        sku: "SKU-FER-NIT-2",
        category: "Fertilizers",
        quantity: 50,
        initialQuantity: 100,
        manufactureDate: "2026-02-05",
        receivedDate: "2026-02-12",
        expiryDate: "2026-08-07" // Expires in 30 days! Caution Alert!
      },
      {
        id: "BAT-004",
        batchNumber: "BAT-COM-2602",
        productId: "2",
        productName: "Nitrogen-Release Bio-Fertilizer Compost (25kg)",
        sku: "SKU-FER-NIT-2",
        category: "Fertilizers",
        quantity: 110,
        initialQuantity: 150,
        manufactureDate: "2026-05-01",
        receivedDate: "2026-05-08",
        expiryDate: "2026-11-15" // Fully Safe (> 30 days)
      },
      {
        id: "BAT-005",
        batchNumber: "BAT-PUMP-2601",
        productId: "3",
        productName: "Solar-Powered Deep Well Submersible Pump",
        sku: "SKU-IOT-SOL-3",
        category: "Machinery",
        quantity: 15,
        initialQuantity: 15,
        manufactureDate: "2026-01-10",
        receivedDate: "2026-01-25",
        expiryDate: "" // Non-perishable
      }
    ];
  });

  // Stock Movement Ledger State
  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const stored = localStorage.getItem("agriconnect_stock_movements");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    // Seed default movements matching items
    return [
      {
        id: "MOV-1001",
        date: "2026-07-07 15:30",
        productId: "1",
        productName: "Certified Organic Seed Potatoes (A-Grade)",
        sku: "SKU-SEE-CER-1",
        type: "Inbound",
        quantity: 100,
        reason: "Supplier batch restock - assigned BAT-POT-2601",
        operator: "Warehouse Lead",
        batchNumber: "BAT-POT-2601"
      },
      {
        id: "MOV-1002",
        date: "2026-07-07 11:20",
        productId: "2",
        productName: "Nitrogen-Release Bio-Fertilizer Compost (25kg)",
        sku: "SKU-FER-NIT-2",
        type: "Outbound",
        quantity: 20,
        reason: "Customer Order ORD-9839 fulfillment via FIFO suggestion",
        operator: "Logistics Admin",
        batchNumber: "BAT-COM-2601"
      },
      {
        id: "MOV-1003",
        date: "2026-07-06 09:45",
        productId: "3",
        productName: "Solar-Powered Deep Well Submersible Pump",
        sku: "SKU-IOT-SOL-3",
        type: "Inbound",
        quantity: 15,
        reason: "Factory shipment assigned BAT-PUMP-2601",
        operator: "Receiving Clerk",
        batchNumber: "BAT-PUMP-2601"
      }
    ];
  });

  // Alert Log State
  const [alertsLog, setAlertsLog] = useState<StockAlertLog[]>(() => {
    const stored = localStorage.getItem("agriconnect_stock_alerts");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      {
        id: "ALT-201",
        timestamp: "2026-07-07 15:35",
        productId: "1",
        productName: "Certified Organic Seed Potatoes (A-Grade)",
        sku: "SKU-SEE-CER-1",
        alertType: "Email",
        recipient: "jakkireddyeswarreddy@gmail.com",
        message: "ALERT: Certified Organic Seed Potatoes (A-Grade) stock has fallen below low stock threshold. Suggesting immediate restock.",
        status: "Sent"
      },
      {
        id: "ALT-202",
        timestamp: "2026-07-07 15:35",
        productId: "1",
        productName: "Certified Organic Seed Potatoes (A-Grade)",
        sku: "SKU-SEE-CER-1",
        alertType: "SMS",
        recipient: "+91 98450-12345",
        message: "AgriConnect Stock Alert: SKU SKU-SEE-CER-1 level is critical. Click here to auto-reorder.",
        status: "Sent"
      },
      {
        id: "ALT-203",
        timestamp: "2026-07-08 08:30",
        productId: "1",
        productName: "Certified Organic Seed Potatoes (A-Grade)",
        sku: "SKU-SEE-CER-1",
        alertType: "Advisory",
        recipient: "Warehouse Operations Team",
        message: "EXPIRY NOTIFICATION (7 Days): Batch BAT-POT-2601 of Certified Organic Seed Potatoes (A-Grade) expires on 2026-07-15! Suggest immediate First-In-First-Out (FIFO) stock rotation sales immediately.",
        status: "Sent"
      }
    ];
  });

  // Form states for manual adjustment
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjProdId, setAdjProdId] = useState("");
  const [adjType, setAdjType] = useState<"Inbound" | "Outbound">("Inbound");
  const [adjQty, setAdjQty] = useState("");
  const [adjReason, setAdjReason] = useState("Manual stock count correction");
  const [adjBatchNum, setAdjBatchNum] = useState("");
  const [adjExpiryDate, setAdjExpiryDate] = useState("");
  const [adjIsPerishable, setAdjIsPerishable] = useState(false);

  // Stock Audit states
  const [isAuditActive, setIsAuditActive] = useState(false);
  const [auditingItems, setAuditingItems] = useState<Record<string, number>>({});
  const [auditorName, setAuditorName] = useState("Operations Manager");
  const [auditNotes, setAuditNotes] = useState("");
  const [selectedAuditReport, setSelectedAuditReport] = useState<StockAuditReport | null>(null);
  const [auditHistory, setAuditHistory] = useState<StockAuditReport[]>(() => {
    const stored = localStorage.getItem("agriconnect_stock_audits");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      {
        id: "AUD-101",
        date: "2026-07-01 10:00",
        auditor: "Warehouse Director",
        notes: "Bi-weekly general warehouse verification. Minimal discrepancies found.",
        totalDiscrepancy: -5,
        items: [
          {
            productId: "1",
            productName: "Certified Organic Seed Potatoes (A-Grade)",
            sku: "SKU-SEE-CER-1",
            systemStock: 105,
            physicalStock: 100,
            discrepancy: -5,
            status: "Deficit"
          },
          {
            productId: "2",
            productName: "Nitrogen-Release Bio-Fertilizer Compost (25kg)",
            sku: "SKU-FER-NIT-2",
            systemStock: 160,
            physicalStock: 160,
            discrepancy: 0,
            status: "Match"
          }
        ]
      }
    ];
  });

  // Form states for new batch receipt (Assign batch numbers to incoming stock)
  const [isReceivingStock, setIsReceivingStock] = useState(false);
  const [recvProdId, setRecvProdId] = useState("");
  const [recvBatchNum, setRecvBatchNum] = useState("");
  const [recvQty, setRecvQty] = useState("");
  const [recvManufactureDate, setRecvManufactureDate] = useState("2026-06-10");
  const [recvExpiryDate, setRecvExpiryDate] = useState("2026-10-10");
  const [recvIsPerishable, setRecvIsPerishable] = useState(true);

  // Local Purchase Orders state
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const stored = localStorage.getItem("agriconnect_purchase_orders");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      {
        id: "PO-2026-001",
        supplierName: "Apex Seeds & Agronomy Corp",
        items: [
          {
            productId: "1",
            productName: "Certified Organic Seed Potatoes (A-Grade)",
            sku: "SKU-SEE-CER-1",
            quantity: 50,
            price: 180
          }
        ],
        expectedDeliveryDate: "2026-07-20",
        status: "Confirmed",
        dateCreated: "2026-07-01",
        notes: "High demand expected for seed potatoes. Expedited manufacturing requested."
      },
      {
        id: "PO-2026-002",
        supplierName: "BioCompost Organics Ltd",
        items: [
          {
            productId: "2",
            productName: "Nitrogen-Release Bio-Fertilizer Compost (25kg)",
            sku: "SKU-FER-NIT-2",
            quantity: 80,
            price: 75
          }
        ],
        expectedDeliveryDate: "2026-07-05",
        status: "Received",
        dateCreated: "2026-06-25",
        notes: "Regular bi-monthly manufacturing supply order."
      },
      {
        id: "PO-2026-003",
        supplierName: "Standard AgroChemicals",
        items: [
          {
            productId: "2",
            productName: "Nitrogen-Release Bio-Fertilizer Compost (25kg)",
            sku: "SKU-FER-NIT-2",
            quantity: 30,
            price: 80
          }
        ],
        expectedDeliveryDate: "2026-07-30",
        status: "Draft",
        dateCreated: "2026-07-08",
        notes: "Buffer stock formulation draft."
      }
    ];
  });

  // Create PO states
  const [isCreatingPO, setIsCreatingPO] = useState(false);
  const [poSupplierName, setPoSupplierName] = useState("");
  const [poExpectedDeliveryDate, setPoExpectedDeliveryDate] = useState("");
  const [poNotes, setPoNotes] = useState("");
  const [poStatus, setPoStatus] = useState<"Draft" | "Sent" | "Confirmed" | "Received" | "Cancelled">("Draft");
  const [poItems, setPoItems] = useState<{ productId: string; quantity: number; price: number }[]>([
    { productId: "", quantity: 10, price: 50 }
  ]);

  // Receive PO state variables
  const [receivingPo, setReceivingPo] = useState<PurchaseOrder | null>(null);
  const [poReceiveItems, setPoReceiveItems] = useState<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    batchNumber: string;
    manufactureDate: string;
    expiryDate: string;
    isPerishable: boolean;
  }[]>([]);

  const [successBanner, setSuccessBanner] = useState("");

  // Persist local state
  useEffect(() => {
    localStorage.setItem("agriconnect_purchase_orders", JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);
  useEffect(() => {
    localStorage.setItem("agriconnect_stock_batches", JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem("agriconnect_stock_movements", JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem("agriconnect_stock_alerts", JSON.stringify(alertsLog));
  }, [alertsLog]);

  useEffect(() => {
    localStorage.setItem("agriconnect_stock_audits", JSON.stringify(auditHistory));
  }, [auditHistory]);

  // Synchronize dynamic product overall stock quantities with sum of all active batches
  useEffect(() => {
    // For each product, count total stock in all batches
    const productStockMap: Record<string, number> = {};
    batches.forEach(batch => {
      productStockMap[batch.productId] = (productStockMap[batch.productId] || 0) + batch.quantity;
    });

    let hasChanges = false;
    const updatedItems = items.map(item => {
      const sumOfBatches = productStockMap[item.id] !== undefined ? productStockMap[item.id] : 0;
      if (item.stock !== sumOfBatches) {
        hasChanges = true;
        return { ...item, stock: sumOfBatches };
      }
      return item;
    });

    if (hasChanges) {
      setItems(updatedItems);
      // Also write back to localStorage & trigger callback if provided
      localStorage.setItem("agriconnect_supplier_items", JSON.stringify(updatedItems));
      updatedItems.forEach(item => {
        if (onUpdateItem) {
          onUpdateItem(item.id, { stock: item.stock });
        }
      });
    }
  }, [batches]);

  // Handle auto-generating batch number when receiving stock
  useEffect(() => {
    if (recvProdId) {
      const prod = items.find(p => p.id === recvProdId);
      if (prod) {
        const catCode = prod.category.toUpperCase().slice(0, 3);
        const randCode = Math.floor(Math.random() * 9000 + 1000);
        setRecvBatchNum(`BAT-${catCode}-${new Date().toISOString().slice(2, 4)}${new Date().toISOString().slice(5, 7)}-${randCode}`);
        setRecvIsPerishable(prod.category === "Seeds" || prod.category === "Fertilizers");
      }
    }
  }, [recvProdId]);

  // System local time proxy: 2026-07-08
  const sysDate = new Date("2026-07-08");

  // Helper function to calculate expiry distance status
  const getExpiryStatus = (expiryDateStr: string) => {
    if (!expiryDateStr) return { label: "Durable", color: "text-slate-500 bg-slate-100 border-slate-200", daysLeft: Infinity, badge: "DURABLE" };
    
    const expDate = new Date(expiryDateStr);
    const diffTime = expDate.getTime() - sysDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Expired ${Math.abs(diffDays)}d ago`, color: "text-rose-700 bg-rose-100 border-rose-200 font-extrabold", daysLeft: diffDays, badge: "EXPIRED" };
    } else if (diffDays <= 7) {
      return { label: `Expires in ${diffDays}d (Critical)`, color: "text-red-700 bg-red-100 border-red-200 font-black animate-pulse", daysLeft: diffDays, badge: "CRITICAL" };
    } else if (diffDays <= 15) {
      return { label: `Expires in ${diffDays}d (Warning)`, color: "text-amber-800 bg-amber-100 border-amber-200 font-bold", daysLeft: diffDays, badge: "WARNING" };
    } else if (diffDays <= 30) {
      return { label: `Expires in ${diffDays}d (Caution)`, color: "text-yellow-800 bg-yellow-50 border-yellow-200", daysLeft: diffDays, badge: "CAUTION" };
    } else {
      return { label: `${diffDays} days remaining (Safe)`, color: "text-emerald-700 bg-emerald-50 border-emerald-200", daysLeft: diffDays, badge: "SAFE" };
    }
  };

  // Derive global counts
  const totalStockValue = items.reduce((sum, item) => sum + (item.stock * (item.price || 0) * 84), 0);
  const totalStockUnits = items.reduce((sum, item) => sum + (item.stock || 0), 0);
  
  const lowStockItems = items.filter(item => {
    const threshold = item.lowStockThreshold || 15;
    return item.stock <= threshold && item.stock > 0;
  });
  const outOfStockItems = items.filter(item => item.stock === 0);

  // Expiry notifications status calculations
  const batchesWithExpiries = batches.map(b => ({
    ...b,
    expStatus: getExpiryStatus(b.expiryDate)
  }));

  const criticalExpiryBatches = batchesWithExpiries.filter(b => b.expStatus.daysLeft <= 7 && b.expStatus.daysLeft >= 0);
  const warningExpiryBatches = batchesWithExpiries.filter(b => b.expStatus.daysLeft > 7 && b.expStatus.daysLeft <= 15);
  const cautionExpiryBatches = batchesWithExpiries.filter(b => b.expStatus.daysLeft > 15 && b.expStatus.daysLeft <= 30);
  const expiredBatches = batchesWithExpiries.filter(b => b.expStatus.daysLeft < 0);

  // --- 8.2 Inventory Analytics Calculations ---
  // A. Stock Value by Category (₹)
  const stockByCategoryValue = useMemo(() => {
    const map: Record<string, number> = { Seeds: 0, Fertilizers: 0, "IoT Sensors": 0, Machinery: 0 };
    items.forEach(item => {
      const cat = item.category || "Seeds";
      const val = (item.stock || 0) * (item.price || 0) * 84; // INR conversion multiplier
      if (map[cat] !== undefined) {
        map[cat] += val;
      } else {
        map[cat] = val;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [items]);

  // B. Stock Turnover & Velocity
  const turnoverMetrics = useMemo(() => {
    return items.map(item => {
      // Outbound sales quantity from ledger
      const outboundQty = movements
        .filter(m => m.productId === item.id && m.type === "Outbound")
        .reduce((sum, m) => sum + m.quantity, 0);

      // Provide dynamic realistic baseline sales based on item if ledger movements are fresh
      const baseSales = outboundQty > 0 ? outboundQty : (item.id === "1" ? 140 : item.id === "2" ? 180 : item.id === "3" ? 22 : 8);
      
      // Average stock level (e.g. current stock + half of sales)
      const avgStock = Math.max(5, item.stock + (baseSales / 2));
      
      // Cost of Goods Sold (COGS) in INR (approx 70% of price)
      const cogs = baseSales * (item.costPrice || (item.price * 0.7)) * 84;
      const avgInvValue = avgStock * (item.costPrice || (item.price * 0.7)) * 84;
      
      const turnoverRatio = parseFloat((cogs / Math.max(1, avgInvValue)).toFixed(2)) || 0.8;
      
      // Days to sell = 365 / turnoverRatio (capped between 5 and 365)
      const daysToSell = turnoverRatio > 0 ? Math.max(5, Math.min(365, Math.round(365 / turnoverRatio))) : 365;

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        stock: item.stock,
        salesUnits: baseSales,
        turnoverRatio,
        daysToSell,
        isFastMover: daysToSell < 60,
      };
    }).sort((a, b) => a.daysToSell - b.daysToSell);
  }, [items, movements]);

  const fastMovers = useMemo(() => turnoverMetrics.filter(t => t.isFastMover), [turnoverMetrics]);
  const slowMovers = useMemo(() => turnoverMetrics.filter(t => !t.isFastMover), [turnoverMetrics]);

  // Average days to sell across active stock
  const avgDaysToSell = useMemo(() => {
    if (turnoverMetrics.length === 0) return 0;
    const sum = turnoverMetrics.reduce((acc, curr) => acc + curr.daysToSell, 0);
    return Math.round(sum / turnoverMetrics.length);
  }, [turnoverMetrics]);

  const expiringBatchesCount = useMemo(() => {
    return batchesWithExpiries.filter(b => b.expStatus.daysLeft <= 15).length;
  }, [batchesWithExpiries]);

  // FIFO Stock Rotation Suggestion Calculation Engine
  const calculateFIFOSuggestion = (productId: string, quantityToDraw: number) => {
    if (!productId || quantityToDraw <= 0) {
      return {
        allocation: [],
        unfulfilled: quantityToDraw,
        totalAvailable: 0
      };
    }
    
    // Get active batches for this product with inventory > 0, sorted by FIFO criteria (receivedDate ASC or expiryDate ASC for perishables)
    const productBatches = [...batches]
      .filter(b => b.productId === productId && b.quantity > 0)
      .sort((a, b) => {
        // If perishable, sort by earliest expiry date first. Otherwise sort by receivedDate (oldest first).
        if (a.expiryDate && b.expiryDate) {
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        } else if (a.expiryDate) {
          return -1;
        } else if (b.expiryDate) {
          return 1;
        }
        return new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime();
      });

    let remaining = quantityToDraw;
    const allocation: { batch: StockBatch; qtyDrawn: number; isFullyDepleted: boolean }[] = [];

    for (const b of productBatches) {
      if (remaining <= 0) break;
      const draw = Math.min(b.quantity, remaining);
      remaining -= draw;
      allocation.push({
        batch: b,
        qtyDrawn: draw,
        isFullyDepleted: draw === b.quantity
      });
    }

    return {
      allocation,
      unfulfilled: remaining,
      totalAvailable: productBatches.reduce((s, b) => s + b.quantity, 0)
    };
  };

  // Trigger FIFO Outbound Execution
  const handleExecuteFIFOOutbound = (productId: string, quantity: number, reason: string) => {
    const targetProduct = items.find(item => item.id === productId);
    if (!targetProduct) return;

    const fifoDetails = calculateFIFOSuggestion(productId, quantity);
    if (fifoDetails.allocation.length === 0) {
      setFeedback("❌ Failed to fulfill: No stock units are available for this product.");
      return;
    }

    // Deduct stock from state batches
    setBatches(prevBatches => {
      return prevBatches.map(b => {
        const drawAlloc = fifoDetails.allocation.find(a => a.batch.id === b.id);
        if (drawAlloc) {
          return { ...b, quantity: Math.max(0, b.quantity - drawAlloc.qtyDrawn) };
        }
        return b;
      });
    });

    // Create movement entries & alerts if threshold is reached
    fifoDetails.allocation.forEach(alloc => {
      const newMovement: StockMovement = {
        id: `MOV-${Math.floor(Math.random() * 9000 + 1000)}`,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
        productId,
        productName: targetProduct.name,
        sku: targetProduct.sku || "AGR-INPUT-SKU",
        type: "Outbound",
        quantity: alloc.qtyDrawn,
        reason: `${reason} - Automatically deducted from batch ${alloc.batch.batchNumber} via FIFO Strategy.`,
        operator: "FIFO Engine",
        batchNumber: alloc.batch.batchNumber
      };

      setMovements(prev => [newMovement, ...prev]);

      // Check low stock triggers
      const newBatchStock = alloc.batch.quantity - alloc.qtyDrawn;
      const threshold = targetProduct.lowStockThreshold || 15;
      if (newBatchStock <= 5) {
        // Trigger alert
        triggerBatchLowAlert(targetProduct, alloc.batch.batchNumber, newBatchStock);
      }
    });

    setFeedback(`🚀 Successfully shipped ${quantity} units using First-In-First-Out rotation across ${fifoDetails.allocation.length} batches.`);
    setSuccessBanner(`✓ Shipped ${quantity} units using First-In-First-Out rotation logic across ${fifoDetails.allocation.length} batches.`);
    setTimeout(() => setSuccessBanner(""), 5000);
  };

  const triggerBatchLowAlert = (item: SupplierItem, batchNum: string, currentStock: number) => {
    const log: StockAlertLog = {
      id: `ALT-B${Math.floor(Math.random() * 900 + 100)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      productId: item.id,
      productName: item.name,
      sku: item.sku || "SKU-ALERT",
      alertType: "SMS",
      recipient: "jakkireddyeswarreddy@gmail.com",
      message: `CRITICAL BATCH ALERT: '${item.name}' Batch ${batchNum} contains only ${currentStock} units left. Arrange replacement batch.`,
      status: "Sent"
    };
    setAlertsLog(prev => [log, ...prev]);
  };

  // Broadcast manual or automatic expiry notifications to system/owner
  const triggerExpiryBroadcaster = () => {
    let count = 0;
    const newAdvisories: StockAlertLog[] = [];

    batchesWithExpiries.forEach(b => {
      if (!b.expiryDate) return;
      const status = b.expStatus;
      
      if (status.daysLeft <= 30 && status.daysLeft >= 0) {
        count++;
        let bracket = "30 Days";
        if (status.daysLeft <= 7) bracket = "7 Days";
        else if (status.daysLeft <= 15) bracket = "15 Days";

        const log: StockAlertLog = {
          id: `ALT-EXP-${Math.floor(Math.random() * 9000 + 1000)}`,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          productId: b.productId,
          productName: b.productName,
          sku: b.sku,
          alertType: "Advisory",
          recipient: "Operations Manager / Farmers Co-ops",
          message: `EXPIRY ADVISORY (${bracket}): Batch ${b.batchNumber} of '${b.productName}' expires on ${b.expiryDate} (${status.label}). Place immediate price discount or trigger FIFO routing.`,
          status: "Sent"
        };
        newAdvisories.push(log);
      }
    });

    if (newAdvisories.length > 0) {
      setAlertsLog(prev => [...newAdvisories, ...prev]);
      setFeedback(`📢 Dispatched ${newAdvisories.length} Expiry Advisory notification alerts (Email/SMS) to distributors and farmers.`);
      setSuccessBanner(`✓ Dispatched alerts for ${newAdvisories.length} perishable batches close to expiry.`);
    } else {
      setFeedback("📢 Checked: No batches are currently within the 30/15/7 day expiry zones.");
      setSuccessBanner("✓ Verified Expiry Levels. All perishable stocks are well within standard fresh zones.");
    }
    setTimeout(() => setSuccessBanner(""), 4500);
  };

  // Assign batch numbers to incoming stock (Form Handler)
  const handleReceiveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recvProdId || !recvQty || !recvBatchNum) return;
    const qty = parseInt(recvQty);
    if (isNaN(qty) || qty <= 0) return;

    const targetProduct = items.find(item => item.id === recvProdId);
    if (!targetProduct) return;

    // Create a new StockBatch
    const newBatch: StockBatch = {
      id: `BAT-${Date.now().toString().slice(-4)}`,
      batchNumber: recvBatchNum,
      productId: recvProdId,
      productName: targetProduct.name,
      sku: targetProduct.sku || "AGR-INPUT-SKU",
      category: targetProduct.category,
      quantity: qty,
      initialQuantity: qty,
      manufactureDate: recvManufactureDate,
      receivedDate: new Date().toISOString().slice(0, 10),
      expiryDate: recvIsPerishable ? recvExpiryDate : ""
    };

    setBatches(prev => [newBatch, ...prev]);

    // Create a StockMovement
    const newMovement: StockMovement = {
      id: `MOV-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      productId: recvProdId,
      productName: targetProduct.name,
      sku: targetProduct.sku || "AGR-INPUT-SKU",
      type: "Inbound",
      quantity: qty,
      reason: `Assigned batch number ${recvBatchNum} to incoming stock. Expiry: ${recvIsPerishable ? recvExpiryDate : "N/A"}.`,
      operator: "Inventory Clerk",
      batchNumber: recvBatchNum
    };

    setMovements(prev => [newMovement, ...prev]);

    // Update product overall stock
    setItems(prevItems => prevItems.map(item => {
      if (item.id === recvProdId) {
        return { ...item, stock: (item.stock || 0) + qty };
      }
      return item;
    }));

    if (onUpdateItem) {
      onUpdateItem(recvProdId, { stock: (targetProduct.stock || 0) + qty });
    }

    setIsReceivingStock(false);
    setRecvQty("");
    setFeedback(`🎉 Successfully assigned Batch ${recvBatchNum} to ${qty} units of ${targetProduct.name}.`);
    setSuccessBanner(`✓ Received ${qty} units into Batch ${recvBatchNum} for ${targetProduct.name}.`);
    setTimeout(() => setSuccessBanner(""), 4500);
  };

  // Create a brand new Purchase Order (with multi-item validation)
  const handleCreatePurchaseOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poSupplierName.trim()) {
      setFeedback("⚠️ Please enter a Supplier name.");
      return;
    }

    const filteredItems = poItems.filter(pi => pi.productId && pi.quantity > 0);
    if (filteredItems.length === 0) {
      setFeedback("⚠️ Please add at least one product with quantity greater than zero.");
      return;
    }

    const newPoId = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const formattedItems = filteredItems.map(pi => {
      const matchedProd = items.find(p => p.id === pi.productId);
      return {
        productId: pi.productId,
        productName: matchedProd ? matchedProd.name : "Unknown Item",
        sku: matchedProd ? (matchedProd.sku || `SKU-${pi.productId}`) : `SKU-${pi.productId}`,
        quantity: pi.quantity,
        price: pi.price
      };
    });

    const newPo: PurchaseOrder = {
      id: newPoId,
      supplierName: poSupplierName,
      items: formattedItems,
      expectedDeliveryDate: poExpectedDeliveryDate || new Date().toISOString().slice(0, 10),
      status: poStatus,
      dateCreated: new Date().toISOString().slice(0, 10),
      notes: poNotes
    };

    // If status is immediately set to Received, we auto-receive into default batches
    if (poStatus === "Received") {
      const newBatches: StockBatch[] = [];
      const newMovements: StockMovement[] = [];

      formattedItems.forEach((it, index) => {
        const matchedProd = items.find(p => p.id === it.productId);
        const isPerishable = matchedProd ? (matchedProd.category === "Seeds" || matchedProd.category === "Fertilizers") : true;
        const batchNo = `BAT-PO-${newPoId.replace("PO-", "")}-${it.productId}`;

        newBatches.push({
          id: `BAT-${Date.now().toString().slice(-4)}-${index}-${Math.floor(Math.random() * 1000)}`,
          batchNumber: batchNo,
          productId: it.productId,
          productName: it.productName,
          sku: it.sku,
          category: matchedProd ? matchedProd.category : "Seeds",
          quantity: it.quantity,
          initialQuantity: it.quantity,
          manufactureDate: new Date().toISOString().slice(0, 10),
          receivedDate: new Date().toISOString().slice(0, 10),
          expiryDate: isPerishable ? new Date(Date.now() + 180*24*60*60*1000).toISOString().slice(0, 10) : ""
        });

        newMovements.push({
          id: `MOV-${Date.now().toString().slice(-4)}-${index}-${Math.floor(Math.random() * 1000)}`,
          date: new Date().toISOString().replace("T", " ").slice(0, 16),
          productId: it.productId,
          productName: it.productName,
          sku: it.sku,
          type: "Inbound",
          quantity: it.quantity,
          reason: `Purchase Order ${newPoId} Auto-Received`,
          operator: "System Automator",
          batchNumber: batchNo
        });
      });

      setBatches(prev => [...newBatches, ...prev]);
      setMovements(prev => [...newMovements, ...prev]);
    }

    setPurchaseOrders(prev => [newPo, ...prev]);
    setFeedback(`🎉 Successfully created Purchase Order ${newPoId} with status "${poStatus}".`);
    setSuccessBanner(`✓ PO ${newPoId} registered.`);
    setTimeout(() => setSuccessBanner(""), 4500);

    // Reset Form
    setIsCreatingPO(false);
    setPoSupplierName("");
    setPoExpectedDeliveryDate("");
    setPoNotes("");
    setPoStatus("Draft");
    setPoItems([{ productId: "", quantity: 10, price: 50 }]);
  };

  // Launch the interactive receipt wizard modal for a specific PO
  const handleLaunchReceivePo = (po: PurchaseOrder) => {
    setReceivingPo(po);
    const initialReceiveDetails = po.items.map(it => {
      const prod = items.find(p => p.id === it.productId);
      const isPerishable = prod ? (prod.category === "Seeds" || prod.category === "Fertilizers") : true;
      return {
        productId: it.productId,
        productName: it.productName,
        sku: it.sku || "SKU-UNKNOWN",
        quantity: it.quantity,
        batchNumber: `BAT-PO-${po.id.replace("PO-", "")}-${it.productId}`,
        manufactureDate: new Date().toISOString().slice(0, 10),
        expiryDate: isPerishable ? new Date(Date.now() + 180*24*60*60*1000).toISOString().slice(0, 10) : "",
        isPerishable
      };
    });
    setPoReceiveItems(initialReceiveDetails);
  };

  // Confirm receipt and generate batches with custom batch/expiry details
  const handleConfirmReceivePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivingPo) return;

    const newBatchesList: StockBatch[] = [];
    const newMovementsList: StockMovement[] = [];

    poReceiveItems.forEach((it, index) => {
      const prod = items.find(p => p.id === it.productId);
      const batchNo = it.batchNumber.trim() || `BAT-PO-${receivingPo.id.replace("PO-", "")}-${it.productId}`;

      newBatchesList.push({
        id: `BAT-${Date.now().toString().slice(-4)}-${index}-${Math.floor(Math.random() * 1000)}`,
        batchNumber: batchNo,
        productId: it.productId,
        productName: it.productName,
        sku: it.sku,
        category: prod ? prod.category : "Seeds",
        quantity: it.quantity,
        initialQuantity: it.quantity,
        manufactureDate: it.manufactureDate || new Date().toISOString().slice(0, 10),
        receivedDate: new Date().toISOString().slice(0, 10),
        expiryDate: it.isPerishable ? it.expiryDate : ""
      });

      newMovementsList.push({
        id: `MOV-${Date.now().toString().slice(-4)}-${index}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
        productId: it.productId,
        productName: it.productName,
        sku: it.sku,
        type: "Inbound",
        quantity: it.quantity,
        reason: `Purchase Order ${receivingPo.id} Received`,
        operator: "Warehouse Manager",
        batchNumber: batchNo
      });
    });

    // Mark PO as received in state
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === receivingPo.id) {
        return { ...po, status: "Received" };
      }
      return po;
    }));

    setBatches(prev => [...newBatchesList, ...prev]);
    setMovements(prev => [...newMovementsList, ...prev]);

    setFeedback(`🎉 Successfully marked PO #${receivingPo.id} as Received! Updated inventory & added ${newBatchesList.length} stock batches.`);
    setSuccessBanner(`✓ PO #${receivingPo.id} Received.`);
    setTimeout(() => setSuccessBanner(""), 4500);

    setReceivingPo(null);
  };

  // Change PO status from status dropdown on list
  const handleChangePoStatus = (poId: string, status: "Draft" | "Sent" | "Confirmed" | "Received" | "Cancelled") => {
    if (status === "Received") {
      const po = purchaseOrders.find(p => p.id === poId);
      if (po) {
        handleLaunchReceivePo(po);
      }
      return;
    }

    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        return { ...po, status };
      }
      return po;
    }));
    setFeedback(`✓ Purchase Order #${poId} status updated to ${status}.`);
  };

  // Delete a PO
  const handleDeletePurchaseOrder = (poId: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== poId));
    setFeedback(`✓ Purchase Order #${poId} removed from records.`);
  };

  // Delete Batch completely (e.g. discarded due to spoilage/expiry)
  const handleDeleteBatch = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const quantityDiscarded = batch.quantity;

    setBatches(prev => prev.filter(b => b.id !== batchId));

    const newMovement: StockMovement = {
      id: `MOV-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      productId: batch.productId,
      productName: batch.productName,
      sku: batch.sku,
      type: "Outbound",
      quantity: quantityDiscarded,
      reason: `EXPIRED / SPOILED stock disposal: Batch ${batch.batchNumber} discarded completely.`,
      operator: "QC Specialist",
      batchNumber: batch.batchNumber
    };

    setMovements(prev => [newMovement, ...prev]);
    setFeedback(`🗑️ Discarded batch ${batch.batchNumber} completely (${quantityDiscarded} units removed).`);
  };

  // Handle manual stock adjustments (Add / Remove stock)
  const handleManualStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjProdId || !adjQty) return;
    const qty = parseInt(adjQty);
    if (isNaN(qty) || qty <= 0) return;

    const targetProduct = items.find(item => item.id === adjProdId);
    if (!targetProduct) return;

    if (adjType === "Inbound") {
      // Add Stock
      const finalBatchNum = adjBatchNum.trim() || `BAT-ADJ-${targetProduct.category.toUpperCase().slice(0,3)}-${Math.floor(Math.random() * 9000 + 1000)}`;
      
      const newBatch: StockBatch = {
        id: `BAT-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`,
        batchNumber: finalBatchNum,
        productId: adjProdId,
        productName: targetProduct.name,
        sku: targetProduct.sku || "AGR-INPUT-SKU",
        category: targetProduct.category,
        quantity: qty,
        initialQuantity: qty,
        manufactureDate: new Date().toISOString().slice(0, 10),
        receivedDate: new Date().toISOString().slice(0, 10),
        expiryDate: adjExpiryDate ? adjExpiryDate : ""
      };

      setBatches(prev => [newBatch, ...prev]);

      const newMovement: StockMovement = {
        id: `MOV-${Math.floor(Math.random() * 9000 + 1000)}`,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
        productId: adjProdId,
        productName: targetProduct.name,
        sku: targetProduct.sku || "AGR-INPUT-SKU",
        type: "Inbound",
        quantity: qty,
        reason: `${adjReason} (Manual Addition)`,
        operator: "Operations Manager",
        batchNumber: finalBatchNum
      };

      setMovements(prev => [newMovement, ...prev]);
      setFeedback(`✓ Added ${qty} units of ${targetProduct.name} to batch ${finalBatchNum}.`);
      setSuccessBanner(`✓ Manual Adjustment: Added ${qty} units to Batch ${finalBatchNum}.`);
    } else {
      // Remove Stock
      // Check total available stock across active batches
      const productBatches = batches.filter(b => b.productId === adjProdId && b.quantity > 0);
      const totalAvailable = productBatches.reduce((sum, b) => sum + b.quantity, 0);

      if (totalAvailable === 0) {
        setFeedback("❌ Failed to adjust: No available stock in any batches to remove.");
        return;
      }

      const qtyToDeduct = Math.min(qty, totalAvailable);

      // FIFO deduction from batches
      let remaining = qtyToDeduct;
      const sortedBatches = [...batches]
        .filter(b => b.productId === adjProdId)
        .sort((a, b) => {
          if (a.expiryDate && b.expiryDate) {
            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
          } else if (a.expiryDate) {
            return -1;
          } else if (b.expiryDate) {
            return 1;
          }
          return new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime();
        });

      const updatedBatchMap: Record<string, number> = {};
      const allocations: { batchNum: string; qtyDrawn: number }[] = [];

      for (const b of sortedBatches) {
        if (remaining <= 0) break;
        const draw = Math.min(b.quantity, remaining);
        remaining -= draw;
        updatedBatchMap[b.id] = b.quantity - draw;
        allocations.push({ batchNum: b.batchNumber, qtyDrawn: draw });
      }

      setBatches(prev => prev.map(b => {
        if (updatedBatchMap[b.id] !== undefined) {
          return { ...b, quantity: updatedBatchMap[b.id] };
        }
        return b;
      }));

      // Log movements for each batch we deducted from
      allocations.forEach(alloc => {
        const newMovement: StockMovement = {
          id: `MOV-${Math.floor(Math.random() * 9000 + 1000)}`,
          date: new Date().toISOString().replace("T", " ").slice(0, 16),
          productId: adjProdId,
          productName: targetProduct.name,
          sku: targetProduct.sku || "AGR-INPUT-SKU",
          type: "Outbound",
          quantity: alloc.qtyDrawn,
          reason: `${adjReason} (Manual Removal from Batch ${alloc.batchNum})`,
          operator: "Operations Manager",
          batchNumber: alloc.batchNum
        };
        setMovements(prev => [newMovement, ...prev]);
      });

      setFeedback(`✓ Removed ${qtyToDeduct} units of ${targetProduct.name} via FIFO logic.`);
      setSuccessBanner(`✓ Manual Adjustment: Deducted ${qtyToDeduct} units from inventory.`);
    }

    // Reset form states
    setAdjQty("");
    setAdjBatchNum("");
    setAdjExpiryDate("");
    setAdjReason("Manual stock count correction");
    
    // Log to Audit Trail
    addAuditEntry(
      "Inventory Stock Adjusted",
      `${adjType === "Inbound" ? "Manual Restock (+)" : "Manual Drawdown (-)"} of ${qty} units for '${targetProduct.name}' (SKU: ${targetProduct.sku || "N/A"}). Reason: ${adjReason}.`,
      "inventory"
    );

    setTimeout(() => setSuccessBanner(""), 5000);
  };

  // Start Stock Audit Session
  const handleStartAudit = () => {
    const initialAuditing: Record<string, number> = {};
    items.forEach(item => {
      initialAuditing[item.id] = item.stock;
    });
    setAuditingItems(initialAuditing);
    setAuditorName("Operations Manager");
    setAuditNotes("");
    setIsAuditActive(true);
    setFeedback("🔍 Stock audit session started. Enter physical counts for all items.");
  };

  // Cancel Active Stock Audit Session
  const handleCancelAudit = () => {
    setIsAuditActive(false);
    setAuditingItems({});
    setFeedback("🚫 Stock audit session cancelled.");
  };

  // Complete Audit & Save Reconciliation report
  const handleSaveAuditReconciliation = () => {
    const auditItemReports: AuditItemReport[] = [];
    let totalDiscrepancy = 0;

    items.forEach(item => {
      const physical = auditingItems[item.id] !== undefined ? auditingItems[item.id] : item.stock;
      const discrepancy = physical - item.stock;
      totalDiscrepancy += discrepancy;

      let status: "Match" | "Surplus" | "Deficit" = "Match";
      if (discrepancy > 0) status = "Surplus";
      else if (discrepancy < 0) status = "Deficit";

      auditItemReports.push({
        productId: item.id,
        productName: item.name,
        sku: item.sku || "AGR-INPUT-SKU",
        systemStock: item.stock,
        physicalStock: physical,
        discrepancy,
        status
      });

      // Apply stock reconciliation
      if (discrepancy < 0) {
        // Deficit: deduct from batches using FIFO
        const deficitQty = Math.abs(discrepancy);
        const productBatches = batches.filter(b => b.productId === item.id && b.quantity > 0);
        const totalAvailable = productBatches.reduce((sum, b) => sum + b.quantity, 0);
        const actualDeduct = Math.min(deficitQty, totalAvailable);

        let remaining = actualDeduct;
        const sortedBatches = [...batches]
          .filter(b => b.productId === item.id)
          .sort((a, b) => {
            if (a.expiryDate && b.expiryDate) {
              return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
            } else if (a.expiryDate) {
              return -1;
            } else if (b.expiryDate) {
              return 1;
            }
            return new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime();
          });

        const updatedBatchMap: Record<string, number> = {};
        const allocations: { batchNum: string; qtyDrawn: number }[] = [];

        for (const b of sortedBatches) {
          if (remaining <= 0) break;
          const draw = Math.min(b.quantity, remaining);
          remaining -= draw;
          updatedBatchMap[b.id] = b.quantity - draw;
          allocations.push({ batchNum: b.batchNumber, qtyDrawn: draw });
        }

        setBatches(prev => prev.map(b => {
          if (updatedBatchMap[b.id] !== undefined) {
            return { ...b, quantity: updatedBatchMap[b.id] };
          }
          return b;
        }));

        // Log movements
        allocations.forEach(alloc => {
          const newMovement: StockMovement = {
            id: `MOV-${Math.floor(Math.random() * 9000 + 1000)}`,
            date: new Date().toISOString().replace("T", " ").slice(0, 16),
            productId: item.id,
            productName: item.name,
            sku: item.sku || "AGR-INPUT-SKU",
            type: "Outbound",
            quantity: alloc.qtyDrawn,
            reason: `Audit Reconciliation: Deficit correction (Batch ${alloc.batchNum})`,
            operator: auditorName,
            batchNumber: alloc.batchNum
          };
          setMovements(prev => [newMovement, ...prev]);
        });

      } else if (discrepancy > 0) {
        // Surplus: add to a new surplus reconciliation batch
        const surplusQty = discrepancy;
        const generatedBatchNum = `BAT-AUDIT-${item.category.toUpperCase().slice(0, 3)}-${Math.floor(Math.random() * 900 + 100)}`;
        
        const newBatch: StockBatch = {
          id: `BAT-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`,
          batchNumber: generatedBatchNum,
          productId: item.id,
          productName: item.name,
          sku: item.sku || "AGR-INPUT-SKU",
          category: item.category,
          quantity: surplusQty,
          initialQuantity: surplusQty,
          manufactureDate: new Date().toISOString().slice(0, 10),
          receivedDate: new Date().toISOString().slice(0, 10),
          expiryDate: ""
        };

        setBatches(prev => [newBatch, ...prev]);

        const newMovement: StockMovement = {
          id: `MOV-${Math.floor(Math.random() * 9000 + 1000)}`,
          date: new Date().toISOString().replace("T", " ").slice(0, 16),
          productId: item.id,
          productName: item.name,
          sku: item.sku || "AGR-INPUT-SKU",
          type: "Inbound",
          quantity: surplusQty,
          reason: `Audit Reconciliation: Surplus correction (Created ${generatedBatchNum})`,
          operator: auditorName,
          batchNumber: generatedBatchNum
        };

        setMovements(prev => [newMovement, ...prev]);
      }
    });

    const newReport: StockAuditReport = {
      id: `AUD-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      auditor: auditorName,
      items: auditItemReports,
      notes: auditNotes || "Completed routine stock audit.",
      totalDiscrepancy
    };

    setAuditHistory(prev => [newReport, ...prev]);
    setIsAuditActive(false);
    setAuditingItems({});
    setFeedback(`📊 Audit completed successfully. Reconciled discrepancies: ${totalDiscrepancy > 0 ? "+" : ""}${totalDiscrepancy} units.`);
    setSuccessBanner(`✓ Stock Audit reconciled. Saved report #${newReport.id}.`);
    
    // Log to Audit Trail
    addAuditEntry(
      "Physical Stock Audit Reconciled",
      `Completed comprehensive stock audit #${newReport.id} by auditor '${auditorName}'. Reconciled net discrepancy of ${totalDiscrepancy} units. Notes: ${auditNotes || "No notes provided"}.`,
      "inventory"
    );

    setTimeout(() => setSuccessBanner(""), 5000);
  };

  // Filters calculation
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.sku || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    
    const threshold = item.lowStockThreshold || 15;
    let matchesAlert = true;
    if (alertFilter === "Low Stock") {
      matchesAlert = item.stock <= threshold && item.stock > 0;
    } else if (alertFilter === "Out of Stock") {
      matchesAlert = item.stock === 0;
    } else if (alertFilter === "Normal") {
      matchesAlert = item.stock > threshold;
    }

    return matchesSearch && matchesCategory && matchesAlert;
  });

  // Filter batches based on filters
  const filteredBatches = batchesWithExpiries.filter(b => {
    const matchesSearch = b.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || b.category === categoryFilter;
    
    let matchesExpiry = true;
    if (expiryWarningFilter === "Expired") {
      matchesExpiry = b.expStatus.daysLeft < 0;
    } else if (expiryWarningFilter === "Critical") {
      matchesExpiry = b.expStatus.daysLeft >= 0 && b.expStatus.daysLeft <= 7;
    } else if (expiryWarningFilter === "Warning") {
      matchesExpiry = b.expStatus.daysLeft > 7 && b.expStatus.daysLeft <= 15;
    } else if (expiryWarningFilter === "Caution") {
      matchesExpiry = b.expStatus.daysLeft > 15 && b.expStatus.daysLeft <= 30;
    } else if (expiryWarningFilter === "Perishable") {
      matchesExpiry = b.expiryDate !== "";
    }

    return matchesSearch && matchesCategory && matchesExpiry;
  });

  // Calculate active suggestions for FIFO
  const selectedFIFODetails = fifoProductId ? calculateFIFOSuggestion(fifoProductId, parseInt(fifoQty) || 0) : null;
  const currentFIFOProduct = items.find(p => p.id === fifoProductId);

  return (
    <div className="space-y-6 text-left">
      
      {/* SUCCESS NOTIFICATION BANNER */}
      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between gap-2 font-semibold text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-emerald-100 text-emerald-600 rounded-full">✓</span>
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner("")} className="text-emerald-500 hover:text-emerald-700 bg-transparent border-0 cursor-pointer">✕</button>
        </div>
      )}

      {/* DASHBOARD STATISTICS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock Value */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 text-left">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Stock Value</p>
            <h3 className="text-xl font-black text-slate-800">₹{totalStockValue.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-600 font-bold">
              {totalStockUnits} total units in storage
            </p>
          </div>
        </div>

        {/* Low Stock Items count */}
        <div className={`border p-4 rounded-2xl shadow-sm flex items-center gap-4 transition-colors ${
          lowStockItems.length > 0 ? "bg-amber-50/50 border-amber-200 text-amber-900" : "bg-white border-slate-100"
        }`}>
          <div className={`p-3 rounded-xl ${lowStockItems.length > 0 ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-slate-50 text-slate-400"}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 text-left flex-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Low Stock Items</p>
            <h3 className="text-xl font-black text-slate-800">{lowStockItems.length}</h3>
            <p className="text-[10px] text-slate-500 font-bold">
              {lowStockItems.length > 0 ? `${lowStockItems.length} SKUs below threshold` : "All items fully stocked"}
            </p>
          </div>
        </div>

        {/* Perishable Stock Expiry Warning count */}
        <div className={`border p-4 rounded-2xl shadow-sm flex items-center gap-4 transition-colors ${
          criticalExpiryBatches.length > 0 || expiredBatches.length > 0 ? "bg-rose-50/50 border-rose-200 text-rose-900" : "bg-white border-slate-100"
        }`}>
          <div className={`p-3 rounded-xl ${criticalExpiryBatches.length > 0 || expiredBatches.length > 0 ? "bg-rose-100 text-rose-600" : "bg-slate-50 text-slate-400"}`}>
            <Hourglass className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 text-left flex-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Critical Expiry (7 Days)</p>
            <h3 className="text-xl font-black text-slate-800">
              {criticalExpiryBatches.length} <span className="text-xs font-semibold text-rose-500">{expiredBatches.length > 0 ? `(${expiredBatches.length} Expired)` : ""}</span>
            </h3>
            <p className="text-[10px] text-rose-600 font-bold">
              {expiredBatches.length > 0 ? "Requires urgent quarantine" : (criticalExpiryBatches.length > 0 ? "FIFO rotation critical" : "No urgent expiries")}
            </p>
          </div>
        </div>

        {/* Upcoming Alerts Log volume */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Bell className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 text-left">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expiry Warning Zone (15-30 Days)</p>
            <h3 className="text-xl font-black text-slate-800">
              {warningExpiryBatches.length + cautionExpiryBatches.length} <span className="text-xs text-slate-400 font-bold">batches</span>
            </h3>
            <p className="text-[10px] text-amber-600 font-bold">
              {warningExpiryBatches.length} warning / {cautionExpiryBatches.length} caution
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH AND ACTION TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-3xs">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU, Batch, Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-black uppercase whitespace-nowrap">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Seeds">Seeds</option>
              <option value="Fertilizers">Fertilizers</option>
              <option value="IoT Sensors">IoT Sensors</option>
              <option value="Machinery">Machinery</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={triggerExpiryBroadcaster}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer border-0 flex items-center gap-1.5"
            title="Dispatch simulated email/SMS warning alerts"
          >
            <Bell className="h-4 w-4 text-amber-500" />
            Check & Send Expiry Alerts
          </button>

          <button
            onClick={() => setIsReceivingStock(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Receive stock (Assign Batch)
          </button>
        </div>
      </div>

      {/* MULTI-TAB NAVIGATION */}
      <div className="flex border-b border-slate-100 pb-0.5">
        <button
          onClick={() => setActiveSubTab("levels")}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeSubTab === "levels"
              ? "border-indigo-600 text-indigo-700 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Sliders className="h-4 w-4 inline mr-1.5" />
          Stock Levels & reorder controls
        </button>

        <button
          onClick={() => setActiveSubTab("batches")}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "batches"
              ? "border-indigo-600 text-indigo-700 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Layers className="h-4 w-4 inline mr-1.5" />
          Batch & Expiry Ledger
          {(criticalExpiryBatches.length > 0 || expiredBatches.length > 0) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("ledger")}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeSubTab === "ledger"
              ? "border-indigo-600 text-indigo-700 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Activity className="h-4 w-4 inline mr-1.5" />
          Stock Movement Ledger
        </button>

        <button
          onClick={() => setActiveSubTab("adjustments")}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeSubTab === "adjustments"
              ? "border-indigo-600 text-indigo-700 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <RefreshCw className="h-4 w-4 inline mr-1.5" />
          Stock Adjustments & Audits
        </button>

        <button
          onClick={() => setActiveSubTab("purchase-orders")}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeSubTab === "purchase-orders"
              ? "border-indigo-600 text-indigo-700 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Calendar className="h-4 w-4 inline mr-1.5" />
          Manufacturing POs
        </button>

        <button
          onClick={() => setActiveSubTab("analytics")}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "analytics"
              ? "border-indigo-600 text-indigo-700 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          📈 Inventory Analytics (8.2)
        </button>
      </div>

      {/* CORE TAB INTERFACES */}
      {activeSubTab === "levels" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main levels control panel */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-indigo-600" />
                Physical Stock Levels & reorder points
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-black uppercase">Stock Alert AlertFilter:</span>
                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Stocks</option>
                  <option value="Low Stock">⚠️ Low Stock Alerts</option>
                  <option value="Out of Stock">🚫 Out of Stock</option>
                  <option value="Normal">✓ Fully Stocked</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-150 text-[10px] uppercase font-black tracking-wider text-slate-500">
                    <th className="p-3 w-5/12">Product Details & SKU</th>
                    <th className="p-3 text-center w-3/12">Physical Stock (Sum)</th>
                    <th className="p-3 text-center w-2/12">Low Stock alert</th>
                    <th className="p-3 text-center w-2/12">Reorder Point</th>
                    <th className="p-3 text-right">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 text-xs">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                        No products found matching specified criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
                      const threshold = item.lowStockThreshold || 15;
                      const reorderPt = item.reorderPoint || 10;
                      
                      const isOutOfStock = item.stock === 0;
                      const isLowStock = item.stock <= threshold && item.stock > 0;
                      const isCriticalReorder = item.stock <= reorderPt && item.stock > 0;

                      let statusBadge = (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black uppercase rounded-md">
                          ✓ OK
                        </span>
                      );
                      if (isOutOfStock) {
                        statusBadge = (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 text-[9px] font-black uppercase rounded-md animate-pulse">
                            🚫 OUT
                          </span>
                        );
                      } else if (isCriticalReorder) {
                        statusBadge = (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[9px] font-black uppercase rounded-md">
                            ⚡ REORDER
                          </span>
                        );
                      } else if (isLowStock) {
                        statusBadge = (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-black uppercase rounded-md">
                            ⚠️ LOW
                          </span>
                        );
                      }

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          {/* Name & SKU */}
                          <td className="p-3 text-left">
                            <p className="font-extrabold text-slate-800 leading-snug">{item.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9.5px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.2 rounded">
                                {item.category}
                              </span>
                              <span className="text-[9.5px] font-mono text-indigo-600 font-bold">
                                SKU: {item.sku || "AGR-INPUT-SKU"}
                              </span>
                            </div>
                          </td>

                          {/* Physical Stock Sum displays */}
                          <td className="p-3 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`font-black font-mono text-sm ${
                                isOutOfStock ? "text-rose-600" : (isLowStock ? "text-amber-600" : "text-slate-800")
                              }`}>
                                {item.stock} <span className="text-[10px] text-slate-400 font-normal">{item.unit || "units"}</span>
                              </span>
                              
                              <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
                                <div 
                                  className={`h-full ${isOutOfStock ? "bg-rose-500" : (isLowStock ? "bg-amber-500" : "bg-emerald-500")}`}
                                  style={{ width: `${Math.min(100, (item.stock / 150) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Alert / Low Stock Point config */}
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              value={threshold}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setItems(prev => prev.map(p => p.id === item.id ? { ...p, lowStockThreshold: val } : p));
                                if (onUpdateItem) onUpdateItem(item.id, { lowStockThreshold: val });
                              }}
                              className="w-14 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-center font-bold text-[11px] font-mono focus:outline-none focus:border-indigo-500"
                            />
                          </td>

                          {/* Reorder Point Config */}
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              value={reorderPt}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setItems(prev => prev.map(p => p.id === item.id ? { ...p, reorderPoint: val } : p));
                                if (onUpdateItem) onUpdateItem(item.id, { reorderPoint: val });
                              }}
                              className="w-14 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-center font-bold text-[11px] font-mono focus:outline-none focus:border-indigo-500"
                            />
                          </td>

                          {/* Status Badge */}
                          <td className="p-3 text-right">
                            <div className="flex flex-col items-end gap-1">
                              {statusBadge}
                              {isOutOfStock && (
                                <button
                                  onClick={() => {
                                    setRecvProdId(item.id);
                                    setIsReceivingStock(true);
                                  }}
                                  className="text-[9px] text-indigo-600 hover:text-indigo-800 font-extrabold underline bg-transparent border-0 cursor-pointer p-0"
                                >
                                  Quick Restock
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column: Auto-Reorder Procurement Suggestions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AUTONOMOUS AUTO-REORDER HUB */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Auto-Reorder Procurement Suggestion
              </h4>

              {items.filter(item => item.stock <= (item.reorderPoint || 10)).length === 0 ? (
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 text-emerald-800 rounded-xl space-y-2">
                  <p className="text-[11px] font-bold">✓ Procurement Status Healthy</p>
                  <p className="text-[10px] text-emerald-600 leading-relaxed">
                    All products are currently stocked above their designated auto-reorder points. No suggested replenishments.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10.5px] text-slate-500 leading-snug">
                    The following items have dropped below their critical reorder points. Approve auto-replenishment to spin up new inbound batches:
                  </p>
                  
                  <div className="space-y-2.5 max-h-[250px] overflow-y-auto">
                    {items
                      .filter(item => item.stock <= (item.reorderPoint || 10))
                      .map(item => {
                        const suggestQty = item.moq || 100;
                        return (
                          <div key={item.id} className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl space-y-2">
                            <div className="flex justify-between items-start gap-1">
                              <div>
                                <p className="font-extrabold text-slate-800 text-[11px] leading-tight">{item.name}</p>
                                <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                                  Current Stock: <strong className="text-amber-700">{item.stock} left</strong> (Reorder: {item.reorderPoint || 10})
                                </p>
                              </div>
                              <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                                Suggest +{suggestQty}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => {
                                // Simulate approving auto-reorder replenishment
                                const catCode = item.category.toUpperCase().slice(0, 3);
                                const rNum = Math.floor(Math.random() * 900 + 100);
                                const generatedBatchNum = `BAT-AUTO-${catCode}-${rNum}`;
                                
                                const newBatch: StockBatch = {
                                  id: `BAT-${Date.now().toString().slice(-4)}`,
                                  batchNumber: generatedBatchNum,
                                  productId: item.id,
                                  productName: item.name,
                                  sku: item.sku || "SKU-AUTO",
                                  category: item.category,
                                  quantity: suggestQty,
                                  initialQuantity: suggestQty,
                                  manufactureDate: "2026-06-01",
                                  receivedDate: "2026-07-08",
                                  expiryDate: (item.category === "Seeds" || item.category === "Fertilizers") ? "2026-10-30" : ""
                                };

                                setBatches(prev => [newBatch, ...prev]);

                                const newMovement: StockMovement = {
                                  id: `MOV-${Math.floor(Math.random() * 9000 + 1000)}`,
                                  date: new Date().toISOString().replace("T", " ").slice(0, 16),
                                  productId: item.id,
                                  productName: item.name,
                                  sku: item.sku || "SKU-AUTO",
                                  type: "Inbound",
                                  quantity: suggestQty,
                                  reason: `Approved Autonomous Procurement Suggestion: Received ${suggestQty} units into Batch ${generatedBatchNum}`,
                                  operator: "Auto-Reorder Hub",
                                  batchNumber: generatedBatchNum
                                };

                                setMovements(prev => [newMovement, ...prev]);
                                setFeedback(`🚀 Procurement Approved: Received ${suggestQty} units for ${item.name} into ${generatedBatchNum}`);
                              }}
                              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase rounded-lg border-0 cursor-pointer shadow-3xs flex items-center justify-center gap-1 transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve restock (+{suggestQty} Units)
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Alerts Logs view */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-amber-500" />
                  Alerts Dispatch History
                </h4>
                <button
                  onClick={() => setAlertsLog([])}
                  className="text-[9px] text-slate-400 hover:text-slate-600 cursor-pointer border-0 bg-transparent flex items-center gap-0.5"
                >
                  <Trash2 className="h-3 w-3" /> Clear
                </button>
              </div>

              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {alertsLog.slice(0, 4).map(log => (
                  <div key={log.id} className="p-2 bg-slate-50 border border-slate-150 rounded-lg space-y-1 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-slate-700 text-[8.5px] uppercase">{log.alertType} Dispatched</span>
                      <span className="text-slate-400 text-[8px] font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600 leading-snug">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeSubTab === "batches" && (
        <div className="space-y-6">
          
          {/* TOP ALERTS & FILTER SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* BATCH EXPIRY WARNING REPORT */}
            <div className="md:col-span-8 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <Hourglass className="h-4.5 w-4.5 text-indigo-600" />
                  Batch Expiry & Health Warning Matrix
                </h3>
                
                {/* Expiry Warning Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-black uppercase whitespace-nowrap">Expiry Status:</span>
                  <select
                    value={expiryWarningFilter}
                    onChange={(e) => setExpiryWarningFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="All">All Batches</option>
                    <option value="Expired">💀 Expired</option>
                    <option value="Critical">🔴 Critical (7 Days)</option>
                    <option value="Warning">🟠 Warning (15 Days)</option>
                    <option value="Caution">🟡 Caution (30 Days)</option>
                    <option value="Perishable">🌾 Perishables only</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-150 text-[10px] uppercase font-black tracking-wider text-slate-500">
                      <th className="p-3">Batch details</th>
                      <th className="p-3">Product Name & SKU</th>
                      <th className="p-3 text-center">Dates (Mfg / Recv)</th>
                      <th className="p-3 text-center">Available Stock</th>
                      <th className="p-3 text-center">Expiry status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 text-xs">
                    {filteredBatches.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                          No stock batches found matching the specified expiry criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBatches.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                          {/* Batch No & ID */}
                          <td className="p-3">
                            <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                              {b.batchNumber}
                            </span>
                            <span className="block text-[8.5px] text-slate-400 mt-1">ID: #{b.id}</span>
                          </td>

                          {/* Product Details */}
                          <td className="p-3 text-left">
                            <p className="font-extrabold text-slate-800 leading-snug">{b.productName}</p>
                            <span className="text-[9.5px] font-mono text-slate-400">SKU: {b.sku}</span>
                          </td>

                          {/* Dates */}
                          <td className="p-3 text-center text-[10.5px]">
                            <p className="text-slate-600 font-bold"><span className="text-slate-400 font-medium">Mfg:</span> {b.manufactureDate || "N/A"}</p>
                            <p className="text-slate-500 mt-0.5"><span className="text-slate-400 font-medium">Recv:</span> {b.receivedDate}</p>
                          </td>

                          {/* Qty */}
                          <td className="p-3 text-center">
                            <span className="font-black font-mono text-slate-800 text-sm">
                              {b.quantity}
                            </span>
                            <span className="text-[9.5px] text-slate-400 font-bold block">
                              of {b.initialQuantity} received
                            </span>
                            {/* Simple visual bar of depletion */}
                            <div className="w-16 bg-slate-100 h-1 rounded-full mx-auto overflow-hidden mt-1">
                              <div 
                                className="h-full bg-indigo-500" 
                                style={{ width: `${Math.min(100, (b.quantity / b.initialQuantity) * 100)}%` }}
                              />
                            </div>
                          </td>

                          {/* Expiry Status */}
                          <td className="p-3 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`px-2 py-1 rounded border text-[9.5px] font-bold ${b.expStatus.color}`}>
                                {b.expStatus.badge === "DURABLE" ? "Durable Product" : b.expiryDate}
                              </span>
                              <span className="text-[9px] text-slate-400 mt-1 block">
                                {b.expStatus.label}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.expStatus.daysLeft < 0 ? (
                                <button
                                  onClick={() => handleDeleteBatch(b.id)}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer border-0 bg-transparent font-bold flex items-center gap-0.5"
                                  title="Quarantine and discard expired stock"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Discard
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setFifoProductId(b.productId);
                                    setActiveSubTab("batches");
                                    // Scroll to FIFO card
                                    const element = document.getElementById("fifo-optimizer-section");
                                    if (element) {
                                      element.scrollIntoView({ behavior: "smooth" });
                                    }
                                  }}
                                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline bg-transparent border-0 cursor-pointer"
                                >
                                  FIFO Route
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FIFO STOCK ROTATION OPTIMIZER WIDGET */}
            <div id="fifo-optimizer-section" className="md:col-span-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                FIFO Stock Rotation Optimizer
              </h4>

              <p className="text-[10.5px] text-slate-500 leading-snug">
                <strong>First In, First Out (FIFO) Auto-Suggestion Engine:</strong> Select a product and specify quantity to draw. The algorithm automatically determines the optimal batch rotation to prevent perishability waste.
              </p>

              {/* FIFO form simulator */}
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-150 space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-black text-slate-500">1. Product to rotate</label>
                  <select
                    value={fifoProductId}
                    onChange={(e) => setFifoProductId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="">-- Choose rotating item --</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.stock} in stock)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-black text-slate-500">2. Quantity to dispatch</label>
                  <input
                    type="number"
                    min="1"
                    value={fifoQty}
                    onChange={(e) => setFifoQty(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Suggestions Breakdown Output */}
              {selectedFIFODetails && currentFIFOProduct ? (
                <div className="space-y-3 animate-fadeIn">
                  <div className="text-xs font-bold border-b border-slate-100 pb-2">
                    FIFO SUGGESTED ALLOCATION QUEUE:
                  </div>

                  {selectedFIFODetails.allocation.length === 0 ? (
                    <div className="text-[10.5px] text-rose-600 font-bold p-3 bg-rose-50 rounded-xl text-center">
                      ⚠️ Error: No active batches found with stock for this product.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="space-y-1.5">
                        {selectedFIFODetails.allocation.map((alloc, idx) => {
                          const status = getExpiryStatus(alloc.batch.expiryDate);
                          return (
                            <div key={alloc.batch.id} className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-lg space-y-1 text-[10.5px]">
                              <div className="flex justify-between items-center font-extrabold text-slate-800">
                                <span className="flex items-center gap-1">
                                  <span className="w-4 h-4 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[9px]">{idx + 1}</span>
                                  Batch {alloc.batch.batchNumber}
                                </span>
                                <span className="text-indigo-700 font-black">Draw {alloc.qtyDrawn} units</span>
                              </div>
                              <div className="flex justify-between items-center text-[9.5px] text-slate-400">
                                <span>Expires: {alloc.batch.expiryDate || "Durable"} | {status.label}</span>
                                <span className="font-mono text-slate-500">Remaining after: {alloc.batch.quantity - alloc.qtyDrawn}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Unfulfilled Alert */}
                      {selectedFIFODetails.unfulfilled > 0 && (
                        <div className="p-2 bg-red-50 border border-red-200 text-red-800 text-[10px] rounded-lg">
                          🚨 Warning: Inventory shortage! <strong>{selectedFIFODetails.unfulfilled} units</strong> cannot be fulfilled even after drawing all available batches.
                        </div>
                      )}

                      {/* Summary Box */}
                      <div className="p-2.5 bg-slate-100 rounded-xl space-y-1 text-[10px] text-slate-500 font-bold">
                        <div className="flex justify-between">
                          <span>Total available across batches:</span>
                          <span className="text-slate-800">{selectedFIFODetails.totalAvailable} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Allocated units:</span>
                          <span className="text-emerald-600 font-extrabold">{Math.min(selectedFIFODetails.totalAvailable, parseInt(fifoQty) || 0)} units</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleExecuteFIFOOutbound(fifoProductId, parseInt(fifoQty) || 0, "Outbound Shipment")}
                        disabled={selectedFIFODetails.allocation.length === 0}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl border-0 cursor-pointer shadow-3xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <ArrowDownLeft className="h-4 w-4" />
                        Execute FIFO Outbound Dispatch
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-[10.5px] italic font-bold bg-slate-50 border border-slate-100 rounded-xl">
                  Select a product above to generate auto-rotation recommendations.
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {activeSubTab === "ledger" && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-indigo-600" />
                Unified Stock Movement Ledger & Audit Trail
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Full cryptographic history logs of all inbound batches, custom adjustments, expirations, and FIFO outbounds.
              </p>
            </div>
            <button
              onClick={() => setMovements([])}
              className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer border-0 bg-transparent flex items-center gap-1 self-end font-bold"
            >
              <Trash2 className="h-3.5 w-3.5" /> Reset Audit Trail
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-150 text-[10px] uppercase font-black tracking-wider text-slate-500">
                  <th className="p-2.5">TX ID</th>
                  <th className="p-2.5">Date & Time</th>
                  <th className="p-2.5">Product Name & SKU</th>
                  <th className="p-2.5 text-center">Batch Number</th>
                  <th className="p-2.5 text-center">Movement Type</th>
                  <th className="p-2.5 text-center">Quantity</th>
                  <th className="p-2.5">Transaction Reason / Reference</th>
                  <th className="p-2.5 text-right">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold text-xs">
                {movements.map(mov => {
                  let badge = (
                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[8px] font-black uppercase rounded">
                      Adjustment
                    </span>
                  );
                  if (mov.type === "Inbound") {
                    badge = (
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase rounded flex items-center justify-center gap-0.5 w-16 mx-auto">
                        <ArrowUpRight className="h-2.5 w-2.5" /> Inbound
                      </span>
                    );
                  } else if (mov.type === "Outbound") {
                    badge = (
                      <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[8px] font-black uppercase rounded flex items-center justify-center gap-0.5 w-16 mx-auto">
                        <ArrowDownLeft className="h-2.5 w-2.5" /> Outbound
                      </span>
                    );
                  } else if (mov.type === "Return") {
                    badge = (
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[8px] font-black uppercase rounded flex items-center justify-center gap-0.5 w-16 mx-auto font-black">
                        <RefreshCw className="h-2.5 w-2.5" /> Return
                      </span>
                    );
                  }

                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2.5 font-mono text-[10.5px] text-slate-400">#{mov.id}</td>
                      <td className="p-2.5 font-mono text-[10.5px] text-slate-500">{mov.date}</td>
                      <td className="p-2.5 text-left">
                        <span className="font-extrabold text-slate-800 block">{mov.productName}</span>
                        <span className="text-[9.5px] font-mono text-slate-400">SKU: {mov.sku}</span>
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold">
                        {mov.batchNumber ? (
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                            {mov.batchNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">-</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center">{badge}</td>
                      <td className="p-2.5 text-center">
                        <span className={`font-black font-mono ${
                          mov.type === "Inbound" || mov.type === "Return" ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          {mov.type === "Inbound" || mov.type === "Return" ? "+" : "-"}{mov.quantity}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-600 italic font-medium leading-relaxed">{mov.reason}</td>
                      <td className="p-2.5 text-right font-mono text-slate-400 text-[10px]">{mov.operator}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === "adjustments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMN 1: MANUAL STOCK ADJUSTMENTS FORM */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 text-left">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <Sliders className="h-4.5 w-4.5 text-indigo-600" />
                  Manual Stock Adjustment (Add/Remove)
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Directly adjust stock quantities and update movements ledger. Deducts or creates batches automatically.
                </p>
              </div>

              <form onSubmit={handleManualStockAdjustment} className="space-y-4">
                {/* Adjustment Type Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Adjustment Type</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setAdjType("Inbound");
                        setAdjReason("Purchase order receipt");
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all border-0 flex items-center justify-center gap-1 ${
                        adjType === "Inbound"
                          ? "bg-white text-emerald-600 shadow-xs"
                          : "text-slate-400 hover:text-slate-600 bg-transparent"
                      }`}
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Add Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAdjType("Outbound");
                        setAdjReason("Damage / Spoilage");
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all border-0 flex items-center justify-center gap-1 ${
                        adjType === "Outbound"
                          ? "bg-white text-rose-600 shadow-xs"
                          : "text-slate-400 hover:text-slate-600 bg-transparent"
                      }`}
                    >
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                      Remove Stock
                    </button>
                  </div>
                </div>

                {/* Product Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Select Product</label>
                  <select
                    value={adjProdId}
                    onChange={(e) => {
                      setAdjProdId(e.target.value);
                      const prod = items.find(p => p.id === e.target.value);
                      if (prod) {
                        setAdjIsPerishable(prod.category === "Seeds" || prod.category === "Fertilizers");
                      }
                    }}
                    required
                    className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl font-medium focus:outline-none transition-colors"
                  >
                    <option value="">-- Choose Agricultural Input SKU --</option>
                    {items.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Current: {p.stock} {p.unit || "units"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Quantity to {adjType === "Inbound" ? "Add" : "Remove"}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Enter stock quantity..."
                    value={adjQty}
                    onChange={(e) => setAdjQty(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl font-medium focus:outline-none transition-colors"
                  />
                </div>

                {/* Optional Batch fields for addition */}
                {adjType === "Inbound" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">
                        Batch Number <span className="text-slate-400 lowercase italic">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. BAT-POT-2026 (Auto-generated if blank)"
                        value={adjBatchNum}
                        onChange={(e) => setAdjBatchNum(e.target.value)}
                        className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl font-medium focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="adjIsPerishable"
                        checked={adjIsPerishable}
                        onChange={(e) => setAdjIsPerishable(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                      />
                      <label htmlFor="adjIsPerishable" className="text-[10px] text-slate-500 font-bold uppercase tracking-wide cursor-pointer select-none">
                        Perishable Item (Seeds / Fertilizers)
                      </label>
                    </div>

                    {adjIsPerishable && (
                      <div className="space-y-1 animate-slideDown">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">
                          Expiry Date <span className="text-slate-400 lowercase italic">(optional)</span>
                        </label>
                        <input
                          type="date"
                          value={adjExpiryDate}
                          onChange={(e) => setAdjExpiryDate(e.target.value)}
                          className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl font-medium focus:outline-none transition-colors"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Reason Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Reason for Adjustment</label>
                  <select
                    value={adjReason}
                    onChange={(e) => setAdjReason(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl font-medium focus:outline-none transition-colors"
                  >
                    {adjType === "Inbound" ? (
                      <>
                        <option value="Purchase order receipt">Purchase Order Receipt</option>
                        <option value="Customer Return">Customer Return / Re-entry</option>
                        <option value="Inventory Restock">Supplier Buffer Restock</option>
                        <option value="Found Item">Found Excess in Warehouse</option>
                        <option value="Initial stock seeding">Initial Stock Seeding</option>
                        <option value="Other inbound correction">Other Inbound Reason</option>
                      </>
                    ) : (
                      <>
                        <option value="Damage / Spoilage">Warehouse Damage / Spoilage</option>
                        <option value="Expired Stock Disposal">Expired Product Disposal</option>
                        <option value="Theft or Missing units">Theft / Unexplained Loss</option>
                        <option value="Return to supplier">Return to Original Supplier</option>
                        <option value="Customer order dispatch">Manual Customer Dispatch</option>
                        <option value="Other outbound correction">Other Outbound Reason</option>
                      </>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!adjProdId || !adjQty}
                  className={`w-full py-3 text-xs font-black uppercase tracking-wider text-white rounded-xl transition-all cursor-pointer border-0 shadow-sm flex items-center justify-center gap-1.5 ${
                    !adjProdId || !adjQty
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : adjType === "Inbound"
                        ? "bg-emerald-600 hover:bg-emerald-700 active:scale-98"
                        : "bg-rose-600 hover:bg-rose-700 active:scale-98"
                  }`}
                >
                  {adjType === "Inbound" ? (
                    <>
                      <Plus className="h-4 w-4" /> Add Stock
                    </>
                  ) : (
                    <>
                      <Minus className="h-4 w-4" /> Remove Stock
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* COLUMN 2: ACTIVE STOCK AUDIT PANEL */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 text-left flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                      <Layers className="h-4.5 w-4.5 text-indigo-600" />
                      Physical Stock Audit & Reconciliation
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Perform routine stock count audits, calculate discrepancies, and auto-reconcile batches with audit slips.
                    </p>
                  </div>

                  {isAuditActive && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[9px] font-black uppercase rounded-lg animate-pulse flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Audit Active
                    </span>
                  )}
                </div>

                {!isAuditActive ? (
                  <div className="py-12 text-center space-y-4 max-w-sm mx-auto">
                    <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                      <RefreshCw className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-sm">Start an Audit Session</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        A stock audit compares system inventory levels with a physical hand count. Completing an audit generates a permanent report and auto-corrects system balances using FIFO.
                      </p>
                    </div>
                    <button
                      onClick={handleStartAudit}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 shadow-xs active:scale-98"
                    >
                      Initialize Stock Audit
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 mt-3 flex-1 flex flex-col justify-between">
                    {/* Auditor config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase">Auditor Name</label>
                        <input
                          type="text"
                          required
                          value={auditorName}
                          onChange={(e) => setAuditorName(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-150 rounded-lg font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 font-bold uppercase">Audit Scope/Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. Q3 seed storage check..."
                          value={auditNotes}
                          onChange={(e) => setAuditNotes(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-150 rounded-lg font-semibold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Table of items to count */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto mt-2">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[9px] uppercase font-bold text-slate-500">
                            <th className="p-2">Item SKU & Name</th>
                            <th className="p-2 text-center">System Stock</th>
                            <th className="p-2 text-center w-24">Physical Count</th>
                            <th className="p-2 text-right">Discrepancy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {items.map(item => {
                            const sysStock = item.stock;
                            const physical = auditingItems[item.id] !== undefined ? auditingItems[item.id] : sysStock;
                            const discrepancy = physical - sysStock;

                            return (
                              <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="p-2 font-bold text-slate-800">
                                  <span className="block truncate max-w-[200px]">{item.name}</span>
                                  <span className="text-[9px] font-mono text-slate-400">{item.sku || `SKU-${item.id}`}</span>
                                </td>
                                <td className="p-2 text-center font-mono font-bold text-slate-500">{sysStock}</td>
                                <td className="p-1">
                                  <input
                                    type="number"
                                    min="0"
                                    required
                                    value={physical}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      setAuditingItems(prev => ({ ...prev, [item.id]: val }));
                                    }}
                                    className="w-full text-center text-xs p-1 bg-indigo-50/50 hover:bg-indigo-100/50 border border-indigo-100 rounded-lg font-bold text-indigo-700 focus:outline-none focus:border-indigo-500"
                                  />
                                </td>
                                <td className="p-2 text-right">
                                  {discrepancy === 0 ? (
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Match</span>
                                  ) : discrepancy > 0 ? (
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono">+{discrepancy} (Surplus)</span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-mono">{discrepancy} (Deficit)</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
                      <button
                        type="button"
                        onClick={handleCancelAudit}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-xl transition-all cursor-pointer border-0"
                      >
                        Cancel Audit
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleSaveAuditReconciliation}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 shadow-xs flex items-center gap-1.5 active:scale-98"
                      >
                        <Check className="h-4 w-4" /> Complete & Reconcile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* AUDIT RECONCILIATION HISTORY LOGS */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 text-left">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-indigo-600" />
                Permanent Audit Reconciliation Logs
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Archived stock reconciliation reports with discrepancy value tallies. Click details to generate compliance slips.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-150 text-[10px] uppercase font-black tracking-wider text-slate-500">
                    <th className="p-2.5">Audit Slip ID</th>
                    <th className="p-2.5">Execution Date</th>
                    <th className="p-2.5">Authorized Auditor</th>
                    <th className="p-2.5 text-center">Items Audited</th>
                    <th className="p-2.5 text-center">Discrepancy Tally</th>
                    <th className="p-2.5">Scope Notes</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold text-xs">
                  {auditHistory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 italic font-medium">
                        No previous stock audit reports are currently archived.
                      </td>
                    </tr>
                  ) : (
                    auditHistory.map(report => {
                      return (
                        <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-2.5 font-mono text-[11px] text-indigo-600 font-bold">#{report.id}</td>
                          <td className="p-2.5 font-mono text-[10.5px] text-slate-500">{report.date}</td>
                          <td className="p-2.5 text-slate-800 font-bold">{report.auditor}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-600">{report.items.length}</td>
                          <td className="p-2.5 text-center">
                            {report.totalDiscrepancy === 0 ? (
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">Fully Reconciled</span>
                            ) : report.totalDiscrepancy > 0 ? (
                              <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded font-mono">+{report.totalDiscrepancy} units</span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded font-mono">{report.totalDiscrepancy} units</span>
                            )}
                          </td>
                          <td className="p-2.5 text-slate-500 italic max-w-[200px] truncate">{report.notes || "-"}</td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => setSelectedAuditReport(report)}
                              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg border-0 cursor-pointer transition-colors"
                            >
                              View Slip
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "purchase-orders" && (
        <div className="space-y-6 animate-fadeIn">
          {/* HEADER BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="text-left">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-indigo-600" />
                Manufacturing Purchase Orders (POs)
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Manage, draft, and track purchase orders with external manufacturers. Receive stocks and auto-generate inventory batches.
              </p>
            </div>
            <button
              onClick={() => {
                // Set initial expected delivery to 7 days from now
                const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
                setPoExpectedDeliveryDate(nextWeek);
                setIsCreatingPO(true);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 shadow-xs flex items-center gap-1.5 self-start sm:self-center active:scale-98"
            >
              <Plus className="h-4 w-4" />
              Create Purchase Order
            </button>
          </div>

          {/* LIST & FILTERS CONTAINER */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Purchase Order Archives</h4>
                <p className="text-[10px] text-slate-400">Archived manufacturing contracts, current status tracking, and receipt logs.</p>
              </div>
              
              {/* Dynamic summary count */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-bold">
                  All ({purchaseOrders.length})
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg font-bold">
                  Confirmed ({purchaseOrders.filter(p => p.status === "Confirmed").length})
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg font-bold">
                  Received ({purchaseOrders.filter(p => p.status === "Received").length})
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg font-bold">
                  Draft ({purchaseOrders.filter(p => p.status === "Draft").length})
                </span>
              </div>
            </div>

            {/* PO GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {purchaseOrders.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-400 italic font-medium">
                  No purchase orders found in records. Click "Create Purchase Order" to get started.
                </div>
              ) : (
                purchaseOrders.map(po => {
                  const poTotalValue = po.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                  
                  return (
                    <div key={po.id} className="border border-slate-150 hover:border-slate-300 rounded-2xl p-5 bg-slate-50/30 transition-all flex flex-col justify-between space-y-4">
                      
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                              #{po.id}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Created: {po.dateCreated}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-sm mt-1">{po.supplierName}</h4>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide border ${
                            po.status === "Received"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : po.status === "Confirmed"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : po.status === "Sent"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : po.status === "Cancelled"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            {po.status}
                          </span>
                        </div>
                      </div>

                      {/* Info lines */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold bg-white border border-slate-100 p-3 rounded-xl shadow-xs">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">Expected Delivery</p>
                          <p className="text-slate-700 flex items-center gap-1 mt-0.5">
                            <Hourglass className="h-3.5 w-3.5 text-slate-400" />
                            {po.expectedDeliveryDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">Total Order Cost</p>
                          <p className="text-indigo-600 font-extrabold mt-0.5">
                            ₹{poTotalValue.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Items table */}
                      <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-100">
                              <th className="p-2">Item Name & SKU</th>
                              <th className="p-2 text-center">Qty</th>
                              <th className="p-2 text-right">Price</th>
                              <th className="p-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 text-slate-600">
                            {po.items.map((it, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="p-2 font-semibold text-slate-800">
                                  <span className="block truncate max-w-[180px]">{it.productName}</span>
                                  <span className="text-[9px] font-mono text-slate-400">{it.sku}</span>
                                </td>
                                <td className="p-2 text-center font-mono font-bold text-slate-500">{it.quantity}</td>
                                <td className="p-2 text-right font-mono">₹{it.price}</td>
                                <td className="p-2 text-right font-mono font-bold text-slate-700">₹{(it.quantity * it.price).toLocaleString("en-IN")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Optional Notes */}
                      {po.notes && (
                        <p className="text-[10px] text-slate-400 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <strong>Note:</strong> {po.notes}
                        </p>
                      )}

                      {/* Footer Actions on Card */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                        {po.status !== "Received" && po.status !== "Cancelled" ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 font-black uppercase">Status:</span>
                            <select
                              value={po.status}
                              onChange={(e) => handleChangePoStatus(po.id, e.target.value as any)}
                              className="bg-white border border-slate-200 hover:border-indigo-400 text-[11px] font-bold rounded-lg px-2 py-1 focus:outline-none text-slate-700 cursor-pointer"
                            >
                              <option value="Draft">Draft</option>
                              <option value="Sent">Sent</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Received">Received (Receive Stock)</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 italic">
                            {po.status === "Received" ? "✓ Inventory Batch Seeding Completed" : "Order Cancelled"}
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          {po.status !== "Received" && po.status !== "Cancelled" && (
                            <button
                              onClick={() => handleLaunchReceivePo(po)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wide rounded-lg cursor-pointer border-0 shadow-xs flex items-center gap-1 active:scale-98"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Receive Stock
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePurchaseOrder(po.id)}
                            className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded-lg border-0 cursor-pointer transition-colors"
                            title="Delete PO Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "analytics" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Intro Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 shrink-0 text-left">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-black text-indigo-600 tracking-wider bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full inline-block">Enterprise Stock Intelligence</span>
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-indigo-600" />
                Inventory Analytics Dashboard (8.2 Requirements)
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold leading-tight">
                Real-time visual monitoring of stock velocity, capital valuations, low-stocks, and FIFO batch expiries.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Total Stock Value */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Total Stock Value</span>
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                  ₹{totalStockValue.toLocaleString()}
                </h3>
                <p className="text-[9.5px] text-slate-500 font-bold">
                  Capital value tied in <span className="font-mono">{totalStockUnits.toLocaleString()}</span> units
                </p>
              </div>
            </div>

            {/* Stock Turnover Speed */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Avg Days to Sell</span>
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-indigo-600 tracking-tight font-mono">
                  {avgDaysToSell} <span className="text-[10px] text-slate-400 font-sans font-black">DAYS</span>
                </h3>
                <p className="text-[9.5px] text-slate-500 font-bold">
                  {fastMovers.length} fast movers | {slowMovers.length} slow movers
                </p>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Stock Deficits</span>
                <div className={`p-1.5 rounded-lg ${outOfStockItems.length > 0 ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                  {outOfStockItems.length} <span className="text-xs font-bold text-rose-500">OOS</span> / {lowStockItems.length} <span className="text-xs font-bold text-amber-500">Low</span>
                </h3>
                <p className="text-[9.5px] text-slate-500 font-bold">
                  Items requiring urgent purchase/restock orders
                </p>
              </div>
            </div>

            {/* Expiring Batches Alerts */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-3xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Expiring Batches (15d)</span>
                <div className={`p-1.5 rounded-lg ${expiredBatches.length > 0 || criticalExpiryBatches.length > 0 ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-slate-50 text-slate-500"}`}>
                  <Hourglass className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                  {expiringBatchesCount} <span className="text-xs font-bold text-rose-500">{expiredBatches.length > 0 ? `(${expiredBatches.length} Expired)` : ""}</span>
                </h3>
                <p className="text-[9.5px] text-rose-600 font-bold">
                  {expiredBatches.length > 0 ? "Immediate quarantine required!" : (criticalExpiryBatches.length > 0 ? "Urgent FIFO stock rotation!" : "No urgent expiries")}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Chart: Stock Value by Category */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex flex-col space-y-3 h-[320px]">
              <div className="text-left">
                <h4 className="text-[11px] uppercase font-black text-slate-500 tracking-wider">Capital Value by Category</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Tied asset liquidity values in rupees (₹)</p>
              </div>
              <div className="flex-1 min-h-0 relative flex items-center justify-center text-[10px] font-bold">
                {stockByCategoryValue.every(s => s.value === 0) ? (
                  <div className="text-slate-400 italic">No capital value in inventory</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockByCategoryValue.filter(s => s.value > 0)}
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {stockByCategoryValue.filter(s => s.value > 0).map((entry, index) => {
                          const COLORS_PIE = ["#4f46e5", "#10b981", "#f59e0b", "#3b82f6"];
                          return <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />;
                        })}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Stock Value"]} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "9.5px", fontWeight: "bold" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Right Chart: Stock Turnover Speed by Product */}
            <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex flex-col space-y-3 h-[320px]">
              <div className="text-left">
                <h4 className="text-[11px] uppercase font-black text-slate-500 tracking-wider">Stock Turnover (Days to Sell)</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Product inventory velocity (shorter is faster)</p>
              </div>
              <div className="flex-1 min-h-0 text-[10px] font-bold">
                {turnoverMetrics.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
                    No product turnover metrics available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={turnoverMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" tickFormatter={(v) => v.length > 12 ? `${v.slice(0, 12)}...` : v} />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip formatter={(value: any) => [`${value} days`, "Time to Sell"]} />
                      <Bar dataKey="daysToSell" fill="#4f46e5">
                        {turnoverMetrics.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.isFastMover ? "#10b981" : "#f59e0b"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Table Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Turnover Table */}
            <div className="lg:col-span-8 bg-white p-5 border border-slate-200 rounded-2xl shadow-3xs space-y-3 text-left">
              <div>
                <h4 className="text-[11px] uppercase font-black text-slate-500 tracking-wider">Product Sales Velocity Analysis</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Classification of Slow vs Fast Moving Agricultural inputs</p>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                <div className="bg-slate-50/70 p-2.5 grid grid-cols-12 text-[8.5px] font-black uppercase text-slate-500">
                  <div className="col-span-5">Product Details & Category</div>
                  <div className="col-span-2 text-center">Unit Stock</div>
                  <div className="col-span-2 text-center">Sales Ratio</div>
                  <div className="col-span-3 text-right">Days to Sell</div>
                </div>

                {turnoverMetrics.map(item => (
                  <div key={item.id} className="p-3 grid grid-cols-12 items-center font-bold text-slate-700 hover:bg-slate-50/30 transition-colors">
                    <div className="col-span-5 text-left">
                      <p className="font-extrabold text-slate-800 line-clamp-1">{item.name}</p>
                      <span className="text-[9px] text-slate-400 font-semibold">{item.category}</span>
                    </div>
                    
                    <div className="col-span-2 text-center font-mono font-black text-slate-800">
                      {item.stock}
                    </div>

                    <div className="col-span-2 text-center font-mono">
                      {item.turnoverRatio}x <span className="text-[9px] text-slate-400 font-sans block leading-none">Turnover</span>
                    </div>

                    <div className="col-span-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        item.isFastMover
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {item.isFastMover ? "⚡ Fast" : "🐢 Slow"} ({item.daysToSell}d)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Alerts Action Panel */}
            <div className="lg:col-span-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-3xs space-y-3 text-left">
              <div>
                <h4 className="text-[11px] uppercase font-black text-slate-500 tracking-wider">Unified Stock Action Center</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Consolidated low stock, expired batches, and out-of-stock items</p>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {/* OOS List */}
                {items.filter(i => (i.stock || 0) === 0).map(i => (
                  <div key={i.id} className="p-2.5 bg-rose-50/40 border border-rose-100 rounded-xl flex items-start gap-2 text-xs">
                    <ShieldAlert className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                    <div className="text-left">
                      <p className="font-extrabold text-rose-800 line-clamp-1">{i.name}</p>
                      <p className="text-[9.5px] text-rose-600 font-bold leading-tight">OUT OF STOCK (Reorder immediately)</p>
                    </div>
                  </div>
                ))}

                {/* Low Stock List */}
                {items.filter(i => {
                  const threshold = i.lowStockThreshold || 15;
                  return (i.stock || 0) <= threshold && (i.stock || 0) > 0;
                }).map(i => (
                  <div key={i.id} className="p-2.5 bg-amber-50/40 border border-amber-100 rounded-xl flex items-start gap-2 text-xs">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="text-left">
                      <p className="font-extrabold text-amber-800 line-clamp-1">{i.name}</p>
                      <p className="text-[9.5px] text-amber-600 font-bold leading-tight">Low Stock: {i.stock} left (Threshold: {i.lowStockThreshold || 15})</p>
                    </div>
                  </div>
                ))}

                {/* Expiring Batches list */}
                {batchesWithExpiries.filter(b => b.expStatus.daysLeft <= 15).map(b => (
                  <div key={b.id} className="p-2.5 bg-indigo-50/40 border border-indigo-100 rounded-xl flex items-start gap-2 text-xs">
                    <Hourglass className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div className="text-left">
                      <p className="font-extrabold text-indigo-900 line-clamp-1">{b.productName}</p>
                      <p className="text-[9.5px] text-indigo-700 font-bold leading-tight">
                        Batch <span className="font-mono">{b.batchNumber}</span>: {b.expStatus.label}
                      </p>
                    </div>
                  </div>
                ))}

                {items.filter(i => (i.stock || 0) === 0).length === 0 &&
                 items.filter(i => (i.stock || 0) <= (i.lowStockThreshold || 15) && (i.stock || 0) > 0).length === 0 &&
                 batchesWithExpiries.filter(b => b.expStatus.daysLeft <= 15).length === 0 && (
                  <div className="p-8 text-center text-slate-400 italic text-xs">
                    ✓ No critical stock or batch warnings found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAuditReport && (
        <div className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  Inventory Audit Slip #{selectedAuditReport.id}
                </h4>
                <p className="text-[10px] text-slate-400">
                  GST-Compliant Agricultural Supply Stock Count Verification Tally
                </p>
              </div>
              <button
                onClick={() => setSelectedAuditReport(null)}
                className="text-slate-400 hover:text-slate-600 border-0 bg-transparent text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Audit Date & Time</p>
                <p className="text-slate-800">{selectedAuditReport.date}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Authorized Auditor</p>
                <p className="text-slate-800">{selectedAuditReport.auditor}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px] text-slate-400 font-bold uppercase">Audit Scope Notes</p>
                <p className="text-slate-800 italic">{selectedAuditReport.notes || "Routine physical warehouse stock verify."}</p>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-500">
                    <th className="p-2.5">Input Item & SKU</th>
                    <th className="p-2.5 text-center">System Qty</th>
                    <th className="p-2.5 text-center">Physical Qty</th>
                    <th className="p-2.5 text-right">Discrepancy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {selectedAuditReport.items.map(it => {
                    return (
                      <tr key={it.productId} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-2.5">
                          <span className="font-bold text-slate-800 block">{it.productName}</span>
                          <span className="text-[9.5px] font-mono text-slate-400">SKU: {it.sku}</span>
                        </td>
                        <td className="p-2.5 text-center font-mono font-medium">{it.systemStock}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-indigo-600">{it.physicalStock}</td>
                        <td className="p-2.5 text-right">
                          {it.discrepancy === 0 ? (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-black uppercase">Match</span>
                          ) : it.discrepancy > 0 ? (
                            <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-mono font-black">+{it.discrepancy} (Surplus)</span>
                          ) : (
                            <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-mono font-black">{it.discrepancy} (Deficit)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="text-xs">
                <span className="text-slate-400 font-bold uppercase text-[9px] block">Overall Audit Tally:</span>
                <span className={`font-black text-sm font-mono ${selectedAuditReport.totalDiscrepancy === 0 ? "text-emerald-600" : selectedAuditReport.totalDiscrepancy > 0 ? "text-indigo-600" : "text-rose-600"}`}>
                  {selectedAuditReport.totalDiscrepancy > 0 ? "+" : ""}{selectedAuditReport.totalDiscrepancy} units total discrepancy
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Simulates report download
                    const text = `AgriConnect Stock Audit Slip #${selectedAuditReport.id}\nAuditor: ${selectedAuditReport.auditor}\nDate: ${selectedAuditReport.date}\nNotes: ${selectedAuditReport.notes}\nItems:\n` + 
                      selectedAuditReport.items.map(i => `${i.productName} (${i.sku}) | System: ${i.systemStock} | Physical: ${i.physicalStock} | Discrepancy: ${i.discrepancy}`).join("\n");
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `audit-report-${selectedAuditReport.id}.txt`;
                    link.click();
                    setFeedback("✓ Downloaded audit report successfully as TXT.");
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0"
                >
                  Download Report
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAuditReport(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0"
                >
                  Close Tally
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PURCHASE ORDER MODAL OVERLAY */}
      {isCreatingPO && (
        <div className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Draft New Manufacturing Purchase Order
                </h4>
                <p className="text-[10px] text-slate-400">
                  Track manufacturing pipeline with custom price sheets and delivery scheduling.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingPO(false)}
                className="text-slate-400 hover:text-slate-600 border-0 bg-transparent text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreatePurchaseOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Supplier Name */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Supplier / Manufacturer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AgriSynth Chemical Lab Inc"
                    value={poSupplierName}
                    onChange={(e) => setPoSupplierName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl font-medium focus:outline-none transition-colors focus:border-indigo-500 text-left"
                  />
                </div>

                {/* Expected Delivery Date */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Expected Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={poExpectedDeliveryDate}
                    onChange={(e) => setPoExpectedDeliveryDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl font-medium focus:outline-none transition-colors focus:border-indigo-500 text-left"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Initial PO Status</label>
                  <select
                    value={poStatus}
                    onChange={(e) => setPoStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl font-medium focus:outline-none transition-colors focus:border-indigo-500 text-left"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent (Awaiting confirmation)</option>
                    <option value="Confirmed">Confirmed (In production)</option>
                    <option value="Received">Received (Instantly seed stock)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Scope Notes / Remarks <span className="text-slate-400 lowercase italic">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Requesting premium organic certification slips..."
                    value={poNotes}
                    onChange={(e) => setPoNotes(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl font-medium focus:outline-none transition-colors focus:border-indigo-500 text-left"
                  />
                </div>
              </div>

              {/* Dynamic Items Rows */}
              <div className="space-y-2 border-t border-slate-100 pt-3 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Purchase Order Items</label>
                  <button
                    type="button"
                    onClick={() => setPoItems(prev => [...prev, { productId: "", quantity: 10, price: 50 }])}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 border-0 bg-transparent cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Item Line
                  </button>
                </div>

                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                  {poItems.map((itemRow, idx) => {
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 animate-slideDown">
                        
                        {/* Select Product */}
                        <div className="flex-1 min-w-[120px]">
                          <select
                            value={itemRow.productId}
                            required
                            onChange={(e) => {
                              const prodId = e.target.value;
                              const matched = items.find(p => p.id === prodId);
                              setPoItems(prev => prev.map((r, i) => {
                                if (i === idx) {
                                  return {
                                    ...r,
                                    productId: prodId,
                                    price: matched ? (matched.price || 100) : 100
                                  };
                                }
                                return r;
                              }));
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                          >
                            <option value="">-- Choose Product SKU --</option>
                            {items.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.sku || `SKU-${p.id}`})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            required
                            placeholder="Qty"
                            value={itemRow.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setPoItems(prev => prev.map((r, i) => {
                                if (i === idx) return { ...r, quantity: val };
                                return r;
                              }));
                            }}
                            className="w-full text-center text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-bold"
                          />
                        </div>

                        {/* Price per unit */}
                        <div className="w-24">
                          <div className="relative">
                            <span className="absolute left-1.5 top-1.5 text-[10px] text-slate-400 font-bold">₹</span>
                            <input
                              type="number"
                              min="0"
                              required
                              placeholder="Price"
                              value={itemRow.price}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setPoItems(prev => prev.map((r, i) => {
                                  if (i === idx) return { ...r, price: val };
                                  return r;
                                }));
                              }}
                              className="w-full pl-4 pr-1 text-center text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-semibold text-emerald-600"
                            />
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          disabled={poItems.length === 1}
                          onClick={() => setPoItems(prev => prev.filter((_, i) => i !== idx))}
                          className={`p-1.5 rounded-lg border-0 cursor-pointer ${
                            poItems.length === 1
                              ? "text-slate-300 cursor-not-allowed"
                              : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation Row */}
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs font-bold text-slate-700">
                <span>Calculated Est. Total Cost:</span>
                <span className="text-sm text-indigo-700 font-black">
                  ₹{poItems.reduce((sum, r) => sum + ((r.quantity || 0) * (r.price || 0)), 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingPO(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-xl transition-all cursor-pointer border-0"
                >
                  Discard Draft
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 shadow-xs active:scale-98"
                >
                  Finalize & Save Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE RECEIVE STOCK WIZARD MODAL */}
      {receivingPo && (
        <div className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <Check className="h-5 w-5 text-emerald-600" />
                  Receive Manufacturing Stock: PO #{receivingPo.id}
                </h4>
                <p className="text-[10px] text-slate-400">
                  Update inventory levels, designate custom manufacture batch numbers, and verify perishability expiry logs.
                </p>
              </div>
              <button
                onClick={() => setReceivingPo(null)}
                className="text-slate-400 hover:text-slate-600 border-0 bg-transparent text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleConfirmReceivePo} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                <p><strong>Manufacturer:</strong> {receivingPo.supplierName}</p>
                <p><strong>Expected Delivery:</strong> {receivingPo.expectedDeliveryDate}</p>
                {receivingPo.notes && <p><strong>PO Notes:</strong> {receivingPo.notes}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configure Batch details per Item</label>
                
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {poReceiveItems.map((itemRecv, idx) => {
                    return (
                      <div key={idx} className="border border-slate-150 p-3.5 rounded-2xl bg-white space-y-3 shadow-xs text-left">
                        {/* Name Header */}
                        <div className="flex items-start justify-between border-b border-slate-50 pb-2 text-left">
                          <div className="text-left">
                            <h5 className="font-extrabold text-slate-800 text-xs text-left">{itemRecv.productName}</h5>
                            <span className="text-[9.5px] font-mono text-slate-400">SKU: {itemRecv.sku} | Quantity: {itemRecv.quantity} units</span>
                          </div>
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono">
                            {itemRecv.quantity} Units
                          </span>
                        </div>

                        {/* Batch fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                          
                          {/* Batch Number */}
                          <div className="space-y-1 text-left">
                            <label className="text-[9px] text-slate-400 font-bold uppercase">Assign Batch Number</label>
                            <input
                              type="text"
                              required
                              value={itemRecv.batchNumber}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPoReceiveItems(prev => prev.map((r, i) => {
                                  if (i === idx) return { ...r, batchNumber: val };
                                  return r;
                                }));
                              }}
                              className="w-full text-xs p-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-indigo-500 text-left"
                            />
                          </div>

                          {/* Manufacture Date */}
                          <div className="space-y-1 text-left">
                            <label className="text-[9px] text-slate-400 font-bold uppercase">Manufacture Date</label>
                            <input
                              type="date"
                              required
                              value={itemRecv.manufactureDate}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPoReceiveItems(prev => prev.map((r, i) => {
                                  if (i === idx) return { ...r, manufactureDate: val };
                                  return r;
                                }));
                              }}
                              className="w-full text-xs p-2 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-lg font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 text-left"
                            />
                          </div>

                        </div>

                        {/* Perishability expiry details */}
                        <div className="flex items-center gap-2 pt-1 text-left">
                          <input
                            type="checkbox"
                            id={`isPerish-${idx}`}
                            checked={itemRecv.isPerishable}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setPoReceiveItems(prev => prev.map((r, i) => {
                                if (i === idx) {
                                  return {
                                    ...r,
                                    isPerishable: val,
                                    expiryDate: val ? new Date(Date.now() + 180*24*60*60*1000).toISOString().slice(0, 10) : ""
                                  };
                                }
                                return r;
                              }));
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                          />
                          <label htmlFor={`isPerish-${idx}`} className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer">
                            Perishable item (Require Expiry Tracking)
                          </label>
                        </div>

                        {itemRecv.isPerishable && (
                          <div className="space-y-1 animate-slideDown text-left">
                            <label className="text-[9px] text-slate-400 font-bold uppercase">Expiry Date</label>
                            <input
                              type="date"
                              required
                              value={itemRecv.expiryDate}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPoReceiveItems(prev => prev.map((r, i) => {
                                  if (i === idx) return { ...r, expiryDate: val };
                                  return r;
                                }));
                              }}
                              className="w-full text-xs p-2 bg-indigo-50/50 hover:bg-indigo-100/50 border border-indigo-100 rounded-lg font-bold text-indigo-700 focus:outline-none focus:border-indigo-500 text-left"
                            />
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReceivingPo(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-xl transition-all cursor-pointer border-0"
                >
                  Cancel Receipt
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 shadow-xs flex items-center gap-1.5 active:scale-98"
                >
                  <Check className="h-4 w-4" /> Verify & Seed Stock Batches
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIVE STOCK / CREATE BATCH MODAL (Assimilates incoming stock and assigns Batch number) */}
      {isReceivingStock && (
        <div className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                Receive Stock & Assign Batch Number
              </h4>
              <button
                onClick={() => setIsReceivingStock(false)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer border-0"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReceiveStock} className="space-y-4 text-xs font-semibold">
              
              {/* Product Selection */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black text-slate-500">Select Input SKU</label>
                <select
                  required
                  value={recvProdId}
                  onChange={(e) => setRecvProdId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose item --</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (SKU: {item.sku || "N/A"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Number */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] uppercase font-black text-slate-500">Batch Number Assigned</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (recvProdId) {
                        const prod = items.find(p => p.id === recvProdId);
                        if (prod) {
                          const catCode = prod.category.toUpperCase().slice(0, 3);
                          const randCode = Math.floor(Math.random() * 9000 + 1000);
                          setRecvBatchNum(`BAT-${catCode}-${new Date().toISOString().slice(2, 4)}${new Date().toISOString().slice(5, 7)}-${randCode}`);
                        }
                      }
                    }}
                    className="text-[9.5px] text-indigo-600 font-extrabold cursor-pointer border-0 bg-transparent hover:underline"
                  >
                    Regenerate Suggestion
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. BAT-WHEAT-26A"
                  value={recvBatchNum}
                  onChange={(e) => setRecvBatchNum(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[9px] text-slate-400 mt-0.5">We suggest a secure, timestamped batch suffix automatically.</p>
              </div>

              {/* Incoming Quantity */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black text-slate-500 font-black">Quantity Received</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 150"
                  value={recvQty}
                  onChange={(e) => setRecvQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Manufacture Date */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-black text-slate-500">Manufacture Date</label>
                <input
                  type="date"
                  required
                  value={recvManufactureDate}
                  onChange={(e) => setRecvManufactureDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Is Perishable toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recvIsPerishable"
                  checked={recvIsPerishable}
                  onChange={(e) => setRecvIsPerishable(e.target.checked)}
                  className="rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                />
                <label htmlFor="recvIsPerishable" className="text-[10.5px] text-slate-600 font-bold select-none cursor-pointer">
                  Perishable product (Requires Expiry tracking & FIFO rotation)
                </label>
              </div>

              {/* Expiry Date (Disabled if non-perishable) */}
              {recvIsPerishable && (
                <div className="space-y-1 bg-amber-50/40 p-3 rounded-xl border border-amber-100 animate-fadeIn">
                  <label className="block text-[10px] uppercase font-black text-amber-800">Perishable Expiry Date</label>
                  <input
                    type="date"
                    required={recvIsPerishable}
                    value={recvExpiryDate}
                    onChange={(e) => setRecvExpiryDate(e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-xs font-bold text-amber-900 focus:outline-none focus:border-indigo-500"
                  />
                  {/* Presets */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setMonth(d.getMonth() + 3);
                        setRecvExpiryDate(d.toISOString().slice(0, 10));
                      }}
                      className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[9px] rounded cursor-pointer border-0 font-bold"
                    >
                      +3 Months
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setMonth(d.getMonth() + 6);
                        setRecvExpiryDate(d.toISOString().slice(0, 10));
                      }}
                      className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[9px] rounded cursor-pointer border-0 font-bold"
                    >
                      +6 Months
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setFullYear(d.getFullYear() + 1);
                        setRecvExpiryDate(d.toISOString().slice(0, 10));
                      }}
                      className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[9px] rounded cursor-pointer border-0 font-bold"
                    >
                      +1 Year
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsReceivingStock(false)}
                  className="px-3.5 py-2 hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-xs font-black rounded-lg cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase rounded-lg cursor-pointer border-0 shadow-sm"
                >
                  Assign & Store Batch
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
