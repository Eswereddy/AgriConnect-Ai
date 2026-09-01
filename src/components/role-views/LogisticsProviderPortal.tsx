import React, { useState, useEffect, useRef } from "react";
import {
  Truck, Layers, Activity, Plus, Search, Filter, Check, X, FileText, MapPin,
  TrendingUp, DollarSign, Users, Settings, ShieldCheck, Award, Navigation,
  Clock, Sparkles, Upload, Download, AlertTriangle, Volume2, Mic, Send,
  Sliders, Bell, Mail, BookOpen, HeartHandshake, UserCheck, FileSpreadsheet,
  Play, Pause, RefreshCw, Star, ArrowRight, CheckCircle, HelpCircle, Link
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { LogisticsRoute, UserRole } from "../../types";
import SupplyChainTraceability from "../analytics/SupplyChainTraceability";

// Supported Languages List matching the global dictionary
const LANGUAGES = ["English", "Telugu", "Hindi", "Tamil", "Kannada", "Marathi", "Gujarati", "Bengali", "Punjabi", "Malayalam"];

// Dynamic translation dictionary for key logistics items
const T: Record<string, Record<string, string>> = {
  English: {
    title: "Logistics Provider Workspace",
    tagline: "Synchronize fleet resources, routing pathways, and temperature-controlled integrity.",
    onboarding: "Onboarding Wizard",
    trustScore: "Trust Score",
    activeDeliveries: "Active Deliveries",
    pendingBookings: "Pending Bookings",
    monthlyRevenue: "Monthly Revenue",
    fleetUtilization: "Fleet Utilization",
    analytics: "Fleet Analytics & Profitability Trends",
    addVehicle: "Register New Fleet Asset",
    manageFleet: "Fleet Management",
    bookings: "Transport Booking Center",
    routeEngine: "Precision Routing Engine",
    payments: "Earnings & Invoicing Control",
    crm: "Customer Relationships & Feedback",
    copilot: "AI Logistics Co-Pilot",
  },
  Hindi: {
    title: "लॉजिस्टिक्स प्रदाता कार्यक्षेत्र",
    tagline: "बेड़े के संसाधनों, मार्ग मार्गों और तापमान-नियंत्रित अखंडता को सिंक्रनाइज़ करें।",
    onboarding: "ऑनबोर्डिंग विज़ार्ड",
    trustScore: "विश्वास स्कोर",
    activeDeliveries: "सक्रिय वितरण",
    pendingBookings: "लंबित बुकिंग",
    monthlyRevenue: "मासिक राजस्व",
    fleetUtilization: "बेड़े का उपयोग",
    analytics: "बेड़े विश्लेषण और लाभप्रदता रुझान",
    addVehicle: "नया बेड़ा संपत्ति पंजीकृत करें",
    manageFleet: "बेड़े का प्रबंधन",
    bookings: "परिवहन बुकिंग केंद्र",
    routeEngine: "परिशुद्धता रूटिंग इंजन",
    payments: "आय और चालान नियंत्रण",
    crm: "ग्राहक संबंध और प्रतिक्रिया",
    copilot: "एआई लॉजिस्टिक्स को-पायलट",
  },
  Telugu: {
    title: "లాజిస్టిక్స్ ప్రొవైడర్ వర్క్‌స్పేస్",
    tagline: "ఫ్లీట్ వనరులు, రూటింగ్ మార్గాలు మరియు ఉష్ణోగ్రత-నియంత్రిత సమగ్రతను సమకాలీకరించండి.",
    onboarding: "ఆన్‌బోర్డింగ్ విజార్డ్",
    trustScore: "విశ్వాస స్కోరు",
    activeDeliveries: "క్రియాశీల డెలివరీలు",
    pendingBookings: "పెండింగ్ బుకింగ్‌లు",
    monthlyRevenue: "నెలవారీ ఆదాయం",
    fleetUtilization: "ఫ్లీట్ వినియోగం",
    analytics: "ఫ్లీట్ అనలిటిక్స్ & లాభదాయకత ట్రెండ్‌లు",
    addVehicle: "కొత్త ఫ్లీట్ ఆస్తిని నమోదు చేయండి",
    manageFleet: "ఫ్లీట్ నిర్వహణ",
    bookings: "రవాణా బుకింగ్ కేంద్రం",
    routeEngine: "ప్రెసిషన్ రూటింగ్ ఇంజిన్",
    payments: "ఆదాయాలు & ఇన్‌వాయిస్ నియంత్రణ",
    crm: "కస్టమర్ సంబంధాలు & అభిప్రాయం",
    copilot: "AI లాజిస్టిక్స్ కో-పైలట్",
  }
};

const getTranslation = (lang: string, key: string): string => {
  return T[lang]?.[key] || T["English"][key] || key;
};

// Seed Data for Vehicles
interface Vehicle {
  id: string;
  regNumber: string;
  type: string;
  make: string;
  model: string;
  year: number;
  capacity: number; // tons
  dimensions: string;
  fuelType: string;
  mileage: number; // km/l
  gpsEnabled: boolean;
  refrigerated: boolean;
  hydraulicLift: boolean;
  tarpaulinCover: boolean;
  ropesStraps: boolean;
  driverName: string;
  driverMobile: string;
  driverLicense: string;
  licenseExpiry: string;
  status: "Available" | "Booked" | "In Transit" | "Under Maintenance" | "Offline";
  ratePerKm: number;
  ratePerHour: number;
  minBooking: number;
  trips: number;
  distanceCovered: number;
  revenue: number;
  rating: number;
}

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "v-1",
    regNumber: "MH-12-AB-1234",
    type: "Medium Truck",
    make: "Tata",
    model: "Ultra T.7",
    year: 2022,
    capacity: 5,
    dimensions: "6.1 x 2.2 x 2.4 m",
    fuelType: "Diesel",
    mileage: 8.5,
    gpsEnabled: true,
    refrigerated: false,
    hydraulicLift: true,
    tarpaulinCover: true,
    ropesStraps: true,
    driverName: "Dinesh Shinde",
    driverMobile: "+91 98765 00123",
    driverLicense: "MH12201900876",
    licenseExpiry: "2028-11-15",
    status: "Available",
    ratePerKm: 28,
    ratePerHour: 350,
    minBooking: 1500,
    trips: 48,
    distanceCovered: 7400,
    revenue: 215000,
    rating: 4.8
  },
  {
    id: "v-2",
    regNumber: "GJ-05-CD-5678",
    type: "Refrigerated Truck",
    make: "Ashok Leyland",
    model: "Boss 1215 Reefer",
    year: 2023,
    capacity: 8,
    dimensions: "7.5 x 2.4 x 2.5 m",
    fuelType: "Diesel",
    mileage: 6.8,
    gpsEnabled: true,
    refrigerated: true,
    hydraulicLift: false,
    tarpaulinCover: false,
    ropesStraps: true,
    driverName: "Vikram Rathore",
    driverMobile: "+91 99887 76655",
    driverLicense: "GJ05202104533",
    licenseExpiry: "2029-04-10",
    status: "Available",
    ratePerKm: 42,
    ratePerHour: 500,
    minBooking: 3000,
    trips: 34,
    distanceCovered: 9200,
    revenue: 386000,
    rating: 4.9
  },
  {
    id: "v-3",
    regNumber: "KA-03-EF-9012",
    type: "Mini Truck",
    make: "Mahindra",
    model: "Supro Profit Truck",
    year: 2021,
    capacity: 1.5,
    dimensions: "4.2 x 1.6 x 1.8 m",
    fuelType: "CNG",
    mileage: 14.2,
    gpsEnabled: true,
    refrigerated: false,
    hydraulicLift: false,
    tarpaulinCover: true,
    ropesStraps: true,
    driverName: "Manoj Gowda",
    driverMobile: "+91 91122 33445",
    driverLicense: "KA03201809012",
    licenseExpiry: "2027-08-22",
    status: "In Transit",
    ratePerKm: 18,
    ratePerHour: 200,
    minBooking: 800,
    trips: 92,
    distanceCovered: 12500,
    revenue: 225000,
    rating: 4.6
  }
];

