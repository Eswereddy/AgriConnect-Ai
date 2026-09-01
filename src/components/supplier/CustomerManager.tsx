import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  Building,
  Star,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  X,
  Plus,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  Check,
  Copy,
  Clock,
  ArrowRight,
  Receipt,
  Percent,
  FileText,
  Calendar,
  AlertCircle,
  Tag,
  Gift,
  Award,
  Layers,
  Megaphone,
  Zap,
  RotateCcw,
  DollarSign
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

interface Review {
  id: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
  replyDate?: string;
}

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minSpend?: number;
  expiry: string;
  status: "active" | "expired" | "redeemed";
}

interface Customer {
  id: string;
  name: string;
  company: string;
  location: string;
  address: string;
  mobile: string;
  email: string;
  baseOrders: number;
  baseSpent: number; // in INR
  baseRating: number;
  joinedDate: string;
  status: "active" | "inactive";
  gstNumber?: string;
  reviews?: Review[];
  coupons?: Coupon[];
}

interface CustomerManagerProps {
  orders: any[];
  onClose: () => void;
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "CUST-001",
    name: "Amir Patel",
    company: "Amir Farms & Seed Growers Ltd.",
    location: "Karnal, Haryana",
    address: "Plot 42, Sector 12, Industrial Area, Karnal, Haryana - 132001",
    gstNumber: "06AAACP4212J1Z3",
    mobile: "+91 98765-12345",
    email: "amir.patel@karnal-agri.in",
    baseOrders: 14,
    baseSpent: 118000,
    baseRating: 4.9,
    joinedDate: "2025-03-12",
    status: "active",
    reviews: [
      {
        id: "REV-101",
        productName: "Premium Certified Wheat Seeds (HD-2967)",
        rating: 5,
        comment: "Excellent germination rate (>96%). High bulk purity, no chaff mixed. Best supplier in Karnal.",
        date: "2026-04-10"
      },
      {
        id: "REV-102",
        productName: "Organic Neem Pesticide Concentrate",
        rating: 4,
        comment: "Effective control of aphids. Standard packaging was sturdy and leak-proof.",
        date: "2026-05-18"
      }
    ],
    coupons: [
      {
        id: "CPN-201",
        code: "KRNALWINTER10",
        discountType: "percentage",
        discountValue: 10,
        minSpend: 25000,
        expiry: "2026-11-30",
        status: "active"
      }
    ]
  },
  {
    id: "CUST-002",
    name: "Devendra Singh",
    company: "Bhatinda Cooperative Society",
    location: "Bhatinda, Punjab",
    address: "Grain Mandi Yard, Block B, Bhatinda, Punjab - 151001",
    gstNumber: "03AAACB7450K2Z8",
    mobile: "+91 99123-45678",
    email: "devendra.singh@punjabcoop.org",
    baseOrders: 8,
    baseSpent: 74500,
    baseRating: 4.7,
    joinedDate: "2025-05-18",
    status: "active",
    reviews: [
      {
        id: "REV-201",
        productName: "Bio-NPK Liquid Fertilizer",
        rating: 5,
        comment: "Outstanding crop vigor observed on cooperative trial plots. Delivered in perfect condition.",
        date: "2026-02-14"
      }
    ],
    coupons: []
  },
  {
    id: "CUST-003",
    name: "Siddharth Roy",
    company: "Sahyadri Agro-Tech Pvt Ltd",
    location: "Nashik, Maharashtra",
    address: "Survey No. 110, Pimpalgaon Baswant, Nashik, Maharashtra - 422209",
    gstNumber: "27AAACS1102C3Z5",
    mobile: "+91 98220-11223",
    email: "siddharth.roy@sahyadri.com",
    baseOrders: 5,
    baseSpent: 52000,
    baseRating: 5.0,
    joinedDate: "2025-08-01",
    status: "active",
    reviews: [
      {
        id: "REV-301",
        productName: "Hybrid Tomato F1 Seeds (Arka Rakshak)",
        rating: 5,
        comment: "Incredible yield and highly resistant to leaf curl virus. The farmers in Nashik are highly satisfied.",
        date: "2026-01-20"
      }
    ],
    coupons: [
      {
        id: "CPN-301",
        code: "NASHIKHIBRID15",
        discountType: "percentage",
        discountValue: 15,
        expiry: "2026-09-15",
        status: "active"
      }
    ]
  },
  {
    id: "CUST-004",
    name: "Sunita Rao",
    company: "Belgaum Growers Federation",
    location: "Belgaum, Karnataka",
    address: "APMC Market Yard, Road No. 3, Belgaum, Karnataka - 590010",
    gstNumber: "29AAACB1402F1Z4",
    mobile: "+91 97401-23456",
    email: "sunita.rao@belgaumgrowers.org",
    baseOrders: 3,
    baseSpent: 26000,
    baseRating: 4.8,
    joinedDate: "2025-11-20",
    status: "active",
    reviews: [
      {
        id: "REV-401",
        productName: "Water Soluble Crop Nutrients (19:19:19)",
        rating: 5,
        comment: "Excellent dissolution. No solid residue blocks our drip emitters.",
        date: "2026-03-05"
      },
      {
        id: "REV-402",
        productName: "Bio-NPK Liquid Fertilizer",
        rating: 2,
        comment: "The fertilizer bottle caps are fragile and leaked during transport, ruining other cargo. Needs better seals.",
        date: "2026-04-18"
      }
    ],
    coupons: []
  },
  {
    id: "CUST-005",
    name: "Rajesh Mohanty",
    company: "Cuttack Paddy Co-op",
    location: "Cuttack, Odisha",
    address: "Mandi complex, Link Road, Cuttack, Odisha - 753012",
    gstNumber: "21AAACR8402P1Z0",
    mobile: "+91 94370-98765",
    email: "rajesh@cuttackcoop.org",
    baseOrders: 2,
    baseSpent: 8400,
    baseRating: 3.5,
    joinedDate: "2026-02-15",
    status: "active",
    reviews: [
      {
        id: "REV-501",
        productName: "Organic Neem Pesticide Concentrate",
        rating: 3,
        comment: "The organic concentrate controls flies but has a very strong odor that is hard to work with. Packaging was delayed by a week.",
        date: "2026-03-22"
      }
    ],
    coupons: []
  },
  {
    id: "CUST-006",
    name: "Ananya Das",
    company: "Das Greenhouse Solutions",
    location: "Kolkata, West Bengal",
    address: "Slat Lake Sector V, Block GP, Kolkata, West Bengal - 700091",
    gstNumber: "19AAACD5432B2Z7",
    mobile: "+91 98300-54321",
    email: "ananya.das@greenhouse.in",
    baseOrders: 1,
    baseSpent: 1500,
    baseRating: 5.0,
    joinedDate: "2026-06-10",
    status: "active",
    reviews: [
      {
        id: "REV-601",
        productName: "Premium Coco Peat Blocks (Buffered)",
        rating: 5,
        comment: "Extremely low EC levels, perfect buffering! Highly recommended for nursery plugs.",
        date: "2026-06-15"
      }
    ],
    coupons: []
  },
  {
    id: "CUST-007",
    name: "Vijay Naidu",
    company: "Deccan Cotton Growers",
    location: "Guntur, Andhra Pradesh",
    address: "Old Club Road, Guntur, Andhra Pradesh - 522001",
    gstNumber: "37AAACV4840D1ZS",
    mobile: "+91 98480-11111",
    email: "v.naidu@deccancotton.org",
    baseOrders: 9,
    baseSpent: 124000,
    baseRating: 4.8,
    joinedDate: "2025-01-30",
    status: "active",
    reviews: [
      {
        id: "REV-701",
        productName: "Hybrid Cotton Seeds (Ajeet 155)",
        rating: 5,
        comment: "Bollworm resistance has stood up well. Got exceptional length cotton fiber this season.",
        date: "2026-05-10"
      }
    ],
    coupons: []
  }
];

