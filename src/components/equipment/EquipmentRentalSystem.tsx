import React, { useState, useEffect, useMemo } from "react";
import {
  Wrench,
  Gauge,
  Map,
  Compass,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Fuel,
  Coins,
  Star,
  CheckCircle,
  AlertTriangle,
  Play,
  Square,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  MapPin,
  MessageSquare,
  ShieldAlert,
  ThumbsUp,
  Sliders,
  DollarSign,
  Locate,
  Truck,
  Home,
  History,
  Filter,
  Upload,
  Camera,
  Trash2
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

// Interfaces
export interface Equipment {
  id: string;
  name: string;
  type: "Tractor" | "Harvester" | "Rotavator" | "Seed Drill" | "Sprayer" | "Tiller" | "Thresher" | "Plow" | "Cultivator" | "Water Pump";
  model: string;
  make: string;
  year: number;
  powerHP: number;
  condition: "New" | "Excellent" | "Good" | "Fair";
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  description: string;
  images: string[];
  fuelBurnRate: number; // Liters per hour
  gpsLocation: {
    lat: number;
    lng: number;
    label: string;
  };
  aiMaintenanceStatus: {
    healthScore: number;
    nextServiceHours: number;
    predictedFailures: string[];
    sensorReadouts: {
      engineTemp: number; // °C
      oilPressure: number; // PSI
      beltTension: string;
      hydraulicFluid: number; // %
    };
  };
  operators: {
    name: string;
    avatar: string;
    rating: number;
    experienceYears: number;
    hourlyRate: number;
    isAvailable: boolean;
  }[];
  damageDeposit: number;
  reviews: {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  alreadyBookedIntervals: {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
  }[];
  iotState: {
    engineRunning: boolean;
    fuelLevel: number;
    rpm: number;
    temperature: number;
    speedGps: number;
  };
}

export const EquipmentRentalSystem: React.FC = () => {
  // Pre-seeded equipment models with high detail
  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: "equip-1",
      name: "John Deere 5050D Utility Tractor",
      type: "Tractor",
      model: "5050D Multi-Terrain",
      make: "John Deere",
      year: 2025,
      powerHP: 50,
      condition: "New",
      hourlyRate: 15,
      dailyRate: 110,
      weeklyRate: 650,
      monthlyRate: 2200,
      description: "Engineered with a robust turbo-charged engine and custom multi-terrain dual clutch tilling wheels. Perfect for deep tilling, plowing, and heavy haulage operations across uneven clayey and sandy soils. Comes equipped with live GPS tracking, fuel burn optimization and IoT telemetry.",
      images: [
        "https://images.unsplash.com/photo-1599933333333-d922a969dfb4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1530268576831-470b4f0453c2?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 6.2,
      gpsLocation: { lat: 31.621, lng: 74.873, label: "Amritsar Hub Sector 2" },
      aiMaintenanceStatus: {
        healthScore: 92,
        nextServiceHours: 42,
        predictedFailures: [
          "Belt slipping risk: 14% wear index observed",
          "Hydraulic valve micro-friction warning: service advised in 40 hours"
        ],
        sensorReadouts: { engineTemp: 82, oilPressure: 45, beltTension: "Optimal", hydraulicFluid: 88 }
      },
      operators: [
        { name: "Jagjeet Singh", avatar: "👨‍🌾", rating: 4.9, experienceYears: 12, hourlyRate: 12, isAvailable: true },
        { name: "Sukhwinder P.", avatar: "🚜", rating: 4.7, experienceYears: 8, hourlyRate: 10, isAvailable: true }
      ],
      damageDeposit: 250,
      reviews: [
        { id: "rev-1", user: "Harpreet Brar", rating: 5, comment: "Excellent power output. Delivered immaculate tilling across 20 acres.", date: "2026-06-20" },
        { id: "rev-2", user: "Gaurav Sharma", rating: 4, comment: "Extremely reliable engine. Clean torque, fuel consumption was exactly as estimated.", date: "2026-06-18" }
      ],
      alreadyBookedIntervals: [
        { start: "2026-06-29", end: "2026-06-30" },
        { start: "2026-07-04", end: "2026-07-06" }
      ],
      iotState: {
        engineRunning: false,
        fuelLevel: 85,
        rpm: 0,
        temperature: 28,
        speedGps: 0
      }
    },
    {
      id: "equip-2",
      name: "Claast Tiger Combine Harvester",
      type: "Harvester",
      model: "Sovereign Series 8",
      make: "Claast",
      year: 2024,
      powerHP: 220,
      condition: "Excellent",
      hourlyRate: 45,
      dailyRate: 320,
      weeklyRate: 1850,
      monthlyRate: 6800,
      description: "A premium high-throughput multi-crop combine harvester built to clear wheat, paddy, and mustard with minimum grain loss. Designed with an ultra-wide cutter bar and rapid grain elevator, saving substantial harvesting costs and manual farm labor.",
      images: [
        "https://images.unsplash.com/photo-1558224494-ef6b48969b7b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 12.5,
      gpsLocation: { lat: 31.515, lng: 74.982, label: "Ludhiana Regional Depot" },
      aiMaintenanceStatus: {
        healthScore: 78,
        nextServiceHours: 12,
        predictedFailures: [
          "Urgent: Drum cutter misalignment (3.2mm deviation detected)",
          "Predicted header motor jam: 78% belt-wear index (Critical limit soon)"
        ],
        sensorReadouts: { engineTemp: 94, oilPressure: 38, beltTension: "Warning (Low)", hydraulicFluid: 64 }
      },
      operators: [
        { name: "Amrik Singh", avatar: "🤠", rating: 5.0, experienceYears: 15, hourlyRate: 18, isAvailable: true },
        { name: "Jaspal Dhillon", avatar: "👨‍🔧", rating: 4.6, experienceYears: 6, hourlyRate: 15, isAvailable: false }
      ],
      damageDeposit: 500,
      reviews: [
        { id: "rev-3", user: "Baldev Singh", rating: 5, comment: "High throughput! Saved me 3 full days of manual harvesting labor.", date: "2026-06-24" }
      ],
      alreadyBookedIntervals: [
        { start: "2026-06-28", end: "2026-06-28" }
      ],
      iotState: {
        engineRunning: true,
        fuelLevel: 54,
        rpm: 1850,
        temperature: 92,
        speedGps: 8.5
      }
    },
    {
      id: "equip-3",
      name: "Maschio Gaspardo Heavy Duty Rotavator",
      type: "Rotavator",
      model: "Virat 205 High Intensity",
      make: "Maschio Gaspardo",
      year: 2025,
      powerHP: 60,
      condition: "New",
      hourlyRate: 10,
      dailyRate: 75,
      weeklyRate: 420,
      monthlyRate: 1500,
      description: "Heavy-duty gear-driven rotavator suited for fast seedbed preparation in challenging dry and wet soil conditions. Features premium boron-steel blades and multi-speed gearboxes to deliver excellent pulverization and high fuel efficiency.",
      images: [
        "https://images.unsplash.com/photo-1605000797439-75a150088dd4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 3.5,
      gpsLocation: { lat: 31.688, lng: 74.821, label: "Gurdaspur Cooperative Storage" },
      aiMaintenanceStatus: {
        healthScore: 95,
        nextServiceHours: 110,
        predictedFailures: [],
        sensorReadouts: { engineTemp: 45, oilPressure: 50, beltTension: "Excellent", hydraulicFluid: 95 }
      },
      operators: [
        { name: "Ranjit Roy", avatar: "👨‍🌾", rating: 4.8, experienceYears: 7, hourlyRate: 9, isAvailable: true }
      ],
      damageDeposit: 150,
      reviews: [
        { id: "rev-4", user: "Rajesh Patil", rating: 5, comment: "Tilled my fields to perfection. Blade sharpness was highly satisfactory.", date: "2026-06-15" }
      ],
      alreadyBookedIntervals: [],
      iotState: {
        engineRunning: false,
        fuelLevel: 100,
        rpm: 0,
        temperature: 24,
        speedGps: 0
      }
    },
    {
      id: "equip-4",
      name: "Fieldking Disc Seed Drill",
      type: "Seed Drill",
      model: "SowMaster Pro 6",
      make: "Fieldking",
      year: 2024,
      powerHP: 45,
      condition: "Excellent",
      hourlyRate: 12,
      dailyRate: 85,
      weeklyRate: 480,
      monthlyRate: 1700,
      description: "Advanced multi-row seed tilling drill designed for precise seed placement and fertilizer depth control. Ideal for sowing wheat, soy, and maize seeds with uniform spacing, ensuring maximum crop yield potential.",
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1605000797439-75a150088dd4?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 4.0,
      gpsLocation: { lat: 31.421, lng: 74.654, label: "Batala Equipment Yards" },
      aiMaintenanceStatus: {
        healthScore: 88,
        nextServiceHours: 28,
        predictedFailures: [
          "Seed tube block indicator in Row 4 (minor debris detected)"
        ],
        sensorReadouts: { engineTemp: 35, oilPressure: 42, beltTension: "Optimal", hydraulicFluid: 82 }
      },
      operators: [
        { name: "Sukhwinder P.", avatar: "🚜", rating: 4.7, experienceYears: 8, hourlyRate: 10, isAvailable: true }
      ],
      damageDeposit: 180,
      reviews: [],
      alreadyBookedIntervals: [
        { start: "2026-06-30", end: "2026-07-02" }
      ],
      iotState: {
        engineRunning: false,
        fuelLevel: 92,
        rpm: 0,
        temperature: 25,
        speedGps: 0
      }
    },
    {
      id: "equip-5",
      name: "Aspee Premium Heavy Boom Sprayer",
      type: "Sprayer",
      model: "AeroJet 600 Liters",
      make: "Aspee",
      year: 2025,
      powerHP: 35,
      condition: "New",
      hourlyRate: 14,
      dailyRate: 95,
      weeklyRate: 550,
      monthlyRate: 1950,
      description: "High-capacity agricultural chemical boom sprayer with balanced aerodynamic wings. Engineered to provide micro-mist dispersion, minimizing pesticide waste and ensuring full tilling cover.",
      images: [
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1599933333333-d922a969dfb4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1530268576831-470b4f0453c2?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 5.0,
      gpsLocation: { lat: 31.599, lng: 74.912, label: "Amritsar Sector 3 Depot" },
      aiMaintenanceStatus: {
        healthScore: 91,
        nextServiceHours: 55,
        predictedFailures: [],
        sensorReadouts: { engineTemp: 52, oilPressure: 44, beltTension: "Optimal", hydraulicFluid: 90 }
      },
      operators: [
        { name: "Jagjeet Singh", avatar: "👨‍🌾", rating: 4.9, experienceYears: 12, hourlyRate: 12, isAvailable: true }
      ],
      damageDeposit: 200,
      reviews: [
        { id: "rev-5", user: "Eswar Reddy", rating: 5, comment: "Uniform mist distribution. Excellent flow pressure tracking controller.", date: "2026-06-25" }
      ],
      alreadyBookedIntervals: [],
      iotState: {
        engineRunning: false,
        fuelLevel: 75,
        rpm: 0,
        temperature: 26,
        speedGps: 0
      }
    },
    {
      id: "equip-6",
      name: "Honda Power Rotary Tiller",
      type: "Tiller",
      model: "AgroForce FJ500",
      make: "Honda",
      year: 2024,
      powerHP: 5.5,
      condition: "Good",
      hourlyRate: 8,
      dailyRate: 60,
      weeklyRate: 350,
      monthlyRate: 1200,
      description: "Compact and powerful rotary tilling unit designed for vegetable beds, orchards, and clayey field borders. Easy steerable handles and fuel-efficient Honda 4-stroke commercial engine make it highly popular for smallholder precision tilling.",
      images: [
        "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1605000797439-75a150088dd4?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 2.8,
      gpsLocation: { lat: 31.642, lng: 74.891, label: "Amritsar Hub Sector 2" },
      aiMaintenanceStatus: {
        healthScore: 84,
        nextServiceHours: 18,
        predictedFailures: [
          "Air filter high dust impedance: replacement advised in 15 operating hours"
        ],
        sensorReadouts: { engineTemp: 78, oilPressure: 32, beltTension: "Optimal", hydraulicFluid: 70 }
      },
      operators: [
        { name: "Gurpreet Brar", avatar: "👨‍🌾", rating: 4.5, experienceYears: 4, hourlyRate: 8, isAvailable: true }
      ],
      damageDeposit: 100,
      reviews: [],
      alreadyBookedIntervals: [],
      iotState: {
        engineRunning: false,
        fuelLevel: 68,
        rpm: 0,
        temperature: 22,
        speedGps: 0
      }
    },
    {
      id: "equip-7",
      name: "Landforce High Speed Thresher",
      type: "Thresher",
      model: "ThreshMax 3000",
      make: "Landforce",
      year: 2025,
      powerHP: 45,
      condition: "New",
      hourlyRate: 18,
      dailyRate: 130,
      weeklyRate: 750,
      monthlyRate: 2600,
      description: "Commercial multi-crop high-speed thresher for wheat, maize, sorghum, and grain crops. Built with anti-clogging technology and advanced blower filters to produce pure, un-broken grain outputs.",
      images: [
        "https://images.unsplash.com/photo-1530268576831-470b4f0453c2?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1599933333333-d922a969dfb4?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 7.5,
      gpsLocation: { lat: 31.528, lng: 74.799, label: "Ludhiana Regional Depot" },
      aiMaintenanceStatus: {
        healthScore: 96,
        nextServiceHours: 120,
        predictedFailures: [],
        sensorReadouts: { engineTemp: 68, oilPressure: 48, beltTension: "Excellent", hydraulicFluid: 96 }
      },
      operators: [
        { name: "Amrik Singh", avatar: "🤠", rating: 5.0, experienceYears: 15, hourlyRate: 18, isAvailable: true }
      ],
      damageDeposit: 300,
      reviews: [
        { id: "rev-6", user: "Satnam Singh", rating: 5, comment: "High speed threshing with almost zero seed breakage. Superb piece of engineering.", date: "2026-06-11" }
      ],
      alreadyBookedIntervals: [
        { start: "2026-07-10", end: "2026-07-12" }
      ],
      iotState: {
        engineRunning: false,
        fuelLevel: 90,
        rpm: 0,
        temperature: 26,
        speedGps: 0
      }
    },
    {
      id: "equip-8",
      name: "Kverneland Reversible Plow",
      type: "Plow",
      model: "UltraDepth 4-Furrow",
      make: "Kverneland",
      year: 2026,
      powerHP: 90,
      condition: "New",
      hourlyRate: 9,
      dailyRate: 70,
      weeklyRate: 400,
      monthlyRate: 1400,
      description: "High-grade boron-steel reversible plow featuring multi-furrow rollover, structured shearbolt triggers, and depth tilling stabilizers. Ideal for field weed incorporation and hardpan clay busting.",
      images: [
        "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1558224494-ef6b48969b7b?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 3.1,
      gpsLocation: { lat: 31.648, lng: 74.832, label: "Amritsar Hub Sector 2" },
      aiMaintenanceStatus: {
        healthScore: 97,
        nextServiceHours: 140,
        predictedFailures: [],
        sensorReadouts: { engineTemp: 32, oilPressure: 48, beltTension: "Optimal", hydraulicFluid: 92 }
      },
      operators: [
        { name: "Sukhwinder P.", avatar: "🚜", rating: 4.7, experienceYears: 8, hourlyRate: 10, isAvailable: true }
      ],
      damageDeposit: 120,
      reviews: [
        { id: "rev-7", user: "Jaswant S.", rating: 5, comment: "Deep furrows and clean rollover. Strong build.", date: "2026-06-25" }
      ],
      alreadyBookedIntervals: [],
      iotState: {
        engineRunning: false,
        fuelLevel: 100,
        rpm: 0,
        temperature: 22,
        speedGps: 0
      }
    },
    {
      id: "equip-9",
      name: "Lemken Achat Heavy Cultivator",
      type: "Cultivator",
      model: "Achat 9 Multi-Row",
      make: "Lemken",
      year: 2025,
      powerHP: 85,
      condition: "Excellent",
      hourlyRate: 11,
      dailyRate: 80,
      weeklyRate: 450,
      monthlyRate: 1600,
      description: "Engineered for rapid soil aeration, weed control and moisture preservation. The specialized spring loaded tynes operate perfectly in high residue stubble crops without clogging.",
      images: [
        "https://images.unsplash.com/photo-1605000797439-75a150088dd4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 3.9,
      gpsLocation: { lat: 31.595, lng: 74.915, label: "Ludhiana Regional Depot" },
      aiMaintenanceStatus: {
        healthScore: 93,
        nextServiceHours: 85,
        predictedFailures: [],
        sensorReadouts: { engineTemp: 41, oilPressure: 45, beltTension: "Optimal", hydraulicFluid: 89 }
      },
      operators: [
        { name: "Jagjeet Singh", avatar: "👨‍🌾", rating: 4.9, experienceYears: 12, hourlyRate: 12, isAvailable: true }
      ],
      damageDeposit: 130,
      reviews: [
        { id: "rev-8", user: "Hardev G.", rating: 4, comment: "Superb breaking of clods. Perfect soil preparation.", date: "2026-06-22" }
      ],
      alreadyBookedIntervals: [],
      iotState: {
        engineRunning: false,
        fuelLevel: 80,
        rpm: 0,
        temperature: 24,
        speedGps: 0
      }
    },
    {
      id: "equip-10",
      name: "Kirloskar High-Volume Diesel Water Pump",
      type: "Water Pump",
      model: "MegaFlow 150-Litre",
      make: "Kirloskar",
      year: 2024,
      powerHP: 14,
      condition: "Excellent",
      hourlyRate: 6,
      dailyRate: 45,
      weeklyRate: 250,
      monthlyRate: 900,
      description: "High head, fuel-efficient mobile diesel water pump built for fast, heavy crop tilling water delivery from canals, borewells, and agricultural storage reservoirs. Highly portable and dependable in remote sectors.",
      images: [
        "https://images.unsplash.com/photo-1599933333333-d922a969dfb4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1530268576831-470b4f0453c2?auto=format&fit=crop&w=600&q=80"
      ],
      fuelBurnRate: 2.2,
      gpsLocation: { lat: 31.551, lng: 74.882, label: "Batala Equipment Yards" },
      aiMaintenanceStatus: {
        healthScore: 89,
        nextServiceHours: 35,
        predictedFailures: ["Impeller minor cavitation warning (predicted in 120 hours)"],
        sensorReadouts: { engineTemp: 64, oilPressure: 39, beltTension: "Optimal", hydraulicFluid: 78 }
      },
      operators: [
        { name: "Ranjit Roy", avatar: "👨‍🌾", rating: 4.8, experienceYears: 7, hourlyRate: 9, isAvailable: true }
      ],
      damageDeposit: 80,
      reviews: [
        { id: "rev-9", user: "Swaran S.", rating: 5, comment: "Steady pressure for continuous canal lifting.", date: "2026-06-28" }
      ],
      alreadyBookedIntervals: [],
      iotState: {
        engineRunning: false,
        fuelLevel: 70,
        rpm: 0,
        temperature: 25,
        speedGps: 0
      }
    }
  ]);

  // Selected Equipment ID
  const [selectedEquipId, setSelectedEquipId] = useState<string>("equip-1");
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [centerTab, setCenterTab] = useState<"specs" | "booking" | "history">("specs");
  const [selectedBookingId, setSelectedBookingId] = useState<string>("BK-410924");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<"All" | "Booked" | "Active" | "Completed" | "Cancelled">("All");
  const [mapType, setMapType] = useState<"satellite" | "terrain">("terrain");
  const [mapZoom, setMapZoom] = useState<number>(14);

  // Filters & Sorting state variables (Requirement 5.1 & 5.2)
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceFilterType, setPriceFilterType] = useState<"hourly" | "daily">("daily");
  const [maxDailyPrice, setMaxDailyPrice] = useState<number>(350);
  const [maxHourlyPrice, setMaxHourlyPrice] = useState<number>(50);
  const [maxDistance, setMaxDistance] = useState<number>(50); // Distance limit in km
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "distance">("price");
  const [searchQuery, setSearchQuery] = useState<string>("All");

  // Simple distance calculator from Amritsar center (31.634, 74.872)
  const calculateDistance = (gps: { lat: number; lng: number }) => {
    const dLat = gps.lat - 31.634;
    const dLng = gps.lng - 74.872;
    return parseFloat((Math.sqrt(dLat * dLat + dLng * dLng) * 111).toFixed(1)); // 111km per degree
  };

  // Filtered and Sorted Equipment list
  const filteredEquipments = useMemo(() => {
    let result = equipments;

    // Filter by Search Query
    if (searchQuery.trim() !== "" && searchQuery !== "All") {
      const q = searchQuery.toLowerCase();
      result = result.filter(eq => 
        eq.name.toLowerCase().includes(q) || 
        eq.model.toLowerCase().includes(q) ||
        eq.type.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(eq => {
        // Map category filter values (e.g. plural form to singular, or similar)
        const typeNormalized = eq.type.toLowerCase();
        const catNormalized = selectedCategory.toLowerCase();
        
        // Match plural or singular
        if (catNormalized === "tractors" && typeNormalized === "tractor") return true;
        if (catNormalized === "harvesters" && typeNormalized === "harvester") return true;
        if (catNormalized === "rotavators" && typeNormalized === "rotavator") return true;
        if (catNormalized === "seed drills" && typeNormalized === "seed drill") return true;
        if (catNormalized === "sprayers" && typeNormalized === "sprayer") return true;
        if (catNormalized === "tillers" && typeNormalized === "tiller") return true;
        if (catNormalized === "threshers" && typeNormalized === "thresher") return true;
        if (catNormalized === "plows" && typeNormalized === "plow") return true;
        if (catNormalized === "cultivators" && typeNormalized === "cultivator") return true;
        if (catNormalized === "water pumps" && typeNormalized === "water pump") return true;
        
        return typeNormalized === catNormalized;
      });
    }

    // Filter by Price Range (using dailyRate or hourlyRate based on priceFilterType)
    if (priceFilterType === "daily") {
      result = result.filter(eq => eq.dailyRate <= maxDailyPrice);
    } else {
      result = result.filter(eq => eq.hourlyRate <= maxHourlyPrice);
    }

    // Filter by Location Distance
    result = result.filter(eq => calculateDistance(eq.gpsLocation) <= maxDistance);

    // Filter by Rating
    result = result.filter(eq => {
      const activeReviewCount = eq.reviews.length;
      const avgRating = activeReviewCount
        ? (eq.reviews.reduce((acc, r) => acc + r.rating, 0) / activeReviewCount)
        : 5.0;
      return avgRating >= minRating;
    });

    // Sort by selection
    return [...result].sort((a, b) => {
      if (sortBy === "price") {
        const rateA = priceFilterType === "daily" ? a.dailyRate : a.hourlyRate;
        const rateB = priceFilterType === "daily" ? b.dailyRate : b.hourlyRate;
        return rateA - rateB;
      } else if (sortBy === "rating") {
        const avgA = a.reviews.length ? (a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length) : 5.0;
        const avgB = b.reviews.length ? (b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length) : 5.0;
        return avgB - avgA;
      } else if (sortBy === "distance") {
        return calculateDistance(a.gpsLocation) - calculateDistance(b.gpsLocation);
      }
      return 0;
    });
  }, [equipments, selectedCategory, priceFilterType, maxDailyPrice, maxHourlyPrice, maxDistance, minRating, sortBy, searchQuery]);

  const selectedEquip = useMemo(() => {
    return equipments.find((e) => e.id === selectedEquipId) || equipments[0];
  }, [equipments, selectedEquipId]);

  // --- BOOKING STATES & CALCULATION CONTROLLERS ---
  const [rentalTier, setRentalTier] = useState<"Hourly" | "Daily" | "Weekly" | "Monthly">("Daily");
  const [durationUnits, setDurationUnits] = useState<number>(3); // e.g. 3 hours, 3 days, or 3 weeks
  const [startDateStr, setStartDateStr] = useState<string>("2026-07-01");
  const [endDateStr, setEndDateStr] = useState<string>("2026-07-03");
  const [deliveryOption, setDeliveryOption] = useState<"pickup" | "delivery">("pickup");

  const [includeOperator, setIncludeOperator] = useState<boolean>(false);
  const [selectedOperatorIndex, setSelectedOperatorIndex] = useState<number>(0);
  const [addInsurance, setAddInsurance] = useState<boolean>(true);

  // Auto-set duration units based on date change for selected tier
  useEffect(() => {
    if (startDateStr && endDateStr) {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (!isNaN(diffDays) && diffDays > 0) {
        if (rentalTier === "Hourly") {
          setDurationUnits(diffDays * 8); // e.g. 8 operating hours per day
        } else if (rentalTier === "Daily") {
          setDurationUnits(diffDays);
        } else if (rentalTier === "Weekly") {
          setDurationUnits(Math.max(1, Math.ceil(diffDays / 7)));
        } else if (rentalTier === "Monthly") {
          setDurationUnits(Math.max(1, Math.ceil(diffDays / 30)));
        }
      }
    }
  }, [startDateStr, endDateStr, rentalTier]);

  // Check Schedule Conflict
  const hasConflict = useMemo(() => {
    if (rentalTier === "Hourly") return false; // simple check
    const reqStart = new Date(startDateStr);
    const reqEnd = new Date(endDateStr);

    return selectedEquip.alreadyBookedIntervals.some((interval) => {
      const bookedStart = new Date(interval.start);
      const bookedEnd = new Date(interval.end);
      return reqStart <= bookedEnd && reqEnd >= bookedStart;
    });
  }, [startDateStr, endDateStr, selectedEquip, rentalTier]);

  // Cost calculations
  const priceEstimates = useMemo(() => {
    let baseRate = selectedEquip.dailyRate;
    if (rentalTier === "Hourly") baseRate = selectedEquip.hourlyRate;
    if (rentalTier === "Weekly") baseRate = selectedEquip.weeklyRate;
    if (rentalTier === "Monthly") baseRate = selectedEquip.monthlyRate;

    const baseCost = baseRate * durationUnits;

    // Fuel Estimation
    // For Hourly: rate * units. For Daily: rate * 6 operating hours/day. For Weekly: rate * 35 operating hours/week. For Monthly: rate * 120 operating hours/month.
    let estimatedOperatingHours = durationUnits;
    if (rentalTier === "Daily") estimatedOperatingHours = durationUnits * 6;
    if (rentalTier === "Weekly") estimatedOperatingHours = durationUnits * 35;
    if (rentalTier === "Monthly") estimatedOperatingHours = durationUnits * 120;

    const estimatedFuelLitres = estimatedOperatingHours * selectedEquip.fuelBurnRate;
    const fuelPricePerLitre = 1.12; // regional average
    const fuelCost = estimatedFuelLitres * fuelPricePerLitre;

    // Operator Cost
    const activeOperator = selectedEquip.operators[selectedOperatorIndex];
    let operatorCost = 0;
    if (includeOperator && activeOperator) {
      const opRate = activeOperator.hourlyRate;
      operatorCost = opRate * estimatedOperatingHours;
    }

    // Insurance
    const insurancePremiumPerDay = 15;
    const insuranceCost = addInsurance ? (rentalTier === "Monthly" ? durationUnits * 30 : rentalTier === "Weekly" ? durationUnits * 7 : rentalTier === "Daily" ? durationUnits : 1) * insurancePremiumPerDay : 0;

    // Delivery Option (Self-pickup vs Delivery to farm with fee based on distance)
    const distance = calculateDistance(selectedEquip.gpsLocation);
    const deliveryCost = deliveryOption === "delivery" ? 10 + (distance * 0.3) : 0; // $10 base + $0.3 per km (e.g. approx ₹830 + ₹25/km)

    // Grand Total
    const total = baseCost + fuelCost + operatorCost + insuranceCost + selectedEquip.damageDeposit + deliveryCost;

    return {
      baseCost,
      estimatedFuelLitres,
      fuelCost,
      operatorCost,
      insuranceCost,
      damageDeposit: selectedEquip.damageDeposit,
      deliveryCost,
      total
    };
  }, [selectedEquip, rentalTier, durationUnits, includeOperator, selectedOperatorIndex, addInsurance, deliveryOption]);

  // --- REVIEWS & FEEDBACK STATE ---
  const [newReviewerName, setNewReviewerName] = useState<string>("");
  const [newReviewComment, setNewReviewComment] = useState<string>("");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      user: newReviewerName,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split("T")[0]
    };

    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.id === selectedEquip.id) {
          return {
            ...eq,
            reviews: [newRev, ...eq.reviews]
          };
        }
        return eq;
      })
    );

    setNewReviewerName("");
    setNewReviewComment("");
    alert("✓ Thank you! Your verified equipment review and efficiency rating has been added to the system logs.");
  };

  // --- IOT CONTROLLERS ENGINE STATE SIMULATOR ---
  const [engineState, setEngineState] = useState({
    rpm: selectedEquip.iotState.rpm,
    temp: selectedEquip.iotState.temperature,
    speed: selectedEquip.iotState.speedGps,
    running: selectedEquip.iotState.engineRunning
  });

  // Sync virtual engine state when switching equipment
  useEffect(() => {
    setEngineState({
      rpm: selectedEquip.iotState.rpm,
      temp: selectedEquip.iotState.temperature,
      speed: selectedEquip.iotState.speedGps,
      running: selectedEquip.iotState.engineRunning
    });
    setActiveImageIndex(0);
    setCenterTab("specs");
  }, [selectedEquipId]);

  // Virtual Live Telemetry fluctuations when engine is running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (engineState.running) {
      interval = setInterval(() => {
        setEngineState((prev) => {
          const targetRpm = 1700 + Math.floor(Math.random() * 150);
          const targetTemp = 88 + Math.floor(Math.random() * 6);
          const targetSpeed = selectedEquip.type === "Harvester" ? 6 + Math.random() * 3 : 15 + Math.random() * 5;

          return {
            rpm: targetRpm,
            temp: Math.min(105, prev.temp + (targetTemp - prev.temp) * 0.15 + (Math.random() - 0.5)),
            speed: parseFloat(targetSpeed.toFixed(1)),
            running: true
          };
        });
      }, 1000);
    } else {
      setEngineState((prev) => ({
        rpm: 0,
        temp: Math.max(28, prev.temp - 2.5),
        speed: 0,
        running: false
      }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [engineState.running, selectedEquipId]);

  const toggleRemoteIgnition = () => {
    const nextRunning = !engineState.running;
    setEngineState((prev) => ({
      ...prev,
      running: nextRunning,
      rpm: nextRunning ? 1600 : 0
    }));

    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.id === selectedEquip.id) {
          return {
            ...eq,
            iotState: {
              ...eq.iotState,
              engineRunning: nextRunning,
              rpm: nextRunning ? 1600 : 0
            }
          };
        }
        return eq;
      })
    );

    alert(`[IoT Telemetry] Remote signal dispatched. Engine ${nextRunning ? "IGNITED & LIVE" : "POWERED OFF"} via cloud controller gateway.`);
  };

  // Run AI Diagnostic Scan trigger
  const [isDiagnosticScanning, setIsDiagnosticScanning] = useState<boolean>(false);
  const [scannedHealth, setScannedHealth] = useState<number | null>(null);

  const handleRunAiDiagnostic = () => {
    setIsDiagnosticScanning(true);
    setTimeout(() => {
      setIsDiagnosticScanning(false);
      setScannedHealth(selectedEquip.aiMaintenanceStatus.healthScore);
      alert(`✓ AI Predictive Maintenance Report Compiled. Machine structural health stands at ${selectedEquip.aiMaintenanceStatus.healthScore}%. Sensor logs verified clean.`);
    }, 1500);
  };

  // --- EQUIPMENT RETURN WORKFLOW STATES ---
  const [returnPhotos, setReturnPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=400&q=80"
  ]);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState<boolean>(false);
  const [hasDamageReport, setHasDamageReport] = useState<boolean>(false);
  const [reportedDamageSeverity, setReportedDamageSeverity] = useState<"Light" | "Moderate" | "Severe">("Light");
  const [reportedDamageDescription, setReportedDamageDescription] = useState<string>("");

  useEffect(() => {
    const booking = userBookings.find(b => b.id === selectedBookingId);
    if (booking) {
      setHasDamageReport(booking.damageReported || false);
      setReportedDamageSeverity(booking.damageSeverity || "Light");
      setReportedDamageDescription(booking.damageNotes || "");
      if (booking.conditionPhotos) {
        setReturnPhotos(booking.conditionPhotos);
      } else {
        setReturnPhotos([
          "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=400&q=80"
        ]);
      }
    }
  }, [selectedBookingId]);

  // --- BOOKING FORM SUBMISSION ---
  const [userBookings, setUserBookings] = useState<{
    id: string;
    equipId: string;
    equipName: string;
    equipModel: string;
    equipType: string;
    startDate: string;
    endDate: string;
    totalPaid: number;
    withOperator: boolean;
    insurance: boolean;
    rentalTier: "Hourly" | "Daily" | "Weekly" | "Monthly";
    durationUnits: number;
    deliveryOption: "pickup" | "delivery";
    status: "Booked" | "Active" | "Completed" | "Cancelled";
    securityDepositStatus: "held" | "refunded";
    damageDeposit: number;
    damageNotes: string;
    damageReported?: boolean;
    damageSeverity?: "Light" | "Moderate" | "Severe";
    damageDeductionAmount?: number;
    conditionPhotos?: string[];
  }[]>([
    {
      id: "BK-410924",
      equipId: "equip-2",
      equipName: "John Deere 5050 D",
      equipModel: "5050 D",
      equipType: "Tractor",
      startDate: "2026-07-01",
      endDate: "2026-07-06",
      totalPaid: 320,
      withOperator: true,
      insurance: true,
      rentalTier: "Weekly",
      durationUnits: 1,
      deliveryOption: "delivery",
      status: "Active",
      securityDepositStatus: "held",
      damageDeposit: 200,
      damageNotes: "Currently active near Border Farm. Front loading bucket check: Clean. Left front tire pressure checked."
    },
    {
      id: "BK-829472",
      equipId: "equip-1",
      equipName: "Swaraj 744 FE Tractor",
      equipModel: "744 FE",
      equipType: "Tractor",
      startDate: "2026-06-10",
      endDate: "2026-06-15",
      totalPaid: 180,
      withOperator: false,
      insurance: true,
      rentalTier: "Daily",
      durationUnits: 5,
      deliveryOption: "pickup",
      status: "Completed",
      securityDepositStatus: "refunded",
      damageDeposit: 150,
      damageNotes: "Returned with full fuel level. Structural check OK. Slight paint scrape on secondary frame rail (insubstantial)."
    },
    {
      id: "BK-312093",
      equipId: "equip-3",
      equipName: "Mahindra Arjun 555 DI",
      equipModel: "555 DI",
      equipType: "Tractor",
      startDate: "2026-06-20",
      endDate: "2026-06-22",
      totalPaid: 95,
      withOperator: false,
      insurance: false,
      rentalTier: "Daily",
      durationUnits: 2,
      deliveryOption: "pickup",
      status: "Cancelled",
      securityDepositStatus: "refunded",
      damageDeposit: 120,
      damageNotes: "Cancelled by booking portal on demand of farmer due to sudden monsoon cloudburst delay."
    }
  ]);

  const handleConfirmBooking = () => {
    if (hasConflict) {
      alert("❌ Critical Scheduling Conflict: The selected dates overlap with an existing block. Please select alternative dates.");
      return;
    }

    const newBooking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      equipId: selectedEquip.id,
      equipName: selectedEquip.name,
      equipModel: selectedEquip.model,
      equipType: selectedEquip.type,
      startDate: startDateStr,
      endDate: endDateStr,
      totalPaid: priceEstimates.total,
      withOperator: includeOperator,
      insurance: addInsurance,
      rentalTier,
      durationUnits,
      deliveryOption,
      status: "Booked" as const,
      securityDepositStatus: "held" as const,
      damageDeposit: selectedEquip.damageDeposit,
      damageNotes: ""
    };

    // Add booked interval to localized state
    setEquipments((prev) =>
      prev.map((eq) => {
        if (eq.id === selectedEquip.id) {
          return {
            ...eq,
            alreadyBookedIntervals: [
              ...eq.alreadyBookedIntervals,
              { start: startDateStr, end: endDateStr }
            ]
          };
        }
        return eq;
      })
    );

    setUserBookings((prev) => [newBooking, ...prev]);
    setSelectedBookingId(newBooking.id);
    setCenterTab("history");
    alert(`✓ SUCCESS! Booking confirmed. Booking reference: ${newBooking.id}. Refundable Damage Deposit of $${selectedEquip.damageDeposit} is held in secure agricultural smart escrow.`);
  };

  // --- ANALYTICS DEMO CHARTS DATA ---
  const usageAnalyticsData = [
    { hour: "08:00", dieselBurn: 5.4, engineRpm: 1650, throttleEfficiency: 92 },
    { hour: "10:00", dieselBurn: 6.8, engineRpm: 1820, throttleEfficiency: 88 },
    { hour: "12:00", dieselBurn: 7.2, engineRpm: 1900, throttleEfficiency: 95 },
    { hour: "14:00", dieselBurn: 6.0, engineRpm: 1750, throttleEfficiency: 91 },
    { hour: "16:00", dieselBurn: 5.8, engineRpm: 1680, throttleEfficiency: 94 },
    { hour: "18:00", dieselBurn: 4.5, engineRpm: 1500, throttleEfficiency: 96 }
  ];

  return (
    <div id="equipment-rental-dashboard" className="space-y-6">

      {/* Main Header Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900 flex items-center gap-1.5 w-fit">
            <Wrench className="h-3 w-3" /> Live IoT Rental Registry
          </span>
          <h2 className="text-white text-base font-black uppercase tracking-tight mt-2">Shared Farm Machinery Command Center</h2>
          <p className="text-slate-400 text-[10px] font-medium">Bilateral tractor leaseholds, machine-learning failure telemetry, operator pooling, and remote ignition triggers.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
            <span className="text-slate-500 text-[8px] uppercase font-bold block">Active Fleet Size</span>
            <span className="text-emerald-400 text-xs font-black">{equipments.length} Heavy Units</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-center">
            <span className="text-slate-500 text-[8px] uppercase font-bold block">Operators On-Call</span>
            <span className="text-teal-400 text-xs font-black">5 Certified Drivers</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: REGISTRY INDEX (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Heavy Machinery Fleet</h3>
              <p className="text-[10px] text-slate-500">Select standard, high-clearance, or high-throughput mechanical units near Amritsar.</p>
            </div>

            {/* SEARCH INPUT (Part 5.1 Browse Equipment) */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery === "All" ? "" : searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, model, category..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs px-3.5 py-2 pl-9 font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Sliders className="h-3.5 w-3.5" />
              </span>
              {searchQuery && searchQuery !== "All" && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* CATEGORY PILLS (Part 5.1 Browse Equipment Categories) */}
            <div className="space-y-1">
              <label className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">Quick Category Filter</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                {["All", "Tractors", "Harvesters", "Rotavators", "Seed Drills", "Sprayers", "Tillers", "Threshers", "Plows", "Cultivators", "Water Pumps"].map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-700 border-emerald-700 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SEARCH, FILTER & SORT PANEL (PART 5.1 REQUIREMENT) */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-700">Detailed Filters</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceFilterType("daily");
                    setMaxDailyPrice(350);
                    setMaxHourlyPrice(50);
                    setMaxDistance(80);
                    setMinRating(0);
                    setSortBy("price");
                    setSearchQuery("");
                  }}
                  className="text-[9px] font-black text-emerald-700 uppercase tracking-wider cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Price filter type toggle and sort selector */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-slate-400 uppercase">Rate Basis</label>
                  <div className="grid grid-cols-2 gap-0.5 bg-white border border-slate-200 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPriceFilterType("daily")}
                      className={`py-0.5 rounded text-[8.5px] font-extrabold text-center transition-all cursor-pointer ${
                        priceFilterType === "daily"
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceFilterType("hourly")}
                      className={`py-0.5 rounded text-[8.5px] font-extrabold text-center transition-all cursor-pointer ${
                        priceFilterType === "hourly"
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Hourly
                    </button>
                  </div>
                </div>

                {/* Sort Order */}
                <div className="space-y-1">
                  <label className="block text-[8px] font-extrabold text-slate-400 uppercase">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "price" | "rating" | "distance")}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-semibold text-slate-700 focus:outline-none h-[22px]"
                  >
                    <option value="price">Price (Low to High)</option>
                    <option value="rating">Rating (High to Low)</option>
                    <option value="distance">Distance (Nearest)</option>
                  </select>
                </div>
              </div>

              {/* Slider for Price Range & Distance */}
              <div className="space-y-2 pt-1">
                {priceFilterType === "daily" ? (
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase">
                      <span>Max Price (Daily)</span>
                      <span className="text-slate-700">₹{maxDailyPrice}/day</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="350"
                      step="10"
                      value={maxDailyPrice}
                      onChange={(e) => setMaxDailyPrice(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase">
                      <span>Max Price (Hourly)</span>
                      <span className="text-slate-700">₹{maxHourlyPrice}/hour</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="2"
                      value={maxHourlyPrice}
                      onChange={(e) => setMaxHourlyPrice(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase">
                    <span>Max Distance</span>
                    <span className="text-slate-700">{maxDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="5"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-extrabold text-slate-400 uppercase">
                    <span>Min Rating</span>
                    <span className="text-slate-700">{minRating === 0 ? "Any" : `${minRating}+ Stars`}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {[0, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setMinRating(val)}
                        className={`px-2 py-0.5 rounded text-[9px] font-black border transition-all cursor-pointer ${
                          minRating === val
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        {val === 0 ? "All" : `${val}★`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredEquipments.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-slate-400 mx-auto mb-2" />
                  <span className="text-[10px] font-black uppercase text-slate-500 block">No Fleet Matches Found</span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Try resetting or broadening your filters.</p>
                </div>
              ) : (
                filteredEquipments.map((eq) => {
                  const isSelected = eq.id === selectedEquipId;
                  const activeReviewCount = eq.reviews.length;
                  const averageStars = activeReviewCount
                    ? (eq.reviews.reduce((acc, r) => acc + r.rating, 0) / activeReviewCount).toFixed(1)
                    : "5.0";
                  const distance = calculateDistance(eq.gpsLocation);

                  return (
                    <div
                      key={eq.id}
                      onClick={() => setSelectedEquipId(eq.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative space-y-2 hover:shadow-md ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-600/15"
                          : "border-slate-150 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">{eq.type}</span>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{eq.name}</h4>
                          <p className="text-[9px] text-slate-500">{eq.model}</p>
                        </div>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                          eq.aiMaintenanceStatus.healthScore >= 90
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : eq.aiMaintenanceStatus.healthScore >= 80
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200 animate-pulse"
                        }`}>
                          {eq.aiMaintenanceStatus.healthScore}% Health
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-extrabold text-slate-700">{averageStars}</span>
                          <span className="text-slate-400 text-[8px]">({activeReviewCount})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-[8px] uppercase font-bold block">
                            {priceFilterType === "daily" ? "Base Daily Rate" : "Base Hourly Rate"} • Distance
                          </span>
                          <span className="text-emerald-700 font-black">
                            {priceFilterType === "daily" ? `₹${eq.dailyRate}/Day` : `₹${eq.hourlyRate}/Hour`} • {distance} km
                          </span>
                        </div>
                      </div>

                      {eq.iotState.engineRunning && (
                        <div className="bg-amber-50 border border-amber-200/50 rounded p-1.5 text-[8px] text-amber-800 font-extrabold flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Play className="h-2 w-2 text-amber-600 fill-amber-600 animate-ping" />
                            ENGINE ACTIVE ON FIELD
                          </span>
                          <span>{eq.iotState.speedGps} km/h • GPS tracked</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* MY ACTIVE BOOKINGS SUMMARY */}
          {userBookings.length > 0 && (
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3.5">
              <span className="text-[9px] font-black uppercase text-teal-400 tracking-wider block">My Leasehold Contracts</span>
              <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                {userBookings.map((b) => (
                  <div key={b.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-[10px]">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">{b.equipName}</span>
                      <span className="text-teal-400 text-[8px] uppercase">{b.id}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[9px]">
                      <span>{b.startDate} to {b.endDate} ({b.durationUnits} {b.rentalTier === "Hourly" ? "hrs" : b.rentalTier === "Daily" ? "days" : b.rentalTier === "Weekly" ? "wks" : "mos"})</span>
                      <span className="text-emerald-400 font-extrabold">₹{Math.round(b.totalPaid * 83)} <span className="text-[7px] text-slate-500">(${b.totalPaid.toFixed(1)})</span></span>
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-500 pt-1 border-t border-slate-900/60">
                      <span>{b.withOperator ? "✓ Operator" : "Self-driven"} • {b.deliveryOption === "delivery" ? "Delivery" : "Self-pickup"}</span>
                      <span>{b.insurance ? "✓ Insured" : "No Insurance"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* MIDDLE COLUMN: LEASE DESK & GPS TRACKER (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">

          {/* TAB NAVIGATION HEADER */}
          <div className="bg-slate-900 rounded-2xl p-1.5 flex gap-1.5 border border-slate-800 shadow-lg">
            <button
              type="button"
              onClick={() => setCenterTab("specs")}
              className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                centerTab === "specs"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Info className="h-3 w-3" /> Specs & Rates
            </button>
            <button
              type="button"
              onClick={() => setCenterTab("booking")}
              className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                centerTab === "booking"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Calendar className="h-3 w-3" /> Lease Desk
            </button>
            <button
              type="button"
              onClick={() => setCenterTab("history")}
              className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                centerTab === "history"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <History className="h-3 w-3" /> Lease History
            </button>
          </div>

          {/* TAB 1: EQUIPMENT DETAILS & CHASSIS SPECIFICATION */}
          {centerTab === "specs" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
              
              {/* Image Gallery Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-black uppercase text-emerald-700 tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {selectedEquip.type} Chassis Detail
                  </span>
                  <h3 className="text-sm font-black text-slate-950 mt-1">{selectedEquip.name}</h3>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/40 px-2 py-1 rounded-lg">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-slate-700">
                    {selectedEquip.reviews.length
                      ? (selectedEquip.reviews.reduce((acc, r) => acc + r.rating, 0) / selectedEquip.reviews.length).toFixed(1)
                      : "5.0"}
                  </span>
                  <span className="text-[8px] text-slate-400">({selectedEquip.reviews.length} reviews)</span>
                </div>
              </div>

              {/* Photo Gallery Visualizer */}
              <div className="space-y-2">
                <div className="relative border border-slate-150 rounded-xl overflow-hidden h-52 bg-slate-100 shadow-inner group">
                  <img
                    src={selectedEquip.images[activeImageIndex]}
                    alt={selectedEquip.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Indicator overlay */}
                  <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-[8px] font-bold text-white px-2 py-0.5 rounded backdrop-blur-xs">
                    Image {activeImageIndex + 1} of {selectedEquip.images.length}
                  </span>
                </div>

                {/* Gallery Thumbnail Row */}
                <div className="grid grid-cols-3 gap-2">
                  {selectedEquip.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        activeImageIndex === idx
                          ? "border-emerald-600 ring-2 ring-emerald-500/20"
                          : "border-slate-200 hover:border-slate-350"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Block */}
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Chassis Description</span>
                <p className="text-[10px] text-slate-600 leading-normal font-medium">{selectedEquip.description}</p>
              </div>

              {/* Specifications Block Grid */}
              <div className="space-y-2">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Technical Specifications</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px]">
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-2">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Make</span>
                    <span className="text-slate-900 font-extrabold block mt-0.5">{selectedEquip.make}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-2">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Model</span>
                    <span className="text-slate-900 font-extrabold block mt-0.5 truncate">{selectedEquip.model}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-2">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Year</span>
                    <span className="text-slate-900 font-extrabold block mt-0.5">{selectedEquip.year}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-2">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Power</span>
                    <span className="text-emerald-700 font-black block mt-0.5">{selectedEquip.powerHP} HP</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-2 col-span-2 sm:col-span-1">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Condition</span>
                    <span className="text-indigo-700 font-extrabold block mt-0.5">{selectedEquip.condition}</span>
                  </div>
                </div>
              </div>

              {/* Rental Rates Dashboard */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secured Rental Rates</span>
                  <span className="text-[8px] font-extrabold text-slate-500 uppercase">Conversion: 1 USD ≈ ₹83</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 text-center">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Hourly Rate</span>
                    <span className="text-xs font-black text-slate-800 block mt-0.5">₹{selectedEquip.hourlyRate * 83}</span>
                    <span className="text-[8px] text-slate-400 font-mono">${selectedEquip.hourlyRate}/hr</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 text-center">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Daily Rate</span>
                    <span className="text-xs font-black text-emerald-700 block mt-0.5">₹{selectedEquip.dailyRate * 83}</span>
                    <span className="text-[8px] text-slate-400 font-mono">${selectedEquip.dailyRate}/day</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 text-center">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Weekly Rate</span>
                    <span className="text-xs font-black text-slate-800 block mt-0.5">₹{selectedEquip.weeklyRate * 83}</span>
                    <span className="text-[8px] text-slate-400 font-mono">${selectedEquip.weeklyRate}/wk</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 text-center">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Monthly Rate</span>
                    <span className="text-xs font-black text-indigo-700 block mt-0.5">₹{selectedEquip.monthlyRate * 83}</span>
                    <span className="text-[8px] text-slate-400 font-mono">${selectedEquip.monthlyRate}/mo</span>
                  </div>
                </div>

                {/* Refundable Security Deposit Banner */}
                <div className="bg-indigo-50 border border-indigo-200/50 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px]">
                    <Coins className="h-4 w-4 text-indigo-600" />
                    <div>
                      <p className="font-extrabold text-indigo-900">Security Damage Deposit</p>
                      <p className="text-[8px] text-indigo-600">100% Refundable lock in Secure Escrow vault upon safe machine return.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-indigo-800 text-xs font-black block">₹{selectedEquip.damageDeposit * 83}</span>
                    <span className="text-[8px] font-mono font-bold text-indigo-500 block">${selectedEquip.damageDeposit} USD</span>
                  </div>
                </div>
              </div>

              {/* Interactive Month Availability Calendar (July 2026) */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Machinery Lease Schedule</span>
                    <h4 className="text-[10px] font-black text-slate-800 uppercase flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" /> Availability: July 2026
                    </h4>
                  </div>
                  <span className="text-[8px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Click dates to select range
                  </span>
                </div>

                {/* Calendar Grid Representation */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 font-sans">
                  {/* Calendar Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                  </div>

                  {/* Calendar Dates Grid */}
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[10px]">
                    {/* Padding empty slots for Wednesday start */}
                    {Array(3).fill(null).map((_, idx) => (
                      <div key={`empty-${idx}`} className="py-2 text-transparent select-none">-</div>
                    ))}

                    {/* Day elements (1 to 31) */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const dayStr = `2026-07-${day < 10 ? `0${day}` : day}`;
                      
                      const isBooked = selectedEquip.alreadyBookedIntervals.some(
                        (interval) => dayStr >= interval.start && dayStr <= interval.end
                      );
                      
                      const isSelectedStart = startDateStr === dayStr;
                      const isSelectedEnd = endDateStr === dayStr;
                      const isSelectedRange = startDateStr && endDateStr && dayStr >= startDateStr && dayStr <= endDateStr;

                      let cellClass = "py-1.5 rounded-lg border text-[10px] font-bold transition-all ";
                      if (isBooked) {
                        cellClass += "bg-red-50 border-red-100 text-red-400 cursor-not-allowed line-through ";
                      } else if (isSelectedStart || isSelectedEnd) {
                        cellClass += "bg-emerald-600 border-emerald-600 text-white shadow-xs font-black cursor-pointer ";
                      } else if (isSelectedRange) {
                        cellClass += "bg-emerald-50 border-emerald-200 text-emerald-800 cursor-pointer ";
                      } else {
                        cellClass += "bg-white border-slate-150 hover:bg-slate-100 text-slate-700 cursor-pointer ";
                      }

                      return (
                        <div
                          key={day}
                          onClick={() => {
                            if (isBooked) return;
                            // Set dates
                            if (!startDateStr || (startDateStr && endDateStr)) {
                              setStartDateStr(dayStr);
                              setEndDateStr("");
                            } else {
                              if (dayStr < startDateStr) {
                                setStartDateStr(dayStr);
                              } else {
                                // Check overlap
                                let overlaps = false;
                                let check = new Date(startDateStr);
                                const target = new Date(dayStr);
                                while (check <= target) {
                                  const cStr = check.toISOString().split("T")[0];
                                  if (selectedEquip.alreadyBookedIntervals.some(inv => cStr >= inv.start && cStr <= inv.end)) {
                                    overlaps = true;
                                    break;
                                  }
                                  check.setDate(check.getDate() + 1);
                                }
                                if (overlaps) {
                                  alert("❌ Booking Overlap: Selected range includes booked dates! Please select another date.");
                                  return;
                                }
                                setEndDateStr(dayStr);
                              }
                            }
                          }}
                          className={`${cellClass} relative flex flex-col items-center justify-center`}
                          title={isBooked ? "Booked Out" : "Available"}
                        >
                          <span>{day}</span>
                          {isBooked && <span className="absolute bottom-0.5 text-[5px] leading-none text-red-600 uppercase font-black font-mono">Booked</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Date range display */}
                <div className="flex justify-between items-center text-[10px] font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-slate-500">Selected Lease Window:</span>
                  <span className="text-slate-800">
                    {startDateStr ? `${startDateStr}` : "Not Selected"}
                    {endDateStr ? ` to ${endDateStr}` : " (Select end date on calendar)"}
                  </span>
                </div>
              </div>

              {/* Location: Google Maps Integration Area */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Geographic Dispatch Location</span>
                    <h4 className="text-[10px] font-black text-slate-800 uppercase flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Google Maps Integration
                    </h4>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMapType(mapType === "terrain" ? "satellite" : "terrain")}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[8px] font-black uppercase text-slate-600 transition-colors cursor-pointer"
                    >
                      {mapType === "terrain" ? "🛰️ Satellite View" : "🗺️ Terrain View"}
                    </button>
                    <div className="flex border border-slate-200 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setMapZoom(Math.max(12, mapZoom - 1))}
                        className="px-1.5 bg-slate-50 hover:bg-slate-100 font-black text-[9px] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-1.5 bg-white text-[8px] font-extrabold flex items-center">{mapZoom}x</span>
                      <button
                        type="button"
                        onClick={() => setMapZoom(Math.min(18, mapZoom + 1))}
                        className="px-1.5 bg-slate-50 hover:bg-slate-100 font-black text-[9px] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Google Maps Simulated Frame */}
                <div className="border border-slate-200 rounded-xl relative overflow-hidden bg-slate-950 h-48 flex items-center justify-center">
                  
                  {/* If satellite mode, render interactive grid overlay over dark space */}
                  {mapType === "satellite" ? (
                    <div className="absolute inset-0 bg-slate-900 opacity-90 transition-all duration-300">
                      {/* Grid lines */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(16,185,129,0.05)_80%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(16,185,129,0.03)_1px,_transparent_1px)] bg-[size:16px_16px]" />
                      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,_transparent_1px)] bg-[size:32px_32px] opacity-10" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-slate-100 opacity-100 transition-all duration-300">
                      {/* Vector roads & maps visual */}
                      <div className="absolute inset-0 bg-[linear-gradient(#e2e8f0_1px,_transparent_1px),_linear-gradient(90deg,_#e2e8f0_1px,_transparent_1px)] bg-[size:24px_24px]" />
                      <div className="absolute w-5/6 h-2.5 bg-amber-100 border-y border-amber-200/50 -rotate-12 transform translate-y-24 translate-x-4 opacity-65" />
                      <div className="absolute w-2/3 h-2 bg-slate-200 border-y border-slate-300/40 rotate-45 transform translate-y-8 translate-x-12 opacity-50" />
                      {/* Water Body representation */}
                      <div className="absolute top-2 right-4 w-20 h-20 bg-blue-100/50 rounded-full blur-md opacity-70" />
                    </div>
                  )}

                  {/* Satellite terrain simulated features */}
                  {mapType === "satellite" && (
                    <div className="absolute text-center text-slate-500 text-[9px] select-none pointer-events-none opacity-40 uppercase tracking-widest font-mono">
                      [ RAW SATELLITE FEED OVER WATER SECTORS ]
                    </div>
                  )}

                  {/* Sector radar rings based on Zoom factor */}
                  <div
                    className="absolute border border-emerald-500/20 rounded-full transition-all duration-500"
                    style={{
                      width: `${(mapZoom - 10) * 24}px`,
                      height: `${(mapZoom - 10) * 24}px`
                    }}
                  />
                  <div
                    className="absolute border border-emerald-500/10 rounded-full transition-all duration-500"
                    style={{
                      width: `${(mapZoom - 10) * 12}px`,
                      height: `${(mapZoom - 10) * 12}px`
                    }}
                  />

                  {/* Selected Equipment GPS Marker Pin */}
                  <div className="absolute text-center flex flex-col items-center">
                    <div className="h-4 w-4 bg-emerald-500 rounded-full border-2 border-white animate-ping absolute" />
                    <div className="h-4 w-4 bg-emerald-600 rounded-full border-2 border-white relative flex items-center justify-center shadow-lg">
                      <MapPin className="h-2 w-2 text-white" />
                    </div>
                    <span className="bg-slate-900/95 text-[7px] text-emerald-400 font-extrabold px-1.5 py-0.5 rounded border border-slate-800 block mt-1 uppercase tracking-wider font-mono shadow-md">
                      {selectedEquip.type} Spot
                    </span>
                  </div>

                  {/* Nearby dispatch depots */}
                  <div className="absolute text-center" style={{ transform: "translate(-80px, -40px)" }}>
                    <div className="h-2 w-2 bg-amber-500 rounded-full border border-white" />
                    <span className="text-[6px] text-slate-500 font-black bg-white/95 px-1 rounded border border-slate-200 block mt-0.5">Amritsar Depot</span>
                  </div>

                  <div className="absolute text-center" style={{ transform: "translate(90px, 35px)" }}>
                    <div className="h-2 w-2 bg-indigo-500 rounded-full border border-white" />
                    <span className="text-[6px] text-slate-500 font-black bg-white/95 px-1 rounded border border-slate-200 block mt-0.5">Ludhiana Hub</span>
                  </div>

                  {/* HUD Readout overlay */}
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/95 border border-slate-800 p-2.5 rounded-lg text-[7px] font-mono text-slate-400 space-y-0.5 shadow-md">
                    <p className="text-white font-extrabold">GOOGLE MAPS API ENGINE:</p>
                    <p>Lat: {selectedEquip.gpsLocation.lat.toFixed(4)}</p>
                    <p>Lng: {selectedEquip.gpsLocation.lng.toFixed(4)}</p>
                    <p className="text-emerald-400 font-bold">Location: {selectedEquip.gpsLocation.label}</p>
                    <p className="text-[6px] text-slate-500">Zoom index: {mapZoom}.0x • Grid clear</p>
                  </div>
                </div>
              </div>

              {/* Book Now trigger button shortcut */}
              <button
                type="button"
                onClick={() => setCenterTab("booking")}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="h-4.5 w-4.5" /> Book Now & Configure Lease Window
              </button>

            </div>
          )}

          {/* TAB 2: INTERACTIVE LEASE BOOKING TERMINAL */}
          {centerTab === "booking" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider">Leasing Workspace</span>
                <h3 className="text-xs font-black text-slate-900 mt-0.5">Rent: {selectedEquip.name}</h3>
                <p className="text-[10px] text-slate-400">Configure lease periods, hire operators, and review dynamic cost projections.</p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Hourly, Daily, Weekly, Monthly selector */}
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1.5">Booking Sched Tier</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["Hourly", "Daily", "Weekly", "Monthly"] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          setRentalTier(tier);
                          setDurationUnits(tier === "Hourly" ? 4 : tier === "Weekly" ? 1 : tier === "Monthly" ? 1 : 3);
                        }}
                        className={`py-2 rounded-lg text-[9px] font-black border transition-all cursor-pointer text-center ${
                          rentalTier === tier
                            ? "bg-emerald-700 border-emerald-700 text-white shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Date Range */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-200/60">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" /> Start Date
                      </label>
                      <input
                        type="date"
                        value={startDateStr}
                        onChange={(e) => setStartDateStr(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" /> End Date
                      </label>
                      <input
                        type="date"
                        value={endDateStr}
                        onChange={(e) => setEndDateStr(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold"
                      />
                    </div>

                    {/* Calculated Hours/Days/Weeks/Months display */}
                    <div className="col-span-2 pt-2 border-t border-slate-200/50 flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-bold uppercase">Calculated Lease Duration:</span>
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-black font-mono">
                        {rentalTier === "Hourly" && `${durationUnits} Hours (Calculated at 8h/day)`}
                        {rentalTier === "Daily" && `${durationUnits} Days`}
                        {rentalTier === "Weekly" && `${durationUnits} ${durationUnits === 1 ? "Week" : "Weeks"}`}
                        {rentalTier === "Monthly" && `${durationUnits} ${durationUnits === 1 ? "Month" : "Months"}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Option */}
                <div className="space-y-2">
                  <label className="block text-slate-500 text-[10px] font-bold uppercase flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-slate-400" /> Delivery Option
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setDeliveryOption("pickup")}
                      className={`p-3 rounded-xl border text-[10px] font-semibold text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                        deliveryOption === "pickup"
                          ? "bg-emerald-50/60 border-emerald-600 text-emerald-900"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-extrabold flex items-center gap-1.5 text-slate-800">
                        <Home className="h-3.5 w-3.5 text-emerald-600" /> Self-pickup
                      </span>
                      <span className="text-[8px] text-slate-500 mt-1 block">Collect from Depot • Free</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryOption("delivery")}
                      className={`p-3 rounded-xl border text-[10px] font-semibold text-left transition-all cursor-pointer flex flex-col justify-between h-18 ${
                        deliveryOption === "delivery"
                          ? "bg-emerald-50/60 border-emerald-600 text-emerald-900"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-extrabold flex items-center gap-1.5 text-slate-800">
                        <Truck className="h-3.5 w-3.5 text-emerald-600" /> Farm Delivery
                      </span>
                      <span className="text-[8px] text-slate-500 mt-1 block">
                        Cost: ₹{Math.round((10 + calculateDistance(selectedEquip.gpsLocation) * 0.3) * 83)} (+₹25/km)
                      </span>
                    </button>
                  </div>
                </div>

                {/* Conflict Indicator */}
                {hasConflict && (
                  <div className="p-2.5 rounded-xl border bg-red-50 border-red-200 text-red-700 text-[10px] font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-red-600" />
                      Conflict Warning: Dates Booked Already
                    </span>
                    <span>Unfit</span>
                  </div>
                )}

                {/* Professional Operator add-on selection */}
                <div className="bg-slate-50/50 border border-slate-200 p-3.5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-500" /> Operator Staff Allocation
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeOperator}
                        onChange={(e) => setIncludeOperator(e.target.checked)}
                        className="accent-emerald-700 h-4.5 w-4.5 cursor-pointer"
                      />
                      <span className="ml-1.5 text-[9px] font-extrabold text-slate-600">Assign Driver</span>
                    </label>
                  </div>

                  {includeOperator && (
                    <div className="space-y-2">
                      <label className="block text-[8px] font-bold text-slate-400 uppercase">Select Available Operator</label>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedEquip.operators.map((op, idx) => (
                          <div
                            key={idx}
                            onClick={() => op.isAvailable && setSelectedOperatorIndex(idx)}
                            className={`p-2 rounded-lg border text-[10px] font-semibold cursor-pointer transition-all ${
                              !op.isAvailable
                                ? "bg-slate-100 border-slate-150 text-slate-400 cursor-not-allowed"
                                : selectedOperatorIndex === idx
                                ? "bg-emerald-50 border-emerald-600 text-emerald-800"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">{op.avatar}</span>
                              <div>
                                <p className="font-bold leading-none">{op.name}</p>
                                <p className="text-[8px] text-slate-400 mt-0.5">{op.experienceYears}yr exp • ₹{op.hourlyRate * 83}/hr</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fuel and Insurance protection check */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                    <div className="text-[10px]">
                      <span className="text-slate-500 font-bold block uppercase text-[8px]">Fuel Burn Estimator</span>
                      <span className="text-slate-800 font-extrabold">{priceEstimates.estimatedFuelLitres.toFixed(1)} Litres</span>
                    </div>
                    <Fuel className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                    <div className="text-[10px]">
                      <span className="text-slate-500 font-bold block uppercase text-[8px]">Damage Insurance</span>
                      <span className="text-slate-800 font-extrabold">₹{priceEstimates.insuranceCost * 83} Prem</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addInsurance}
                        onChange={(e) => setAddInsurance(e.target.checked)}
                        className="accent-emerald-700 h-4.5 w-4.5 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Bill breakdown sheets */}
                <div className="bg-slate-900 text-slate-300 rounded-xl p-4 space-y-2 text-[10px] font-medium font-mono">
                  <div className="flex justify-between text-[8px] uppercase tracking-wider text-slate-500 pb-1.5 border-b border-slate-800">
                    <span>Leasehold Itemized Invoice</span>
                    <span>Amount (₹ / $)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Lease Rate ({rentalTier} x {durationUnits}):</span>
                    <span className="text-white">₹{Math.round(priceEstimates.baseCost * 83)} <span className="text-[8px] text-slate-400">(${priceEstimates.baseCost})</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Consumption Reserve (₹93/L):</span>
                    <span className="text-white">₹{Math.round(priceEstimates.fuelCost * 83)} <span className="text-[8px] text-slate-400">(${priceEstimates.fuelCost.toFixed(1)})</span></span>
                  </div>
                  {includeOperator && (
                    <div className="flex justify-between">
                      <span>Operator Labor allocation:</span>
                      <span className="text-white">₹{Math.round(priceEstimates.operatorCost * 83)} <span className="text-[8px] text-slate-400">(${priceEstimates.operatorCost.toFixed(1)})</span></span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Damage Liability Premium:</span>
                    <span className="text-white">₹{Math.round(priceEstimates.insuranceCost * 83)} <span className="text-[8px] text-slate-400">(${priceEstimates.insuranceCost})</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Farm Gate Dispatch / Delivery:</span>
                    <span className="text-white">
                      {priceEstimates.deliveryCost > 0 
                        ? `₹${Math.round(priceEstimates.deliveryCost * 83)} (${priceEstimates.deliveryCost.toFixed(1)} USD)`
                        : "Free (Self-pickup)"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
                    <span>Escrow Refundable Damage Deposit:</span>
                    <span className="text-indigo-400">₹{priceEstimates.damageDeposit * 83} <span className="text-[8px] text-indigo-400">(${priceEstimates.damageDeposit})</span></span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-500 pt-2 text-xs font-extrabold font-sans text-white">
                    <span>GRAND TOTAL LEASE SECURE:</span>
                    <span className="text-emerald-400 text-sm font-black">₹{Math.round(priceEstimates.total * 83)} <span className="text-[9px] text-slate-400">(${priceEstimates.total.toFixed(2)})</span></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={hasConflict}
                  className={`w-full py-3.5 font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    hasConflict
                      ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/10"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  Establish Secured Machinery Leasehold
                </button>
              </div>
            </div>
          )}

          {centerTab === "history" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* RENTAL HISTORY LIST PANEL */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase font-black text-indigo-700 tracking-wider flex items-center gap-1">
                      <History className="h-3 w-3" /> Audit & Escrow Ledger
                    </span>
                    <h3 className="text-xs font-black text-slate-900 mt-0.5">Lease History & Contracts</h3>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black font-mono px-2 py-0.5 rounded-full">
                    {userBookings.length} total
                  </span>
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/50">
                  {(["All", "Booked", "Active", "Completed", "Cancelled"] as const).map((st) => {
                    const count = st === "All" 
                      ? userBookings.length 
                      : userBookings.filter(b => b.status === st).length;
                    const isActive = historyStatusFilter === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setHistoryStatusFilter(st)}
                        className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                          isActive
                            ? "bg-slate-800 text-white shadow-xs"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-150/40"
                        }`}
                      >
                        {st}
                        <span className={`text-[7px] font-black px-1 rounded-full ${
                          isActive ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* List Container */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {userBookings.filter(b => historyStatusFilter === "All" || b.status === historyStatusFilter).length === 0 ? (
                    <div className="text-center py-6 text-[10px] text-slate-400 font-semibold italic">
                      No machinery leases logged under "{historyStatusFilter}" state.
                    </div>
                  ) : (
                    userBookings
                      .filter(b => historyStatusFilter === "All" || b.status === historyStatusFilter)
                      .map((b) => {
                        const isSelected = selectedBookingId === b.id;
                        return (
                          <div
                            key={b.id}
                            onClick={() => setSelectedBookingId(b.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-xs text-left ${
                              isSelected
                                ? "bg-slate-50/85 border-indigo-600/80 ring-2 ring-indigo-600/10"
                                : "bg-white border-slate-200/70 hover:bg-slate-50/50"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{b.equipType} • {b.id}</span>
                                <h4 className="text-[11px] font-black text-slate-900 leading-tight">{b.equipName}</h4>
                                <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Clock className="h-2.5 w-2.5 text-slate-400" /> {b.startDate} to {b.endDate}
                                </span>
                              </div>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                                b.status === "Booked"
                                  ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                                  : b.status === "Active"
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-700 animate-pulse"
                                  : b.status === "Completed"
                                  ? "bg-slate-50 border-slate-200 text-slate-600"
                                  : "bg-red-50 border-red-100 text-red-600"
                              }`}>
                                {b.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 text-[10px]">
                              <span className="text-[8px] text-slate-400 font-bold uppercase">
                                Rate: {b.rentalTier} • {b.deliveryOption === "delivery" ? "Delivered" : "Pickup"}
                              </span>
                              <span className="text-emerald-700 font-extrabold font-mono">
                                ₹{Math.round(b.totalPaid * 83)} <span className="text-[7px] text-slate-400 font-sans">(${b.totalPaid.toFixed(0)})</span>
                              </span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* RENTAL DETAIL PANEL (LEASEHOLD CONTRACT INSPECTOR) */}
              {(() => {
                const activeBooking = userBookings.find(b => b.id === selectedBookingId) || userBookings[0];
                if (!activeBooking) return null;

                // Attempt to load current equipment image & metrics
                const linkedEquip = equipments.find(e => e.id === activeBooking.equipId) || equipments.find(e => e.name === activeBooking.equipName);
                
                return (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider">Leasehold Contract Audit</span>
                        <h3 className="text-xs font-black text-slate-900 mt-0.5 text-left">Agreement Details: {activeBooking.id}</h3>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                        activeBooking.status === "Booked"
                          ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                          : activeBooking.status === "Active"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                          : activeBooking.status === "Completed"
                          ? "bg-slate-50 border-slate-200 text-slate-600"
                          : "bg-red-50 border-red-100 text-red-600"
                      }`}>
                        {activeBooking.status}
                      </span>
                    </div>

                    {/* Equipment Thumbnail + Details Row */}
                    <div className="flex gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50 text-left">
                      {linkedEquip && (
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                          <img
                            src={linkedEquip.images[0]}
                            alt={linkedEquip.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider">{activeBooking.equipType} Chassis</span>
                        <h4 className="text-[11px] font-black text-slate-900 leading-tight">{activeBooking.equipName}</h4>
                        <p className="text-[9px] text-slate-500">Model: {activeBooking.equipModel} • {linkedEquip ? `${linkedEquip.powerHP} HP` : "Standard Power"}</p>
                      </div>
                    </div>

                    {/* Leasehold Timeline & Parameters */}
                    <div className="grid grid-cols-2 gap-3 text-[10px] bg-slate-50/50 p-3 rounded-xl border border-slate-200/40 text-left">
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[8px]">Rental Leasehold Term</span>
                        <span className="text-slate-800 font-black flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3 text-slate-500" /> {activeBooking.startDate}
                        </span>
                        <span className="text-slate-400 text-[8px] block">to {activeBooking.endDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[8px]">Billing Rate Framework</span>
                        <span className="text-slate-800 font-black block mt-0.5">
                          {activeBooking.rentalTier} Billing
                        </span>
                        <span className="text-slate-400 text-[8px] block">{activeBooking.durationUnits} {activeBooking.rentalTier === "Hourly" ? "Operating Hours" : activeBooking.rentalTier === "Daily" ? "Days Lease" : activeBooking.rentalTier === "Weekly" ? "Weeks Lease" : "Months Lease"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[8px]">Dispatch Logistics</span>
                        <span className="text-slate-800 font-bold block mt-0.5">
                          {activeBooking.deliveryOption === "delivery" ? "🚚 Farm Gate Delivery" : "🏢 Self Depot Pickup"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[8px]">Operator Setup</span>
                        <span className="text-slate-800 font-bold block mt-0.5">
                          {activeBooking.withOperator ? "👨‍✈️ Driver Dispatched" : "🚜 Self-Operated"}
                        </span>
                      </div>
                    </div>

                    {/* Escrow Escrow Ledger */}
                    <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2.5 text-left">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-[10px]">
                        <span className="text-teal-400 font-black tracking-wider uppercase text-[8px] flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Secure Escrow Audit
                        </span>
                        <span className="text-slate-400 font-mono font-bold">Smart ESCROW v2.4</span>
                      </div>
                      <div className="space-y-1.5 text-[10px] text-slate-300 font-semibold">
                        <div className="flex justify-between">
                          <span>Total Rental Charge Paid:</span>
                          <span className="text-emerald-400 font-bold">₹{Math.round(activeBooking.totalPaid * 83)} <span className="text-[8px] text-slate-400">(${activeBooking.totalPaid.toFixed(1)})</span></span>
                        </div>
                        <div className="flex justify-between">
                          <span>Security Damage Deposit Held:</span>
                          <span className="text-indigo-400 font-bold">₹{Math.round(activeBooking.damageDeposit * 83)} <span className="text-[8px] text-indigo-400 font-sans">(${activeBooking.damageDeposit})</span></span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800 pt-1.5 text-[9px] items-center">
                          <span className="text-slate-400 uppercase font-black text-[8px]">Deposit Security Status:</span>
                          <span className={`px-2 py-0.5 rounded font-black uppercase text-[8px] ${
                            activeBooking.securityDepositStatus === "held"
                              ? "bg-amber-950 text-amber-400 border border-amber-800/60"
                              : "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                          }`}>
                            {activeBooking.securityDepositStatus === "held" ? "🔒 HELD IN ESCROW" : "🔓 FULLY REFUNDED"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Damage Log & Remarks (Interactively editable!) */}
                    {activeBooking.status !== "Active" && activeBooking.status !== "Completed" && (
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Wrench className="h-3 w-3 text-slate-400" /> Machinery Inspection Damage Notes
                        </label>
                        <div className="relative">
                          <textarea
                            placeholder="No damage or inspection remarks filed yet."
                            value={activeBooking.damageNotes}
                            onChange={(e) => {
                              const val = e.target.value;
                              setUserBookings(prev => prev.map(b => b.id === activeBooking.id ? { ...b, damageNotes: val } : b));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium leading-relaxed"
                            rows={2}
                          />
                        </div>
                        <span className="text-[7px] text-slate-400 block italic leading-none">Note: Field engineers update logs dynamically. You can log remarks directly. Changes auto-save on typing.</span>
                      </div>
                    )}

                    {/* Interactive Workflow Buttons */}
                    {activeBooking.status === "Booked" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to cancel leasehold ${activeBooking.id}? Your refundable damage deposit of ₹${activeBooking.damageDeposit * 83} will be returned.`)) {
                            // Cancel booking
                            setUserBookings(prev => prev.map(b => b.id === activeBooking.id ? {
                              ...b,
                              status: "Cancelled",
                              securityDepositStatus: "refunded",
                              damageNotes: "Lease contract canceled by user. Escrow damage deposit fully refunded."
                            } : b));
                            
                            // Remove booking interval from equipment
                            setEquipments(prev => prev.map(eq => {
                              if (eq.id === activeBooking.equipId || eq.name === activeBooking.equipName) {
                                return {
                                  ...eq,
                                  alreadyBookedIntervals: eq.alreadyBookedIntervals.filter(i => i.start !== activeBooking.startDate || i.end !== activeBooking.endDate)
                                };
                              }
                              return eq;
                            }));

                            alert("✓ Lease canceled. Escrow deposit fully refunded to your linked account.");
                          }
                        }}
                        className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                      >
                        Cancel Lease Contract & Refund Escrow
                      </button>
                    )}

                    {activeBooking.status === "Active" && (
                      <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-left animate-in fade-in duration-200">
                        <div className="border-b border-slate-200 pb-2 flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span className="text-[10px] uppercase font-black text-slate-700">Return Machinery Verification Desk</span>
                        </div>

                        {/* File Upload Zone for Condition Photos */}
                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                            <span>📷 Condition Photos (Drag & Drop or click to add)</span>
                            <span className="text-[7px] text-slate-400 font-medium">Add at least 1 proof photo</span>
                          </label>

                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingPhoto(true);
                            }}
                            onDragLeave={() => setIsDraggingPhoto(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingPhoto(false);
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                const files = Array.from(e.dataTransfer.files);
                                files.forEach(file => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === "string") {
                                      setReturnPhotos(prev => [...prev, reader.result as string]);
                                    }
                                  };
                                  reader.readAsDataURL(file as any);
                                });
                              }
                            }}
                            onClick={() => {
                              const fileInput = document.getElementById("return-photo-upload-input");
                              if (fileInput) fileInput.click();
                            }}
                            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                              isDraggingPhoto
                                ? "border-emerald-600 bg-emerald-50/50"
                                : "border-slate-200 bg-white hover:bg-slate-50/50"
                            }`}
                          >
                            <input
                              type="file"
                              id="return-photo-upload-input"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files) {
                                  const files = Array.from(e.target.files);
                                  files.forEach(file => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === "string") {
                                        setReturnPhotos(prev => [...prev, reader.result as string]);
                                      }
                                    };
                                    reader.readAsDataURL(file as any);
                                  });
                                }
                              }}
                            />
                            <Upload className="h-5 w-5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-700">Select files or Drop inspection photos</span>
                            <span className="text-[8px] text-slate-400">Accepts camera pictures, receipts, or inspections</span>
                          </div>

                          {/* Pre-made demo pictures for quick click seeding */}
                          <div className="flex gap-2 items-center">
                            <span className="text-[7px] font-bold text-slate-400 uppercase">Or quick check:</span>
                            <button
                              type="button"
                              onClick={() => setReturnPhotos(prev => [...prev, "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80"])}
                              className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[8px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                              + Back Hitch OK
                            </button>
                            <button
                              type="button"
                              onClick={() => setReturnPhotos(prev => [...prev, "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=80"])}
                              className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[8px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                              + Tires Inspected
                            </button>
                          </div>

                          {/* Photos List Grid */}
                          {returnPhotos.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 pt-1">
                              {returnPhotos.map((p, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group bg-white">
                                  <img src={p} alt="Inspection Proof" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReturnPhotos(prev => prev.filter((_, i) => i !== idx));
                                    }}
                                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-0.5 rounded-full shadow cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Damage Report Section */}
                        <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200/60">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-800 flex items-center gap-1.5">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Report New Machinery Damages
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={hasDamageReport}
                                onChange={(e) => setHasDamageReport(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 animate-none"></div>
                            </label>
                          </div>

                          {hasDamageReport && (
                            <div className="space-y-2.5 pt-2 border-t border-slate-100 animate-in slide-in-from-top-1 duration-200">
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Damage Severity Rating</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {(["Light", "Moderate", "Severe"] as const).map((sev) => {
                                    let color = "hover:bg-slate-50 text-slate-600 border-slate-200";
                                    if (reportedDamageSeverity === sev) {
                                      if (sev === "Light") color = "bg-amber-50 text-amber-800 border-amber-500";
                                      else if (sev === "Moderate") color = "bg-orange-50 text-orange-800 border-orange-500";
                                      else color = "bg-red-50 text-red-800 border-red-500";
                                    }
                                    return (
                                      <button
                                        key={sev}
                                        type="button"
                                        onClick={() => setReportedDamageSeverity(sev)}
                                        className={`py-1 text-[9px] font-bold rounded-lg border cursor-pointer text-center transition-all ${color}`}
                                      >
                                        {sev === "Light" && "Light ($25)"}
                                        {sev === "Moderate" && "Moderate ($75)"}
                                        {sev === "Severe" && `Severe ($${activeBooking.damageDeposit})`}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Details & Damage Description</label>
                                <textarea
                                  placeholder="Describe the physical condition or damage..."
                                  value={reportedDamageDescription}
                                  onChange={(e) => setReportedDamageDescription(e.target.value)}
                                  rows={2}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Real-time escrow calculation ledger */}
                        <div className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 space-y-2 text-[10px] font-mono">
                          <span className="text-[8px] font-bold uppercase text-teal-400 tracking-wider">💸 Refund & Claim Ledger</span>
                          <div className="space-y-1 font-semibold">
                            <div className="flex justify-between text-slate-400">
                              <span>Damage Deposit Held:</span>
                              <span className="text-slate-200 font-bold">₹{Math.round(activeBooking.damageDeposit * 83)} <span className="text-[8px]">(${activeBooking.damageDeposit})</span></span>
                            </div>
                            
                            {hasDamageReport && (
                              <div className="flex justify-between text-red-400">
                                <span>Damage Deductions:</span>
                                <span>-₹{Math.round((reportedDamageSeverity === "Light" ? 25 : reportedDamageSeverity === "Moderate" ? 75 : activeBooking.damageDeposit) * 83)} <span className="text-[8px]">(-${reportedDamageSeverity === "Light" ? 25 : reportedDamageSeverity === "Moderate" ? 75 : activeBooking.damageDeposit})</span></span>
                              </div>
                            )}

                            <div className="flex justify-between border-t border-slate-800 pt-1.5 text-emerald-400 font-bold">
                              <span>Net Escrow Refunded:</span>
                              <span>
                                ₹{Math.round(Math.max(0, activeBooking.damageDeposit - (hasDamageReport ? (reportedDamageSeverity === "Light" ? 25 : reportedDamageSeverity === "Moderate" ? 75 : activeBooking.damageDeposit) : 0)) * 83)}{" "}
                                <span className="text-[8px]">(${Math.max(0, activeBooking.damageDeposit - (hasDamageReport ? (reportedDamageSeverity === "Light" ? 25 : reportedDamageSeverity === "Moderate" ? 75 : activeBooking.damageDeposit) : 0))})</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Final Return trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            if (returnPhotos.length === 0) {
                              alert("⚠️ For security and contract auditing compliance, please upload or attach at least 1 condition verification photo.");
                              return;
                            }

                            const deduction = hasDamageReport ? (reportedDamageSeverity === "Light" ? 25 : reportedDamageSeverity === "Moderate" ? 75 : activeBooking.damageDeposit) : 0;
                            const finalRefund = Math.max(0, activeBooking.damageDeposit - deduction);

                            // Apply updates to the active booking
                            setUserBookings(prev => prev.map(b => b.id === activeBooking.id ? {
                              ...b,
                              status: "Completed" as const,
                              securityDepositStatus: "refunded" as const,
                              damageReported: hasDamageReport,
                              damageSeverity: hasDamageReport ? reportedDamageSeverity : undefined,
                              damageDeductionAmount: deduction,
                              conditionPhotos: returnPhotos,
                              damageNotes: hasDamageReport 
                                ? `Damage reported: ${reportedDamageSeverity} severity. ${reportedDamageDescription || "No details provided"}. Deduction: $${deduction} USD.`
                                : `Returned in clean/inspected condition. Full escrow deposit released. Verified files: ${returnPhotos.length} photos.`
                            } : b));

                            // Remove booking interval from equipment to free up calendar
                            setEquipments(prev => prev.map(eq => {
                              if (eq.id === activeBooking.equipId || eq.name === activeBooking.equipName) {
                                return {
                                  ...eq,
                                  alreadyBookedIntervals: eq.alreadyBookedIntervals.filter(i => i.start !== activeBooking.startDate || i.end !== activeBooking.endDate)
                                };
                              }
                              return eq;
                            }));

                            alert(`✓ MACHINERY RETURNED SUCCESSFULLY!\n\n• Condition Photos: ${returnPhotos.length} verified.\n• Damage Deductions: ₹${Math.round(deduction * 83)} ($${deduction} USD).\n• Escrow Security Refund: ₹${Math.round(finalRefund * 83)} ($${finalRefund} USD) has been dispatched to your linked bank account.`);
                          }}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer text-center shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Approve Condition Check & Return Machinery
                        </button>
                      </div>
                    )}

                    {activeBooking.status === "Completed" && (
                      <div className="space-y-3 animate-in fade-in">
                        <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl text-[10px] text-slate-800 text-left space-y-2">
                          <div className="flex items-center gap-1.5 font-extrabold text-emerald-800">
                            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                            Closed Contract Audit Report
                          </div>
                          
                          <p className="text-slate-600 font-medium">{activeBooking.damageNotes}</p>

                          {activeBooking.conditionPhotos && activeBooking.conditionPhotos.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Closed Inspection Verification Images</span>
                              <div className="grid grid-cols-4 gap-1.5">
                                {activeBooking.conditionPhotos.map((p, idx) => (
                                  <div key={idx} className="aspect-square rounded border border-slate-200 overflow-hidden bg-white">
                                    <img src={p} alt="Closed proof" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-2 border-t border-emerald-100 text-[9px] flex justify-between font-mono font-bold text-slate-500">
                            <span>Refunded Deposit:</span>
                            <span className="text-emerald-700">
                              ₹{Math.round((activeBooking.damageDeposit - (activeBooking.damageDeductionAmount || 0)) * 83)} (${activeBooking.damageDeposit - (activeBooking.damageDeductionAmount || 0)})
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeBooking.status === "Cancelled" && (
                      <div className="bg-red-50 border border-red-100 p-2.5 rounded-xl text-[10px] text-red-800 font-extrabold flex items-center gap-1.5 animate-in fade-in">
                        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                        This contract was cancelled. Escrow returned.
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: AI PREDICTIVE SCANNER & IOT CONTROLLER (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">

          {/* IOT ENGINE COMMAND CONTROLLER DESK */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[9px] uppercase font-black text-amber-700 tracking-wider">IoT Remote Command Portal</span>
              <h3 className="text-xs font-black text-slate-900 mt-0.5">IoT Remote Control Panel</h3>
              <p className="text-[10px] text-slate-400">Dispatch engine commands, toggle state triggers, and log machine pressure outputs.</p>
            </div>

            <div className="space-y-4">
              {/* remote start stop switch */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <div className="text-[10px]">
                  <span className="text-slate-500 font-bold block uppercase text-[8px]">Virtual Remote Ignition</span>
                  <span className={`font-black ${engineState.running ? "text-emerald-700 animate-pulse" : "text-slate-500"}`}>
                    {engineState.running ? "● ENGINE RUNNING" : "○ ENGINE IDLE"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleRemoteIgnition}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs font-black flex items-center justify-center transition-all ${
                    engineState.running
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-emerald-600 text-white shadow-sm"
                  }`}
                >
                  {engineState.running ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                </button>
              </div>

              {/* IoT Telemetry Gauges */}
              <div className="space-y-2">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Virtual Engine HUD</span>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-2 font-mono">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Engine RPM</span>
                    <span className="text-slate-800 text-[11px] font-black">{engineState.rpm} rpm</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-2 font-mono">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Engine Temp</span>
                    <span className={`text-[11px] font-black ${engineState.temp >= 95 ? "text-red-600 animate-pulse" : "text-slate-800"}`}>
                      {engineState.temp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-2 font-mono">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">Fuel Level</span>
                    <span className="text-slate-800 text-[11px] font-black">{selectedEquip.iotState.fuelLevel}%</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-2 font-mono">
                    <span className="text-[7px] text-slate-400 uppercase font-bold block">GPS Speed</span>
                    <span className="text-slate-800 text-[11px] font-black">{engineState.speed} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI PREDICTIVE MAINTENANCE SCANNER */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[9px] uppercase font-black text-indigo-700 tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Machine AI Telematics
              </span>
              <h3 className="text-xs font-black text-slate-900 mt-0.5">Predictive Health Metrics</h3>
              <p className="text-[10px] text-slate-400">Neural analysis of belt wear, acoustic vibration anomalies, and filter debris levels.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1 text-xs font-semibold">
                <div className="flex justify-between text-[10px] pb-1">
                  <span className="text-slate-500">Structural Score:</span>
                  <span className="text-slate-800 font-extrabold">{selectedEquip.aiMaintenanceStatus.healthScore}%</span>
                </div>
                {/* Visual Health Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      selectedEquip.aiMaintenanceStatus.healthScore >= 90
                        ? "bg-emerald-600"
                        : selectedEquip.aiMaintenanceStatus.healthScore >= 80
                        ? "bg-amber-500"
                        : "bg-red-600"
                    }`}
                    style={{ width: `${selectedEquip.aiMaintenanceStatus.healthScore}%` }}
                  />
                </div>
              </div>

              {/* Failure predictions lists */}
              <div className="space-y-2">
                <span className="block text-[8px] font-bold text-slate-400 uppercase">ML Failure Log Warns</span>
                <div className="space-y-1.5">
                  {selectedEquip.aiMaintenanceStatus.predictedFailures.map((pf, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-100 p-2 rounded text-[8px] text-red-800 flex items-start gap-1 font-semibold leading-normal">
                      <AlertTriangle className="h-3 w-3 text-red-600 shrink-0 mt-0.5" />
                      <span>{pf}</span>
                    </div>
                  ))}

                  {selectedEquip.aiMaintenanceStatus.predictedFailures.length === 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded text-[8px] text-emerald-800 flex items-center gap-1.5 font-bold">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      No mechanical fault detected by AI.
                    </div>
                  )}
                </div>
              </div>

              {/* Real-time Sensor readouts */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3 text-[9px] space-y-1.5 font-semibold text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Oil pressure:</span>
                  <span className="text-slate-800">{selectedEquip.aiMaintenanceStatus.sensorReadouts.oilPressure} PSI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Belt Tension:</span>
                  <span className="text-slate-800">{selectedEquip.aiMaintenanceStatus.sensorReadouts.beltTension}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hydraulic Fluid:</span>
                  <span className="text-slate-800">{selectedEquip.aiMaintenanceStatus.sensorReadouts.hydraulicFluid}% capacity</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAiDiagnostic}
                disabled={isDiagnosticScanning}
                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/70 text-indigo-700 text-[10px] font-black rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                {isDiagnosticScanning ? (
                  <>
                    <div className="h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    Scanning Acoustic Waves...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Trigger Predictive Acoustic Diagnosis
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* LOWER GRID: USAGE ANALYTICS & REVIEW SUBMISSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* RECHARTS USAGE ANALYTICS (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
              Machine Fuel Burn & Usage Analytics
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Real-time charts of diesel burn rate overlaying throttle efficiency across operating hours.</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageAnalyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" fontSize={9} stroke="#64748b" />
                <YAxis fontSize={9} stroke="#64748b" />
                <Tooltip contentStyle={{ fontSize: "10px", borderRadius: "8px" }} />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line type="monotone" name="Fuel Burn Rate (L/hr)" dataKey="dieselBurn" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 5 }} />
                <Line type="monotone" name="Throttle Efficiency (%)" dataKey="throttleEfficiency" stroke="#10b981" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FEEDBACK & RATINGS CORNER (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
              Verified Farmer Reviews
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Post-harvest performance commentary on chosen hardware configurations.</p>
          </div>

          {/* Form */}
          <form onSubmit={handlePostReview} className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase">My Name</label>
                <input
                  type="text"
                  placeholder="Amir P."
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[8px] font-bold text-slate-400 uppercase">Rating Score</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] focus:outline-none font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase">Commentary</label>
              <textarea
                placeholder="Describe engine tilling precision, blade speed..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] focus:outline-none"
                rows={2}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-[10px] rounded cursor-pointer"
            >
              Post Machine Efficiency Log
            </button>
          </form>

          {/* List reviews */}
          <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 pt-2 border-t border-slate-100">
            {selectedEquip.reviews.map((rev) => (
              <div key={rev.id} className="bg-slate-50 p-2.5 rounded-lg text-[9px] font-semibold space-y-1">
                <div className="flex justify-between items-center text-[8px]">
                  <span className="text-slate-700 font-extrabold">{rev.user}</span>
                  <span className="text-slate-400">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-[8px] text-amber-500 font-bold">
                  {"⭐".repeat(rev.rating)}
                </div>
                <p className="text-slate-600 leading-normal italic font-medium">"{rev.comment}"</p>
              </div>
            ))}

            {selectedEquip.reviews.length === 0 && (
              <div className="text-center py-4 text-[9px] italic text-slate-400">
                No verified reviews logged yet. Be the first to review this unit!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