// Seed Data for Bookings
interface TransportBooking {
  id: string;
  orderRef: string;
  customerName: string;
  customerType: string;
  customerPhone: string;
  customerEmail: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLatLon: [number, number];
  deliveryLatLon: [number, number];
  distance: number;
  loadType: string;
  weight: number; // kg
  preferredDateTime: string;
  budget: number;
  assignedVehicleId?: string;
  status: "Pending" | "Accepted" | "Picked Up" | "In Transit" | "Near Destination" | "Delivered" | "Rejected";
  eta?: string;
  edt?: string;
  actualDistance?: number;
  actualDuration?: number;
  totalCost?: number;
  paymentStatus: "Unpaid" | "Paid";
  customerRating?: number;
  customerReview?: string;
  rejectReason?: string;
  transitNotes?: { time: string; note: string }[];
}

const INITIAL_BOOKINGS: TransportBooking[] = [
  {
    id: "BK-2026-001",
    orderRef: "ORD-9901",
    customerName: "Rajesh Patel",
    customerType: "Farmer",
    customerPhone: "+91 94450 12345",
    customerEmail: "rajesh.patel@agrimail.in",
    pickupAddress: "Nashik Onion Cooperative Hub, Maharashtra",
    deliveryAddress: "Vashi APMC Mandi, Navi Mumbai, Maharashtra",
    pickupLatLon: [19.9975, 73.7898],
    deliveryLatLon: [19.0330, 73.0297],
    distance: 165,
    loadType: "Fresh Red Onions",
    weight: 4500,
    preferredDateTime: "2026-07-20 06:00",
    budget: 6500,
    assignedVehicleId: "v-3",
    status: "In Transit",
    eta: "4 hours",
    edt: "2026-07-20 11:30",
    paymentStatus: "Unpaid",
    transitNotes: [
      { time: "06:30", note: "Consignment securely loaded & tarpaulin fastened." },
      { time: "08:15", note: "Delayed by 15 mins at Ghoti toll gate due to heavy commercial flow." }
    ]
  },
  {
    id: "BK-2026-002",
    orderRef: "ORD-9902",
    customerName: "Priya Sharma",
    customerType: "Buyer",
    customerPhone: "+91 93245 98765",
    customerEmail: "priya@coldstarfoods.com",
    pickupAddress: "Mahabaleshwar Strawberry Estates, Maharashtra",
    deliveryAddress: "ColdStar Distribution Silo A4, Pune, Maharashtra",
    pickupLatLon: [17.9258, 73.6640],
    deliveryLatLon: [18.5204, 73.8567],
    distance: 120,
    loadType: "Premium Strawberries (Cold Storage Required)",
    weight: 2500,
    preferredDateTime: "2026-07-21 04:00",
    budget: 9500,
    status: "Pending",
    paymentStatus: "Unpaid"
  },
  {
    id: "BK-2026-003",
    orderRef: "ORD-9884",
    customerName: "Suresh Kumar",
    customerType: "Warehouse Operator",
    customerPhone: "+91 95560 55443",
    customerEmail: "suresh.k@centralwarehousing.gov",
    pickupAddress: "AgriConnect Hub Bangalore, Karnataka",
    deliveryAddress: "Chennai Marine Terminal Port Gate 3, Tamil Nadu",
    pickupLatLon: [12.9716, 77.5946],
    deliveryLatLon: [13.0827, 80.2707],
    distance: 350,
    loadType: "Grade-A Basmati Rice Export Sacks",
    weight: 7500,
    preferredDateTime: "2026-07-18 10:00",
    budget: 18000,
    assignedVehicleId: "v-1",
    status: "Delivered",
    actualDistance: 348,
    actualDuration: 7.5,
    totalCost: 17500,
    paymentStatus: "Paid",
    customerRating: 5,
    customerReview: "Superb transit. Temperature logs verified on arrival. Perfect compliance."
  }
];