export default function CustomerManager({ orders, onClose }: CustomerManagerProps) {
  // Persistence for added/edited customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const stored = localStorage.getItem("agriconnect_supplier_customers");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return INITIAL_CUSTOMERS;
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedFrequency, setSelectedFrequency] = useState("All"); // All, Frequent (>= 5), Occasional (2-4), New (1)
  const [selectedSpent, setSelectedSpent] = useState("All"); // All, High (>= 50k), Medium (10k-50k), Low (< 10k)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Tab inside details panel (Profile vs Order History vs Reviews vs Coupons)
  const [activeDetailTab, setActiveDetailTab] = useState<"profile" | "orders" | "reviews" | "coupons">("profile");
  
  // Register customer modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newGst, setNewGst] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Create Coupon/Discount state
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState<"percentage" | "flat">("percentage");
  const [couponValue, setCouponValue] = useState<number>(10);
  const [couponMinSpend, setCouponMinSpend] = useState<string>("");
  const [couponExpiry, setCouponExpiry] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Copy feedbacks
  const [copyFeedback, setCopyFeedback] = useState<Record<string, boolean>>({});

  // Message drafting state
  const [messageChannel, setMessageChannel] = useState<"email" | "sms" | "whatsapp">("email");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");

  // Customer Segments Campaign Hub states
  const [managerView, setManagerView] = useState<"directory" | "segments" | "reviews" | "analytics">("directory");
  
  // Reviews & Ratings Hub states
  const [reviewReplyTexts, setReviewReplyTexts] = useState<Record<string, string>>({});
  const [reviewSuccessFeedback, setReviewSuccessFeedback] = useState<Record<string, string>>({});
  const [activeReviewRatingFilter, setActiveReviewRatingFilter] = useState<number | "All">("All");
  const [activeReviewThemeFilter, setActiveReviewThemeFilter] = useState<string | "All">("All");

  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("high-value");
  const [isCreatingSegmentCoupon, setIsCreatingSegmentCoupon] = useState(false);
  const [segmentCouponCode, setSegmentCouponCode] = useState("");
  const [segmentCouponType, setSegmentCouponType] = useState<"percentage" | "flat">("percentage");
  const [segmentCouponValue, setSegmentCouponValue] = useState<number>(10);
  const [segmentCouponMinSpend, setSegmentCouponMinSpend] = useState<string>("");
  const [segmentCouponExpiry, setSegmentCouponExpiry] = useState("");
  const [segmentCouponSuccess, setSegmentCouponSuccess] = useState("");
  const [segmentMessageChannel, setSegmentMessageChannel] = useState<"email" | "sms" | "whatsapp">("email");
  const [segmentMessageSubject, setSegmentMessageSubject] = useState("");
  const [segmentMessageBody, setSegmentMessageBody] = useState("");
  const [isSegmentSending, setIsSegmentSending] = useState(false);
  const [segmentSendSuccess, setSegmentSendSuccess] = useState("");
  const [campaignTab, setCampaignTab] = useState<"message" | "coupon" | "audience">("message");

  // Save customers helper
  const saveCustomers = (list: Customer[]) => {
    setCustomers(list);
    localStorage.setItem("agriconnect_supplier_customers", JSON.stringify(list));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopyFeedback(prev => ({ ...prev, [id]: false }));
    }, 1500);
  };

  // Dynamically blend simulated base customer parameters with real dynamic transaction lists
  const processedCustomers = useMemo(() => {
    return customers.map(cust => {
      // Find orders matching this customer name or email
      const custOrders = orders.filter(
        o => 
          (o.farmerName && o.farmerName.toLowerCase() === cust.name.toLowerCase()) ||
          (o.buyerEmail && o.buyerEmail.toLowerCase() === cust.email.toLowerCase())
      );

      const dynamicOrdersCount = custOrders.length;
      const dynamicSpent = custOrders.reduce((sum, o) => sum + (o.amount || 0) * 84, 0); // convert simulated USD amount to ₹

      return {
        ...cust,
        totalOrders: cust.baseOrders + dynamicOrdersCount,
        totalSpent: cust.baseSpent + dynamicSpent,
        avgOrderValue: (cust.baseSpent + dynamicSpent) / ((cust.baseOrders + dynamicOrdersCount) || 1)
      };
    });
  }, [customers, orders]);

  // Sync selectedCustomer with processed list so stats update in real-time
  const syncedSelectedCustomer = useMemo(() => {
    if (!selectedCustomer) return null;
    return processedCustomers.find(c => c.id === selectedCustomer.id) || selectedCustomer;
  }, [selectedCustomer, processedCustomers]);

  // --- 8.3 Customer Analytics Memoized Engines ---
  // A. Acquisition Metrics
  const customerAcquisitionMetrics = useMemo(() => {
    // New customers this month (joinedDate starting with "2026-07")
    const newCustomers = processedCustomers.filter(c => c.joinedDate && c.joinedDate.startsWith("2026-07"));
    const newCustomersCount = newCustomers.length;

    // Active emails / names this month from orders
    const activeNamesThisMonth = new Set(
      orders
        .filter(o => o.date && o.date.startsWith("2026-07"))
        .map(o => (o.farmerName || "").toLowerCase())
    );

    // Repeat customers this month (active this month, and totalOrders > 1)
    const repeatCustomersThisMonth = processedCustomers.filter(c => 
      (activeNamesThisMonth.has(c.name.toLowerCase()) || c.name === "Amir Patel" || c.name === "Devendra Singh") && c.totalOrders > 1
    );
    const repeatCustomersCount = repeatCustomersThisMonth.length;

    return {
      newCustomers,
      newCustomersCount,
      repeatCustomersThisMonth,
      repeatCustomersCount,
    };
  }, [processedCustomers, orders]);

  // B. Churn Rate Calculation Engine
  const customerChurnRate = useMemo(() => {
    const total = processedCustomers.length;
    if (total === 0) return 4.8; // baseline standard

    const inactiveCount = processedCustomers.filter(c => c.status === "inactive").length;
    
    // Silent accounts (joined > 180 days ago but has placed <= 1 totalOrders)
    const silentCount = processedCustomers.filter(c => {
      if (c.status === "inactive") return true;
      const joinTime = new Date(c.joinedDate).getTime();
      const nowTime = new Date("2026-07-11").getTime();
      const daysSinceJoined = (nowTime - joinTime) / (1000 * 60 * 60 * 24);
      return daysSinceJoined > 180 && c.totalOrders <= 1;
    }).length;

    const rate = ((inactiveCount + silentCount) / total) * 100;
    return rate > 0 ? parseFloat(rate.toFixed(1)) : 4.8;
  }, [processedCustomers]);

  // C. CLV Metrics
  const customerCLVMetrics = useMemo(() => {
    const total = processedCustomers.length;
    if (total === 0) return { averageCLV: 0, topCustomers: [] };

    const totalSpentSum = processedCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    const averageCLV = Math.round(totalSpentSum / total);

    const topCustomers = [...processedCustomers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return {
      averageCLV,
      topCustomers,
    };
  }, [processedCustomers]);

  // D. Retention & Purchase Interval Engine
  const customerRetentionMetrics = useMemo(() => {
    const total = processedCustomers.length;
    const repeatCount = processedCustomers.filter(c => c.totalOrders > 1).length;
    const repeatPurchaseRate = total > 0 ? parseFloat(((repeatCount / total) * 100).toFixed(1)) : 75.5;

    // Time between purchases calculation (weighted average by account duration / purchase count)
    const intervals: number[] = [];
    processedCustomers.forEach(c => {
      if (c.totalOrders <= 1) return;
      const joinTime = new Date(c.joinedDate).getTime();
      const nowTime = new Date("2026-07-11").getTime();
      const daysSinceJoined = Math.max(30, (nowTime - joinTime) / (1000 * 60 * 60 * 24));
      intervals.push(daysSinceJoined / c.totalOrders);
    });

    const averageTimeBetweenPurchases = intervals.length > 0
      ? Math.round(intervals.reduce((sum, val) => sum + val, 0) / intervals.length)
      : 42;

    return {
      repeatPurchaseRate,
      averageTimeBetweenPurchases,
    };
  }, [processedCustomers]);

  // E. Registration Trends over Time (for visual growth chart)
  const registrationTrendData = useMemo(() => {
    const counts: Record<string, number> = {};
    processedCustomers.forEach(c => {
      if (!c.joinedDate) return;
      const month = c.joinedDate.slice(0, 7); // "YYYY-MM"
      counts[month] = (counts[month] || 0) + 1;
    });

    const standardMonths = [
      "2025-01", "2025-03", "2025-05", "2025-08", "2025-11", "2026-02", "2026-06", "2026-07"
    ];

    let cumulative = 0;
    return standardMonths.map(m => {
      const added = counts[m] || 0;
      cumulative += added;
      const [year, monthNum] = m.split("-");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const displayLabel = `${monthNames[parseInt(monthNum) - 1]} '${year.slice(2)}`;
      return {
        month: displayLabel,
        "New Partners": added,
        "Total Scale": cumulative
      };
    });
  }, [processedCustomers]);

  // F. Spent Distribution by Segment (for pie chart representation)
  const segmentSpendDistribution = useMemo(() => {
    let high = 0;
    let med = 0;
    let low = 0;
    processedCustomers.forEach(c => {
      if (c.totalSpent >= 50000) high += c.totalSpent;
      else if (c.totalSpent >= 10000) med += c.totalSpent;
      else low += c.totalSpent;
    });

    return [
      { name: "Premium Tier (₹50k+)", value: high, color: "#4f46e5" },
      { name: "Growth Tier (₹10k-50k)", value: med, color: "#10b981" },
      { name: "Niche Tier (<₹10k)", value: low, color: "#f59e0b" }
    ].filter(item => item.value > 0);
  }, [processedCustomers]);

  // Unique list of states/locations for filtering
  const locationsList = useMemo(() => {
    const locs = processedCustomers.map(c => {
      const parts = c.location.split(",");
      return parts[parts.length - 1]?.trim() || c.location;
    });
    return ["All", ...Array.from(new Set(locs))];
  }, [processedCustomers]);

  // Filters logic
  const filteredCustomers = useMemo(() => {
    return processedCustomers.filter(cust => {
      // Search Box: matches name, company, email, mobile
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          cust.name.toLowerCase().includes(q) ||
          cust.company.toLowerCase().includes(q) ||
          cust.email.toLowerCase().includes(q) ||
          cust.mobile.replace(/[^0-9]/g, "").includes(q) ||
          cust.mobile.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Location filter
      if (selectedLocation !== "All") {
        if (!cust.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // Frequency filter
      if (selectedFrequency !== "All") {
        if (selectedFrequency === "Frequent" && cust.totalOrders <= 10) return false;
        if (selectedFrequency === "Occasional" && (cust.totalOrders < 3 || cust.totalOrders > 10)) return false;
        if (selectedFrequency === "New" && cust.totalOrders >= 3) return false;
      }

      // Spent class filter
      if (selectedSpent !== "All") {
        if (selectedSpent === "High" && cust.totalSpent <= 100000) return false;
        if (selectedSpent === "Medium" && (cust.totalSpent < 50000 || cust.totalSpent > 100000)) return false;
        if (selectedSpent === "Low" && cust.totalSpent >= 50000) return false;
      }

      return true;
    });
  }, [processedCustomers, searchQuery, selectedLocation, selectedFrequency, selectedSpent]);

  // General statistics
  const stats = useMemo(() => {
    const total = processedCustomers.length;
    const highValue = processedCustomers.filter(c => c.totalSpent >= 50000).length;
    const frequentCount = processedCustomers.filter(c => c.totalOrders >= 5).length;
    const totalSpentSum = processedCustomers.reduce((acc, c) => acc + c.totalSpent, 0);
    const allRevsCount = processedCustomers.reduce((acc, c) => acc + (c.reviews?.length || 0), 0);
    const allRevsSum = processedCustomers.reduce((acc, c) => acc + (c.reviews?.reduce((sum, r) => sum + r.rating, 0) || 0), 0);
    const averageRating = allRevsCount > 0 ? (allRevsSum / allRevsCount).toFixed(1) : (processedCustomers.reduce((acc, c) => acc + c.baseRating, 0) / (total || 1)).toFixed(1);

    return {
      total,
      highValue,
      frequentCount,
      totalSpentSum,
      averageRating
    };
  }, [processedCustomers]);

  // Segment Specifications (Section 7.3 Requirements)
  const segmentsList = useMemo(() => {
    return [
      {
        id: "high-value",
        name: "High Value Partners",
        description: "Lifetime spent is greater than ₹1,00,000",
        tagline: "Top-tier enterprise agricultural cooperatives and seed houses.",
        color: "emerald",
        badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        icon: Sparkles,
        filterFn: (c: any) => c.totalSpent > 100000,
      },
      {
        id: "medium-value",
        name: "Medium Value Partners",
        description: "Lifetime spent is between ₹50,000 and ₹1,00,000",
        tagline: "Solid core accounts targeted for standard growth programs.",
        color: "teal",
        badgeBg: "bg-teal-50 text-teal-700 border border-teal-100",
        icon: Award,
        filterFn: (c: any) => c.totalSpent >= 50000 && c.totalSpent <= 100000,
      },
      {
        id: "low-value",
        name: "Low Value Partners",
        description: "Lifetime spent is less than ₹50,000",
        tagline: "Smaller buyers or trial-run growers with moderate spending.",
        color: "slate",
        badgeBg: "bg-slate-50 text-slate-700 border border-slate-100",
        icon: UserCheck,
        filterFn: (c: any) => c.totalSpent < 50000,
      },
      {
        id: "frequent",
        name: "Frequent Buyers",
        description: "More than 10 lifetime crop seed/fertilizer orders",
        tagline: "High transaction density accounts requiring frequent loyalty rewards.",
        color: "indigo",
        badgeBg: "bg-indigo-50 text-indigo-700 border border-indigo-100",
        icon: TrendingUp,
        filterFn: (c: any) => c.totalOrders > 10,
      },
      {
        id: "occasional",
        name: "Occasional Buyers",
        description: "Between 3 and 10 orders across the agricultural cycles",
        tagline: "Established but seasonal accounts; prime for conversion campaigns.",
        color: "amber",
        badgeBg: "bg-amber-50 text-amber-700 border border-amber-100",
        icon: Clock,
        filterFn: (c: any) => c.totalOrders >= 3 && c.totalOrders <= 10,
      },
      {
        id: "new",
        name: "New Accounts",
        description: "Recently onboarded partners with fewer than 3 purchases",
        tagline: "Fresh connections to warm up with onboarding discount coupons.",
        color: "rose",
        badgeBg: "bg-rose-50 text-rose-700 border border-rose-100",
        icon: Layers,
        filterFn: (c: any) => c.totalOrders < 3,
      }
    ];
  }, [processedCustomers]);

  // Pre-configured conversion templates for target segmented audience (Section 7.3)
  const segmentTemplates = useMemo(() => {
    return {
      "high-value": [
        {
          title: "👑 Priority Seed Booking & Credit Offer",
          subject: "Exclusive Pre-Season Seed Allocation & Premium Credit Terms",
          body: "Dear Partner,\n\nBecause of your premier High-Value account status with us, we have reserved early pre-booking allocations for our incoming high-yield certified seed varieties. We are also pleased to authorize a special 45-day interest-free credit buffer for orders finalized this week.\n\nReply directly to block your bulk bags.\n\nWarm regards,\nAgriConnect Enterprise Support"
        },
        {
          title: "💎 Tiered Rebate on High-Density Orders",
          subject: "Exclusive 5% Extra Cash Back on Orders Exceeding 100 Bags",
          body: "Dear Partner,\n\nWe deeply value your high-volume operations. To celebrate our ongoing enterprise partnership, we are launching a segment-only 5% flat rebate on your next booking of bio-pesticides or nutrient fertilizers over 100 sacks.\n\nBest regards,\nAgriConnect Logistics Division"
        }
      ],
      "medium-value": [
        {
          title: "📈 Core Partner Gold Tier Upgrade Campaign",
          subject: "Upgrade Invitation: Reach Gold Status on Next Purchase",
          body: "Dear Partner,\n\nUnlock maximum profitability! Purchase over ₹30,000 in seed supplies or bio-fertilizers during this season-opening campaign and instantly elevate your business to our Gold Partner tier — granting you free logistics and priority dispatcher scheduling.\n\nSincerely,\nAgriConnect Marketing Team"
        }
      ],
      "low-value": [
        {
          title: "🌱 Organic Yield Trial-to-Scale Discount",
          subject: "Grow Your Margins: Starter Bundle Discount on Nutrient Fertilizer",
          body: "Dear Partner,\n\nMaximize your growers' yields on regional demo trials! Try our premium bio-NPK fertilizer liquids this month and take 15% off list price. Our agronomy team will also provide free remote soil diagnostic assistance.\n\nBest regards,\nAgriConnect Sales Desk"
        }
      ],
      "frequent": [
        {
          title: "⭐ Continuous Engagement Reward Coupon",
          subject: "Loyalty Appreciation: Special 10% Coupon Code Inside",
          body: "Dear Partner,\n\nYour consistent order frequency drives our mutual success! As a thank you for placing over 10 orders with us, we are issuing an exclusive 10% reward coupon applicable across all custom seeds and specialty soil amendments.\n\nWarm regards,\nAgriConnect Customer Loyalty Desk"
        }
      ],
      "occasional": [
        {
          title: "🌾 Seasonal Revival Pre-Booking Campaign",
          subject: "Welcome Back: Early Sowing Discounts & Premium Seed Stock",
          body: "Dear Partner,\n\nWith the upcoming sowing cycle starting, we want to ensure you have full access to our fresh, premium, drought-resistant grain and crop seed varieties. Enjoy ₹2,000 flat discount on your season-opening booking of ₹20,000+.\n\nSincerely,\nAgriConnect Enterprise Sales"
        }
      ],
      "new": [
        {
          title: "🤝 Fresh Onboarding Priority Support",
          subject: "Welcome Gift: 15% Off Your Next Mandi Booking",
          body: "Dear Partner,\n\nWelcome to our supplier network! We are committed to making your first agricultural supply cycles highly prosperous. Please enjoy this introductory 15% welcome discount, valid on any crop seeds or soil amendment products.\n\nWarmest regards,\nAgriConnect Partner Success Team"
        }
      ]
    } as Record<string, Array<{ title: string; subject: string; body: string }>>;
  }, []);

  // Handle direct message broadcast to a whole segment
  const handleSendSegmentMessage = () => {
    if (!segmentMessageBody.trim()) return;
    setIsSegmentSending(true);
    setSegmentSendSuccess("");
    setTimeout(() => {
      setIsSegmentSending(false);
      const selectedSeg = segmentsList.find(s => s.id === selectedSegmentId);
      const activeMembers = processedCustomers.filter(selectedSeg?.filterFn || (() => false));
      setSegmentSendSuccess(`✅ Broadcast sent via ${segmentMessageChannel.toUpperCase()} to all ${activeMembers.length} members of "${selectedSeg?.name}"!`);
      setSegmentMessageSubject("");
      setSegmentMessageBody("");
      setTimeout(() => setSegmentSendSuccess(""), 5000);
    }, 1200);
  };

  // Handle coupon creation for a whole segment
  const handleCreateSegmentCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!segmentCouponCode.trim()) return;

    const selectedSeg = segmentsList.find(s => s.id === selectedSegmentId);
    if (!selectedSeg) return;

    const activeMembers = processedCustomers.filter(selectedSeg.filterFn);
    
    if (activeMembers.length === 0) {
      setSegmentCouponSuccess(`⚠️ No customers currently qualify for this segment to receive coupons.`);
      return;
    }

    const newCoupon: Coupon = {
      id: `CPN-SEG-${Date.now()}`,
      code: segmentCouponCode.trim().toUpperCase(),
      discountType: segmentCouponType,
      discountValue: segmentCouponValue,
      minSpend: segmentCouponMinSpend ? parseFloat(segmentCouponMinSpend) : undefined,
      expiry: segmentCouponExpiry || new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active"
    };

    // Append coupon to each customer matching segment filter
    const updated = customers.map(cust => {
      const processedRecord = processedCustomers.find(pc => pc.id === cust.id);
      if (processedRecord && selectedSeg.filterFn(processedRecord)) {
        return {
          ...cust,
          coupons: [...(cust.coupons || []), newCoupon]
        };
      }
      return cust;
    });

    saveCustomers(updated);
    setSegmentCouponSuccess(`🎉 Coupon "${newCoupon.code}" successfully assigned to all ${activeMembers.length} partners in "${selectedSeg.name}"!`);
    setSegmentCouponCode("");
    setSegmentCouponMinSpend("");
    
    setTimeout(() => {
      setSegmentCouponSuccess("");
      setIsCreatingSegmentCoupon(false);
    }, 3000);
  };

  // Flattened and linked reviews list for view & analytics (Section 7.4)
  const allReviews = useMemo(() => {
    const list: Array<{
      id: string;
      productName: string;
      rating: number;
      comment: string;
      date: string;
      reply?: string;
      replyDate?: string;
      customerName: string;
      customerCompany: string;
      customerLocation: string;
      customerId: string;
    }> = [];

    processedCustomers.forEach(cust => {
      if (cust.reviews && cust.reviews.length > 0) {
        cust.reviews.forEach(rev => {
          list.push({
            ...rev,
            customerName: cust.name,
            customerCompany: cust.company,
            customerLocation: cust.location,
            customerId: cust.id
          });
        });
      }
    });

    // Sort by date descending
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [processedCustomers]);

  // Review Analytics calculations (Section 7.4)
  const reviewAnalytics = useMemo(() => {
    const total = allReviews.length;
    if (total === 0) {
      return {
        avgRating: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        positiveKeywords: [],
        negativeKeywords: []
      };
    }

    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = parseFloat((sum / total).toFixed(1));

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    allReviews.forEach(r => {
      const rounded = Math.round(r.rating);
      if (distribution[rounded] !== undefined) {
        distribution[rounded]++;
      }
    });

    // Keyword theme tagging
    const posThemes = [
      { word: "germination", label: "High Germination", count: 0 },
      { word: "yield", label: "Exceptional Yield", count: 0 },
      { word: "sturdy", label: "Sturdy Packaging", count: 0 },
      { word: "vigor", label: "Crop Vigor", count: 0 },
      { word: "buffering", label: "Perfect Buffering", count: 0 },
      { word: "excellent", label: "Excellent Quality", count: 0 }
    ];

    const negThemes = [
      { word: "blocks", label: "Drip blocks", count: 0 },
      { word: "leaked", label: "Leaked bottles", count: 0 },
      { word: "delayed", label: "Delayed shipping", count: 0 },
      { word: "fragile", label: "Fragile parts", count: 0 },
      { word: "odor", label: "Strong odor", count: 0 }
    ];

    allReviews.forEach(rev => {
      const text = rev.comment.toLowerCase();
      posThemes.forEach(theme => {
        if (text.includes(theme.word.toLowerCase())) {
          theme.count++;
        }
      });
      negThemes.forEach(theme => {
        if (text.includes(theme.word.toLowerCase())) {
          theme.count++;
        }
      });
    });

    return {
      avgRating,
      distribution,
      positiveKeywords: posThemes.filter(t => t.count > 0),
      negativeKeywords: negThemes.filter(t => t.count > 0)
    };
  }, [allReviews]);

  // Filtered reviews list for UI binding (Section 7.4)
  const filteredReviewsList = useMemo(() => {
    return allReviews.filter(rev => {
      // 1. Star Rating filter
      if (activeReviewRatingFilter !== "All") {
        if (Math.round(rev.rating) !== activeReviewRatingFilter) {
          return false;
        }
      }

      // 2. Keyword Theme filter
      if (activeReviewThemeFilter !== "All") {
        if (!rev.comment.toLowerCase().includes(activeReviewThemeFilter.toLowerCase())) {
          return false;
        }
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          rev.customerName.toLowerCase().includes(q) ||
          rev.customerCompany.toLowerCase().includes(q) ||
          rev.productName.toLowerCase().includes(q) ||
          rev.comment.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [allReviews, activeReviewRatingFilter, activeReviewThemeFilter, searchQuery]);

  // Handle publishing a review reply
  const handlePublishReviewReply = (custId: string, revId: string) => {
    const replyText = reviewReplyTexts[revId]?.trim();
    if (!replyText) return;

    const updated = customers.map(cust => {
      if (cust.id === custId) {
        const updatedReviews = (cust.reviews || []).map(r => {
          if (r.id === revId) {
            return {
              ...r,
              reply: replyText,
              replyDate: new Date().toISOString().split("T")[0]
            };
          }
          return r;
        });
        return {
          ...cust,
          reviews: updatedReviews
        };
      }
      return cust;
    });

    saveCustomers(updated);
    
    // Clear the reply input text area
    setReviewReplyTexts(prev => {
      const copy = { ...prev };
      delete copy[revId];
      return copy;
    });

    // Set feedback
    setReviewSuccessFeedback(prev => ({
      ...prev,
      [revId]: "✅ Response published successfully!"
    }));
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
      setReviewSuccessFeedback(prev => {
        const copy = { ...prev };
        delete copy[revId];
        return copy;
      });
    }, 3000);
  };

  // Handle deleting a review reply
  const handleDeleteReviewReply = (custId: string, revId: string) => {
    const updated = customers.map(cust => {
      if (cust.id === custId) {
        const updatedReviews = (cust.reviews || []).map(r => {
          if (r.id === revId) {
            const copy = { ...r };
            delete copy.reply;
            delete copy.replyDate;
            return copy;
          }
          return r;
        });
        return {
          ...cust,
          reviews: updatedReviews
        };
      }
      return cust;
    });

    saveCustomers(updated);
  };

  // Handle manual customer creation
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCompany.trim() || !newLocation.trim() || !newMobile.trim() || !newEmail.trim()) {
      return;
    }

    const newCust: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: newName,
      company: newCompany,
      location: newLocation,
      address: newAddress || `${newLocation}, India`,
      gstNumber: newGst || "Not Provided",
      mobile: newMobile,
      email: newEmail,
      baseOrders: 1,
      baseSpent: 12000,
      baseRating: 5.0,
      joinedDate: new Date().toISOString().split("T")[0],
      status: "active",
      reviews: [],
      coupons: []
    };

    saveCustomers([...customers, newCust]);
    
    // reset form
    setNewName("");
    setNewCompany("");
    setNewLocation("");
    setNewAddress("");
    setNewGst("");
    setNewMobile("");
    setNewEmail("");
    setIsAddOpen(false);
  };

  // Create custom Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (!syncedSelectedCustomer) return;

    const newCoupon: Coupon = {
      id: `CPN-${Date.now()}`,
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      discountValue: couponValue,
      minSpend: couponMinSpend ? parseFloat(couponMinSpend) : undefined,
      expiry: couponExpiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active"
    };

    const updated = customers.map(cust => {
      if (cust.id === syncedSelectedCustomer.id) {
        return {
          ...cust,
          coupons: [...(cust.coupons || []), newCoupon]
        };
      }
      return cust;
    });

    saveCustomers(updated);
    setCouponSuccess(`🎉 Coupon "${newCoupon.code}" successfully generated for ${syncedSelectedCustomer.name}!`);
    setCouponCode("");
    setCouponMinSpend("");
    
    setTimeout(() => {
      setCouponSuccess("");
      setIsCreatingCoupon(false);
    }, 2500);
  };

  // Handle direct message send trigger
  const handleSendMessage = () => {
    if (!messageBody.trim()) return;
    setIsSending(true);
    setSendSuccess("");
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(`✅ Message successfully dispatched via ${messageChannel.toUpperCase()} to ${syncedSelectedCustomer?.name}!`);
      setMessageSubject("");
      setMessageBody("");
      setTimeout(() => setSendSuccess(""), 4000);
    }, 1200);
  };

  // Fetch orders specifically belonging to the selected customer
  const customerOrdersList = useMemo(() => {
    if (!syncedSelectedCustomer) return [];
    return orders.filter(
      o => 
        (o.farmerName && o.farmerName.toLowerCase() === syncedSelectedCustomer.name.toLowerCase()) ||
        (o.buyerEmail && o.buyerEmail.toLowerCase() === syncedSelectedCustomer.email.toLowerCase())
    );
  }, [syncedSelectedCustomer, orders]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-7xl w-full h-[92vh] shadow-2xl relative flex flex-col space-y-5 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Enterprise Customer Directory</h3>
              <p className="text-slate-400 text-xs font-semibold">Analyze buyer lifetimes, purchase frequencies, state regions, and order histories</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Navigation View Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-black uppercase tracking-wider shrink-0">
              <button
                onClick={() => setManagerView("directory")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  managerView === "directory" 
                    ? "bg-white text-slate-800 shadow-3xs" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Users className="h-4 w-4" /> Partner Directory
              </button>
              <button
                onClick={() => setManagerView("segments")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  managerView === "segments" 
                    ? "bg-white text-indigo-700 shadow-3xs" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Layers className="h-4 w-4" /> Campaign Segments
              </button>
              <button
                onClick={() => setManagerView("reviews")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  managerView === "reviews" 
                    ? "bg-white text-amber-700 shadow-3xs" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <MessageSquare className="h-4 w-4 text-amber-500" /> Reviews & Feedback
              </button>
              <button
                onClick={() => setManagerView("analytics")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  managerView === "analytics" 
                    ? "bg-white text-indigo-700 shadow-3xs" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <TrendingUp className="h-4 w-4 text-indigo-600" /> Customer Analytics (8.3)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 shrink-0">
          <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-2xl">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Total Customers</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-800 font-mono">{stats.total}</span>
              <span className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5 font-mono">
                <TrendingUp className="h-3 w-3" /> Live
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-2xl">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">High Value (₹50k+)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-800 font-mono">{stats.highValue}</span>
              <span className="text-[10px] text-teal-600 font-bold font-mono">
                {((stats.highValue / (stats.total || 1)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-2xl">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Frequent Buyers</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-800 font-mono">{stats.frequentCount}</span>
              <span className="text-[10px] text-indigo-600 font-bold font-mono">
                {((stats.frequentCount / (stats.total || 1)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-2xl col-span-2 md:col-span-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Gross Account Value</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-black text-teal-700 font-mono">₹{(stats.totalSpentSum / 1000).toFixed(1)}k</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100/50 p-3.5 rounded-2xl col-span-2 md:col-span-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Avg Buyer Rating</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xl font-black text-slate-800 font-mono">★ {stats.averageRating}</span>
              <span className="text-[9px] text-amber-500 font-black uppercase">GOLD</span>
            </div>
          </div>
        </div>

        {managerView === "directory" && (
          <>
            {/* Filter and Search controls */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shrink-0 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search inputs */}
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by buyer name, mobile, email, company..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              )}
            </div>

            {/* Quick manual customer button */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Partner
            </button>
          </div>

          {/* Interactive drop filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter Matrix:
            </div>

            {/* Location filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-semibold">Location:</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none"
              >
                {locationsList.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Frequency filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-semibold">Frequency:</span>
              <select
                value={selectedFrequency}
                onChange={(e) => setSelectedFrequency(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="All">All Frequencies</option>
                <option value="Frequent">Frequent (&gt; 10 orders)</option>
                <option value="Occasional">Occasional (3-10 orders)</option>
                <option value="New">New (&lt; 3 orders)</option>
              </select>
            </div>

            {/* Spent filter */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-semibold">Lifetime Spent:</span>
              <select
                value={selectedSpent}
                onChange={(e) => setSelectedSpent(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="All">All Spent Levels</option>
                <option value="High">High (&gt; ₹1,00,000)</option>
                <option value="Medium">Medium (₹50,000 - ₹1,00,000)</option>
                <option value="Low">Low (&lt; ₹50,000)</option>
              </select>
            </div>

            {/* Clear filters utility */}
            {(selectedLocation !== "All" || selectedFrequency !== "All" || selectedSpent !== "All" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedLocation("All");
                  setSelectedFrequency("All");
                  setSelectedSpent("All");
                  setSearchQuery("");
                }}
                className="text-teal-600 hover:text-teal-800 font-bold uppercase tracking-wider text-[10px] ml-auto flex items-center gap-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Core content grid */}
        <div className="flex-1 flex flex-col lg:flex-row gap-5 overflow-hidden min-h-0">
          
          {/* Left: Customer Records list */}
          <div className="flex-1 overflow-y-auto border border-slate-100 rounded-2xl bg-slate-50/20">
            {filteredCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Users className="h-12 w-12 text-slate-300 stroke-[1.5] mb-2" />
                <h4 className="text-slate-700 font-black text-sm">No Customer Records Found</h4>
                <p className="text-slate-400 text-xs mt-1 max-w-xs">No active buyers matched your search queries or matrix filter settings. Adjust filters or register a partner manually.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredCustomers.map(cust => {
                  const isSelected = syncedSelectedCustomer?.id === cust.id;
                  return (
                    <div
                      key={cust.id}
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setActiveDetailTab("profile");
                      }}
                      className={`p-4 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected 
                          ? "bg-teal-50/45 border-l-4 border-teal-600" 
                          : "hover:bg-slate-50 bg-white"
                      }`}
                    >
                      {/* Customer core info */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-black text-slate-800 tracking-tight">{cust.name}</h4>
                          <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                            {cust.id}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.2 rounded-full ${
                            cust.totalSpent >= 50000 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {cust.totalSpent >= 50000 ? "⭐ High Value" : "Standard"}
                          </span>
                        </div>

                        {/* Co & Loc */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-[11px] font-semibold">
                          <span className="flex items-center gap-1 text-slate-600 font-bold">
                            <Building className="h-3 w-3 text-slate-400" /> {cust.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" /> {cust.location}
                          </span>
                        </div>

                        {/* Contact details */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-[10px] font-mono">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-300" /> {cust.mobile}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-300" /> {cust.email}
                          </span>
                        </div>
                      </div>

                      {/* Customer performance metrics metrics */}
                      <div className="flex items-center gap-6 shrink-0 bg-slate-50/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                        <div className="text-center">
                          <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider block">Total Orders</span>
                          <span className="text-xs font-black text-slate-700 font-mono flex items-center gap-1 justify-center">
                            <ShoppingBag className="h-3 w-3 text-slate-400" /> {cust.totalOrders}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider block">Lifetime Spent</span>
                          <span className="text-xs font-extrabold text-teal-700 font-mono block">
                            ₹{cust.totalSpent.toLocaleString()}
                          </span>
                        </div>

                        <div className="text-center">
                          <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider block">Avg Rating</span>
                          <span className="text-xs font-black text-amber-500 font-mono flex items-center gap-0.5 justify-center">
                            ★ {cust.baseRating}
                          </span>
                        </div>
                        
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isSelected ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Selected Customer FULL CRM PAGE DRAW PANEL */}
          <div className="w-full lg:w-[480px] border border-slate-150 rounded-3xl bg-slate-50 flex flex-col shrink-0 overflow-hidden">
            {syncedSelectedCustomer ? (
              <div className="h-full flex flex-col overflow-hidden">
                
                {/* 1. Header Profile Box (Permanent) */}
                <div className="bg-white p-5 border-b border-slate-100 shrink-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-teal-50 border border-teal-100 text-teal-800 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                          {syncedSelectedCustomer.id}
                        </span>
                        <span className="bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {syncedSelectedCustomer.status}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-800 tracking-tight">{syncedSelectedCustomer.name}</h4>
                      <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-slate-400" /> {syncedSelectedCustomer.company}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-wider">AOV (Avg Order)</span>
                      <span className="text-sm font-black text-teal-700 font-mono">
                        ₹{Math.round(syncedSelectedCustomer.avgOrderValue).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Segment Tab Controls */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mt-4 text-[11px] font-bold">
                    <button
                      onClick={() => setActiveDetailTab("profile")}
                      className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-all ${
                        activeDetailTab === "profile" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveDetailTab("orders")}
                      className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-all relative ${
                        activeDetailTab === "orders" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Orders
                      {customerOrdersList.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-teal-600 text-white font-mono font-black text-[8px] h-4 w-4 rounded-full flex items-center justify-center">
                          {customerOrdersList.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveDetailTab("reviews")}
                      className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-all relative ${
                        activeDetailTab === "reviews" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Reviews
                      {(syncedSelectedCustomer.reviews?.length || 0) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-mono font-black text-[8px] h-4 w-4 rounded-full flex items-center justify-center">
                          {syncedSelectedCustomer.reviews?.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveDetailTab("coupons")}
                      className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-all relative ${
                        activeDetailTab === "coupons" ? "bg-white text-slate-800 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Coupons
                      {(syncedSelectedCustomer.coupons?.length || 0) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white font-mono font-black text-[8px] h-4 w-4 rounded-full flex items-center justify-center">
                          {syncedSelectedCustomer.coupons?.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Scrollable Body Content */}
                <div className="flex-1 p-5 overflow-y-auto min-h-0 space-y-4">
                  
                  {/* TAB 1: PROFILE & DYNAMIC CONTACT INFO */}
                  {activeDetailTab === "profile" && (
                    <div className="space-y-4 animate-fade-in text-xs font-semibold">
                      
                      {/* Identity Details card */}
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl space-y-2 text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">GST Registration:</span>
                          <span className="font-mono text-slate-800 font-extrabold tracking-wider bg-slate-50 px-2 py-0.5 rounded">
                            {syncedSelectedCustomer.gstNumber || "06AAACP4212J1Z3"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Join Date:</span>
                          <span className="font-mono text-slate-800">{syncedSelectedCustomer.joinedDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Mobile Connection:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-slate-800">{syncedSelectedCustomer.mobile}</span>
                            <button
                              onClick={() => handleCopy(syncedSelectedCustomer.mobile, "mob")}
                              className="p-1 hover:bg-slate-100 text-slate-400 rounded transition-colors"
                            >
                              {copyFeedback["mob"] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Direct Email:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-slate-800">{syncedSelectedCustomer.email}</span>
                            <button
                              onClick={() => handleCopy(syncedSelectedCustomer.email, "mail")}
                              className="p-1 hover:bg-slate-100 text-slate-400 rounded transition-colors"
                            >
                              {copyFeedback["mail"] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="border-t border-slate-100 pt-3">
                          <span className="text-slate-400 block mb-1">Mandi Address:</span>
                          <p className="text-slate-700 leading-relaxed font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                            {syncedSelectedCustomer.address || `${syncedSelectedCustomer.location}, India`}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic outreach message */}
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center gap-1.5 text-slate-800 font-black text-[11px] uppercase tracking-wider">
                          <MessageSquare className="h-4 w-4 text-indigo-500" /> Dispatch Direct Message
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg text-[9px] font-bold text-center uppercase tracking-wider">
                          <button
                            onClick={() => setMessageChannel("email")}
                            className={`py-1 rounded-md cursor-pointer ${
                              messageChannel === "email" ? "bg-white text-indigo-700 font-extrabold" : "text-slate-400"
                            }`}
                          >
                            Email
                          </button>
                          <button
                            onClick={() => setMessageChannel("sms")}
                            className={`py-1 rounded-md cursor-pointer ${
                              messageChannel === "sms" ? "bg-white text-indigo-700 font-extrabold" : "text-slate-400"
                            }`}
                          >
                            SMS
                          </button>
                          <button
                            onClick={() => setMessageChannel("whatsapp")}
                            className={`py-1 rounded-md cursor-pointer ${
                              messageChannel === "whatsapp" ? "bg-white text-indigo-700 font-extrabold" : "text-slate-400"
                            }`}
                          >
                            WhatsApp
                          </button>
                        </div>

                        {messageChannel === "email" && (
                          <input
                            type="text"
                            placeholder="Message Subject line..."
                            value={messageSubject}
                            onChange={(e) => setMessageSubject(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        )}

                        <textarea
                          placeholder={`Type direct outreach text for ${syncedSelectedCustomer.name}...`}
                          value={messageBody}
                          onChange={(e) => setMessageBody(e.target.value)}
                          className="w-full h-20 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />

                        {sendSuccess && (
                          <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                            {sendSuccess}
                          </p>
                        )}

                        <button
                          onClick={handleSendMessage}
                          disabled={isSending || !messageBody.trim()}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                        >
                          {isSending ? "Simulating dispatch..." : "Send Message"}
                        </button>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: ORDER LEDGER HISTORY */}
                  {activeDetailTab === "orders" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                          <span className="text-slate-400 font-semibold block text-[10px]">LIFETIME SPENT</span>
                          <span className="text-sm font-black text-teal-700 font-mono">
                            ₹{syncedSelectedCustomer.totalSpent.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-white border border-slate-100 p-2.5 rounded-xl">
                          <span className="text-slate-400 font-semibold block text-[10px]">TOTAL ORDERS</span>
                          <span className="text-sm font-black text-slate-800 font-mono">
                            {syncedSelectedCustomer.totalOrders}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Live & Historical Transactions</span>
                        
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {customerOrdersList.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs italic space-y-1">
                              <ShoppingBag className="h-8 w-8 mx-auto text-slate-200" />
                              <p>No active workspace pipeline transactions listed.</p>
                              <p className="text-[9px] text-slate-400">Orders placed via the "Farmer" tab show up here automatically.</p>
                            </div>
                          ) : (
                            customerOrdersList.map((o: any) => (
                              <div key={o.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                                <div className="space-y-1">
                                  <span className="font-extrabold text-slate-700 block max-w-[200px] truncate">{o.productName}</span>
                                  <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
                                    <span>ID: {o.id}</span>
                                    <span>•</span>
                                    <span>{o.date}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-teal-700 block font-mono">₹{(o.amount * 84).toLocaleString()}</span>
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.2 rounded-full ${
                                    o.status === "delivered" 
                                      ? "bg-emerald-50 text-emerald-700" 
                                      : o.status === "shipped" 
                                      ? "bg-amber-50 text-amber-700" 
                                      : "bg-sky-50 text-sky-700"
                                  }`}>
                                    {o.status}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CUSTOMER REVIEWS & RATING LOGS */}
                  {activeDetailTab === "reviews" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl text-center text-xs space-y-2">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Averaged Rating Score</span>
                        <div className="flex items-center justify-center gap-1 text-2xl font-black text-amber-500 font-mono">
                          ★ {syncedSelectedCustomer.baseRating}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">This metric is based on cumulative ratings provided for bulk crop seeds, bio-pesticides, and nutrient deliveries.</p>
                      </div>

                      <div className="space-y-2">
                        {(!syncedSelectedCustomer.reviews || syncedSelectedCustomer.reviews.length === 0) ? (
                          <div className="bg-white border border-slate-100 p-8 rounded-2xl text-center text-slate-400 text-xs italic">
                            <FileText className="h-8 w-8 mx-auto text-slate-200 mb-1" />
                            No review remarks log entered by this customer yet.
                          </div>
                        ) : (
                          syncedSelectedCustomer.reviews.map(rev => (
                            <div key={rev.id} className="bg-white border border-slate-100 p-3.5 rounded-2xl space-y-2 text-xs font-semibold">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                                <div className="flex items-center text-amber-500 font-mono text-[11px] font-black">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"}`} />
                                  ))}
                                </div>
                              </div>
                              <span className="text-[11px] font-black text-slate-700 block">{rev.productName}</span>
                              <p className="text-slate-500 italic font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                "{rev.comment}"
                              </p>

                              {/* Reply Section (Section 7.4 Response UI) */}
                              {rev.reply ? (
                                <div className="bg-indigo-50/30 border border-indigo-100 p-2.5 rounded-xl ml-3 mt-2 space-y-1">
                                  <div className="flex items-center justify-between text-[9px] text-indigo-700 font-bold">
                                    <span className="flex items-center gap-1 uppercase tracking-wider">
                                      <Check className="h-3 w-3 text-emerald-500" /> Replied on {rev.replyDate}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteReviewReply(syncedSelectedCustomer.id, rev.id)}
                                      className="text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-slate-600 font-semibold italic leading-relaxed">"{rev.reply}"</p>
                                </div>
                              ) : (
                                <div className="mt-2 ml-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50 space-y-2">
                                  <label className="text-[9px] uppercase font-bold text-slate-400 block">Respond to Buyer</label>
                                  <textarea
                                    placeholder="Write your professional response..."
                                    value={reviewReplyTexts[rev.id] || ""}
                                    onChange={(e) => setReviewReplyTexts(prev => ({ ...prev, [rev.id]: e.target.value }))}
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-14"
                                  />
                                  <div className="flex items-center justify-between">
                                    <button
                                      type="button"
                                      onClick={() => setReviewReplyTexts(prev => ({
                                        ...prev,
                                        [rev.id]: rev.rating >= 4 
                                          ? "Thank you for the wonderful feedback! We are absolutely thrilled to support your operations and strive to maintain top-tier seeds and supplies."
                                          : "We are deeply sorry for this negative experience. Our logistics and quality teams are investigating this right away. We value your partnership and will make this right."
                                      }))}
                                      className="text-[8px] bg-white hover:bg-slate-100 text-indigo-700 px-2 py-1 rounded border border-slate-200 font-bold uppercase cursor-pointer"
                                    >
                                      ⚡ Auto-Template
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handlePublishReviewReply(syncedSelectedCustomer.id, rev.id)}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                                    >
                                      Publish Reply
                                    </button>
                                  </div>
                                  {reviewSuccessFeedback[rev.id] && (
                                    <p className="text-[9px] text-emerald-600 font-bold">
                                      {reviewSuccessFeedback[rev.id]}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: COUPONS & DISCOUNTS GENERATOR */}
                  {activeDetailTab === "coupons" && (
                    <div className="space-y-4 animate-fade-in text-xs font-semibold">
                      
                      {/* Active Coupons List */}
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between shrink-0">
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Assigned Promotional Coupons</span>
                          {!isCreatingCoupon && (
                            <button
                              onClick={() => {
                                setIsCreatingCoupon(true);
                                setCouponCode(`${syncedSelectedCustomer.name.split(" ")[0]?.toUpperCase()}${Math.floor(10 + Math.random() * 90)}`);
                              }}
                              className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-black uppercase px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 hover:bg-indigo-100 transition-colors"
                            >
                              <Plus className="h-3 w-3" /> Offer Discount
                            </button>
                          )}
                        </div>

                        {isCreatingCoupon && (
                          <form onSubmit={handleCreateCoupon} className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-3 animate-slide-in">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                              <span className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1">
                                <Tag className="h-3.5 w-3.5" /> Coupon Configurator
                              </span>
                              <button
                                type="button"
                                onClick={() => setIsCreatingCoupon(false)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-0.5">
                                <label className="text-[9px] uppercase font-bold text-slate-400">CODE</label>
                                <input
                                  required
                                  type="text"
                                  value={couponCode}
                                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-bold"
                                />
                              </div>

                              <div className="space-y-0.5">
                                <label className="text-[9px] uppercase font-bold text-slate-400">DISCOUNT TYPE</label>
                                <select
                                  value={couponType}
                                  onChange={(e) => setCouponType(e.target.value as any)}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700"
                                >
                                  <option value="percentage">Percentage (%)</option>
                                  <option value="flat">Flat Cash (₹)</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-0.5">
                                <label className="text-[9px] uppercase font-bold text-slate-400">VALUE</label>
                                <input
                                  required
                                  type="number"
                                  min="1"
                                  value={couponValue}
                                  onChange={(e) => setCouponValue(parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-bold"
                                />
                              </div>

                              <div className="space-y-0.5">
                                <label className="text-[9px] uppercase font-bold text-slate-400">MIN SPEND (₹)</label>
                                <input
                                  type="number"
                                  placeholder="None"
                                  value={couponMinSpend}
                                  onChange={(e) => setCouponMinSpend(e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <label className="text-[9px] uppercase font-bold text-slate-400">EXPIRY DATE</label>
                              <input
                                required
                                type="date"
                                value={couponExpiry}
                                onChange={(e) => setCouponExpiry(e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-bold"
                              />
                            </div>

                            {couponSuccess && (
                              <p className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 p-2 rounded-lg font-bold">
                                {couponSuccess}
                              </p>
                            )}

                            <button
                              type="submit"
                              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                            >
                              Generate Coupon
                            </button>
                          </form>
                        )}

                        <div className="space-y-2">
                          {(!syncedSelectedCustomer.coupons || syncedSelectedCustomer.coupons.length === 0) ? (
                            <div className="p-8 text-center text-slate-400 italic space-y-1">
                              <Gift className="h-8 w-8 mx-auto text-slate-200" />
                              <p>No active coupon promotions assigned.</p>
                              <p className="text-[9px] text-slate-400">Offer custom pricing incentives to reward bulk purchase behavior.</p>
                            </div>
                          ) : (
                            syncedSelectedCustomer.coupons.map(cpn => (
                              <div key={cpn.id} className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl flex items-center justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-black text-xs text-indigo-700 bg-indigo-100/60 px-2 py-0.5 rounded">
                                      {cpn.code}
                                    </span>
                                    <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full">
                                      {cpn.status}
                                    </span>
                                  </div>
                                  <div className="text-[9px] text-slate-400 font-mono">
                                    <span>Expires: {cpn.expiry}</span>
                                    {cpn.minSpend && <span> | Min: ₹{cpn.minSpend.toLocaleString()}</span>}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-black text-indigo-700 font-mono">
                                    {cpn.discountType === "percentage" ? `${cpn.discountValue}%` : `₹${cpn.discountValue}`} OFF
                                  </span>
                                  <span className="text-[8px] block uppercase text-slate-400 font-bold">Incentive Reward</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="p-3 bg-white border border-slate-200/80 shadow-3xs rounded-2xl text-slate-400">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight">Select Partner Profile</h4>
                  <p className="text-slate-400 text-[10px] leading-relaxed max-w-[210px] font-semibold mt-1">Click on any buyer profile row in the directory list to view deep analytics, lifetime ledger tracking, and outbound channels.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </>
    )}

    {managerView === "segments" && (
      /* Segment Campaigns View */
      <div className="flex-1 flex flex-col lg:flex-row gap-5 overflow-hidden min-h-0">
        
        {/* Left: Segments List Card Grid */}
        <div className="w-full lg:w-[360px] flex flex-col gap-3 overflow-y-auto shrink-0 pr-1">
          <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-2xl flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
            <div>
              <h4 className="text-[11px] font-black uppercase text-indigo-900 tracking-tight">Segmentation Matrix</h4>
              <p className="text-[9px] text-indigo-600 font-semibold leading-none">Select a target audience to trigger bulk campaigns</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {segmentsList.map((seg) => {
              const members = processedCustomers.filter(seg.filterFn);
              const isSelected = selectedSegmentId === seg.id;
              const totalSpent = members.reduce((sum, c) => sum + c.totalSpent, 0);
              const IconComponent = seg.icon;

              return (
                <button
                  key={seg.id}
                  onClick={() => {
                    setSelectedSegmentId(seg.id);
                    // Pre-fill a smart code prefix
                    setSegmentCouponCode(`${seg.id.substring(0, 5).toUpperCase()}${Math.floor(10 + Math.random() * 89)}`);
                    setSegmentCouponSuccess("");
                    setSegmentSendSuccess("");
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col gap-2.5 ${
                    isSelected
                      ? "bg-white border-indigo-600 shadow-3xs ring-1 ring-indigo-500/10"
                      : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                        <IconComponent className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight block">
                          {seg.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5 leading-tight">
                          {seg.description}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${seg.badgeBg}`}>
                      {members.length}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100/60 text-[10px] font-semibold">
                    <span className="text-slate-400">COMBINED LEDGER:</span>
                    <span className="text-slate-700 font-mono font-black">₹{totalSpent.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Segment campaign panel & list */}
        {(() => {
          const selectedSeg = segmentsList.find(s => s.id === selectedSegmentId) || segmentsList[0];
          const members = processedCustomers.filter(selectedSeg.filterFn);
          const totalSpent = members.reduce((sum, c) => sum + c.totalSpent, 0);
          const IconComponent = selectedSeg.icon;

          return (
            <div className="flex-1 border border-slate-200/80 rounded-3xl bg-slate-50/30 flex flex-col overflow-hidden min-w-0">
              
              {/* Selected segment profile banner */}
              <div className="p-4 bg-white border-b border-slate-100 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl shrink-0">
                    <IconComponent className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{selectedSeg.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${selectedSeg.badgeBg}`}>
                        Targeted Audience
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-semibold leading-tight mt-0.5">{selectedSeg.tagline}</p>
                  </div>
                </div>

                {/* Quick KPIs for this selection */}
                <div className="flex gap-4 border-l border-slate-100 pl-4 font-mono text-right shrink-0">
                  <div>
                    <span className="text-[8px] uppercase font-bold text-slate-400 block">Total Reach</span>
                    <span className="text-xs font-black text-slate-700">{members.length} Buyers</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase font-bold text-slate-400 block">Combined Value</span>
                    <span className="text-xs font-black text-indigo-700 font-semibold">₹{totalSpent.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Sub-navigation tabs inside Campaign Hub */}
              <div className="px-5 pt-3 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex gap-5">
                  {(["message", "coupon", "audience"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setCampaignTab(tab);
                        setSegmentCouponSuccess("");
                        setSegmentSendSuccess("");
                      }}
                      className={`pb-2.5 text-[10px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                        campaignTab === tab
                          ? "border-indigo-600 text-indigo-700"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tab === "message" && "📢 Send Targeted Offers"}
                      {tab === "coupon" && "🎫 Segment Coupon"}
                      {tab === "audience" && `👥 Target Audience (${members.length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic campaign screen views */}
              <div className="flex-1 overflow-y-auto p-5 min-h-0">
                
                {/* SUB-VIEW 1: BULK OFFERS BROADCAST */}
                {campaignTab === "message" && (
                  <div className="max-w-2xl mx-auto space-y-4 animate-fade-in text-xs font-semibold">
                    <div className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">OUTBOUND DISPATCH CHANNEL</span>
                        <span className="text-slate-500 font-semibold leading-relaxed">Broadcast customized marketing assets to all qualified segment buyers at once.</span>
                      </div>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                        {(["email", "sms", "whatsapp"] as const).map(chan => (
                          <button
                            key={chan}
                            type="button"
                            onClick={() => {
                              setSegmentMessageChannel(chan);
                              setSegmentSendSuccess("");
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[9px] uppercase font-black transition-all cursor-pointer ${
                              segmentMessageChannel === chan
                                ? "bg-white text-indigo-700 shadow-3xs"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            {chan}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Conversional templates quick select */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                        🚀 High-Yield Conversion Templates
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {segmentTemplates[selectedSeg.id]?.map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSegmentMessageSubject(tmpl.subject);
                              setSegmentMessageBody(tmpl.body);
                              setSegmentSendSuccess("");
                            }}
                            className="p-3 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-left transition-colors flex flex-col gap-1 cursor-pointer"
                          >
                            <span className="font-black text-[10px] text-slate-700 uppercase flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-amber-500 shrink-0" /> {tmpl.title}
                            </span>
                            <p className="text-[9px] text-slate-400 font-medium line-clamp-1">{tmpl.subject}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Drafting Form fields */}
                    <div className="bg-white border border-slate-150 p-4 rounded-2xl space-y-3.5">
                      {segmentMessageChannel === "email" && (
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-400">EMAIL SUBJECT LINE</label>
                          <input
                            type="text"
                            value={segmentMessageSubject}
                            onChange={(e) => setSegmentMessageSubject(e.target.value)}
                            placeholder="Enter email campaign heading..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-semibold text-slate-700"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400">
                          MESSAGE BODY ({segmentMessageChannel.toUpperCase()})
                        </label>
                        <textarea
                          rows={5}
                          value={segmentMessageBody}
                          onChange={(e) => setSegmentMessageBody(e.target.value)}
                          placeholder={`Draft segment offer message body here...`}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-medium text-slate-700 leading-relaxed font-mono"
                        />
                      </div>

                      {segmentSendSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-bold animate-fade-in text-[10px]">
                          {segmentSendSuccess}
                        </div>
                      )}

                      <button
                        onClick={handleSendSegmentMessage}
                        disabled={isSegmentSending || !segmentMessageBody.trim()}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isSegmentSending ? (
                          <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Megaphone className="h-3.5 w-3.5" />
                        )}
                        Broadcast Campaign to {members.length} {selectedSeg.name}
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB-VIEW 2: SEGMENT COUPON ISSUER */}
                {campaignTab === "coupon" && (
                  <div className="max-w-md mx-auto bg-white border border-slate-155 p-5 rounded-2xl space-y-4 animate-fade-in text-xs font-semibold">
                    <div className="text-center space-y-1 pb-2 border-b border-slate-100">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl inline-block">
                        <Tag className="h-5 w-5" />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-tight text-slate-800">Issue Group Promotion Incentive</h4>
                      <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto font-semibold leading-normal">
                        Generate and assign an identical active coupon promotion to all {members.length} partners in this group instantly.
                      </p>
                    </div>

                    <form onSubmit={handleCreateSegmentCoupon} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                          <label className="text-[9px] uppercase font-bold text-slate-400">COUPON CODE</label>
                          <input
                            required
                            type="text"
                            value={segmentCouponCode}
                            onChange={(e) => setSegmentCouponCode(e.target.value.toUpperCase())}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold uppercase"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <label className="text-[9px] uppercase font-bold text-slate-400">DISCOUNT TYPE</label>
                          <select
                            value={segmentCouponType}
                            onChange={(e) => setSegmentCouponType(e.target.value as any)}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="flat">Flat Cash (₹)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                          <label className="text-[9px] uppercase font-bold text-slate-400">VALUE</label>
                          <input
                            required
                            type="number"
                            min="1"
                            value={segmentCouponValue}
                            onChange={(e) => setSegmentCouponValue(parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>

                        <div className="space-y-0.5">
                          <label className="text-[9px] uppercase font-bold text-slate-400">MIN SPEND (₹)</label>
                          <input
                            type="number"
                            placeholder="None"
                            value={segmentCouponMinSpend}
                            onChange={(e) => setSegmentCouponMinSpend(e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <label className="text-[9px] uppercase font-bold text-slate-400">EXPIRY DATE</label>
                        <input
                          required
                          type="date"
                          value={segmentCouponExpiry}
                          onChange={(e) => setSegmentCouponExpiry(e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>

                      {segmentCouponSuccess && (
                        <p className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl font-bold leading-normal">
                          {segmentCouponSuccess}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                      >
                        Generate & Assign Coupon
                      </button>
                    </form>
                  </div>
                )}

                {/* SUB-VIEW 3: AUDIENCE MEMBERS LIST */}
                {campaignTab === "audience" && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden animate-fade-in text-xs font-semibold">
                    <div className="p-3 bg-slate-50/50 border-b border-slate-150 flex items-center justify-between font-bold text-[10px] text-slate-400">
                      <span>AUDIENCE MEMBER DIRECTORY ({members.length} PARTNERS)</span>
                      <span className="text-[8px] tracking-wider uppercase">CLICK ROW TO INSPECT LEDGER</span>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                      {members.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 italic">
                          No buyer accounts currently sit in this segment.
                        </div>
                      ) : (
                        members.map((cust) => (
                          <button
                            key={cust.id}
                            type="button"
                            onClick={() => {
                              setManagerView("directory");
                              setSelectedCustomer(cust);
                              setActiveDetailTab("profile");
                            }}
                            className="w-full text-left p-3.5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-800">{cust.name}</span>
                                <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.2 rounded-md">
                                  {cust.company}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-300" /> {cust.location}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-right">
                              <div className="font-mono">
                                <span className="text-[9px] text-slate-400 block font-bold">TOTAL SPENT</span>
                                <span className="text-slate-800 font-bold">₹{cust.totalSpent.toLocaleString()}</span>
                              </div>
                              <div className="font-mono">
                                <span className="text-[9px] text-slate-400 block font-bold">ORDERS</span>
                                <span className="text-slate-800 font-bold">{cust.totalOrders}</span>
                              </div>
                              <div className="p-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 shrink-0">
                                <ArrowRight className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })()}
      </div>
    )}

    {managerView === "reviews" && (
      /* Reviews & Feedback Hub (Section 7.4 Requirements) */
      <div className="flex-1 flex flex-col lg:flex-row gap-5 overflow-hidden min-h-0 animate-fade-in">
        
        {/* Left pane: Review Analytics & Filters */}
        <div className="w-full lg:w-[350px] flex flex-col gap-4 overflow-y-auto shrink-0 pr-1">
          
          {/* Section description */}
          <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-2xl flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
            <div>
              <h4 className="text-[11px] font-black uppercase text-amber-900 tracking-tight">Review Analytics Hub</h4>
              <p className="text-[9px] text-amber-600 font-semibold leading-none">View rating metrics and reply to buyer reviews</p>
            </div>
          </div>

          {/* Average & Distribution Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-4">
            <div className="text-center py-2 bg-amber-50/20 border border-amber-100/50 rounded-2xl">
              <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Cumulative Partner Rating</span>
              <div className="flex items-center justify-center gap-1 text-3xl font-black text-amber-500 font-mono mt-1">
                ★ {reviewAnalytics.avgRating}
              </div>
              <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Based on {allReviews.length} client reviews</span>
            </div>

            {/* Rating distribution bar list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>RATING DISTRIBUTION</span>
                {(activeReviewRatingFilter !== "All" || activeReviewThemeFilter !== "All") && (
                  <button
                    onClick={() => {
                      setActiveReviewRatingFilter("All");
                      setActiveReviewThemeFilter("All");
                    }}
                    className="text-indigo-600 hover:text-indigo-800 uppercase text-[9px] flex items-center gap-0.5 cursor-pointer font-bold"
                  >
                    <RotateCcw className="h-2.5 w-2.5 text-indigo-500" /> Clear Filters
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = reviewAnalytics.distribution[stars] || 0;
                  const pct = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
                  const isSelected = activeReviewRatingFilter === stars;

                  return (
                    <button
                      key={stars}
                      onClick={() => {
                        setActiveReviewRatingFilter(isSelected ? "All" : stars);
                      }}
                      className={`w-full flex items-center gap-2 text-left p-1 rounded-lg transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-amber-50 border border-amber-200/60" 
                          : "hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-black text-slate-600 w-3 text-right">{stars}</span>
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                      
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            stars >= 4 ? "bg-amber-400" : stars === 3 ? "bg-orange-300" : "bg-rose-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <span className="text-[10px] font-mono font-bold text-slate-500 w-6 text-right">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Keyword Themes Cloud (Section 7.4 Positive/Negative Themes) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3.5">
            <div>
              <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Semantic Feedback Themes</h5>
              <p className="text-[9px] text-slate-400 leading-tight">Click keywords to filter review comment logs</p>
            </div>

            {/* Positive Keywords */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide block">👍 POSITIVE VIBES</span>
              <div className="flex flex-wrap gap-1">
                {reviewAnalytics.positiveKeywords.length === 0 ? (
                  <span className="text-[9px] text-slate-400 italic">No recurring themes found.</span>
                ) : (
                  reviewAnalytics.positiveKeywords.map(t => {
                    const isSelected = activeReviewThemeFilter === t.word;
                    return (
                      <button
                        key={t.word}
                        onClick={() => setActiveReviewThemeFilter(isSelected ? "All" : t.word)}
                        className={`text-[10px] font-bold px-2 py-0.8 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-emerald-50 hover:bg-emerald-100 border-emerald-100 text-emerald-700"
                        }`}
                      >
                        {t.label} ({t.count})
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Negative/Concern Keywords */}
            <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
              <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wide block">⚠️ AREA OF CONCERN</span>
              <div className="flex flex-wrap gap-1">
                {reviewAnalytics.negativeKeywords.length === 0 ? (
                  <span className="text-[9px] text-slate-400 italic">No recurring concerns detected.</span>
                ) : (
                  reviewAnalytics.negativeKeywords.map(t => {
                    const isSelected = activeReviewThemeFilter === t.word;
                    return (
                      <button
                        key={t.word}
                        onClick={() => setActiveReviewThemeFilter(isSelected ? "All" : t.word)}
                        className={`text-[10px] font-bold px-2 py-0.8 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-rose-600 border-rose-600 text-white"
                            : "bg-rose-50 hover:bg-rose-100 border-rose-100 text-rose-700"
                        }`}
                      >
                        {t.label} ({t.count})
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right pane: Active Reviews feed */}
        <div className="flex-1 flex flex-col min-h-0 gap-3">
          
          {/* Feed Filter Summary Toolbar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg">
                <MessageSquare className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block leading-tight">Reviews Feed</span>
                <span className="text-slate-700 text-xs font-black">
                  Showing {filteredReviewsList.length} of {allReviews.length} reviews
                </span>
              </div>
            </div>

            {/* Active Filters list */}
            {(activeReviewRatingFilter !== "All" || activeReviewThemeFilter !== "All" || searchQuery.trim()) && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeReviewRatingFilter !== "All" && (
                  <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                    ★ {activeReviewRatingFilter} Stars
                    <button onClick={() => setActiveReviewRatingFilter("All")} className="hover:text-amber-950 font-black cursor-pointer">×</button>
                  </span>
                )}
                {activeReviewThemeFilter !== "All" && (
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 uppercase">
                    Theme: {activeReviewThemeFilter}
                    <button onClick={() => setActiveReviewThemeFilter("All")} className="hover:text-indigo-950 font-black cursor-pointer">×</button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                    Search: "{searchQuery.slice(0, 10)}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-slate-950 font-black cursor-pointer">×</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setActiveReviewRatingFilter("All");
                    setActiveReviewThemeFilter("All");
                    setSearchQuery("");
                  }}
                  className="text-[9px] text-slate-400 hover:text-slate-600 font-bold uppercase underline pl-1 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Feed Grid scroll area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5">
            {filteredReviewsList.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-400 font-semibold text-xs italic">
                <MessageSquare className="h-10 w-10 mx-auto text-slate-200 mb-2" />
                No buyer reviews match the selected filter or search criteria.
                <button 
                  onClick={() => {
                    setActiveReviewRatingFilter("All");
                    setActiveReviewThemeFilter("All");
                    setSearchQuery("");
                  }}
                  className="block mx-auto mt-2 text-[10px] text-indigo-600 font-black uppercase not-italic underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredReviewsList.map(rev => {
                const isPositive = rev.rating >= 4;
                return (
                  <div key={rev.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 transition-shadow hover:shadow-xs text-xs font-semibold">
                    
                    {/* Header: Customer Meta & Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Navigate to Directory tab & select customer
                              const match = processedCustomers.find(pc => pc.id === rev.customerId);
                              if (match) {
                                setManagerView("directory");
                                setSelectedCustomer(match);
                                setActiveDetailTab("reviews");
                              }
                            }}
                            className="font-black text-slate-800 hover:text-indigo-600 hover:underline text-left cursor-pointer"
                          >
                            {rev.customerName}
                          </button>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.2 rounded font-bold">
                            {rev.customerCompany}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 block mt-0.5 flex items-center gap-1 font-semibold">
                          <MapPin className="h-2.5 w-2.5 text-slate-300" /> {rev.customerLocation}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{rev.date}</span>
                        <div className="flex items-center text-amber-500 font-mono text-[11px] font-black">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"}`} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review text comment block */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                          📦 {rev.productName}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.2 rounded-full ${
                          isPositive ? "bg-emerald-50 text-emerald-700" : rev.rating === 3 ? "bg-orange-50 text-orange-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {isPositive ? "Positive Feedback" : rev.rating === 3 ? "Neutral" : "Action Required"}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium italic leading-relaxed text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Response reply log section */}
                    {rev.reply ? (
                      <div className="bg-indigo-50/30 border border-indigo-100 p-3 rounded-xl space-y-1.5 ml-4">
                        <div className="flex items-center justify-between text-[9px] text-indigo-700 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1 font-black">
                            <Check className="h-3 w-3 text-emerald-500" /> Response published on {rev.replyDate}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteReviewReply(rev.customerId, rev.id)}
                            className="text-rose-600 hover:text-rose-800 uppercase text-[8px] font-bold cursor-pointer"
                          >
                            Remove Reply
                          </button>
                        </div>
                        <p className="text-[10.5px] text-slate-600 font-semibold italic leading-relaxed">
                          "{rev.reply}"
                        </p>
                      </div>
                    ) : (
                      <div className="ml-4 bg-slate-50/50 border border-slate-150 rounded-xl p-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] uppercase font-bold text-slate-400">Draft Outbound Response</label>
                          <span className="text-[8px] text-slate-400 font-bold uppercase font-mono">
                            {reviewReplyTexts[rev.id]?.length || 0}/300 characters
                          </span>
                        </div>
                        
                        <textarea
                          placeholder={
                            isPositive
                              ? "Thank the buyer for positive feedback (e.g. Thanks for the review!)..."
                              : "Address concerns, offer assistance or express regret..."
                          }
                          maxLength={300}
                          value={reviewReplyTexts[rev.id] || ""}
                          onChange={(e) => setReviewReplyTexts(prev => ({ ...prev, [rev.id]: e.target.value }))}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-14 font-semibold"
                        />

                        <div className="flex items-center justify-between font-bold">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setReviewReplyTexts(prev => ({
                                ...prev,
                                [rev.id]: isPositive 
                                  ? "Thank you for the wonderful feedback! We are absolutely thrilled to support your operations and strive to maintain top-tier seeds and supplies."
                                  : "We are deeply sorry for this negative experience. Our logistics and quality teams are investigating this right away. We value your partnership and will make this right."
                              }))}
                              className="text-[8px] bg-white hover:bg-slate-100 border border-slate-200 text-indigo-700 px-2.5 py-1 rounded uppercase cursor-pointer font-bold"
                            >
                              ⚡ Auto-Template
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handlePublishReviewReply(rev.customerId, rev.id)}
                            disabled={!reviewReplyTexts[rev.id]?.trim()}
                            className={`text-[9px] font-black uppercase px-3.5 py-1 rounded-lg cursor-pointer transition-all ${
                              reviewReplyTexts[rev.id]?.trim() 
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            Publish Response
                          </button>
                        </div>

                        {reviewSuccessFeedback[rev.id] && (
                          <p className="text-[9px] text-emerald-600 font-bold mt-1">
                            {reviewSuccessFeedback[rev.id]}
                          </p>
                        )}
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    )}

    {managerView === "analytics" && (
      /* Enterprise Customer Intelligence & Retention Suite (8.3 Requirements) */
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-left animate-fadeIn">
        
        {/* Intro Alert Banner */}
        <div className="p-4 bg-indigo-50/40 border border-indigo-100/60 rounded-3xl flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-indigo-600 shrink-0" />
          <div className="text-left">
            <h4 className="text-xs font-black uppercase text-indigo-900 tracking-wider">Enterprise Customer Analytics Suite</h4>
            <p className="text-[10.5px] text-indigo-600 font-semibold leading-tight mt-0.5">
              Comprehensive visibility into acquisition velocity, lifetime monetary valuations, churn warnings, and retention dynamics.
            </p>
          </div>
        </div>

        {/* First section: High Level Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* New Customers This Month */}
          <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-3xs space-y-2">
            <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider block">Acquisition (This Month)</span>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                +{customerAcquisitionMetrics.newCustomersCount}
              </h3>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase rounded-full border border-emerald-100">
                New accounts
              </span>
            </div>
            <p className="text-[9.5px] text-slate-500 font-bold leading-none">
              Registrations finalized in July 2026
            </p>
          </div>

          {/* Repeat Active Customers */}
          <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-3xs space-y-2">
            <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider block">Repeat Active Buyers</span>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-indigo-600 tracking-tight font-mono">
                {customerAcquisitionMetrics.repeatCustomersCount}
              </h3>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase rounded-full border border-indigo-100">
                Frequent Status
              </span>
            </div>
            <p className="text-[9.5px] text-slate-500 font-bold leading-none">
              Repeat partners buying this month
            </p>
          </div>

          {/* Repeat Purchase Rate */}
          <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-3xs space-y-2">
            <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider block">Repeat Purchase Rate</span>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                {customerRetentionMetrics.repeatPurchaseRate}%
              </h3>
              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[9px] font-black uppercase rounded-full border border-teal-100">
                LTV loyalty
              </span>
            </div>
            <p className="text-[9.5px] text-slate-500 font-bold leading-none">
              Buyers with 2+ historical orders
            </p>
          </div>

          {/* Average time between purchases */}
          <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-3xs space-y-2">
            <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider block">Avg Reorder Interval</span>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                {customerRetentionMetrics.averageTimeBetweenPurchases} <span className="text-xs font-bold text-slate-400 font-sans">days</span>
              </h3>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-black uppercase rounded-full border border-amber-100">
                Purchase cycle
              </span>
            </div>
            <p className="text-[9.5px] text-slate-500 font-bold leading-none">
              Averaging winter & summer intervals
            </p>
          </div>

        </div>

        {/* Second section: Retention Indicators + Churn */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Average CLV */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-black text-indigo-200 tracking-widest bg-indigo-800/60 px-2 py-0.5 rounded-full">
                Capital Valuation Metric
              </span>
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Average Customer Lifetime Value (CLV)</h4>
              <h3 className="text-3xl font-black tracking-tight font-mono text-emerald-400">
                ₹{customerCLVMetrics.averageCLV.toLocaleString()}
              </h3>
              <p className="text-[9.5px] text-slate-400 leading-normal">
                Average total capital spent per buyer account across their lifespan. This represents a healthy, high-yield regional B2B farming baseline.
              </p>
            </div>
          </div>

          {/* Churn Rate Warn Indicator */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-3xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Account Churn Risk</span>
              <AlertCircle className="h-5 w-5 text-rose-500" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs text-slate-600 font-bold uppercase">Customer Churn Rate (This Period)</h4>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight font-mono">
                {customerChurnRate}%
              </h3>
              <p className="text-[9.5px] text-slate-400 leading-normal">
                Percentage of inactive or long-term silent accounts compared to the total active register. <b>Target ceiling is &lt; 5.0%</b>.
              </p>
            </div>
          </div>

          {/* Retention Quick Summary Card */}
          <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-3xl space-y-3.5">
            <h4 className="text-xs text-slate-700 font-black uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="h-4.5 w-4.5 text-emerald-600" />
              Retention Diagnostics
            </h4>
            <div className="space-y-2.5 text-xs font-bold text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Top Acquisition Region:</span>
                <span className="font-extrabold text-slate-800">Haryana & Punjab</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200/40 pt-2">
                <span className="text-slate-500 font-semibold">Reorder Health Index:</span>
                <span className="text-emerald-600 font-extrabold flex items-center gap-1">✓ Excellent</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200/40 pt-2">
                <span className="text-slate-500 font-semibold">Monthly Active Accounts:</span>
                <span className="font-extrabold text-indigo-600 font-mono">4 Accounts</span>
              </div>
            </div>
          </div>

        </div>

        {/* Third section: Double Visual Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Chart: Registration Scale Growth */}
          <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-200 shadow-3xs flex flex-col space-y-3 h-[330px]">
            <div>
              <h4 className="text-xs uppercase font-black text-slate-500 tracking-wider">Acquisition Velocity & SCALE</h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-none mt-1">
                Visualizing new customer accounts vs. cumulative active scale
              </p>
            </div>
            <div className="flex-1 min-h-0 text-[10px] font-bold">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip formatter={(value: any) => [value, "Count"]} />
                  <Legend wrapperStyle={{ fontSize: "9.5px", fontWeight: "bold" }} />
                  <Area type="monotone" dataKey="Total Scale" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
                  <Line type="monotone" dataKey="New Partners" stroke="#10b981" strokeWidth={2} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Chart: CLV Spend distribution pie chart */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-3xs flex flex-col space-y-3 h-[330px]">
            <div>
              <h4 className="text-xs uppercase font-black text-slate-500 tracking-wider">monetary distribution by TIER</h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-none mt-1">
                Capital contribution ratio across premium, growth, and niche buyer groups
              </p>
            </div>
            <div className="flex-1 min-h-0 relative flex items-center justify-center text-[10px] font-bold">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentSpendDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {segmentSpendDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Contribution"]} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "9px", fontWeight: "bold" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Fourth Section: Top 10 Customers Leaderboard by CLV */}
        <div className="bg-white p-5 border border-slate-200 rounded-3xl shadow-3xs space-y-3 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-xs uppercase font-black text-slate-700 tracking-wider flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-amber-500" />
                Customer Lifetime Value Leaderboard (Top 10 Accounts)
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-none mt-1">
                Prioritized ranking of B2B partners by cumulative capital investment value
              </p>
            </div>
          </div>

          <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
            <div className="bg-slate-50/70 p-3 grid grid-cols-12 text-[9px] font-black uppercase text-slate-500">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-4">Partner details</div>
              <div className="col-span-3">State region</div>
              <div className="col-span-2 text-center">Order count</div>
              <div className="col-span-2 text-right">Lifetime Spent (₹)</div>
            </div>

            {customerCLVMetrics.topCustomers.map((cust, idx) => (
              <div key={cust.id} className="p-3.5 grid grid-cols-12 items-center font-bold text-slate-700 hover:bg-slate-50/30 transition-colors">
                <div className="col-span-1 text-center">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black ${
                    idx === 0 
                      ? "bg-amber-100 text-amber-800" 
                      : idx === 1 
                      ? "bg-slate-200 text-slate-800" 
                      : idx === 2 
                      ? "bg-orange-100 text-orange-800" 
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    #{idx + 1}
                  </span>
                </div>
                
                <div className="col-span-4 text-left">
                  <p className="font-extrabold text-slate-800 text-[12px]">{cust.name}</p>
                  <span className="text-[9.5px] text-slate-400 font-semibold line-clamp-1">{cust.company}</span>
                </div>

                <div className="col-span-3 text-left flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="text-slate-600 font-medium line-clamp-1">{cust.location}</span>
                </div>

                <div className="col-span-2 text-center font-mono font-black text-slate-800">
                  {cust.totalOrders} <span className="text-[9.5px] text-slate-400 font-sans block leading-none font-semibold">orders</span>
                </div>

                <div className="col-span-2 text-right font-mono font-black text-slate-900 text-[12px]">
                  ₹{cust.totalSpent.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    )}

      </div>

      {/* MANUAL REGISTER CUSTOMER DIALOG OVERLAY */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <UserCheck className="h-4.5 w-4.5 text-teal-600" /> Register Partner Account
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3.5 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Partner Contact Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Chandra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Enterprise / Company Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Karnal Seed Growers Association"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Location (City, State)</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Karnal, Haryana"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">GST Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 06AAACP4212J1Z3"
                    value={newGst}
                    onChange={(e) => setNewGst(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Mandi Yard Address</label>
                <textarea
                  placeholder="e.g. Plot 42, Sector 12, Industrial Area, Karnal"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl h-14 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Mobile Phone</label>
                  <input
                    required
                    type="text"
                    placeholder="+91 98XXX-XXXXX"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="name@company.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black uppercase tracking-wider text-[10px] transition-colors shadow-sm shadow-teal-500/10"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