export default function LogisticsProviderPortal({
  activeRole,
  routes,
  silos,
  onAddRoute,
  onUpdateRoute,
  onUpdateSilo
}: {
  activeRole: UserRole;
  routes: LogisticsRoute[];
  silos: any[];
  onAddRoute: (newRoute: LogisticsRoute) => void;
  onUpdateRoute: (id: string, updated: Partial<LogisticsRoute>) => void;
  onUpdateSilo: (id: string, updated: Partial<any>) => void;
}) {
  // Tabs: dashboard, onboarding, fleet, bookings, map, billing, crm, aiCopilot, settings
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [lang, setLang] = useState<string>("English");

  // Authentication & Onboarding state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");
  const [email, setEmail] = useState("ops@fasttracklogistics.com");
  const [password, setPassword] = useState("SecureFTL2026!");
  const [mobileNum, setMobileNum] = useState("9876543215");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [rememberMe, setRememberMe] = useState(true);

  // Verification status
  const [companyStatus, setCompanyStatus] = useState<"Pending" | "Verified" | "Suspended" | "Banned">("Verified");
  const [badgeLevel, setBadgeLevel] = useState<"Bronze" | "Silver" | "Gold">("Gold");
  const [trustScore, setTrustScore] = useState<number>(88);

  // Onboarding Wizard steps
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [onboardingForm, setOnboardingForm] = useState({
    companyName: "FastTrack Logistics Pvt Ltd",
    gstNumber: "29JKLMN7890P1Q2",
    panNumber: "FGHIJ5678K",
    businessType: "Private Limited",
    fleetSizeEstimate: "15",
    yearsOfOperation: "6",
    serviceAreas: "Maharashtra, Gujarat, Karnataka",
    contactName: "Vikramaditya Shastry",
    contactEmail: "v.shastry@fasttrack.com",
    contactPhone: "+91 98765 43215",
    address: "Logistics Arcade Ground Floor, Navi Mumbai",
    website: "www.fasttracklogistics.com",
    rcUploaded: true,
    gstUploaded: true,
    dlUploaded: true
  });

  // Master States
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [bookings, setBookings] = useState<TransportBooking[]>(INITIAL_BOOKINGS);
  const [invoices, setInvoices] = useState<any[]>([
    { id: "INV-2026-001", bookingId: "BK-2026-003", customer: "Suresh Kumar", baseCharge: 16000, gst: 1500, total: 17500, status: "Paid", date: "2026-07-18" }
  ]);

  // Form states for vehicle adding
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehReg, setNewVehReg] = useState("");
  const [newVehType, setNewVehType] = useState("Medium Truck");
  const [newVehMake, setNewVehMake] = useState("");
  const [newVehModel, setNewVehModel] = useState("");
  const [newVehCapacity, setNewVehCapacity] = useState(5);
  const [newVehDriver, setNewVehDriver] = useState("");
  const [newVehDriverLicense, setNewVehDriverLicense] = useState("");
  const [newVehRateKm, setNewVehRateKm] = useState(25);

  // Selected Booking details modal
  const [selectedBooking, setSelectedBooking] = useState<TransportBooking | null>(null);
  const [vehicleToAssign, setVehicleToAssign] = useState("");
  const [customRejectReason, setCustomRejectReason] = useState("");

  // Live Tracking and Simulation simulation
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(true);
  const [simulationProgress, setSimulationProgress] = useState(40); // percent along Pune-Mumbai line
  const [simulatedSpeed, setSimulatedSpeed] = useState(62); // km/h
  const [simulatedFuel, setSimulatedFuel] = useState(78); // %
  const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null);

  // Route Optimization state
  const [routeOrigin, setRouteOrigin] = useState("Nashik");
  const [routeDest, setRouteDest] = useState("Mumbai Mandi");
  const [optimizedOutput, setOptimizedOutput] = useState<any>(null);

  // AI assistant state
  const [aiChatMessages, setAiChatMessages] = useState<any[]>([
    { role: "assistant", content: "Greetings! I am the AgriConnect Logistics AI Auditor. You can ask me to forecast regional demand, optimize shipping rates, or generate a detailed vehicle performance summary." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiDemandForm, setAiDemandForm] = useState({ type: "Refrigerated Truck", region: "Maharashtra", season: "Kharif Monsoon" });
  const [aiDemandResult, setAiDemandResult] = useState<any>(null);
  const [aiPricingForm, setAiPricingForm] = useState({ distance: 150, type: "Refrigerated Truck", dieselPrice: 94 });
  const [aiPricingResult, setAiPricingResult] = useState<any>(null);

  // Speech API support check
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);

  // Notification toggles
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);

  // Offline Sync and Storage Simulation
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineStatus, setOfflineStatus] = useState<"Online" | "Offline">("Online");

  // Refs for audio feedback
  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Live simulation tick
  useEffect(() => {
    let timer: any;
    if (isPlayingSimulation) {
      timer = setInterval(() => {
        setSimulationProgress(prev => {
          if (prev >= 100) {
            setSimulatedSpeed(0);
            return 100;
          }
          // Slight speed fluctuate
          setSimulatedSpeed(Math.floor(55 + Math.random() * 15));
          // Slower fuel burn
          if (Math.random() > 0.8) setSimulatedFuel(f => Math.max(10, f - 1));
          
          // Generate simulated alert under some random condition
          if (prev === 45) {
            setSimulatedAlert("Vehicle stopped at Khopoli Food Plaza for > 10 minutes");
          } else if (prev === 75) {
            setSimulatedAlert("Minor speed limit exceedance: 76 km/h in 60 km/h expressway sector.");
          }
          return prev + 2;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlayingSimulation]);

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  // Simulated OTP sender
  const handleSendOtp = () => {
    if (!mobileNum) return;
    setOtpSent(true);
    setOtpTimer(60);
    alert(`🔑 Twilio Demonstration OTP Sent successfully to +91 ${mobileNum}. Use Code: 2026 to sign in.`);
  };

  const handleVerifyOtp = () => {
    if (otp === "2026" || otp === "1234") {
      setIsLoggedIn(true);
      alert("✓ Verification Successful. Welcome to FastTrack Logistics Portal.");
    } else {
      alert("❌ Invalid OTP. For test demonstration, enter '2026'.");
    }
  };

  // Add vehicle manually
  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehReg) return;
    const v: Vehicle = {
      id: `v-${Date.now()}`,
      regNumber: newVehReg,
      type: newVehType,
      make: newVehMake || "Tata",
      model: newVehModel || "Gold Standard",
      year: 2024,
      capacity: newVehCapacity,
      dimensions: "5.5 x 2.0 x 2.2 m",
      fuelType: "Diesel",
      mileage: 9.0,
      gpsEnabled: true,
      refrigerated: newVehType.includes("Refrigerated"),
      hydraulicLift: false,
      tarpaulinCover: true,
      ropesStraps: true,
      driverName: newVehDriver || "Unassigned Driver",
      driverMobile: "+91 90000 11111",
      driverLicense: newVehDriverLicense || "MH12REGISTRY99",
      licenseExpiry: "2030-01-01",
      status: "Available",
      ratePerKm: newVehRateKm,
      ratePerHour: 300,
      minBooking: 1000,
      trips: 0,
      distanceCovered: 0,
      revenue: 0,
      rating: 5.0
    };
    setVehicles([v, ...vehicles]);
    setShowAddVehicleModal(false);
    setNewVehReg("");
    setNewVehDriver("");
    setNewVehDriverLicense("");
    alert(`✓ Vehicle ${newVehReg} registered to fleet database.`);
  };

  // Bulk Upload File Import Simulation
  const handleBulkImportSimulation = () => {
    const dataPreview = [
      { reg: "MH-12-KL-9876", type: "Heavy Truck", capacity: 12, rate: 35, driver: "Vijay Sawant", status: "Valid" },
      { reg: "KA-51-MM-4321", type: "Mini Truck", capacity: 2, rate: 15, driver: "Satish Shetty", status: "Valid" },
      { reg: "GJ-01-YY-0099", type: "Refrigerated Truck", capacity: 7, rate: 40, driver: "Alpesh Patel", status: "Error - Duplicate Driver License" }
    ];

    if (confirm("Download CSV Template & Import 3 parsed vehicle fleet records?")) {
      const added = dataPreview.filter(d => d.status === "Valid").map((d, index) => ({
        id: `v-bulk-${index}-${Date.now()}`,
        regNumber: d.reg,
        type: d.type,
        make: "Ashok Leyland",
        model: "Enterprise",
        year: 2023,
        capacity: d.capacity,
        dimensions: "8.0 x 2.4 x 2.6 m",
        fuelType: "Diesel",
        mileage: 7.2,
        gpsEnabled: true,
        refrigerated: d.type.includes("Refrigerated"),
        hydraulicLift: false,
        tarpaulinCover: true,
        ropesStraps: true,
        driverName: d.driver,
        driverMobile: "+91 98112 23344",
        driverLicense: "DL-VALID-BULK-" + index,
        licenseExpiry: "2031-12-31",
        status: "Available" as const,
        ratePerKm: d.rate,
        ratePerHour: 400,
        minBooking: 2000,
        trips: 0,
        distanceCovered: 0,
        revenue: 0,
        rating: 5.0
      }));

      setVehicles([...added, ...vehicles]);
      alert(`Import complete! 2 vehicles successfully validated & imported. 1 validation error skipped (GJ-01-YY-0099).`);
    }
  };

  // Accept booking and assign vehicle
  const handleAcceptBooking = (bId: string) => {
    if (!vehicleToAssign) {
      alert("Please select a vehicle from the fleet list to assign.");
      return;
    }
    const veh = vehicles.find(v => v.id === vehicleToAssign);
    if (!veh) return;

    setBookings(prev => prev.map(b => {
      if (b.id === bId) {
        return {
          ...b,
          status: "Accepted",
          assignedVehicleId: vehicleToAssign,
          eta: `${Math.round(b.distance / 45)} hours`,
          edt: new Date(Date.now() + 4 * 3600000).toISOString().slice(0, 16).replace("T", " "),
          transitNotes: [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: `Booking accepted. Assigned vehicle ${veh.regNumber} and driver ${veh.driverName}.` }]
        };
      }
      return b;
    }));

    // Update vehicle status
    setVehicles(prev => prev.map(v => v.id === vehicleToAssign ? { ...v, status: "Booked" } : v));

    // Mirror to standard routes array in App.tsx if desired
    const activeB = bookings.find(b => b.id === bId);
    if (activeB) {
      onAddRoute({
        id: bId,
        driverName: veh.driverName,
        cargo: activeB.loadType,
        weight: activeB.weight,
        origin: activeB.pickupAddress.split(",")[0],
        destination: activeB.deliveryAddress.split(",")[0],
        tempCelsius: veh.refrigerated ? 4.0 : 25.5,
        status: "Dispatched",
        progress: 0
      });
    }

    setSelectedBooking(null);
    setVehicleToAssign("");
    alert(`✓ Booking Accepted. Dispatched dispatch itinerary to ${veh.driverName} (${veh.regNumber}).`);
  };

  // Complete/Deliver a booking
  const handleMarkAsDelivered = (bId: string) => {
    const b = bookings.find(booking => booking.id === bId);
    if (!b) return;

    const rate = vehicles.find(v => v.id === b.assignedVehicleId)?.ratePerKm || 30;
    const calculatedCost = Math.round(b.distance * rate);
    const gstRate = b.loadType.toLowerCase().includes("strawberry") ? 0.05 : 0.12;
    const finalGst = Math.round(calculatedCost * gstRate);
    const grandTotal = calculatedCost + finalGst;

    setBookings(prev => prev.map(booking => {
      if (booking.id === bId) {
        return {
          ...booking,
          status: "Delivered",
          actualDistance: b.distance,
          actualDuration: Math.round(b.distance / 42 * 10) / 10,
          totalCost: grandTotal,
          paymentStatus: "Unpaid",
          customerRating: 5,
          customerReview: "Safe arrival. Extremely punctual delivery and pristine cold-integrity sustained."
        };
      }
      return booking;
    }));

    // Free up vehicle
    if (b.assignedVehicleId) {
      setVehicles(prev => prev.map(v => v.id === b.assignedVehicleId ? { ...v, status: "Available", trips: v.trips + 1, distanceCovered: v.distanceCovered + b.distance, revenue: v.revenue + grandTotal } : v));
    }

    // Add to invoices
    const newInv = {
      id: `INV-2026-00${invoices.length + 1}`,
      bookingId: bId,
      customer: b.customerName,
      baseCharge: calculatedCost,
      gst: finalGst,
      total: grandTotal,
      status: "Unpaid",
      date: new Date().toISOString().split("T")[0]
    };
    setInvoices([newInv, ...invoices]);

    // Update external route in App.tsx
    onUpdateRoute(bId, { status: "Delivered", progress: 100 });

    alert(`✓ Consignment delivered safely. Auto-generated invoice ${newInv.id} for ₹${grandTotal} with ${gstRate * 100}% GST calculated.`);
  };

  // Route Optimization calculation simulation
  const handleOptimizeRoute = () => {
    if (!routeOrigin || !routeDest) return;
    const routeOutputs: Record<string, any> = {
      "Nashik": {
        distance: "165 km",
        time: "3 hrs 45 mins",
        fuelCost: "₹2,100",
        steps: [
          "Departure: Nashik Cold Farm Terminal Gate 1",
          "Mandi Bypass Link -> NH 160 Corridor (Sinnar Sector)",
          "Thane Kasara Ghat Segment - Monitor temperature consistency at steep gradients",
          "Expressway Entry -> Vashi APMC Terminal Hub"
        ]
      },
      "Pune": {
        distance: "148 km",
        time: "3 hrs 15 mins",
        fuelCost: "₹1,850",
        steps: [
          "Departure: Pune Agricultural Warehouse 4B",
          "Vashi-Pune Expressway Gateway",
          "Lonavala Ghat Area - Drive cautious under heavy monsoon rain simulation",
          "Vashi Mandi Entry Point"
        ]
      }
    };

    const output = routeOutputs[routeOrigin] || {
      distance: "210 km",
      time: "4 hrs 45 mins",
      fuelCost: "₹2,800",
      steps: [
        `Departure from ${routeOrigin} pickup spot`,
        "Route mapped via State Highway 10",
        "Check commercial vehicle check-points for state tax compliance",
        `Safely reach terminal point in ${routeDest}`
      ]
    };

    setOptimizedOutput(output);
    alert(`✓ Route mapped from ${routeOrigin} to ${routeDest}. AI predicted travel duration: ${output.time}.`);
  };

  // AI Demand Predictor Tool
  const handlePredictDemand = () => {
    const score = Math.floor(75 + Math.random() * 20);
    setAiDemandResult({
      confidence: `${score}%`,
      forecast: "High Demand Expected (+34% Volume Spike)",
      recommendation: "Maintain maximum fleet readiness. Vegetable & grain corridors from Nashik are expanding before festival seasons. Expand Refrigerated Trucks allocation.",
      confidenceScore: score
    });
  };

  // AI Pricing Optimizer Tool
  const handleOptimizePrice = () => {
    const base = aiPricingForm.distance * 28;
    const congestionPremium = aiPricingForm.distance > 200 ? 500 : 200;
    const recommended = base + congestionPremium;
    setAiPricingResult({
      recommendedRate: `₹${recommended}`,
      perKmRecommended: `₹${(recommended / aiPricingForm.distance).toFixed(2)} / km`,
      breakdown: `Base Freight: ₹${base} | Dynamic Toll/Congestion Fuel Margin: ₹${congestionPremium}`
    });
  };

  // Server-side AI Chat Co-Pilot query
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user" as const, content: chatInput };
    const currentHistory = [...aiChatMessages, userMsg];
    setAiChatMessages(currentHistory);
    setChatInput("");
    setIsGeneratingAi(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentHistory,
          activeRole: "Logistics Provider",
          language: lang,
          dialect: "Standard",
          farmData: {
            vehiclesCount: vehicles.length,
            bookingsCount: bookings.length,
            providerName: onboardingForm.companyName
          }
        })
      });

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      const aiReply = { role: "assistant" as const, content: data.content };
      setAiChatMessages([...currentHistory, aiReply]);
      speakResponse(data.content);
    } catch (err) {
      // Fallback response matching standard answers to avoid blockages
      const lower = userMsg.content.toLowerCase();
      let fallbackText = "I have reviewed your active fleet logistics. Your vehicles are 100% on schedule with safe temperature logs.";
      if (lower.includes("revenue") || lower.includes("money") || lower.includes("profit")) {
        fallbackText = `FastTrack Logistics current monthly accrued revenue is ₹7,42,678. The highest performing asset is the Ashok Leyland Boss Reefer (GJ-05-CD-5678) generating ₹3,86,000 across 34 cold-chain trips.`;
      } else if (lower.includes("booking") || lower.includes("pending")) {
        fallbackText = `You have 1 pending booking from Priya Sharma (#BK-2026-002) for strawberry cold transport from Mahabaleshwar. I recommend assigning your Ashok Leyland refrigerated reefer (GJ-05-CD-5678) which is currently Available.`;
      } else if (lower.includes("optimize") || lower.includes("route")) {
        fallbackText = `Analyzing weather & traffic... The best route from Nashik to Mumbai Mandi is via NH 160. Current travel time is 3 hours 45 minutes with optimal clear skies, minimizing potential crop spoilage.`;
      }
      const aiReply = { role: "assistant" as const, content: `[Simulation Engine] ${fallbackText}` };
      setAiChatMessages([...currentHistory, aiReply]);
      speakResponse(fallbackText);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Simulated Voice Command
  const startVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
      setIsListeningSpeech(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.lang = "en-IN";
      rec.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setChatInput(spoken);
        setIsListeningSpeech(false);
        alert(`🎙️ Voice Captured: "${spoken}"`);
      };
      rec.onerror = () => setIsListeningSpeech(false);
      rec.onend = () => setIsListeningSpeech(false);
      rec.start();
    } else {
      alert("Speech recognition API is not fully supported in this iframe browser environment. Enter questions via keyboard.");
    }
  };

  // Export Data Simulator
  const handleExportAllData = (format: "json" | "csv") => {
    const exportBundle = { vehicles, bookings, invoices, onboardingForm };
    const text = JSON.stringify(exportBundle, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FastTrack_Logistics_Database_Export.${format}`;
    link.click();
    alert(`✓ Combined database tables (${vehicles.length} fleet vehicles, ${bookings.length} transport bookings) compiled & exported successfully.`);
  };

  // Offline Mode Toggle
  const toggleOfflineMode = () => {
    if (offlineStatus === "Online") {
      setOfflineStatus("Offline");
      alert("⚠️ Router sync severed. Simulating local IndexedDB offline storage cache active.");
    } else {
      setOfflineStatus("Online");
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        alert("✓ Reconnected to AgriConnect main cloud server. Local offline transport logs synchronized successfully.");
      }, 1500);
    }
  };

  // Stats Calculations
  const statsActiveCount = bookings.filter(b => ["In Transit", "Picked Up", "Near Destination"].includes(b.status)).length;
  const statsPendingCount = bookings.filter(b => b.status === "Pending").length;
  const statsTotalRevenue = vehicles.reduce((sum, v) => sum + v.revenue, 0);
  const statsFleetInUse = Math.round((vehicles.filter(v => ["In Transit", "Booked"].includes(v.status)).length / vehicles.length) * 100);

  // Chart Mock Data
  const deliveryTrendData = [
    { name: "07/12", deliveries: 4 },
    { name: "07/13", deliveries: 6 },
    { name: "07/14", deliveries: 5 },
    { name: "07/15", deliveries: 8 },
    { name: "07/16", deliveries: 7 },
    { name: "07/17", deliveries: 9 },
    { name: "07/18", deliveries: 12 }
  ];

  const revenueTrendData = [
    { name: "Week 1", revenue: 140000 },
    { name: "Week 2", revenue: 210000 },
    { name: "Week 3", revenue: 185000 },
    { name: "Week 4", revenue: 247678 }
  ];

  const fleetUtilizationData = vehicles.map(v => ({
    name: v.regNumber.split("-")[2],
    utilization: Math.round((v.distanceCovered / 15000) * 100)
  }));

  const ratingData = [
    { name: "5 Star", value: 24 },
    { name: "4 Star", value: 8 },
    { name: "3 Star", value: 2 }
  ];
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Truck className="h-8 w-8 text-blue-600 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Logistics Portal Gate</h2>
          <p className="text-xs text-slate-500">AgriConnect Premium Supply Chain Networks</p>
        </div>

        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-all ${loginMethod === "email" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"}`}
          >
            Email Login
          </button>
          <button
            onClick={() => setLoginMethod("mobile")}
            className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-all ${loginMethod === "mobile" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400"}`}
          >
            OTP Phone Login
          </button>
        </div>

        {loginMethod === "email" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Company Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Access Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                <span>Pass strength: <span className="text-emerald-500 font-bold">Strong</span></span>
                <span className="cursor-pointer hover:text-blue-600">Forgot Password?</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Mobile Contact Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="9876543210"
                  value={mobileNum}
                  onChange={(e) => setMobileNum(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
                />
                <button
                  onClick={handleSendOtp}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold"
                >
                  Send OTP
                </button>
              </div>
            </div>
            {otpSent && (
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Verification OTP Code</label>
                <input
                  type="text"
                  placeholder="Enter 4-Digit Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>Demo Code: <span className="font-bold text-slate-600">2026</span></span>
                  <span>Resend in {otpTimer}s</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="rounded text-blue-600 focus:ring-0" />
            Keep me signed in
          </label>
          <span className="underline cursor-pointer">Privacy Policies</span>
        </div>

        <button
          onClick={() => {
            if (loginMethod === "mobile") {
              handleVerifyOtp();
            } else {
              setIsLoggedIn(true);
            }
          }}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-100"
        >
          <ShieldCheck className="h-4 w-4" />
          Authorize Workspace Access
        </button>

        <div className="border-t border-slate-100 pt-4 text-center">
          <p className="text-[10px] text-slate-400">
            Secure sandbox portal. Authorized and governed by AgriConnect AI Smart Ledger protocols.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upper Brand Control Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tight">{onboardingForm.companyName}</h1>
              <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Award className="h-3 w-3" /> {badgeLevel} Member
              </span>
            </div>
            <p className="text-[10px] text-slate-400">AgriConnect Registered Inter-State Carrier</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-[9px] text-slate-400 block font-bold uppercase">Compliance Score</span>
            <span className="font-black text-emerald-400">★ {onboardingForm.yearsOfOperation}y Ops / Trust: {trustScore}/100</span>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-blue-400" />
            <select
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                speakResponse(`Selected language is now ${e.target.value}`);
              }}
              className="bg-slate-800 text-white text-[11px] font-bold rounded-lg px-2 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Offline Sync State Trigger */}
          <button
            onClick={toggleOfflineMode}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all text-[11px] border ${
              offlineStatus === "Online" 
                ? "bg-emerald-950 text-emerald-400 border-emerald-800" 
                : "bg-rose-950 text-rose-400 border-rose-800 animate-pulse"
            }`}
          >
            <Activity className="h-3 w-3" />
            {isSyncing ? "Syncing..." : `${offlineStatus}`}
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "dashboard", label: getTranslation(lang, "dashboard") || "Dashboard", icon: Layers },
          { id: "onboarding", label: getTranslation(lang, "onboarding") || "Onboarding Wizard", icon: UserCheck },
          { id: "fleet", label: getTranslation(lang, "manageFleet") || "Fleet Management", icon: Truck },
          { id: "bookings", label: getTranslation(lang, "bookings") || "Transport Booking Center", icon: Mail },
          { id: "map", label: getTranslation(lang, "routeEngine") || "Live Tracking Map", icon: MapPin },
          { id: "billing", label: getTranslation(lang, "payments") || "Revenue & Invoice", icon: DollarSign },
          { id: "crm", label: getTranslation(lang, "crm") || "CRM & Feedback", icon: Users },
          { id: "aiCopilot", label: getTranslation(lang, "copilot") || "AI Logistics Co-Pilot", icon: Sparkles },
          { id: "traceability", label: getTranslation(lang, "traceability") || "Supply Chain Traceability", icon: Link },
          { id: "settings", label: "Profile & Settings", icon: Settings },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === t.id 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Welcome and Quick Action Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Truck className="h-32 w-32" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <span className="p-1 bg-white/10 rounded">★</span>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-black">Elite Carrier Hub</p>
                </div>
                <h2 className="text-xl font-black">Welcome back, {onboardingForm.contactName}!</h2>
                <p className="text-xs text-blue-100/80 leading-relaxed">
                  Your inter-state agritech transport assets are fully monitored. 100% of cold chain reefer routes meet compliance metrics.
                </p>
              </div>
              <div className="pt-6 flex gap-2">
                <button onClick={() => setActiveTab("bookings")} className="bg-white text-slate-900 hover:bg-slate-50 px-3.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer">
                  Pending Orders
                </button>
                <button onClick={() => setActiveTab("map")} className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer">
                  Route Map
                </button>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Accrued Revenue</span>
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp className="h-4 w-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-950">₹{statsTotalRevenue.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">This current operation month</p>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[82%]"></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fleet Utilization</span>
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Clock className="h-4 w-4" /></div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-950">{statsFleetInUse}%</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Vehicles booked or in transit</p>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${statsFleetInUse}%` }}></div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active Deliveries", val: statsActiveCount, color: "text-amber-500" },
              { label: "Pending Requests", val: statsPendingCount, color: "text-blue-500" },
              { label: "Completed Lifespan", val: 174, color: "text-slate-800" },
              { label: "On-Time Dispatch", val: "96.4%", color: "text-emerald-500" },
            ].map((st, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <p className="text-[10px] text-slate-400 font-bold uppercase">{st.label}</p>
                <p className={`text-xl font-black mt-1 ${st.color}`}>{st.val}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Delivery Trends Line Chart */}
            <div className="lg:col-span-8 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Revenue & Delivery Volumetrics</h3>
                  <p className="text-sm font-black text-slate-800">Accrued Profit Growth Pipeline</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2.5 py-1 rounded">Last 30 Days</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rating distribution Pie Chart & Utilization Bar */}
            <div className="lg:col-span-4 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Feedback Index</h3>
                <p className="text-sm font-black text-slate-800">5-Star Customer Rating Mix</p>
              </div>
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ratingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5">
                {ratingData.map((r, i) => (
                  <div key={i} className="flex justify-between text-xs text-slate-600 font-bold">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>{r.name}</span>
                    <span>{r.value} reviews</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE SETUP & ONBOARDING WIZARD */}
      {activeTab === "onboarding" && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-800">Logistics Carrier Onboarding Wizard</h2>
              <p className="text-xs text-slate-500">Provide legal identification and fleet metrics to verify inter-state clearance.</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-xl font-bold">Step {wizardStep} of 4</span>
          </div>

          {/* Wizard Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-black text-slate-400">
              <span>Onboarding Progress</span>
              <span>{wizardStep * 25}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${wizardStep * 25}%` }}></div>
            </div>
          </div>

          {/* Wizard Steps Contents */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Step 1: Corporate Registration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Company legal Name</label>
                  <input
                    type="text"
                    value={onboardingForm.companyName}
                    onChange={(e) => setOnboardingForm({...onboardingForm, companyName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">GST Identification (GSTIN)</label>
                  <input
                    type="text"
                    value={onboardingForm.gstNumber}
                    onChange={(e) => setOnboardingForm({...onboardingForm, gstNumber: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    value={onboardingForm.panNumber}
                    onChange={(e) => setOnboardingForm({...onboardingForm, panNumber: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Business Structure Type</label>
                  <select
                    value={onboardingForm.businessType}
                    onChange={(e) => setOnboardingForm({...onboardingForm, businessType: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option>Sole Proprietorship</option>
                    <option>Partnership Firm</option>
                    <option>LLP</option>
                    <option>Private Limited</option>
                    <option>Public Limited</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Step 2: Operations & Contact Registry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Lead Dispatch Manager</label>
                  <input
                    type="text"
                    value={onboardingForm.contactName}
                    onChange={(e) => setOnboardingForm({...onboardingForm, contactName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Corporate Mobile</label>
                  <input
                    type="text"
                    value={onboardingForm.contactPhone}
                    onChange={(e) => setOnboardingForm({...onboardingForm, contactPhone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Operations Email Address</label>
                  <input
                    type="email"
                    value={onboardingForm.contactEmail}
                    onChange={(e) => setOnboardingForm({...onboardingForm, contactEmail: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Corporate URL Link</label>
                  <input
                    type="text"
                    value={onboardingForm.website}
                    onChange={(e) => setOnboardingForm({...onboardingForm, website: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Step 3: Fleet Metric Estimates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Total active Fleet Count</label>
                  <input
                    type="number"
                    value={onboardingForm.fleetSizeEstimate}
                    onChange={(e) => setOnboardingForm({...onboardingForm, fleetSizeEstimate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Authorized Years of Operation</label>
                  <input
                    type="number"
                    value={onboardingForm.yearsOfOperation}
                    onChange={(e) => setOnboardingForm({...onboardingForm, yearsOfOperation: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Active State Corridors (comma separated)</label>
                  <input
                    type="text"
                    value={onboardingForm.serviceAreas}
                    onChange={(e) => setOnboardingForm({...onboardingForm, serviceAreas: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Step 4: Verification Documentation Upload</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "GST Certificate", key: "gstUploaded" },
                  { title: "Vehicle RCs (PDF Bundle)", key: "rcUploaded" },
                  { title: "Driver Licenses", key: "dlUploaded" }
                ].map((doc, idx) => (
                  <div key={idx} className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center cursor-pointer space-y-2 transition-colors">
                    <div className="mx-auto w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">{doc.title}</p>
                    <p className="text-[9px] text-slate-400">Drag & drop scanned copy here</p>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-600 font-bold">
                      <CheckCircle className="h-3 w-3" /> Ready
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
              disabled={wizardStep === 1}
              className="px-4 py-2 bg-slate-100 disabled:opacity-55 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
            >
              Back
            </button>
            {wizardStep < 4 ? (
              <button
                onClick={() => setWizardStep(prev => Math.min(4, prev + 1))}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Continue Step
              </button>
            ) : (
              <button
                onClick={() => {
                  setCompanyStatus("Verified");
                  setBadgeLevel("Gold");
                  alert("✓ Verification application package submitted. Document audit complete in simulation.");
                  setActiveTab("dashboard");
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Submit & Verify
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FLEET MANAGEMENT */}
      {activeTab === "fleet" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-base font-black text-slate-800">Fleet Control Tower</h2>
              <p className="text-xs text-slate-500">Monitor vehicle capacity, fuel ratings, and regulatory insurance status.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkImportSimulation}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4" /> Bulk Upload CSV
              </button>
              <button
                onClick={() => setShowAddVehicleModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add Vehicle
              </button>
            </div>
          </div>

          {/* Add Vehicle Modal Drawer */}
          {showAddVehicleModal && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 shadow-inner">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-800">Register New Vehicle Asset</h3>
                <button onClick={() => setShowAddVehicleModal(false)} className="p-1 bg-slate-200 hover:bg-slate-300 rounded-full"><X className="h-4 w-4" /></button>
              </div>

              <form onSubmit={handleAddVehicleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Registration #</label>
                  <input required placeholder="MH-12-XX-9999" value={newVehReg} onChange={e => setNewVehReg(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Vehicle Class Type</label>
                  <select value={newVehType} onChange={e => setNewVehType(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs">
                    <option>Mini Truck</option>
                    <option>Medium Truck</option>
                    <option>Heavy Truck</option>
                    <option>Refrigerated Truck</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Load Capacity (Tons)</label>
                  <input type="number" value={newVehCapacity} onChange={e => setNewVehCapacity(parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Per Km Rate (₹)</label>
                  <input type="number" value={newVehRateKm} onChange={e => setNewVehRateKm(parseInt(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Driver Assigned Name</label>
                  <input placeholder="Enter Name" value={newVehDriver} onChange={e => setNewVehDriver(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Driver License</label>
                  <input placeholder="License No" value={newVehDriverLicense} onChange={e => setNewVehDriverLicense(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs" />
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer">
                    Commit to Database
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Alert Alerts Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
            <div className="flex gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-amber-800">Scheduled Service Overdue (1)</p>
                <p className="text-[10px] text-amber-700">MH-12-AB-1234: Hydraulic fluid audit due in 400 km.</p>
              </div>
            </div>
            <div className="flex gap-2.5 border-t md:border-t-0 md:border-l border-slate-200 md:pl-4">
              <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-emerald-800">PUC Emissions Compliance (Ok)</p>
                <p className="text-[10px] text-emerald-700">All 3 active fleet assets certified.</p>
              </div>
            </div>
            <div className="flex gap-2.5 border-t md:border-t-0 md:border-l border-slate-200 md:pl-4">
              <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-blue-800">Driver License Audits</p>
                <p className="text-[10px] text-blue-700">Manoj Gowda license expiring soon (Aug 2027).</p>
              </div>
            </div>
          </div>

          {/* Vehicles List Table */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Fleet Registry Tables ({vehicles.length})</span>
              <div className="flex gap-1">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">Reefers Integrated</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">GPS Enabled</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="p-4">Reg Number / Make</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Driver & License</th>
                    <th className="p-4">Per Km Rate</th>
                    <th className="p-4">Accrued Revenue</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-semibold">
                  {vehicles.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{v.regNumber}</p>
                        <p className="text-[10px] text-slate-400">{v.make} {v.model} ({v.year})</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] rounded font-bold ${v.refrigerated ? "bg-cyan-50 text-cyan-700" : "bg-slate-100 text-slate-600"}`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="p-4">{v.capacity} Tons</td>
                      <td className="p-4">
                        <p>{v.driverName}</p>
                        <p className="text-[10px] text-slate-400">{v.driverMobile}</p>
                      </td>
                      <td className="p-4">₹{v.ratePerKm}/km</td>
                      <td className="p-4 font-bold text-emerald-600">₹{v.revenue.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] rounded font-bold ${
                          v.status === "Available" ? "bg-emerald-50 text-emerald-700" :
                          v.status === "In Transit" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-400"
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            const newStatus = v.status === "Available" ? "Under Maintenance" : "Available";
                            setVehicles(prev => prev.map(item => item.id === v.id ? { ...item, status: newStatus as any } : item));
                            alert(`✓ ${v.regNumber} status changed to ${newStatus}.`);
                          }}
                          className="text-xs text-blue-600 hover:underline cursor-pointer"
                        >
                          Toggle Maintenance
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BOOKING MANAGEMENT */}
      {activeTab === "bookings" && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-black text-slate-800">Transport Booking Center</h2>
            <p className="text-xs text-slate-500">Respond to incoming haulage requests from farmers, buyers, and agricultural silos.</p>
          </div>

          {/* Dynamic Pending Bookings List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(b => (
              <div key={b.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">{b.customerType}</span>
                      <h3 className="font-bold text-sm text-slate-800 mt-1">{b.loadType}</h3>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${
                      b.status === "Pending" ? "bg-amber-50 text-amber-700" :
                      b.status === "In Transit" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                    <div className="flex gap-1.5">
                      <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">PICKUP ADDRESS</p>
                        <p className="font-semibold truncate text-slate-700">{b.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Navigation className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">DELIVERY TERMINAL</p>
                        <p className="font-semibold truncate text-slate-700">{b.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-center">
                    <div className="border border-slate-100 p-2 rounded-xl">
                      <p className="text-slate-400 font-bold">ESTIMATED WEIGHT</p>
                      <p className="font-black text-slate-700">{(b.weight / 1000).toFixed(1)} Tons</p>
                    </div>
                    <div className="border border-slate-100 p-2 rounded-xl">
                      <p className="text-slate-400 font-bold">PROPOSED BUDGET</p>
                      <p className="font-black text-emerald-600">₹{b.budget.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {b.status === "Pending" ? (
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Assign Fleet Asset
                    </button>
                  ) : b.status === "In Transit" ? (
                    <button
                      onClick={() => handleMarkAsDelivered(b.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Confirm Safe Delivery Landing
                    </button>
                  ) : (
                    <div className="text-center text-[10px] text-slate-400 font-black">
                      Trip Fully Completed ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Booking Assignment Drawer Modal */}
          {selectedBooking && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
              <h3 className="font-black text-slate-800 text-sm">Assign Fleet Resource for {selectedBooking.id}</h3>
              <p className="text-xs text-slate-500">Select an available truck. Ensure refrigerated trucks are assigned for cold chain strawberries.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Select Available Vehicle</label>
                  <select
                    value={vehicleToAssign}
                    onChange={e => setVehicleToAssign(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2 text-xs rounded-xl"
                  >
                    <option value="">-- Select Vehicle / Driver --</option>
                    {vehicles.filter(v => v.status === "Available").map(v => (
                      <option key={v.id} value={v.id}>{v.regNumber} - {v.type} ({v.driverName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Reject Booking Reason</label>
                  <select
                    value={customRejectReason}
                    onChange={e => setCustomRejectReason(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2 text-xs rounded-xl"
                  >
                    <option value="">-- Keep Accepted --</option>
                    <option>No vehicle available in sector</option>
                    <option>Budget proposed too low</option>
                    <option>Cold chain cargo restriction mismatch</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                {customRejectReason ? (
                  <button
                    onClick={() => {
                      setBookings(prev => prev.map(item => item.id === selectedBooking.id ? { ...item, status: "Rejected", rejectReason: customRejectReason } : item));
                      setSelectedBooking(null);
                      setCustomRejectReason("");
                      alert("✓ Booking successfully rejected.");
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                ) : (
                  <button
                    onClick={() => handleAcceptBooking(selectedBooking.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Accept & Dispatch
                  </button>
                )}
                <button onClick={() => setSelectedBooking(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-bold rounded-xl cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: LIVE TRACKING & MAP SIMULATION */}
      {activeTab === "map" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-base font-black text-slate-800">Precision Routing & Live Tracking</h2>
              <p className="text-xs text-slate-500">Simulate inter-state GPS routes, temperature parameters, and fuel consumption.</p>
            </div>
            <button
              onClick={() => {
                setSimulationProgress(0);
                setIsPlayingSimulation(true);
                alert("✓ Live transit telemetry restarted from Nashik farm cooperative.");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" /> Restart Transit Simulation
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Simulated Map */}
            <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-5 relative overflow-hidden h-[400px] flex flex-col justify-between text-white">
              <div className="absolute inset-0 opacity-15">
                {/* SVG Grid simulating Map Coordinates */}
                <svg width="100%" height="100%">
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Maharashtra Map Outline Mock */}
                  <path d="M 50,150 Q 150,50 350,100 T 550,250 T 350,380 Z" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5" />
                </svg>
              </div>

              {/* Map Floating UI */}
              <div className="z-10 flex justify-between items-start">
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-[11px] space-y-1">
                  <p className="font-black text-blue-400">ACTIVE TRANSIT CHANNEL</p>
                  <p>Consignment: Fresh Red Onions (BK-2026-001)</p>
                  <p className="text-slate-400">Driver: Dinesh Shinde (Ultra T.7)</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setIsPlayingSimulation(!isPlayingSimulation)} className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800">
                    {isPlayingSimulation ? <Pause className="h-4 w-4 text-amber-500" /> : <Play className="h-4 w-4 text-emerald-500" />}
                  </button>
                </div>
              </div>

              {/* Simulated Vehicle Progress along route */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-2/3 h-2 bg-slate-800 rounded-full">
                  {/* Start Point */}
                  <span className="absolute left-0 -top-6 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700">Pune (Farm)</span>
                  {/* End Point */}
                  <span className="absolute right-0 -top-6 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700">Mumbai APMC</span>
                  {/* Active Path */}
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${simulationProgress}%` }}></div>
                  {/* Car Pin */}
                  <div className="absolute top-1/2 -translate-y-1/2 -ml-2" style={{ left: `${simulationProgress}%` }}>
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border border-white animate-bounce">
                      <Truck className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry HUD */}
              <div className="z-10 grid grid-cols-3 gap-2 bg-slate-900/95 border border-slate-800 p-3 rounded-2xl text-center text-xs">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold">LIVE GPS SPEED</p>
                  <p className="font-black text-emerald-400">{simulatedSpeed} km/h</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold">FUEL MARGIN</p>
                  <p className="font-black text-blue-400">{simulatedFuel}%</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold">ESTIMATED ETA</p>
                  <p className="font-black text-amber-400">{100 - simulationProgress === 0 ? "Delivered" : `${Math.round((100 - simulationProgress) * 4.5 / 100 * 10) / 10} hours`}</p>
                </div>
              </div>
            </div>

            {/* Route Optimizer Engine Form */}
            <div className="lg:col-span-4 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5"><Navigation className="h-4 w-4 text-blue-600" /> Dynamic Route Optimizer</h3>
              <p className="text-xs text-slate-500">Calculate the fastest, fuel-efficient inter-state bypasses with weather warnings.</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Origin Coordinates (City)</label>
                  <select value={routeOrigin} onChange={e => setRouteOrigin(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl">
                    <option value="Nashik">Nashik Onion Cooperative</option>
                    <option value="Pune">Pune Warehouse Hub</option>
                    <option value="Nagpur">Nagpur Orange Mandi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Target Destination</label>
                  <input type="text" value={routeDest} onChange={e => setRouteDest(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl" />
                </div>
                <button
                  onClick={handleOptimizeRoute}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Analyze & Optimize
                </button>
              </div>

              {optimizedOutput && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 text-xs">
                  <div className="flex justify-between font-black text-slate-800">
                    <span>Distance: {optimizedOutput.distance}</span>
                    <span className="text-emerald-600">Fuel: {optimizedOutput.fuelCost}</span>
                  </div>
                  <div className="space-y-1.5 border-t border-slate-200 pt-2 text-[10px] text-slate-600">
                    {optimizedOutput.steps.map((s: string, idx: number) => (
                      <p key={idx} className="flex gap-1">
                        <span className="text-blue-500">↳</span> {s}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Driver Leaderboard Scorecard */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5"><Award className="h-4.5 w-4.5 text-blue-600" /> Driver Safety & Performance Leaderboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Vikram Rathore", trips: 34, score: "98/100", safety: "Excellent", rating: "★ 4.9" },
                { name: "Dinesh Shinde", trips: 48, score: "94/100", safety: "Very Good", rating: "★ 4.8" },
                { name: "Manoj Gowda", trips: 92, score: "89/100", safety: "Good", rating: "★ 4.6" }
              ].map((dr, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800">{dr.name}</h4>
                    <p className="text-[10px] text-slate-400">Total Trips: {dr.trips} | Safety: {dr.safety}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-600 text-sm">{dr.score}</p>
                    <p className="text-[10px] text-slate-400">{dr.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: REVENUE, PAYMENTS & INVOICING */}
      {activeTab === "billing" && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-black text-slate-800">Accrued Freight Revenue & Rates</h2>
            <p className="text-xs text-slate-500">Calculate corporate invoices, manage dynamic per-kilometer pricing, and dispatch driver payouts.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Rates Table Configuration */}
            <div className="lg:col-span-4 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5"><Sliders className="h-4 w-4 text-blue-600" /> Rate Management</h3>
              <p className="text-xs text-slate-500">Adjust active per-km and waiting fees for dynamic agritech corridors.</p>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center">
                  <span>Base Medium Truck per-km</span>
                  <input type="number" defaultValue={28} className="w-16 bg-slate-50 border p-1 rounded text-center text-xs font-bold" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Refrigerated Reefer per-km</span>
                  <input type="number" defaultValue={42} className="w-16 bg-slate-50 border p-1 rounded text-center text-xs font-bold" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Waiting Surcharge / Hour</span>
                  <input type="number" defaultValue={150} className="w-16 bg-slate-50 border p-1 rounded text-center text-xs font-bold" />
                </div>
                <div className="flex justify-between items-center">
                  <span>Night Operations Premium (1.1x)</span>
                  <span className="text-xs font-black text-emerald-600">Active</span>
                </div>
                <button
                  onClick={() => alert("✓ Custom freight rates saved and published to farmer/buyer marketplaces.")}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Publish New Rates
                </button>
              </div>
            </div>

            {/* Generated Invoice Registry */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="p-4 bg-slate-50 border-b border-slate-100 font-black text-xs text-slate-700 uppercase tracking-wider">
                Accrued Invoice Registers
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="bg-slate-50/50 border-b font-black uppercase text-slate-400 text-[10px]">
                      <th className="p-4">Invoice ID / Date</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Base Charge</th>
                      <th className="p-4">Tax (GST)</th>
                      <th className="p-4">Grand Total</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-950">
                          {inv.id}
                          <p className="text-[10px] text-slate-400 font-normal">{inv.date}</p>
                        </td>
                        <td className="p-4">{inv.customer}</td>
                        <td className="p-4">₹{inv.baseCharge.toLocaleString()}</td>
                        <td className="p-4">₹{inv.gst.toLocaleString()}</td>
                        <td className="p-4 font-black text-slate-900">₹{inv.total.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] rounded font-bold ${inv.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] text-slate-500">Demonstration Invoicing ledger complete.</span>
                <button
                  onClick={() => alert("PDF batch compiled successfully.")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Export All PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CUSTOMER RELATIONSHIPS & CRM */}
      {activeTab === "crm" && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-black text-slate-800">Customer Relationship Directory (CRM)</h2>
            <p className="text-xs text-slate-500">Monitor consumer engagement, view feedback metrics, and reply to star ratings.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Customer table registry */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-100 font-black text-xs text-slate-700 uppercase">
                Active Client Accounts
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { name: "Rajesh Patel", type: "Farmer (Co-op Leader)", spend: "₹2,45,000", totaltrips: 18, email: "rajesh@onion.in" },
                  { name: "Priya Sharma", type: "Buyer (Coldstar Foods)", spend: "₹3,86,000", totaltrips: 12, email: "priya@coldstar.com" },
                  { name: "Suresh Kumar", type: "Warehouse Operator", spend: "₹1,75,000", totaltrips: 7, email: "suresh@silos.in" }
                ].map((cli, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50/50 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{cli.name}</h4>
                      <p className="text-[10px] text-slate-400">{cli.type} • {cli.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800">{cli.spend}</p>
                      <p className="text-[10px] text-slate-400">{cli.totaltrips} booking trips</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ratings, reviews feedback panel */}
            <div className="lg:col-span-5 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> Recent Consumer Reviews</h3>

              <div className="space-y-4">
                {[
                  { user: "Suresh Kumar", score: 5, text: "Excellent reefer temperature integrity maintained. Grains arrived perfect.", date: "2026-07-18" },
                  { user: "Rajesh Patel", score: 4, text: "Ghoti toll gate had traffic delay, but driver kept me updated. Nice.", date: "2026-07-15" }
                ].map((rev, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-950">{rev.user}</span>
                      <span className="text-amber-500 font-bold">{"★".repeat(rev.score)}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">"{rev.text}"</p>
                    <input
                      placeholder="Type response to client..."
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          alert("✓ Reply sent to consumer notification portal.");
                          (e.target as any).value = "";
                        }
                      }}
                      className="w-full bg-white border border-slate-200 p-1.5 text-[10px] rounded-lg mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AI ASSISTANT FOR LOGISTICS */}
      {activeTab === "aiCopilot" && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-black text-slate-800">AgriConnect AI Logistics Assistant</h2>
            <p className="text-xs text-slate-500">Deploy machine-learning algorithms to predict regional market demand, optimize prices, and plan routes.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* AI Demand Predictor Tool */}
            <div className="lg:col-span-4 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-black text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1"><TrendingUp className="h-4 w-4 text-blue-500" /> AI Demand Predictor</h3>
              <p className="text-xs text-slate-500">Calculate forward demand confidence index using real-time mandi volume datasets.</p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Target Corridor State</label>
                  <select value={aiDemandForm.region} onChange={e => setAiDemandForm({...aiDemandForm, region: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-xl">
                    <option>Maharashtra</option>
                    <option>Gujarat</option>
                    <option>Karnataka</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Vehicle Category</label>
                  <select value={aiDemandForm.type} onChange={e => setAiDemandForm({...aiDemandForm, type: e.target.value})} className="w-full bg-slate-50 border p-2 rounded-xl">
                    <option>Refrigerated Truck</option>
                    <option>Medium Truck</option>
                    <option>Mini Truck</option>
                  </select>
                </div>
                <button
                  onClick={handlePredictDemand}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Analyze Mandi Trends
                </button>
              </div>

              {aiDemandResult && (
                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-center font-black text-blue-800">
                    <span>Forecast: {aiDemandResult.forecast}</span>
                    <span>Conf: {aiDemandResult.confidence}</span>
                  </div>
                  <p className="text-[10px] text-blue-700 leading-relaxed">{aiDemandResult.recommendation}</p>
                </div>
              )}
            </div>

            {/* AI Dynamic Pricing Optimizer */}
            <div className="lg:col-span-4 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-black text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1"><DollarSign className="h-4 w-4 text-emerald-500" /> AI Pricing Optimizer</h3>
              <p className="text-xs text-slate-500">Calculate recommended client rate per-km by correlating diesel prices and corridor toll logs.</p>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Distance (Km)</label>
                    <input type="number" value={aiPricingForm.distance} onChange={e => setAiPricingForm({...aiPricingForm, distance: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border p-2 rounded-xl text-center font-black" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Diesel Price (₹/L)</label>
                    <input type="number" value={aiPricingForm.dieselPrice} onChange={e => setAiPricingForm({...aiPricingForm, dieselPrice: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border p-2 rounded-xl text-center font-black" />
                  </div>
                </div>
                <button
                  onClick={handleOptimizePrice}
                  className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Optimize Freight Margin
                </button>
              </div>

              {aiPricingResult && (
                <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl text-xs space-y-1">
                  <p className="font-black text-emerald-800 text-sm">Suggested Rate: {aiPricingResult.recommendedRate}</p>
                  <p className="text-[10px] font-bold text-emerald-700">{aiPricingResult.perKmRecommended}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{aiPricingResult.breakdown}</p>
                </div>
              )}
            </div>

            {/* AI Co-Pilot Assistant Chat Feed */}
            <div className="lg:col-span-4 bg-slate-900 text-white p-5 rounded-3xl shadow-xl flex flex-col justify-between h-[380px]">
              <div className="space-y-2 border-b border-slate-800 pb-2 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-blue-400 animate-pulse" />
                  <span className="text-xs font-black tracking-tight uppercase">AI Logistics Co-Pilot</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase">Live</span>
                </div>
              </div>

              {/* Chat Message Scroll */}
              <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1 text-xs scrollbar-thin scrollbar-thumb-slate-800">
                {aiChatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed text-[11px] ${
                      msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-800 text-slate-100 rounded-bl-none"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isGeneratingAi && (
                  <div className="text-[10px] text-slate-400 italic">Thinking and checking compliance parameters...</div>
                )}
              </div>

              {/* Voice & Text Input row */}
              <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button onClick={startVoiceSearch} className={`p-2 rounded-xl text-slate-400 hover:text-white ${isListeningSpeech ? "bg-red-950 text-red-400 animate-ping" : "bg-slate-900"}`}>
                  <Mic className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  placeholder="Ask copilot to forecast demand..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendChatMessage()}
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-slate-200"
                />
                <button onClick={handleSendChatMessage} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-xl">
                  <Send className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8.5: SUPPLY CHAIN TRACEABILITY (blockchain ledger, contracts, tokenization, ZKP/IPFS) */}
      {activeTab === "traceability" && (
        <div className="animate-in fade-in">
          <SupplyChainTraceability />
        </div>
      )}

      {/* TAB 9: PROFILE & SETTINGS */}
      {activeTab === "settings" && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-black text-slate-800">Logistics Profile & Settings Control</h2>
            <p className="text-xs text-slate-500">Configure notification channels, system preferences, and backup fleet database tables.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Detail Display */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Operational Identity</h3>
              <div className="bg-slate-50 p-4 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400">Company Name</span>
                  <span className="font-bold text-slate-800">{onboardingForm.companyName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400">GST Registration</span>
                  <span className="font-bold text-slate-800">{onboardingForm.gstNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400">PAN Registration</span>
                  <span className="font-bold text-slate-800">{onboardingForm.panNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Carrier Representative</span>
                  <span className="font-bold text-slate-800">{onboardingForm.contactName}</span>
                </div>
              </div>
            </div>

            {/* Notification alert checkboxes */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Alert & Dispatch Notifications</h3>
              <div className="bg-slate-50 p-4 rounded-2xl space-y-3.5 text-xs text-slate-700 font-bold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={notifSMS} onChange={() => setNotifSMS(!notifSMS)} className="rounded text-blue-600 focus:ring-0" />
                  SMS alerts for transit delays and traffic alerts
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} className="rounded text-blue-600 focus:ring-0" />
                  Email dispatch confirmations to farming co-ops
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={notifPush} onChange={() => setNotifPush(!notifPush)} className="rounded text-blue-600 focus:ring-0" />
                  In-App push notification for vehicle maintenance reminders
                </label>
              </div>
            </div>
          </div>

          {/* Database Export Backups */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Data Portability / Seed Backups</h3>
            <p className="text-xs text-slate-500">Securely export all local fleet vehicle parameters, active bookings, and invoicing ledgers.</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleExportAllData("json")}
                className="bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800"
              >
                <Download className="h-4 w-4 text-blue-400" /> Export JSON DB
              </button>
              <button
                onClick={() => handleExportAllData("csv")}
                className="bg-slate-100 border text-slate-700 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-200"
              >
                <FileText className="h-4 w-4 text-slate-500" /> Export CSV Reports
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
