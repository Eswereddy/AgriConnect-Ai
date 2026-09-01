import React, { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  Video,
  Mic,
  Calendar,
  CheckCircle,
  HelpCircle,
  Award,
  Users,
  Smartphone,
  Cpu,
  DollarSign,
  Globe,
  Compass,
  ArrowRight,
  Sparkles,
  Heart,
  Volume2,
  Tv,
  ChevronRight,
  Smile,
  Clock,
  Play,
  Bookmark,
  Share2,
  Search,
  Pause,
  RotateCcw,
  Check,
  VolumeX,
  Maximize,
  Filter,
  Download,
  WifiOff,
  SkipForward,
  SkipBack,
  Bell,
  BellRing,
  PlusCircle,
  MessageSquare,
  Send,
  Star,
  Lock,
  Unlock,
  Book,
  ThumbsUp,
  MessageCircle
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: "Certification" | "Workshop" | "Special Program";
  duration: string;
  modulesCount: number;
  instructor: string;
  language: string;
  unlocked: boolean;
  completed: boolean;
  coverColor: string;
  tags: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  price: "Free" | "Paid" | string;
  enrolled: boolean;
  progressPercent: number;
}

interface CourseModule {
  id: string;
  title: string;
  lessonText: string;
  quizQuestion: string;
  quizOptions: string[];
  correctIdx: number;
}

const COURSE_CURRICULUMS: Record<string, CourseModule[]> = {
  "c-1": [
    {
      id: "m-1-1",
      title: "Module 1: Soil Nitrogen & Legume Nodes",
      lessonText: "Leguminous cover crops like clover or alfalfa form a symbiotic relationship with Rhizobium bacteria. These bacteria fix atmospheric nitrogen into ammonia within soil root nodules, providing a natural and free biological source of soil nitrogen.",
      quizQuestion: "What symbiotic bacteria are responsible for nitrogen fixation in legume root nodules?",
      quizOptions: ["Lactobacillus", "Rhizobium", "E. Coli", "Spirulina"],
      correctIdx: 1
    },
    {
      id: "m-1-2",
      title: "Module 2: Biochar Soil Amendments",
      lessonText: "Biochar is charcoal produced from thermal decomposition of organic biomass under oxygen-depleted conditions (pyrolysis). Its highly porous micro-structure acts as a permanent physical sponge to retain soil moisture, microbes, and critical nutrients.",
      quizQuestion: "Through what process is biochar created from biomass under oxygen-depleted conditions?",
      quizOptions: ["Hydrolysis", "Fermentation", "Pyrolysis", "Oxidation"],
      correctIdx: 2
    },
    {
      id: "m-1-3",
      title: "Module 3: Multi-Cropping & Rotation",
      lessonText: "Rotating deep-rooted crops with shallow-rooted crops prevents single-tier nutrient depletion and breaks pest reproductive cycles. Continuous single-crop farming depletes soil micro-flora, inviting resilient soil pathogens.",
      quizQuestion: "What is a primary benefit of rotating deep-rooted crops with shallow-rooted ones?",
      quizOptions: ["It increases soil erosion", "It prevents single-tier nutrient depletion and breaks pest cycles", "It requires higher pesticide usage", "It lowers overall market values"],
      correctIdx: 1
    }
  ],
  "c-2": [
    {
      id: "m-2-1",
      title: "Module 1: Trichoderma Bio-Fungicide",
      lessonText: "Trichoderma is a beneficial soil fungus that acts as an aggressive bio-agent against crop rot. It wraps around pathogenic fungal hyphae, releasing chitinolytic enzymes to dissolve their cell walls safely.",
      quizQuestion: "Which cell wall dissolving enzymes does Trichoderma release to combat crop rot pathogens?",
      quizOptions: ["Chitinolytic enzymes", "Amylases", "Lipases", "Proteases"],
      correctIdx: 0
    },
    {
      id: "m-2-2",
      title: "Module 2: Predatory Insect Breeding",
      lessonText: "Rather than spraying synthetic insecticides, organic farming breeds beneficial predatory insects like Ladybugs or Lacewings. These predators consume soft-bodied crop pests like aphids and spider mites naturally.",
      quizQuestion: "Which pest is ladybugs' favorite target for natural biocontrol?",
      quizOptions: ["Root nematodes", "Aphids & spider mites", "Leafhoppers", "Wireworms"],
      correctIdx: 1
    },
    {
      id: "m-2-3",
      title: "Module 3: Pheromone Insect Trapping",
      lessonText: "Pheromone traps emit synthesized species-specific female scent markers to lure and capture male moths (such as yellow stem borer), halting their mating and egg-laying cycles without chemical contamination.",
      quizQuestion: "How do synthetic pheromone traps suppress pest populations?",
      quizOptions: ["By poisoning the crop leaves", "By luring and trapping male moths to disrupt mating", "By sterilizing the surrounding soil", "By repelling beneficial ladybugs"],
      correctIdx: 1
    }
  ],
  "c-3": [
    {
      id: "m-3-1",
      title: "Module 1: Multi-Signature Escrow Basics",
      lessonText: "An escrow is an arrangement where a neutral third-party holds payment funds. In modern smart agricultural contracting, multi-sig locks secure buyer commitments, releasing them automatically upon verified delivery receipts.",
      quizQuestion: "What ensures buyer payments are secured before harvesting commences in smart contracting?",
      quizOptions: ["A verbal agreement", "Multi-signature cryptographic Escrow locks", "A simple promissory note", "A cash advance to local agents"],
      correctIdx: 1
    },
    {
      id: "m-3-2",
      title: "Module 2: Auditing Price Volatility",
      lessonText: "Price risk can be audited by comparing current contract-bid premiums against real-time APMC (Agricultural Produce Market Committee) indices, hedging crop selling targets during high demand periods.",
      quizQuestion: "What does APMC stand for in Indian agricultural market indexing?",
      quizOptions: ["Agri Produce Management Committee", "Agricultural Produce Market Committee", "Apex Pricing Municipal Council", "Automated Post-harvest Margin Corp"],
      correctIdx: 1
    },
    {
      id: "m-3-3",
      title: "Module 3: Crop Dispute Arbitration Keys",
      lessonText: "Disputes regarding quality are resolved by appointing an accredited neutral agricultural arbitrator who possesses a multi-sig key. If the crop moisture is within contract specs, they release the locked funds to the farmer.",
      quizQuestion: "What does an appointed neutral agricultural arbitrator hold to settle smart contract disputes?",
      quizOptions: ["The farmer's land deeds", "A physical crop sample", "A multi-signature key to release locked escrow funds", "A corporate seal"],
      correctIdx: 2
    }
  ],
  "c-4": [
    {
      id: "m-4-1",
      title: "Module 1: Phytosanitary Certification Specs",
      lessonText: "Phytosanitary certificates prove exported grains are free of restricted quarantine pests. Requirements include rigorous lab culture screenings, steam-sterilization of packing wood, and trace chemical residue logs.",
      quizQuestion: "What is the primary purpose of a Phytosanitary Certificate in grain export?",
      quizOptions: ["To prove the shipping vessel speed", "To certify that grains are free of quarantined pests and pathogens", "To estimate overall customs duty", "To declare the total container weight"],
      correctIdx: 1
    },
    {
      id: "m-4-2",
      title: "Module 2: APEDA Rice Standards",
      lessonText: "APEDA dictates that Premium Basmati export rice must be aged at least 9 months, have less than 12.5% moisture content, and average grain lengths exceeding 6.61mm before milling.",
      quizQuestion: "What is the maximum moisture percentage APEDA permits for safe Basmati rice shipping?",
      quizOptions: ["15.5%", "12.5%", "18.0%", "9.0%"],
      correctIdx: 1
    },
    {
      id: "m-4-3",
      title: "Module 3: Cold-Chain Shipping Logistics",
      lessonText: "Maintaining active temperature-controlled refrigeration prevents mold growth and cargo dampness during sea travel. Humidity must be kept under 60% with continuous forced ventilation loops.",
      quizQuestion: "What maximum humidity target is ideal during maritime container transport of agricultural grains?",
      quizOptions: ["Under 60% with forced ventilation", "80% to 90% static air", "100% airtight humidity", "No ventilation is required"],
      correctIdx: 0
    }
  ],
  "c-5": [
    {
      id: "m-5-1",
      title: "Module 1: App-Based Soil Diagnostics",
      lessonText: "Farmers use mobile apps connected to regional IoT sensory nodes to poll real-time soil nitrogen, phosphorus, temperature, and local evapotranspiration rates directly from their fields.",
      quizQuestion: "Which nutrient sensors are commonly paired with soil diagnostic mobile apps?",
      quizOptions: ["Helium gas sensors", "Nitrogen, Phosphorus, and Potassium (NPK) sensors", "Methane levels", "Iron ore density"],
      correctIdx: 1
    },
    {
      id: "m-5-2",
      title: "Module 2: Smart Spray Drone Coordination",
      lessonText: "Using GPS waypoints and Lidar elevation surveys, smartphones can coordinate autonomous spray drones. This ensures perfect micronutrient delivery while keeping farmers safe from chemical drifts.",
      quizQuestion: "What helps drones fly perfectly contoured path heights over uneven farming terrain?",
      quizOptions: ["A standard compass", "Lidar elevational surveys and GPS waypoints", "High wind speeds", "Manual joystick steering only"],
      correctIdx: 1
    }
  ],
  "c-6": [
    {
      id: "m-6-1",
      title: "Module 1: Tractor Hydraulic Systems",
      lessonText: "Modern farm tractors employ draft-controlled 3-point linkages powered by central hydraulic pumps. This allows heavy seed-drills and subsoilers to maintain a uniform working depth across bumpy terrains.",
      quizQuestion: "Which system maintains uniform plowing depth despite tractor elevation shifts?",
      quizOptions: ["Pneumatic tire pressure", "Draft-controlled 3-point hydraulic linkage", "Exhaust pressure", "Steering gear"],
      correctIdx: 1
    },
    {
      id: "m-6-2",
      title: "Module 2: Harvester Header Adjustments",
      lessonText: "The harvester header cutting height must be continuously adjusted based on crop lodging (bending). Floating headers with flexible skid plates automatically glide over soil contours to capture fallen stalks.",
      quizQuestion: "What component allows harvesters to glide smoothly over soil to rescue lodged crops?",
      quizOptions: ["A rigid steel plow", "Floating headers with flexible skid plates", "A standard rotary cutter", "An elevated conveyor belt"],
      correctIdx: 1
    },
    {
      id: "m-6-3",
      title: "Module 3: Heavy Machinery Safety",
      lessonText: "Always engage Roll-Over Protective Structures (ROPS) and seatbelts. When operating on high slopes, lock rear differentials to maximize traction and prevent high-torque side rollovers.",
      quizQuestion: "What safety structure protects operators during tractor roll accidents?",
      quizOptions: ["A reinforced bumper", "ROPS (Roll-Over Protective Structures)", "Differential lock", "Draft control linkage"],
      correctIdx: 1
    }
  ]
};

interface VideoTutorial {
  id: string;
  title: string;
  category: "Planting" | "Fertilizing" | "Pest Control" | "Harvesting" | "Marketing";
  languages: string[];
  duration: string;
  durationSeconds: number;
  instructor: string;
  description: string;
  keywords: string[];
  coverGradient: string;
}

interface WatchHistoryEntry {
  videoId: string;
  progressPercent: number; // 0 to 100
  lastWatchedAt: string; // ISO timestamp
}

const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    id: "v-1",
    title: "Precision Sowing Depth & Seed Spacing for Basmati Rice",
    category: "Planting",
    languages: ["Hindi", "English", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi"],
    duration: "12 mins",
    durationSeconds: 720,
    instructor: "Dr. Ramesh Verma (IARI)",
    description: "Learn how precise 2.5cm sowing depth and 15x20cm spacing increases basmati rice yield density, optimizes root aeration, and mitigates early lodging.",
    keywords: ["basmati", "paddy", "spacing", "depth", "rice", "sowing", "root", "planting"],
    coverGradient: "from-emerald-500 to-green-600"
  },
  {
    id: "v-2",
    title: "Micro-Nutrient Balancing: Foliar NPK Calibration",
    category: "Fertilizing",
    languages: ["Hindi", "English", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi"],
    duration: "10 mins",
    durationSeconds: 600,
    instructor: "Prof. S. Swaminathan (Agronomist)",
    description: "A comprehensive guide on creating and applying foliar nitrogen-phosphorus-potassium sprays to bypass root lockup in heavy clay loam.",
    keywords: ["npk", "foliar", "spray", "nitrogen", "potassium", "phosphorus", "fertilizer", "soil"],
    coverGradient: "from-blue-500 to-cyan-600"
  },
  {
    id: "v-3",
    title: "Neem Oil & Trichoderma: Bio-Control Pest Management",
    category: "Pest Control",
    languages: ["Hindi", "English", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi"],
    duration: "15 mins",
    durationSeconds: 900,
    instructor: "Dr. Rachel Carter (Eco-Pathologist)",
    description: "Deploying concentrated cold-pressed neem oil sprays and Trichoderma beneficial fungi to systematically combat fruit borer pests organic-style.",
    keywords: ["neem", "oil", "pest", "borer", "organic", "insect", "fungi", "trichoderma", "control"],
    coverGradient: "from-rose-500 to-orange-600"
  },
  {
    id: "v-4",
    title: "Moisture-Locked Harvesting & Silo Preparation",
    category: "Harvesting",
    languages: ["Hindi", "English", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi"],
    duration: "14 mins",
    durationSeconds: 840,
    instructor: "Gurdev Singh (Harvest Specialist)",
    description: "Determining exact 14% grain moisture index before combine-harvesting rice crops. Tips on mechanical grain dryers and moisture-monitoring.",
    keywords: ["grain", "harvest", "moisture", "silo", "drying", "storage", "rice", "wheat"],
    coverGradient: "from-amber-500 to-yellow-600"
  },
  {
    id: "v-5",
    title: "Decentralized Escrow Contracts: Peak Price Execution",
    category: "Marketing",
    languages: ["Hindi", "English", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi"],
    duration: "8 mins",
    durationSeconds: 480,
    instructor: "CA Rajesh Aggarwal (Agri-Financial Advisory)",
    description: "How to use local escrow networks to lock high contract-bids with global buyers, trace bank-escrow releases, and secure payment-on-delivery.",
    keywords: ["marketing", "escrow", "price", "sale", "bids", "contract", "finance", "rate"],
    coverGradient: "from-indigo-500 to-purple-600"
  },
  {
    id: "v-6",
    title: "High-Density Maize Intercropping & Soil Preservation",
    category: "Planting",
    languages: ["Hindi", "English", "Telugu", "Tamil", "Kannada", "Punjabi"],
    duration: "11 mins",
    durationSeconds: 660,
    instructor: "Rajesh Grewal (Progressive Farmer)",
    description: "Step-by-step planting of legume rows between maize blocks to maximize nitrogen nodules and double physical harvest output per acre.",
    keywords: ["maize", "corn", "intercropping", "legumes", "planting", "nitrogen", "density"],
    coverGradient: "from-emerald-600 to-teal-700"
  },
  {
    id: "v-7",
    title: "Vermicomposting Pit Setup: Farm Waste Recycling",
    category: "Fertilizing",
    languages: ["Hindi", "English", "Telugu", "Kannada", "Marathi", "Gujarati"],
    duration: "9 mins",
    durationSeconds: 540,
    instructor: "Srinivas Gowda (Soil Microbiologist)",
    description: "Establish a backyard vermicompost pit using red wiggler earthworms, cow dung, dry leaves, and active soil microbes to bypass chemical urea entirely.",
    keywords: ["vermicompost", "worm", "compost", "dung", "urea", "organic", "fertilizer", "soil"],
    coverGradient: "from-blue-600 to-indigo-700"
  },
  {
    id: "v-8",
    title: "Biological Management of Tomato Early Blight",
    category: "Pest Control",
    languages: ["Hindi", "English", "Tamil", "Malayalam", "Marathi", "Bengali"],
    duration: "13 mins",
    durationSeconds: 780,
    instructor: "Meera Nair (APEDA Organic Consultant)",
    description: "Diagnosing early concentric blight rings on lower tomato leaves. Creating natural copper hydroxide sprays and establishing aeration prunes.",
    keywords: ["blight", "tomato", "fungicide", "copper", "prune", "biological", "pest", "disease"],
    coverGradient: "from-rose-600 to-pink-700"
  },
  {
    id: "v-9",
    title: "Zero-Damage Root Veg Harvesting & Sorting",
    category: "Harvesting",
    languages: ["Hindi", "English", "Marathi", "Gujarati", "Bengali", "Punjabi"],
    duration: "10 mins",
    durationSeconds: 600,
    instructor: "Gurmit Gill (Farm Machinery Lead)",
    description: "Adjusting potato excavator blade depths and shaker-screen frequencies to prevent skin bruising, clod impact, and optimize retail sorting.",
    keywords: ["potato", "root", "excavator", "bruising", "grading", "harvesting", "sorting"],
    coverGradient: "from-amber-600 to-orange-700"
  },
  {
    id: "v-10",
    title: "Digital Branding & Traceability QR Setup for Farmers",
    category: "Marketing",
    languages: ["Hindi", "English", "Telugu", "Tamil", "Kannada", "Malayalam"],
    duration: "11 mins",
    durationSeconds: 660,
    instructor: "Tech-Vani Outreach",
    description: "Unlocking organic retail premiums by embedding farm telemetry logs, soil test values, and harvest timestamps into an interactive QR code packaging label.",
    keywords: ["qr", "traceability", "branding", "marketing", "packaging", "retail", "premium", "digital"],
    coverGradient: "from-indigo-600 to-violet-700"
  }
];

interface Podcast {
  id: string;
  title: string;
  host: string;
  duration: string;
  durationSeconds: number;
  topic: "Farming Tips" | "Financial Literacy" | "Success Stories" | "Market Trends";
  language: string;
  description: string;
}

interface Webinar {
  id: string;
  title: string;
  speaker: string;
  date: string;
  time: string;
  status: "Live" | "Recorded" | "Upcoming";
  joined?: boolean;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIdx: number;
}

interface QAAnswer {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  upvotes: number;
  isAccepted: boolean;
  isExpert?: boolean;
}

interface QAQuestion {
  id: string;
  title: string;
  description: string;
  cropTopic: string;
  author: string;
  createdAt: string;
  upvotes: number;
  answers: QAAnswer[];
  isSolved: boolean;
}

const INITIAL_QA_QUESTIONS: QAQuestion[] = [
  {
    id: "q-1",
    title: "Tomato leaf-curl: Aphids vs Heat Stress?",
    description: "My early-summer tomatoes are showing severe leaf curling on younger foliage. Checked undersides and found a few tiny green insects, but temperatures are also hitting 38°C daily. What's the best organic remedy to try first?",
    cropTopic: "Tomato / Pest Management",
    author: "Ramesh Patil",
    createdAt: "2026-07-04",
    upvotes: 14,
    answers: [
      {
        id: "ans-1",
        author: "Dr. Rachel Carter (Eco-Pathologist)",
        text: "The combination of minor aphid presence and high heat will cause severe transpiration shock. Spray a 2% cold-pressed neem oil emulsion at dusk (never in mid-day sun to prevent leaf scorching) and apply straw mulch to stabilize root temperatures.",
        createdAt: "2026-07-04",
        upvotes: 9,
        isAccepted: true,
        isExpert: true
      },
      {
        id: "ans-2",
        author: "Srinivas Gowda (Soil Specialist)",
        text: "Agreed. Soil moisture consistency is critical during heatwaves. If the soil surface crusts, the tomato roots can't absorb moisture fast enough to keep up with leaf transpiration, leading to immediate defense curling.",
        createdAt: "2026-07-05",
        upvotes: 5,
        isAccepted: false,
        isExpert: false
      }
    ],
    isSolved: true
  },
  {
    id: "q-2",
    title: "Organic Stem Borer management in Basmati Paddy",
    description: "I'm noticing several 'dead hearts' in my vegetative-stage Basmati field. Synthetic chemicals are strictly forbidden under my APEDA trade export contract. How can I halt this biologically?",
    cropTopic: "Basmati Rice / Bio-Control",
    author: "Sukhwinder Singh",
    createdAt: "2026-07-05",
    upvotes: 18,
    answers: [
      {
        id: "ans-3",
        author: "Dr. Ramesh Verma (IARI)",
        text: "Deploy Trichogramma japonicum cards (egg parasitoid wasps) at 5 cards/acre immediately. In parallel, hang 3-4 species-specific pheromone traps per acre to capture the male stem borer moths. This will halt the mating cycle completely.",
        createdAt: "2026-07-05",
        upvotes: 12,
        isAccepted: true,
        isExpert: true
      }
    ],
    isSolved: true
  },
  {
    id: "q-3",
    title: "Pre-charging Biochar with Vermicompost runoff",
    description: "I'm setting up a vermicomposting pit next week. I have about 50kg of raw agricultural biochar. Should I pre-soak/charge the biochar in composting tea or urine before soil application? What are the absorption rates?",
    cropTopic: "Soil Health / Fertilizer",
    author: "Eswar Reddy",
    createdAt: "2026-07-06",
    upvotes: 7,
    answers: [],
    isSolved: false
  }
];

export default function AgriEducationHub() {
  // --- STATE SYSTEM ---
  const [activeSubTab, setActiveSubTab] = useState<"courses" | "media" | "programs" | "qa">("courses");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [playingPodcast, setPlayingPodcast] = useState<string | null>(null);

  // --- COMMUNITY Q&A STATES ---
  const [qaQuestions, setQaQuestions] = useState<QAQuestion[]>(() => {
    const saved = localStorage.getItem("agri_qa_questions");
    return saved ? JSON.parse(saved) : INITIAL_QA_QUESTIONS;
  });
  const [qaSearchQuery, setQaSearchQuery] = useState("");
  const [qaSelectedTopic, setQaSelectedTopic] = useState("All");
  const [qaNewTitle, setQaNewTitle] = useState("");
  const [qaNewDescription, setQaNewDescription] = useState("");
  const [qaNewCropTopic, setQaNewCropTopic] = useState("Tomato / Pest Management");
  const [qaNewAnswerTexts, setQaNewAnswerTexts] = useState<Record<string, string>>({});
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);

  // Synchronize Q&A questions to localStorage
  useEffect(() => {
    localStorage.setItem("agri_qa_questions", JSON.stringify(qaQuestions));
  }, [qaQuestions]);

  // --- VIDEO TUTORIAL WATCH HISTORY STATE ---
  const [videoSearchQuery, setVideoSearchQuery] = useState("");
  const [selectedVideoCategory, setSelectedVideoCategory] = useState("All");
  const [watchHistory, setWatchHistory] = useState<Record<string, WatchHistoryEntry>>(() => {
    const saved = localStorage.getItem("agri_video_watch_history");
    return saved ? JSON.parse(saved) : {};
  });
  const [activePlayingVideo, setActivePlayingVideo] = useState<VideoTutorial | null>(null);
  const [playingProgress, setPlayingProgress] = useState(0); // 0 to 100
  const [isPlaySimulating, setIsPlaySimulating] = useState(false);
  const [videoVolume, setVideoVolume] = useState(80);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState(1);

  // --- PODCAST INTERACTIVE PLAYBACK & OFFLINE DOWNLOADS STATES ---
  const [podcastSearchQuery, setPodcastSearchQuery] = useState("");
  const [selectedPodcastTopic, setSelectedPodcastTopic] = useState("All");
  const [offlineOnlyFilter, setOfflineOnlyFilter] = useState(false);
  
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPodcastPlaying, setIsPodcastPlaying] = useState(false);
  const [podcastProgress, setPodcastProgress] = useState(0); // in seconds
  const [podcastPlaybackSpeed, setPodcastPlaybackSpeed] = useState(1);
  const [podcastVolume, setPodcastVolume] = useState(85);
  const [podcastMuted, setPodcastMuted] = useState(false);

  const [downloadedPodcasts, setDownloadedPodcasts] = useState<string[]>(() => {
    const saved = localStorage.getItem("agri_downloaded_podcasts");
    return saved ? JSON.parse(saved) : [];
  });
  const [downloadingPodcastId, setDownloadingPodcastId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Synchronize downloaded podcasts to localStorage
  useEffect(() => {
    localStorage.setItem("agri_downloaded_podcasts", JSON.stringify(downloadedPodcasts));
  }, [downloadedPodcasts]);

  // Handle ticking simulated podcast player progress
  useEffect(() => {
    let interval: any = null;
    if (currentPodcast && isPodcastPlaying) {
      interval = setInterval(() => {
        setPodcastProgress((prev) => {
          const next = prev + (1 * podcastPlaybackSpeed);
          if (next >= currentPodcast.durationSeconds) {
            setIsPodcastPlaying(false);
            clearInterval(interval);
            return currentPodcast.durationSeconds;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentPodcast, isPodcastPlaying, podcastPlaybackSpeed]);

  // --- WEBINAR INTERACTIVE STATES ---
  const [remindersSet, setRemindersSet] = useState<string[]>(() => {
    const saved = localStorage.getItem("agri_webinar_reminders");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeWebinarRoom, setActiveWebinarRoom] = useState<Webinar | null>(null);
  const [webinarChatMessages, setWebinarChatMessages] = useState<Record<string, { sender: string; text: string; timestamp: string; isExpert?: boolean }[]>>({
    "web-3": [
      { sender: "System", text: "Welcome to the Live Stream Classroom! Ask questions directly to Vikas Koul.", timestamp: "15:00" },
      { sender: "Farmer Patil", text: "Is the LIDAR resolution fine enough to spot clay erosion gaps?", timestamp: "15:01", isExpert: false },
      { sender: "Vikas Koul (Host)", text: "Yes! At 30m altitude, the scanner downsamples at 2.5cm/pixel, which highlights minor runoffs perfectly.", timestamp: "15:02", isExpert: true }
    ],
    "web-1": [
      { sender: "System", text: "Streaming Lobby active for Global Export Standards Q&A.", timestamp: "11:00" },
      { sender: "Farmer Patel", text: "What is the maximum moisture percentage allowed for premium basmati shipping?", timestamp: "11:01", isExpert: false },
      { sender: "Dr. Shashi Tharoor (Expert)", text: "Typically, it must be under 12.5% to avoid internal cargo mold and yellowing.", timestamp: "11:02", isExpert: true }
    ],
    "web-2": [
      { sender: "System", text: "Watching pre-recorded video: Multi-Sig Escrow Contract Disputes.", timestamp: "Recorded June 24" },
      { sender: "Advocate Sandeep Hegde", text: "Always specify arbitrator keys clearly in the genesis clause to avoid legal locks.", timestamp: "00:15:30", isExpert: true }
    ]
  });
  const [newWebinarQuestion, setNewWebinarQuestion] = useState("");
  const [isSchedulingWebinar, setIsSchedulingWebinar] = useState(false);
  const [newWebinarTitle, setNewWebinarTitle] = useState("");
  const [newWebinarSpeaker, setNewWebinarSpeaker] = useState("");
  const [newWebinarDate, setNewWebinarDate] = useState("");
  const [newWebinarTime, setNewWebinarTime] = useState("");
  const [newWebinarStatus, setNewWebinarStatus] = useState<"Upcoming" | "Live">("Upcoming");

  // Synchronize reminders to localStorage
  useEffect(() => {
    localStorage.setItem("agri_webinar_reminders", JSON.stringify(remindersSet));
  }, [remindersSet]);

  // Synchronize watch history to localStorage
  useEffect(() => {
    localStorage.setItem("agri_video_watch_history", JSON.stringify(watchHistory));
  }, [watchHistory]);

  // Handle ticking simulated video player progress
  useEffect(() => {
    let interval: any = null;
    if (activePlayingVideo && isPlaySimulating) {
      interval = setInterval(() => {
        setPlayingProgress((prev) => {
          const next = Math.min(prev + (2 * videoPlaybackSpeed), 100);
          
          // Auto update watch history
          setWatchHistory((prevHistory) => ({
            ...prevHistory,
            [activePlayingVideo.id]: {
              videoId: activePlayingVideo.id,
              progressPercent: Math.round(next),
              lastWatchedAt: new Date().toISOString()
            }
          }));

          if (next >= 100) {
            setIsPlaySimulating(false);
            clearInterval(interval);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activePlayingVideo, isPlaySimulating, videoPlaybackSpeed]);

  const handleStartPlayVideo = (video: VideoTutorial) => {
    const existing = watchHistory[video.id];
    setActivePlayingVideo(video);
    setPlayingProgress(existing ? existing.progressPercent : 0);
    setIsPlaySimulating(true);
  };

  const handlePauseVideo = () => {
    setIsPlaySimulating(false);
  };

  const handleResumeVideo = () => {
    setIsPlaySimulating(true);
  };

  const handleSeekVideo = (newProgress: number) => {
    const bounded = Math.max(0, Math.min(newProgress, 100));
    setPlayingProgress(bounded);
    if (activePlayingVideo) {
      setWatchHistory((prevHistory) => ({
        ...prevHistory,
        [activePlayingVideo.id]: {
          videoId: activePlayingVideo.id,
          progressPercent: Math.round(bounded),
          lastWatchedAt: new Date().toISOString()
        }
      }));
    }
  };

  const handleResetVideoProgress = (videoId: string) => {
    setWatchHistory((prevHistory) => {
      const copy = { ...prevHistory };
      delete copy[videoId];
      return copy;
    });
    if (activePlayingVideo?.id === videoId) {
      setPlayingProgress(0);
      setIsPlaySimulating(false);
    }
  };

  // --- QUIZ GAME STATE ---
  const [activeQuizCourse, setActiveQuizCourse] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // --- INTERACTIVE CLASSROOM STATE (SECTION 7.4) ---
  const [activeClassroomCourseId, setActiveClassroomCourseId] = useState<string | null>("c-1");
  const [classroomModuleIdx, setClassroomModuleIdx] = useState<number>(0);
  const [classroomQuizMode, setClassroomQuizMode] = useState<boolean>(false);
  const [classroomSelectedAnswerIdx, setClassroomSelectedAnswerIdx] = useState<number | null>(null);
  const [classroomShowFeedback, setClassroomShowFeedback] = useState<boolean>(false);
  const [classroomScore, setClassroomScore] = useState<number>(0);
  const [classroomPassedModules, setClassroomPassedModules] = useState<Record<string, string[]>>({
    "c-1": ["m-1-1"], // Default progress for Course 1 (1 module completed out of 3 = 33%)
    "c-5": ["m-5-1", "m-5-2"] // Default progress for Course 5 (all 2 modules completed = 100%)
  });
  const [studentName, setStudentName] = useState<string>("Eswar Reddy");
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState<string | null>(null);
  const [isSharingCertificate, setIsSharingCertificate] = useState<string | null>(null);
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>("");
  const [courseLevelFilter, setCourseLevelFilter] = useState<string>("All");
  const [coursePriceFilter, setCoursePriceFilter] = useState<string>("All");

  // --- COURSES & CERTIFICATIONS REGISTRY ---
  const [courses, setCourses] = useState<Course[]>([
    { id: "c-1", title: "100% Organic Soil Health Certification", category: "Certification", duration: "4 Weeks", modulesCount: 3, instructor: "Dr. Ramesh Verma", language: "Hindi/English", unlocked: true, completed: false, coverColor: "from-emerald-500 to-teal-600", tags: ["Organic", "Soil Bio"], level: "Beginner", rating: 4.8, price: "Free", enrolled: true, progressPercent: 33 },
    { id: "c-2", title: "Biological Pest Management", category: "Certification", duration: "2 Weeks", modulesCount: 3, instructor: "Prof. S. Swaminathan", language: "Hindi/Telugu", unlocked: true, completed: false, coverColor: "from-green-500 to-emerald-600", tags: ["Integrated Pest", "Eco"], level: "Intermediate", rating: 4.6, price: "Paid (₹499)", enrolled: false, progressPercent: 0 },
    { id: "c-3", title: "Financial Literacy & Escrow Auditing", category: "Certification", duration: "1 Week", modulesCount: 3, instructor: "CA Rajesh Aggarwal", language: "Hindi/Kannada", unlocked: true, completed: false, coverColor: "from-indigo-500 to-blue-600", tags: ["Agri-Finance", "Tax"], level: "Beginner", rating: 4.9, price: "Free", enrolled: false, progressPercent: 0 },
    { id: "c-4", title: "Export Readiness & Trade Compliance", category: "Certification", duration: "3 Weeks", modulesCount: 3, instructor: "Meera Nair (APEDA Trainer)", language: "English", unlocked: true, completed: false, coverColor: "from-amber-500 to-orange-600", tags: ["Global Export", "Logistics"], level: "Advanced", rating: 4.7, price: "Paid (₹1,299)", enrolled: false, progressPercent: 0 },
    { id: "c-5", title: "Digital Literacy & Smart Phone Farming", category: "Workshop", duration: "3 Hours", modulesCount: 2, instructor: "Tech-Vani Outreach", language: "All regional languages", unlocked: true, completed: true, coverColor: "from-sky-500 to-indigo-600", tags: ["Mobile Apps", "Lidar Sync"], level: "Beginner", rating: 4.5, price: "Free", enrolled: true, progressPercent: 100 },
    { id: "c-6", title: "Heavy Farm Equipment Operations", category: "Workshop", duration: "4 Hours", modulesCount: 3, instructor: "Mahindra Training Academy", language: "Hindi/Punjabi", unlocked: true, completed: false, coverColor: "from-slate-600 to-slate-800", tags: ["Tractor", "Harvester"], level: "Intermediate", rating: 4.4, price: "Paid (₹899)", enrolled: false, progressPercent: 0 }
  ]);

  // --- PODCAST LIBRARY ---
  const podcasts: Podcast[] = useMemo(() => [
    {
      id: "pod-1",
      title: "Soil Regeneration & Organic Nitrogen Fixation Tips",
      host: "Dr. Ramesh Verma",
      duration: "12 mins",
      durationSeconds: 720,
      topic: "Farming Tips",
      language: "Hindi",
      description: "Essential farming tips on using root inoculants and organic green manures to rapidly restore depleted clay loam."
    },
    {
      id: "pod-2",
      title: "Micro-Loan Access, Smart Escrows & Financial Literacy",
      host: "Siddharth Rao (NABARD Advisor)",
      duration: "16 mins",
      durationSeconds: 960,
      topic: "Financial Literacy",
      language: "English",
      description: "Unlock direct banking routes, set up cryptographic escrow contracts, and understand farm ledger bookkeeping."
    },
    {
      id: "pod-3",
      title: "From Dustbowl to Green Paradise: A Farmer's Success Story",
      host: "Srinivas Gowda",
      duration: "14 mins",
      durationSeconds: 840,
      topic: "Success Stories",
      language: "Telugu",
      description: "How a marginal farmer transitioned 5 acres from absolute soil erosion to record organic paddy yields in under 2 years."
    },
    {
      id: "pod-4",
      title: "Global Rice Export Bans & Local Grain Market Trends",
      host: "Meera Nair (APEDA Officer)",
      duration: "10 mins",
      durationSeconds: 600,
      topic: "Market Trends",
      language: "English",
      description: "Navigating international grain demand, domestic MSP updates, and planning your crop cycle for peak seasonal margins."
    },
    {
      id: "pod-5",
      title: "Farming Tips: Micro-Irrigation & Solar Pump Layouts",
      host: "S. K. Bansal (Agri-Engineer)",
      duration: "15 mins",
      durationSeconds: 900,
      topic: "Farming Tips",
      language: "Hindi",
      description: "How to layout high-efficiency drip networks and pair them with smart solar-powered submersible wells."
    },
    {
      id: "pod-6",
      title: "Success Stories: Cooperatives Driving Organic Premium Pricing",
      host: "Nandi Village Co-op",
      duration: "11 mins",
      durationSeconds: 660,
      topic: "Success Stories",
      language: "Kannada",
      description: "How 45 smallholders pooled their produce to bypass predatory middlemen and sell directly to organic retail chains."
    }
  ], []);

  // --- PODCAST INTEGRATION LOGIC & HANDLERS ---
  const filteredPodcasts = useMemo(() => {
    return podcasts.filter((pod) => {
      // 1. Filter by topic
      const matchesTopic = selectedPodcastTopic === "All" || pod.topic === selectedPodcastTopic;

      // 2. Filter by offline mode
      const matchesOffline = !offlineOnlyFilter || downloadedPodcasts.includes(pod.id);

      // 3. Filter by search query
      const query = podcastSearchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        pod.title.toLowerCase().includes(query) ||
        pod.description.toLowerCase().includes(query) ||
        pod.host.toLowerCase().includes(query) ||
        pod.topic.toLowerCase().includes(query);

      return matchesTopic && matchesOffline && matchesSearch;
    });
  }, [podcasts, selectedPodcastTopic, offlineOnlyFilter, downloadedPodcasts, podcastSearchQuery]);

  const handleStartPodcast = (pod: Podcast) => {
    setCurrentPodcast(pod);
    setPodcastProgress(0);
    setIsPodcastPlaying(true);
  };

  const handleTogglePlayPodcast = () => {
    if (!currentPodcast && filteredPodcasts.length > 0) {
      setCurrentPodcast(filteredPodcasts[0]);
      setPodcastProgress(0);
      setIsPodcastPlaying(true);
    } else {
      setIsPodcastPlaying((prev) => !prev);
    }
  };

  const handleSkipPodcast = (seconds: number) => {
    if (!currentPodcast) return;
    setPodcastProgress((prev) => {
      const next = prev + seconds;
      return Math.max(0, Math.min(next, currentPodcast.durationSeconds));
    });
  };

  const handleNextPodcast = () => {
    if (!currentPodcast || filteredPodcasts.length === 0) return;
    const idx = filteredPodcasts.findIndex((p) => p.id === currentPodcast.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % filteredPodcasts.length;
      handleStartPodcast(filteredPodcasts[nextIdx]);
    } else {
      handleStartPodcast(filteredPodcasts[0]);
    }
  };

  const handlePrevPodcast = () => {
    if (!currentPodcast || filteredPodcasts.length === 0) return;
    const idx = filteredPodcasts.findIndex((p) => p.id === currentPodcast.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + filteredPodcasts.length) % filteredPodcasts.length;
      handleStartPodcast(filteredPodcasts[prevIdx]);
    } else {
      handleStartPodcast(filteredPodcasts[0]);
    }
  };

  const handleStartSimulatedDownload = (id: string) => {
    if (downloadingPodcastId) return;
    setDownloadingPodcastId(id);
    setDownloadProgress(0);

    let progress = 0;
    const timer = setInterval(() => {
      progress += 20;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
        setDownloadedPodcasts((prev) => {
          if (!prev.includes(id)) {
            return [...prev, id];
          }
          return prev;
        });
        setDownloadingPodcastId(null);
        setDownloadProgress(0);
      }
    }, 300);
  };

  const handleDeleteDownloadedPodcast = (id: string) => {
    setDownloadedPodcasts((prev) => prev.filter((item) => item !== id));
    if (currentPodcast?.id === id && offlineOnlyFilter) {
      setIsPodcastPlaying(false);
      setCurrentPodcast(null);
    }
  };

  // --- WEBINARS ---
  const [webinars, setWebinars] = useState<Webinar[]>([
    { id: "web-1", title: "Live Q&A: Preparing Your Basmati Lot for Global Export Standards", speaker: "Dr. Shashi Tharoor (APEDA Commissioner)", date: "Every Wednesday", time: "11:00 AM UTC", status: "Upcoming", joined: false },
    { id: "web-2", title: "Recorded: Multi-Sig Escrow Contract Disputes & Legal Redressals", speaker: "Advocate Sandeep Hegde", date: "June 24, 2026", time: "Recorded", status: "Recorded" },
    { id: "web-3", title: "Live: Advanced Lidar Drone Heightmap Scanning & Soil Health Correlation", speaker: "Vikas Koul (Lead AI Studio Architect)", date: "Every Friday", time: "03:00 PM UTC", status: "Live", joined: false }
  ]);

  // --- CHILDREN & WOMEN TARGETED PROGRAMS ---
  const specialPrograms = [
    { title: "👧 Future Farmers: Kids Coding & Agricultural Bots", description: "Interactive physics simulations and block-coding tasks tailored to educate the youth on smart drone and tractor path planning.", audiance: "Children (Ages 8-14)", type: "Interactive" },
    { title: "👩 Women-in-Agri Entrepreneurship Program", description: "Dedicated micro-loan financing masterclasses, collaborative local cooperative setup toolkits, and organic leadership training.", audiance: "Women Farmers", type: "Special Grant" },
    { title: "🥑 Recipe Corner: Maximizing Culinary Value from Organic Produce", description: "A creative kitchen hub with farm-fresh organic recipe ideas (e.g. Basmati Rice Desserts, Organic Mustard Dressing) to maximize the premium of your farm crops.", audiance: "Everyone", type: "Culinary" }
  ];

  // --- VIRTUAL FARM TOUR CHANNELS ---
  const virtualTours = [
    { title: "🎥 VR Tour: Fully Autonomous Greenhouses (360°)", dur: "6 mins", host: "Israel AgroTech Campus" },
    { title: "🎥 VR Tour: Organic Rice Terrace Elevational Lidar Maps", dur: "10 mins", host: "Nandi Hills Village Cooperative" }
  ];

  // --- QUIZ QUESTIONS REGISTRY ---
  const quizDatabase: Record<string, QuizQuestion[]> = {
    "c-1": [
      { question: "What is the primary visual benefit of growing Legumes like clover as cover crops?", options: ["They capture nitrogen in soil nodes", "They attract predatory wasps", "They require zero irrigation", "They increase crop sugar content"], correctIdx: 0 },
      { question: "Which soil pH level is widely recommended for Basmati Rice cultivation?", options: ["pH 4.0 - 5.0", "pH 6.0 - 7.5", "pH 8.5 - 9.0", "pH 3.0 - 3.5"], correctIdx: 1 }
    ],
    "c-2": [
      { question: "What represents a biological alternative to synthetic herbicide spraying?", options: ["Chemical weed burning", "Introducing target insects / deep soil tilling", "Adding extra heavy fertilizers", "Increasing field flood volumes"], correctIdx: 1 }
    ],
    "c-3": [
      { question: "Under decentralized contract farming, where is the buyer's payment locked safely?", options: ["In the farmer's storage chest", "In a multi-sig cryptographic Escrow account", "In the nearest APMC physical treasury box", "In an unchecked commercial loan register"], correctIdx: 1 }
    ]
  };

  // Trigger Webinar Join
  const joinWebinar = (id: string) => {
    setWebinars(prev =>
      prev.map(w => (w.id === id ? { ...w, joined: true } : w))
    );
    alert("Webinar registration successful! An SMS and calendar invite containing the stream URL has been dispatched.");
  };

  const handleToggleReminder = (id: string) => {
    setRemindersSet((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter((x) => x !== id);
      } else {
        alert("⏱️ Webinar reminder set! We'll alert you 15 minutes before the broadcast begins.");
        return [...prev, id];
      }
    });
  };

  const handleAskWebinarQuestion = (webinarId: string) => {
    if (!newWebinarQuestion.trim()) return;
    const userMsg = {
      sender: "You (Farmer)",
      text: newWebinarQuestion.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setWebinarChatMessages((prev) => ({
      ...prev,
      [webinarId]: [...(prev[webinarId] || []), userMsg]
    }));
    
    const askedText = newWebinarQuestion.trim();
    setNewWebinarQuestion("");

    setTimeout(() => {
      let replyText = "Thank you for your question. We will compile custom notes on this for the Q&A session transcripts!";
      const lower = askedText.toLowerCase();
      if (lower.includes("price") || lower.includes("cost") || lower.includes("budget")) {
        replyText = "Price models vary by local APMC yard indices, but contract escrows secure a guaranteed floor price, minimizing standard price volatility.";
      } else if (lower.includes("drone") || lower.includes("lidar") || lower.includes("fly") || lower.includes("sensor")) {
        replyText = "With multi-spectral lidar sensors, altitude control is vital. We suggest flying at 30-40 meters at high sun hours to prevent shadow noise.";
      } else if (lower.includes("soil") || lower.includes("organic") || lower.includes("fertilizer") || lower.includes("nitrogen")) {
        replyText = "Excellent question! Intercropping legumes provides a robust biological root nodule network that fixes 40-75 lbs of pure nitrogen per acre safely.";
      } else if (lower.includes("escrow") || lower.includes("smart") || lower.includes("law") || lower.includes("contract")) {
        replyText = "For escrow contracts, both parties commit locked funds to the multi-sig ledger. If disputes occur, certified agri-mediators arbitrate the key.";
      }

      const hostMsg = {
        sender: activeWebinarRoom?.speaker || "Expert Host",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isExpert: true
      };

      setWebinarChatMessages((prev) => ({
        ...prev,
        [webinarId]: [...(prev[webinarId] || []), hostMsg]
      }));
    }, 1200);
  };

  const handleScheduleNewWebinar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebinarTitle.trim() || !newWebinarSpeaker.trim()) {
      alert("Please enter a Title and Speaker name.");
      return;
    }

    const newWeb: Webinar = {
      id: `web-${Date.now()}`,
      title: newWebinarTitle.trim(),
      speaker: newWebinarSpeaker.trim(),
      date: newWebinarDate || "Tomorrow",
      time: newWebinarTime || "12:00 PM UTC",
      status: newWebinarStatus,
      joined: false
    };

    setWebinars((prev) => [newWeb, ...prev]);
    setIsSchedulingWebinar(false);
    
    setNewWebinarTitle("");
    setNewWebinarSpeaker("");
    setNewWebinarDate("");
    setNewWebinarTime("");
    setNewWebinarStatus("Upcoming");

    alert(`🎉 Successfully scheduled webinar: "${newWeb.title}"!`);
  };

  // --- INTERACTIVE CLASSROOM EVENT HANDLERS (SECTION 7.4) ---
  const handleEnrollCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, enrolled: true, progressPercent: 0 } : c
      )
    );
    setClassroomPassedModules((prev) => ({
      ...prev,
      [courseId]: prev[courseId] || []
    }));
    setActiveClassroomCourseId(courseId);
    setClassroomModuleIdx(0);
    setClassroomQuizMode(false);
    setClassroomSelectedAnswerIdx(null);
    setClassroomShowFeedback(false);
  };

  const handleStartClassroomQuiz = () => {
    setClassroomQuizMode(true);
    setClassroomSelectedAnswerIdx(null);
    setClassroomShowFeedback(false);
  };

  const handleSelectClassroomAnswer = (optIdx: number) => {
    if (classroomShowFeedback) return; // Prevent double selecting
    setClassroomSelectedAnswerIdx(optIdx);
    setClassroomShowFeedback(true);
    
    const modules = COURSE_CURRICULUMS[activeClassroomCourseId || ""] || [];
    const activeMod = modules[classroomModuleIdx];
    if (optIdx === activeMod.correctIdx) {
      setClassroomScore((prev) => prev + 1);
    }
  };

  const handleAdvanceClassroom = () => {
    if (!activeClassroomCourseId) return;
    const modules = COURSE_CURRICULUMS[activeClassroomCourseId] || [];
    const activeMod = modules[classroomModuleIdx];
    
    const wasCorrect = classroomSelectedAnswerIdx === activeMod.correctIdx;
    
    if (wasCorrect) {
      // Mark module as passed if not already in list
      const currentPassed = classroomPassedModules[activeClassroomCourseId] || [];
      let updatedPassed = [...currentPassed];
      if (!updatedPassed.includes(activeMod.id)) {
        updatedPassed.push(activeMod.id);
      }
      
      const newPassedRecord = {
        ...classroomPassedModules,
        [activeClassroomCourseId]: updatedPassed
      };
      setClassroomPassedModules(newPassedRecord);

      // Calculate progress percentage
      const totalModules = modules.length;
      const passedCount = updatedPassed.length;
      const newProgressPercent = Math.round((passedCount / totalModules) * 100);

      setCourses((prev) =>
        prev.map((c) => {
          if (c.id === activeClassroomCourseId) {
            const isCompletedNow = newProgressPercent >= 100;
            return {
              ...c,
              progressPercent: newProgressPercent,
              completed: isCompletedNow || c.completed
            };
          }
          return c;
        })
      );

      // Advance to next module or complete
      if (classroomModuleIdx < modules.length - 1) {
        setClassroomModuleIdx((prev) => prev + 1);
        setClassroomQuizMode(false);
        setClassroomSelectedAnswerIdx(null);
        setClassroomShowFeedback(false);
      } else {
        // All modules of the course completed!
        setClassroomQuizMode(false);
        setClassroomSelectedAnswerIdx(null);
        setClassroomShowFeedback(false);
        alert(`🏆 Congratulations! You have successfully completed all modules for this course. Click "Claim Graduation Certificate" to view and download your verified credential!`);
      }
    } else {
      // Incorrect answer: retry module
      setClassroomQuizMode(false);
      setClassroomSelectedAnswerIdx(null);
      setClassroomShowFeedback(false);
      alert("❌ Incorrect answer. Let's review the lesson text and try the quiz again!");
    }
  };

  const handleDownloadCertificateSimulation = (courseId: string) => {
    setIsDownloadingCertificate(courseId);
    setTimeout(() => {
      setIsDownloadingCertificate(null);
      
      // Open simulated download alert or trigger automatic download of simple txt/doc
      const course = courses.find(c => c.id === courseId);
      const title = course ? course.title : "Agri-Smart Expert Certification";
      
      const certContent = `
============================================================
             AGRI-SMART LAND LEDGER & EDUCATION HUB
============================================================
                  CERTIFICATE OF ACHIEVEMENT
              
This is to certify that:
                       ${studentName.toUpperCase()}
                       
has successfully completed the comprehensive curriculum and passed
all examinations for:
            "${title.toUpperCase()}"
            
Verified by Agri-Smart Academy & Ministry of Agrarian Analytics.
Instructor: ${course?.instructor || "Academy Board"}
Issued on: ${new Date().toLocaleDateString()}
Verify Credential ID: CRED-${courseId}-${Math.floor(100000 + Math.random() * 900000)}
============================================================
      `;
      
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob([certContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `Certificate_${studentName.replace(/\s+/g, '_')}_${courseId}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      alert("📥 Download Complete! Your certified academic PDF/TXT transcript has been downloaded successfully.");
    }, 1500);
  };

  const handleShareCertificateSimulation = (courseId: string) => {
    setIsSharingCertificate(courseId);
    setTimeout(() => {
      setIsSharingCertificate(null);
      const shareUrl = `${window.location.origin}/verify-cert/${courseId}-${Math.floor(100000 + Math.random() * 900000)}`;
      navigator.clipboard.writeText(shareUrl);
      alert(`🔗 Shareable Credential Link copied to clipboard!\nLink: ${shareUrl}`);
    }, 1000);
  };

  // Start Quiz
  const startQuiz = (courseId: string) => {
    if (!quizDatabase[courseId]) {
      alert("Online test preparation complete. Your custom quiz is being compiled.");
      return;
    }
    setActiveQuizCourse(courseId);
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // Submit Answer
  const handleAnswerSelection = (idx: number) => {
    setSelectedAnswerIdx(idx);
    const questions = quizDatabase[activeQuizCourse || ""] || [];
    const currentQ = questions[currentQuestionIdx];
    if (idx === currentQ.correctIdx) {
      setQuizScore(prev => prev + 1);
    }
  };

  // Next Question or Finish
  const handleNextQuizStep = () => {
    const questions = quizDatabase[activeQuizCourse || ""] || [];
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswerIdx(null);
    } else {
      setQuizCompleted(true);
      // Mark course as completed in our state
      setCourses(prev =>
        prev.map(c => (c.id === activeQuizCourse ? { ...c, completed: true } : c))
      );
    }
  };

  // --- COMMUNITY Q&A HANDLERS ---
  const filteredQaQuestions = useMemo(() => {
    return qaQuestions.filter((q) => {
      const matchesTopic = qaSelectedTopic === "All" || q.cropTopic.toLowerCase().includes(qaSelectedTopic.toLowerCase());
      const query = qaSearchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.cropTopic.toLowerCase().includes(query) ||
        q.author.toLowerCase().includes(query);
      return matchesTopic && matchesSearch;
    });
  }, [qaQuestions, qaSelectedTopic, qaSearchQuery]);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaNewTitle.trim() || !qaNewDescription.trim()) {
      alert("Please enter both a title and description for your question.");
      return;
    }
    const newQ: QAQuestion = {
      id: `q-${Date.now()}`,
      title: qaNewTitle.trim(),
      description: qaNewDescription.trim(),
      cropTopic: qaNewCropTopic,
      author: "You (Farmer)",
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 1,
      answers: [],
      isSolved: false
    };
    setQaQuestions((prev) => [newQ, ...prev]);
    setQaNewTitle("");
    setQaNewDescription("");
    setIsAskingQuestion(false);
    alert("Success! Your question has been posted to the community.");
  };

  const handleUpvoteQuestion = (qId: string) => {
    setQaQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  const handleAddAnswer = (qId: string) => {
    const text = qaNewAnswerTexts[qId] || "";
    if (!text.trim()) {
      alert("Please enter a response before submitting.");
      return;
    }
    const newAnswer: QAAnswer = {
      id: `ans-${Date.now()}`,
      author: "You (Farmer)",
      text: text.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 0,
      isAccepted: false,
      isExpert: false
    };
    setQaQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            answers: [...q.answers, newAnswer]
          };
        }
        return q;
      })
    );
    setQaNewAnswerTexts((prev) => ({
      ...prev,
      [qId]: ""
    }));
  };

  const handleUpvoteAnswer = (qId: string, aId: string) => {
    setQaQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            answers: q.answers.map((a) => (a.id === aId ? { ...a, upvotes: a.upvotes + 1 } : a))
          };
        }
        return q;
      })
    );
  };

  const handleToggleAcceptAnswer = (qId: string, aId: string) => {
    setQaQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const updatedAnswers = q.answers.map((a) => {
            if (a.id === aId) {
              return { ...a, isAccepted: !a.isAccepted };
            }
            return a;
          });
          const hasAnyAccepted = updatedAnswers.some((a) => a.isAccepted);
          return {
            ...q,
            answers: updatedAnswers,
            isSolved: hasAnyAccepted
          };
        }
        return q;
      })
    );
  };

  // --- FILTER AND WATCH HISTORY MEMOS ---
  const filteredVideos = useMemo(() => {
    return VIDEO_TUTORIALS.filter((video) => {
      // Filter by category
      const matchesCategory = selectedVideoCategory === "All" || video.category === selectedVideoCategory;

      // Filter by search query (title, instructor, description or keywords)
      const query = videoSearchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.instructor.toLowerCase().includes(query) ||
        video.keywords.some((kw) => kw.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedVideoCategory, videoSearchQuery]);

  const continueWatchingVideos = useMemo(() => {
    return (Object.values(watchHistory) as WatchHistoryEntry[])
      .map((entry) => {
        const video = VIDEO_TUTORIALS.find((v) => v.id === entry.videoId);
        return video ? { ...video, progressPercent: entry.progressPercent } : null;
      })
      .filter((v): v is (VideoTutorial & { progressPercent: number }) => v !== null && v.progressPercent > 0 && v.progressPercent < 100)
      .sort((a, b) => {
        const dateA = watchHistory[a.id]?.lastWatchedAt || "";
        const dateB = watchHistory[b.id]?.lastWatchedAt || "";
        return dateB.localeCompare(dateA);
      });
  }, [watchHistory]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const query = courseSearchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        c.title.toLowerCase().includes(query) ||
        c.instructor.toLowerCase().includes(query) ||
        c.tags.some(tag => tag.toLowerCase().includes(query));

      const matchesLevel = courseLevelFilter === "All" || c.level === courseLevelFilter;
      
      const matchesPrice = coursePriceFilter === "All" ||
        (coursePriceFilter === "Free" ? c.price === "Free" : c.price !== "Free");

      return matchesSearch && matchesLevel && matchesPrice;
    });
  }, [courses, courseSearchQuery, courseLevelFilter, coursePriceFilter]);

  return (
    <div id="agri-education-hub" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
      
      {/* Banner segment */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg animate-pulse">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              📚 Agri-Education & Skill Certification Hub
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Learn organic agronomy techniques, earn digital certifications, join expert webinars, and master financial tools
          </p>
        </div>

        {/* Translation Language control */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Select Tutorial Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white border text-xs font-bold text-slate-700 rounded px-2 py-0.5 focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
          </select>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-150 pb-1">
        <button
          onClick={() => setActiveSubTab("courses")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeSubTab === "courses"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          🎓 Courses & Certifications
        </button>
        <button
          onClick={() => setActiveSubTab("media")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeSubTab === "media"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          🎙️ Video, Tours & Podcast Library
        </button>
        <button
          onClick={() => setActiveSubTab("programs")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeSubTab === "programs"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          👧 Programs & Culinary Recipes
        </button>
        <button
          onClick={() => setActiveSubTab("qa")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeSubTab === "qa"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          👥 Community Q&A
        </button>
      </div>

      {/* Primary Sub-tab panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SUB TAB: Courses & Certifications */}
        {activeSubTab === "courses" && (
          <>
            {/* Left side courses list (8 columns) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Search & Filter controls */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-72">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search courses, instructors, tags..."
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {courseSearchQuery && (
                    <button
                      onClick={() => setCourseSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Level:</span>
                    <select
                      value={courseLevelFilter}
                      onChange={(e) => setCourseLevelFilter(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 px-2 py-1 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Price:</span>
                    <select
                      value={coursePriceFilter}
                      onChange={(e) => setCoursePriceFilter(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 px-2 py-1 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Prices</option>
                      <option value="Free">Free</option>
                      <option value="Paid">Paid Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Course grid */}
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCourses.map(course => {
                    const isSelected = activeClassroomCourseId === course.id;
                    return (
                      <div 
                        key={course.id} 
                        className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-all ${
                          isSelected ? "ring-2 ring-indigo-500 border-transparent" : "border-slate-200"
                        }`}
                      >
                        
                        {/* Header Banner */}
                        <div className={`p-4 bg-gradient-to-r ${course.coverColor} text-white space-y-1.5 relative`}>
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                              {course.category}
                            </span>
                            <div className="flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                              <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                              <span>{course.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <h4 className="text-xs font-black leading-snug">{course.title}</h4>
                          <p className="text-[10px] text-white/80 font-semibold">Instructor: {course.instructor}</p>
                        </div>

                        {/* Metadata Content */}
                        <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-1 text-[9px] text-slate-500 font-bold font-mono border-b border-slate-100 pb-2.5">
                              <div>⏱️ {course.duration}</div>
                              <div className="text-center">📚 {course.modulesCount} Modules</div>
                              <div className="text-right text-indigo-600 font-black">{course.price}</div>
                            </div>

                            {/* Level and tags info */}
                            <div className="flex items-center justify-between">
                              <span className={`text-[8.5px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                                course.level === "Beginner" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                course.level === "Intermediate" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                                "bg-rose-50 text-rose-700 border border-rose-100"
                              }`}>
                                {course.level}
                              </span>
                              
                              <div className="flex flex-wrap gap-1 justify-end">
                                {course.tags.map((tag, i) => (
                                  <span key={i} className="text-[8.5px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-bold font-mono">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Progress bar (Percentage Completed) */}
                            {course.enrolled && (
                              <div className="space-y-1 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/40">
                                <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                  <span className="flex items-center gap-1 text-indigo-700">
                                    <Clock className="h-3 w-3" />
                                    Progress Tracking
                                  </span>
                                  <span className="font-mono text-indigo-600">{course.progressPercent}% Completed</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="h-1.5 rounded-full bg-indigo-600 transition-all duration-500"
                                    style={{ width: `${course.progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Course Interaction Controls */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            {!course.enrolled ? (
                              <button
                                onClick={() => handleEnrollCourse(course.id)}
                                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Unlock className="h-3.5 w-3.5" />
                                Enroll & Start Learning
                              </button>
                            ) : (
                              <>
                                {course.progressPercent >= 100 ? (
                                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-100 text-[10px] font-black uppercase">
                                    <Award className="h-4 w-4 text-emerald-600 animate-bounce" />
                                    <span>Certified Graduate</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-xl border border-indigo-100 text-[10px] font-black uppercase">
                                    <BookOpen className="h-4 w-4 text-indigo-600" />
                                    <span>Active Student</span>
                                  </div>
                                )}

                                <button
                                  onClick={() => {
                                    setActiveClassroomCourseId(course.id);
                                    setClassroomModuleIdx(0);
                                    setClassroomQuizMode(false);
                                    setClassroomSelectedAnswerIdx(null);
                                    setClassroomShowFeedback(false);
                                  }}
                                  className={`px-3 py-1.5 text-xs font-black uppercase rounded-xl cursor-pointer transition-colors flex items-center gap-1 ${
                                    isSelected 
                                      ? "bg-indigo-50 border border-indigo-200 text-indigo-700" 
                                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                  }`}
                                >
                                  {course.progressPercent >= 100 ? "Review Classroom" : "Enter Classroom"}
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed space-y-2">
                  <Search className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-extrabold text-slate-500">No courses match your active search or filter criteria.</p>
                  <button 
                    onClick={() => {
                      setCourseSearchQuery("");
                      setCourseLevelFilter("All");
                      setCoursePriceFilter("All");
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Right Side: Interactive Classroom Hub (4 columns) */}
            <div className="lg:col-span-4 space-y-5">
              
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                    <h4 className="text-[10.5px] font-black text-slate-100 uppercase tracking-wider">
                      Interactive Classroom Workspace
                    </h4>
                  </div>
                  {activeClassroomCourseId && (
                    <span className="text-[8.5px] font-mono font-black uppercase text-indigo-400 bg-indigo-950/60 border border-indigo-900 px-2 py-0.5 rounded-full">
                      Live Studio
                    </span>
                  )}
                </div>

                {activeClassroomCourseId ? (
                  (() => {
                    const activeCourse = courses.find((c) => c.id === activeClassroomCourseId);
                    const modules = COURSE_CURRICULUMS[activeClassroomCourseId] || [];
                    const activeMod = modules[classroomModuleIdx];
                    const passedList = classroomPassedModules[activeClassroomCourseId] || [];
                    const isCompleted = activeCourse ? activeCourse.progressPercent >= 100 : false;

                    return (
                      <div className="space-y-4">
                        {/* Course Name Header */}
                        <div className="space-y-1">
                          <span className="text-[8px] uppercase tracking-wider bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded font-black font-mono">
                            {activeCourse?.category} • Instructor: {activeCourse?.instructor}
                          </span>
                          <h5 className="text-[11.5px] font-black text-white leading-snug">
                            {activeCourse?.title}
                          </h5>
                        </div>

                        {/* Module Navigator Strip */}
                        <div className="flex items-center gap-1 overflow-x-auto py-1">
                          {modules.map((mod, index) => {
                            const isCurrent = index === classroomModuleIdx;
                            const isPassed = passedList.includes(mod.id);
                            return (
                              <button
                                key={mod.id}
                                onClick={() => {
                                  setClassroomModuleIdx(index);
                                  setClassroomQuizMode(false);
                                  setClassroomSelectedAnswerIdx(null);
                                  setClassroomShowFeedback(false);
                                }}
                                className={`px-2 py-1 text-[9px] font-black font-mono rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                                  isCurrent 
                                    ? "bg-indigo-600 text-white" 
                                    : isPassed 
                                    ? "bg-emerald-950 border border-emerald-800 text-emerald-400" 
                                    : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200"
                                }`}
                              >
                                {isPassed && <Check className="h-2.5 w-2.5" />}
                                Module {index + 1}
                              </button>
                            );
                          })}
                        </div>

                        {/* Interactive Lesson and Quiz Section */}
                        {activeMod ? (
                          <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-3.5">
                            
                            {/* Lesson Reading Content */}
                            {!classroomQuizMode ? (
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[8.5px] text-indigo-400 uppercase font-black tracking-wider font-mono">
                                    📖 Concept Study Guide
                                  </span>
                                  <span className="text-[8.5px] font-mono text-slate-500 font-bold">
                                    Lesson {classroomModuleIdx + 1} of {modules.length}
                                  </span>
                                </div>
                                <h6 className="text-[10.5px] font-extrabold text-slate-200">
                                  {activeMod.title}
                                </h6>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                                  {activeMod.lessonText}
                                </p>

                                <div className="pt-2 border-t border-slate-900 flex justify-between items-center gap-1.5">
                                  {passedList.includes(activeMod.id) ? (
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/40 p-1.5 rounded border border-emerald-900/60">
                                      <CheckCircle className="h-3.5 w-3.5" />
                                      <span>Chapter passed!</span>
                                    </div>
                                  ) : (
                                    <div className="text-[8.5px] text-indigo-300 bg-indigo-950/40 px-2 py-1.5 rounded-lg border border-indigo-950">
                                      Read carefully, then test.
                                    </div>
                                  )}
                                  
                                  <button
                                    onClick={handleStartClassroomQuiz}
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1 transition-all"
                                  >
                                    <HelpCircle className="h-3 w-3" />
                                    Take Module Quiz
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Module Quiz Panel */
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[8.5px] text-rose-400 uppercase font-black tracking-wider font-mono">
                                    ❓ Module Assessment Task
                                  </span>
                                  <span className="text-[8.5px] font-mono text-slate-500 font-bold">
                                    Quiz {classroomModuleIdx + 1} of {modules.length}
                                  </span>
                                </div>

                                <p className="text-[10.5px] font-black text-slate-100 leading-normal">
                                  {activeMod.quizQuestion}
                                </p>

                                <div className="space-y-1.5">
                                  {activeMod.quizOptions.map((opt, idx) => {
                                    const isSelected = classroomSelectedAnswerIdx === idx;
                                    const isCorrect = idx === activeMod.correctIdx;
                                    
                                    let buttonStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white";
                                    if (classroomShowFeedback) {
                                      if (isCorrect) {
                                        buttonStyle = "bg-emerald-950 border-emerald-500 text-emerald-300 font-extrabold";
                                      } else if (isSelected) {
                                        buttonStyle = "bg-rose-950 border-rose-500 text-rose-300 font-extrabold";
                                      } else {
                                        buttonStyle = "bg-slate-900 border-slate-900 text-slate-500 opacity-60";
                                      }
                                    } else if (isSelected) {
                                      buttonStyle = "bg-indigo-950 border-indigo-500 text-indigo-300 font-extrabold";
                                    }

                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => handleSelectClassroomAnswer(idx)}
                                        disabled={classroomShowFeedback}
                                        className={`w-full p-2.5 rounded-xl border text-left text-[9.5px] transition-all cursor-pointer flex items-center justify-between ${buttonStyle}`}
                                      >
                                        <span className="font-semibold">{opt}</span>
                                        {classroomShowFeedback && isCorrect && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                                      </button>
                                    );
                                  })}
                                </div>

                                {classroomShowFeedback && (
                                  <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
                                    <div className="text-[9px] font-mono">
                                      {classroomSelectedAnswerIdx === activeMod.correctIdx ? (
                                        <span className="text-emerald-400 font-black font-mono">✓ Correct answer!</span>
                                      ) : (
                                        <span className="text-rose-400 font-black font-mono">✕ Incorrect.</span>
                                      )}
                                    </div>
                                    <button
                                      onClick={handleAdvanceClassroom}
                                      className="px-3 py-1 bg-slate-100 hover:bg-white text-slate-900 rounded-lg text-[9.5px] font-black uppercase flex items-center gap-1 cursor-pointer transition-all"
                                    >
                                      <span>{classroomSelectedAnswerIdx === activeMod.correctIdx ? "Continue" : "Retry lesson"}</span>
                                      <ChevronRight className="h-3.5 w-3.5 text-slate-900" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="text-center p-4 bg-slate-950 rounded-xl border border-dashed border-slate-800">
                            No modules configured for this course.
                          </div>
                        )}

                        {/* Certificate Section for Graduates */}
                        {isCompleted && (
                          <div className="p-4 bg-gradient-to-br from-amber-950/25 to-yellow-950/15 border border-amber-500/30 rounded-xl space-y-3 shadow-lg relative overflow-hidden">
                            
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="flex items-center gap-1.5">
                              <Award className="h-5 w-5 text-amber-400 animate-bounce" />
                              <h5 className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
                                Graduation Certificate Earned
                              </h5>
                            </div>

                            <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                              You have passed all module exams. Customize your academic credentials printout below:
                            </p>

                            {/* Customize Student Name */}
                            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5">
                              <label className="text-[8px] uppercase text-amber-400 font-black tracking-wider">Student Name on Certificate:</label>
                              <input
                                type="text"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                placeholder="Eswar Reddy"
                                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                              />
                            </div>

                            {/* Live Printable Certificate Mock preview */}
                            <div className="border border-amber-500/20 bg-slate-950/80 p-3 rounded-xl space-y-2 text-center text-[8px] font-mono border-dashed relative">
                              <div className="absolute top-1 right-1 text-[6px] text-amber-500/60 uppercase font-black tracking-widest">Digital Badge</div>
                              <div className="text-[7.5px] font-black tracking-widest text-amber-400 uppercase">AGRI-SMART ACADEMY</div>
                              <div className="text-[6px] text-slate-500">CERTIFIES THAT</div>
                              <div className="text-[10.5px] font-black text-white py-0.5 tracking-wide underline decoration-amber-500 underline-offset-4">
                                {studentName.toUpperCase() || "YOUR NAME"}
                              </div>
                              <div className="text-[6px] text-slate-500">HAS GRADUATED FROM:</div>
                              <div className="text-[8.5px] font-extrabold text-amber-200 px-1 truncate leading-tight">
                                "{activeCourse?.title.toUpperCase()}"
                              </div>
                              <div className="flex justify-between items-center text-[5.5px] text-slate-500 pt-2 border-t border-slate-900">
                                <span>DATE: {new Date().toLocaleDateString()}</span>
                                <span className="text-amber-500 font-bold">STATUS: VERIFIED ✔</span>
                              </div>
                            </div>

                            {/* Download & Share Actions */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleDownloadCertificateSimulation(activeClassroomCourseId)}
                                disabled={isDownloadingCertificate !== null}
                                className="px-2.5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 text-black rounded-lg text-[9.5px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                              >
                                <Download className="h-3 w-3 text-black" />
                                {isDownloadingCertificate === activeClassroomCourseId ? "Saving..." : "Download Certificate"}
                              </button>

                              <button
                                onClick={() => handleShareCertificateSimulation(activeClassroomCourseId)}
                                disabled={isSharingCertificate !== null}
                                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/20 rounded-lg text-[9.5px] font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                              >
                                <Share2 className="h-3 w-3 text-amber-400" />
                                {isSharingCertificate === activeClassroomCourseId ? "Sharing..." : "Share Link"}
                              </button>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center p-8 space-y-3 bg-slate-950 rounded-xl border border-dashed border-slate-850">
                    <HelpCircle className="h-10 w-10 text-slate-600 mx-auto animate-bounce" />
                    <h5 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">No Active Course Classroom</h5>
                    <p className="text-[9.5px] text-slate-500 leading-relaxed font-semibold">
                      Please select any smart farming certification course on the left and click <span className="text-indigo-400 font-bold">"Enter Classroom"</span> or <span className="text-indigo-400 font-bold">"Enroll Now"</span> to launch your customized learning workspace, read course slides, and pass module quizzes!
                    </p>
                  </div>
                )}
              </div>

            </div>
          </>
        )}

        {/* SUB TAB: Video Tutorials, VR Tours & Podcasts */}
        {activeSubTab === "media" && (
          <>
            {/* Video tutorials and virtual tours */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* VIDEO TUTORIALS SEARCH & FILTERS */}
              <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                    Interactive Video Lectures & Tutorials Library
                  </h4>
                  <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                    {filteredVideos.length} Videos localized in {selectedLanguage}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search tutorials by title, keywords (e.g. paddy, soil, neem)..."
                      value={videoSearchQuery}
                      onChange={(e) => setVideoSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["All", "Planting", "Fertilizing", "Pest Control", "Harvesting", "Marketing"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedVideoCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer transition-all uppercase tracking-wider border ${
                        selectedVideoCategory === cat
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cat === "All" ? "🌍 All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* WATCH HISTORY: CONTINUE WATCHING */}
              {continueWatchingVideos.length > 0 && (
                <div className="p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-3.5 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-600 animate-spin-slow" />
                      📺 Continue Watching (Watch History)
                    </h4>
                    <span className="text-[10px] text-indigo-600 font-bold">
                      {continueWatchingVideos.length} in progress
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {continueWatchingVideos.map((video) => (
                      <div key={video.id} className="bg-white rounded-xl border border-indigo-100/50 p-4 space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="text-[8.5px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                              {video.category}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 font-bold">
                              {video.duration}
                            </span>
                          </div>
                          <h5 className="text-xs font-extrabold text-slate-800 leading-snug">{video.title}</h5>
                          <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{video.description}</p>
                        </div>

                        <div className="space-y-2 pt-2.5">
                          {/* Progress bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8.5px] font-bold font-mono text-indigo-600">
                              <span>Playback Progress</span>
                              <span>{video.progressPercent}% Watched</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full transition-all"
                                style={{ width: `${video.progressPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleStartPlayVideo(video)}
                              className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10.5px] font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Play className="h-3 w-3 fill-current" />
                              Resume Tutorial
                            </button>
                            <button
                              onClick={() => handleResetVideoProgress(video.id)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                              title="Reset watch history"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIDEO TUTORIALS GRID */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Available Video Lectures
                  </h5>
                  {videoSearchQuery && (
                    <button
                      onClick={() => setVideoSearchQuery("")}
                      className="text-[10px] text-indigo-600 font-bold hover:underline"
                    >
                      Clear search filter
                    </button>
                  )}
                </div>

                {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredVideos.map((video) => {
                      const watched = watchHistory[video.id];
                      const isCompleted = watched?.progressPercent === 100;
                      const isInProgress = watched && watched.progressPercent > 0 && watched.progressPercent < 100;

                      return (
                        <div key={video.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                          {/* Video Thumbnail placeholder */}
                          <div className={`h-36 bg-gradient-to-br ${video.coverGradient} p-4 text-white relative flex flex-col justify-between overflow-hidden group`}>
                            {/* Blur ambient background pattern */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors"></div>
                            
                            <div className="flex justify-between items-start z-10">
                              <span className="text-[8.5px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                {video.category}
                              </span>
                              <span className="text-[9px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded font-bold font-mono">
                                {video.duration}
                              </span>
                            </div>

                            {/* Simulated video play overlay */}
                            <button
                              onClick={() => handleStartPlayVideo(video)}
                              className="absolute inset-0 flex items-center justify-center text-white/90 group-hover:text-white transition-all cursor-pointer z-10"
                            >
                              <div className="p-3 bg-black/40 group-hover:bg-indigo-600 rounded-full backdrop-blur-sm transition-all group-hover:scale-110 shadow-lg">
                                <Play className="h-6 w-6 fill-current" />
                              </div>
                            </button>

                            <div className="flex justify-between items-end z-10">
                              <span className="text-[9px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded font-bold">
                                {video.instructor}
                              </span>
                              {isCompleted && (
                                <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <Check className="h-2.5 w-2.5" /> Complete
                                </span>
                              )}
                              {isInProgress && (
                                <span className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                                  {watched.progressPercent}% Watched
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Body details */}
                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <h5 className="text-xs font-black text-slate-800 leading-snug">{video.title}</h5>
                              <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">
                                {video.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <button
                                onClick={() => handleStartPlayVideo(video)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isCompleted
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                                    : isInProgress
                                    ? "bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100"
                                    : "bg-slate-900 hover:bg-slate-800 text-white"
                                }`}
                              >
                                <Play className="h-3.5 w-3.5" />
                                {isCompleted ? "Re-watch Video" : isInProgress ? "Resume Progress" : "Start Watching"}
                              </button>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                localized
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-dashed rounded-xl space-y-2">
                    <HelpCircle className="h-8 w-8 text-slate-400 mx-auto" />
                    <h5 className="text-xs font-bold text-slate-600 uppercase">No videos match criteria</h5>
                    <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                      We couldn't find any video tutorials matching your search term. Try resetting your search filter.
                    </p>
                  </div>
                )}
              </div>

              {/* Virtual Farm Tours */}
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">
                  🎥 360° Virtual Lidar Farm Tours
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {virtualTours.map((tour, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border text-[11px] font-semibold flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-slate-800">{tour.title}</h5>
                        <span className="text-[9px] text-slate-400 font-bold">Host: {tour.host} • Length: {tour.dur}</span>
                      </div>
                      <button
                        onClick={() => alert("Launching 360° VR environment model. Drag your mouse to look around!")}
                        className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9.5px] font-black cursor-pointer hover:bg-slate-800 shrink-0"
                      >
                        Launch VR
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Podcasts & Weekly Webinars (4 columns) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Podcast Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="h-4 w-4 text-rose-500 animate-pulse" />
                    7.2 Podcast Library
                  </h4>
                  {offlineOnlyFilter && (
                    <span className="flex items-center gap-1 text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-black uppercase">
                      <WifiOff className="h-2.5 w-2.5" /> Saved Offline
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  Listen to localized farming tips, financial literacy, success stories, and market trends. Download episodes for offline listening.
                </p>

                {/* Search & Filter Controls */}
                <div className="space-y-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-inner">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-3 w-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search podcasts, hosts..."
                      value={podcastSearchQuery}
                      onChange={(e) => setPodcastSearchQuery(e.target.value)}
                      className="w-full pl-6.5 pr-2 py-1 bg-slate-50 border border-slate-150 rounded-lg text-[10px] font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Filters Row */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <select
                      value={selectedPodcastTopic}
                      onChange={(e) => setSelectedPodcastTopic(e.target.value)}
                      className="bg-slate-50 border border-slate-150 text-[9.5px] font-bold text-slate-700 rounded-lg px-1.5 py-1 focus:outline-none"
                    >
                      <option value="All">All Topics</option>
                      <option value="Farming Tips">Farming Tips</option>
                      <option value="Financial Literacy">Financial Literacy</option>
                      <option value="Success Stories">Success Stories</option>
                      <option value="Market Trends">Market Trends</option>
                    </select>

                    <button
                      onClick={() => setOfflineOnlyFilter(!offlineOnlyFilter)}
                      className={`px-1.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        offlineOnlyFilter
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-150"
                      }`}
                    >
                      <WifiOff className="h-2.5 w-2.5" />
                      {offlineOnlyFilter ? "Saved Only" : "Show Saved"}
                    </button>
                  </div>
                </div>

                {/* List of podcasts */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {filteredPodcasts.length > 0 ? (
                    filteredPodcasts.map((pod) => {
                      const isPlayingThis = currentPodcast?.id === pod.id;
                      const isDownloaded = downloadedPodcasts.includes(pod.id);
                      const isDownloadingThis = downloadingPodcastId === pod.id;

                      // Topic specific icons and colors
                      let topicIcon = <Mic className="h-2.5 w-2.5 text-emerald-500" />;
                      let topicBg = "bg-emerald-50 text-emerald-700";
                      if (pod.topic === "Financial Literacy") {
                        topicIcon = <DollarSign className="h-2.5 w-2.5 text-indigo-500" />;
                        topicBg = "bg-indigo-50 text-indigo-700";
                      } else if (pod.topic === "Success Stories") {
                        topicIcon = <Sparkles className="h-2.5 w-2.5 text-rose-500" />;
                        topicBg = "bg-rose-50 text-rose-700";
                      } else if (pod.topic === "Market Trends") {
                        topicIcon = <Globe className="h-2.5 w-2.5 text-amber-500" />;
                        topicBg = "bg-amber-50 text-amber-700";
                      }

                      return (
                        <div
                          key={pod.id}
                          className={`p-2.5 bg-white rounded-xl border transition-all space-y-2 relative ${
                            isPlayingThis
                              ? "border-indigo-500 shadow bg-indigo-50/5"
                              : "border-slate-200 hover:shadow-xs"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                              <span className={`text-[7.5px] px-1.5 py-0.5 rounded font-black uppercase font-mono ${topicBg} inline-flex items-center gap-1`}>
                                {topicIcon}
                                {pod.topic}
                              </span>
                              <h5 className="font-extrabold text-slate-800 leading-snug text-[10.5px]">{pod.title}</h5>
                              <p className="text-[9.5px] text-slate-500 leading-normal font-semibold">
                                {pod.description}
                              </p>
                            </div>
                            
                            {/* Play Circle button */}
                            <button
                              onClick={() => {
                                if (isPlayingThis) {
                                  setIsPodcastPlaying(!isPodcastPlaying);
                                } else {
                                  handleStartPodcast(pod);
                                }
                              }}
                              className={`p-1.5 rounded-full cursor-pointer transition-colors flex items-center justify-center shrink-0 ${
                                isPlayingThis
                                  ? "bg-indigo-600 text-white"
                                  : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                              }`}
                              title={isPlayingThis ? "Toggle Playback" : "Play Episode"}
                            >
                              {isPlayingThis && isPodcastPlaying ? (
                                <Pause className="h-3 w-3" />
                              ) : (
                                <Play className="h-3 w-3 fill-current ml-0.5" />
                              )}
                            </button>
                          </div>

                          {/* Footer details */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[8.5px] font-mono font-bold text-slate-400">
                            <div>Host: <span className="text-slate-600">{pod.host}</span></div>
                            <div className="flex items-center gap-2">
                              <span>⏱️ {pod.duration}</span>

                              {/* Download simulated trigger */}
                              {isDownloaded ? (
                                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded border border-emerald-100">
                                  <span>Downloaded</span>
                                  <button
                                    onClick={() => handleDeleteDownloadedPodcast(pod.id)}
                                    className="hover:text-rose-600 text-slate-400 transition-colors font-extrabold cursor-pointer ml-1"
                                    title="Delete from saved"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : isDownloadingThis ? (
                                <div className="bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded border border-indigo-150 flex items-center gap-1 animate-pulse">
                                  <span>Saving {downloadProgress}%</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleStartSimulatedDownload(pod.id)}
                                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer hover:underline"
                                  title="Download for offline playback"
                                >
                                  <Download className="h-2.5 w-2.5" />
                                  <span>Download</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center bg-white border border-dashed rounded-xl space-y-2">
                      <HelpCircle className="h-7 w-7 text-slate-300 mx-auto" />
                      <h5 className="text-[10px] font-black text-slate-500 uppercase">No Podcasts Found</h5>
                      <p className="text-[9.5px] text-slate-400 leading-relaxed font-semibold">
                        Try clearing search terms or toggling offline filter.
                      </p>
                    </div>
                  )}
                </div>

                {/* Interactive Player Deck */}
                {currentPodcast && (
                  <div className="bg-slate-950 text-slate-100 rounded-xl p-3 border border-slate-800 space-y-2.5 shadow-lg relative overflow-hidden">
                    {/* Top indicator strip */}
                    <div className="absolute top-0 left-0 h-1 bg-indigo-600 w-full">
                      {isPodcastPlaying && (
                        <div className="h-full bg-emerald-400 animate-pulse" style={{ width: `${(podcastProgress / currentPodcast.durationSeconds) * 100}%` }}></div>
                      )}
                    </div>

                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5 max-w-[85%]">
                        <span className="text-[8px] bg-slate-900 text-indigo-400 px-1.5 py-0.5 rounded font-black uppercase font-mono tracking-wider">
                          Now Broadcasting
                        </span>
                        <h5 className="font-extrabold text-white text-[10px] leading-snug truncate">
                          {currentPodcast.title}
                        </h5>
                        <p className="text-[9px] text-slate-400 truncate font-semibold">
                          Host: {currentPodcast.host} • {currentPodcast.topic}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsPodcastPlaying(false);
                          setCurrentPodcast(null);
                        }}
                        className="text-slate-500 hover:text-slate-300 text-[10px] font-bold cursor-pointer"
                        title="Close Player"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Progress slider / Scrubbing bar */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max={currentPodcast.durationSeconds}
                        value={podcastProgress}
                        onChange={(e) => setPodcastProgress(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none focus:outline-none"
                      />
                      <div className="flex justify-between text-[8px] font-mono text-slate-500 font-extrabold">
                        <span>
                          {Math.floor(podcastProgress / 60)}:
                          {String(podcastProgress % 60).padStart(2, "0")}
                        </span>
                        <span>
                          {Math.floor(currentPodcast.durationSeconds / 60)}:
                          {String(currentPodcast.durationSeconds % 60).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-900">
                      {/* Interactive Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handlePrevPodcast}
                          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Previous Track"
                        >
                          <SkipBack className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleSkipPodcast(-10)}
                          className="px-1 py-0.5 bg-slate-900 text-slate-300 rounded text-[8px] hover:text-white font-mono"
                          title="Skip Back 10s"
                        >
                          -10s
                        </button>

                        <button
                          onClick={handleTogglePlayPodcast}
                          className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all cursor-pointer shadow flex items-center justify-center"
                        >
                          {isPodcastPlaying ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3 fill-current ml-0.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleSkipPodcast(10)}
                          className="px-1 py-0.5 bg-slate-900 text-slate-300 rounded text-[8px] hover:text-white font-mono"
                          title="Skip Forward 10s"
                        >
                          +10s
                        </button>
                        <button
                          onClick={handleNextPodcast}
                          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Next Track"
                        >
                          <SkipForward className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Speed multiplier & mute button */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
                          {[1, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => setPodcastPlaybackSpeed(speed)}
                              className={`px-1 rounded text-[8px] font-black ${
                                podcastPlaybackSpeed === speed
                                  ? "bg-indigo-600 text-white"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setPodcastMuted(!podcastMuted)}
                          className="text-slate-400 hover:text-white"
                        >
                          {podcastMuted ? (
                            <VolumeX className="h-3 w-3 text-rose-400" />
                          ) : (
                            <Volume2 className="h-3 w-3 text-slate-300" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Expert Webinars Panel */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 space-y-4 shadow-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-indigo-400 animate-pulse" />
                    7.3 Expert Webinars
                  </h4>
                  <button
                    onClick={() => setIsSchedulingWebinar(!isSchedulingWebinar)}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <PlusCircle className="h-3 w-3" />
                    Schedule
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Join interactive classrooms, set early notifications, ask live questions, or play recordings anytime.
                </p>

                {/* Simulated Scheduling Form */}
                {isSchedulingWebinar && (
                  <form onSubmit={handleScheduleNewWebinar} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="text-[9.5px] font-black text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                      Schedule a New Session
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <label className="text-[8px] uppercase text-slate-500 font-bold">Topic/Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Organic Pest Secrets"
                          value={newWebinarTitle}
                          onChange={(e) => setNewWebinarTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 rounded px-2 py-1 text-[9.5px] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[8px] uppercase text-slate-500 font-bold">Expert Speaker</label>
                        <input
                          type="text"
                          placeholder="e.g. Dr. Verma"
                          value={newWebinarSpeaker}
                          onChange={(e) => setNewWebinarSpeaker(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 rounded px-2 py-1 text-[9.5px] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="space-y-0.5">
                        <label className="text-[8px] uppercase text-slate-500 font-bold">Date</label>
                        <input
                          type="text"
                          placeholder="Every Saturday"
                          value={newWebinarDate}
                          onChange={(e) => setNewWebinarDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 rounded px-1.5 py-1 text-[9.5px] text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[8px] uppercase text-slate-500 font-bold">Time</label>
                        <input
                          type="text"
                          placeholder="02:00 PM"
                          value={newWebinarTime}
                          onChange={(e) => setNewWebinarTime(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 rounded px-1.5 py-1 text-[9.5px] text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[8px] uppercase text-slate-500 font-bold">Status</label>
                        <select
                          value={newWebinarStatus}
                          onChange={(e) => setNewWebinarStatus(e.target.value as "Upcoming" | "Live")}
                          className="w-full bg-slate-900 border border-slate-850 rounded px-1.5 py-1 text-[9.5px] text-white focus:outline-none"
                        >
                          <option value="Upcoming">Upcoming</option>
                          <option value="Live">Live Stream</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsSchedulingWebinar(false)}
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded text-[9.5px] font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[9.5px] font-black uppercase cursor-pointer"
                      >
                        Confirm Session
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Webinars */}
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {webinars.map((web) => {
                    const isReminderSet = remindersSet.includes(web.id);
                    return (
                      <div
                        key={web.id}
                        className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2.5 hover:border-slate-700/80 transition-all text-[10px]"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <h5 className="font-extrabold text-white leading-snug">{web.title}</h5>
                            <p className="text-[9px] text-slate-400 font-semibold">
                              Speaker: <span className="text-slate-200">{web.speaker}</span>
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                              web.status === "Live"
                                ? "bg-rose-600 text-white animate-pulse"
                                : web.status === "Upcoming"
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {web.status}
                          </span>
                        </div>

                        {/* Date/Time strip */}
                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 font-bold bg-slate-900/60 p-1.5 rounded border border-white/5">
                          <span>📅 {web.date}</span>
                          <span>⏱️ {web.time}</span>
                        </div>

                        {/* Interactive Buttons block */}
                        <div className="flex items-center gap-2 pt-1">
                          {web.status === "Live" && (
                            <button
                              onClick={() => setActiveWebinarRoom(web)}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Tv className="h-3 w-3" />
                              Join Live Room
                            </button>
                          )}

                          {web.status === "Recorded" && (
                            <button
                              onClick={() => setActiveWebinarRoom(web)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Play className="h-3 w-3 fill-current" />
                              Watch Recorded
                            </button>
                          )}

                          {web.status === "Upcoming" && (
                            <>
                              <button
                                onClick={() => joinWebinar(web.id)}
                                disabled={web.joined}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-colors cursor-pointer ${
                                  web.joined
                                    ? "bg-emerald-600 text-white"
                                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                }`}
                              >
                                {web.joined ? "✓ Registered" : "Register Now"}
                              </button>

                              <button
                                onClick={() => handleToggleReminder(web.id)}
                                className={`p-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                                  isReminderSet
                                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-400"
                                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                                }`}
                                title={isReminderSet ? "Reminder Enabled" : "Enable Reminder Notification"}
                              >
                                {isReminderSet ? (
                                  <BellRing className="h-3.5 w-3.5 text-emerald-400 animate-bounce" />
                                ) : (
                                  <Bell className="h-3.5 w-3.5" />
                                )}
                                <span className="text-[8.5px] font-bold font-mono px-0.5">
                                  {isReminderSet ? "Alert On" : "Remind"}
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </>
        )}

        {/* SUB TAB: Children section, Women programs, and recipes */}
        {activeSubTab === "programs" && (
          <div className="lg:col-span-12 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {specialPrograms.map((prog, idx) => (
                <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                      <span className="text-indigo-600">{prog.type}</span>
                      <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        Audience: {prog.audiance}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-slate-800 leading-snug">{prog.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                      {prog.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (prog.type === "Culinary") {
                        alert("Gathering organic ingredients list... Recommended recipes downloaded to your marketplace menu.");
                      } else {
                        alert(`Successfully initiated workspace modules for: ${prog.title}`);
                      }
                    }}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Launch Interactive Hub
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB TAB: Community Q&A (activeSubTab === "qa") */}
        {activeSubTab === "qa" && (
          <div className="lg:col-span-12 space-y-6">
            
            {/* Top Control Header Panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="space-y-1 w-full md:w-auto">
                <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-indigo-600" />
                  7.5 Community Q&A & Expert Advisory
                </h4>
                <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
                  Post regional farming queries, search community answers, upvote expert diagnostics, and mark accepted solutions.
                </p>
              </div>

              {/* Action and Search Block */}
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Q&A keyword, crop..."
                    value={qaSearchQuery}
                    onChange={(e) => setQaSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[10.5px] font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                  />
                </div>

                {/* Crop Filter Dropdown */}
                <select
                  value={qaSelectedTopic}
                  onChange={(e) => setQaSelectedTopic(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl text-[10.5px] font-bold text-slate-700 px-3 py-1.5 focus:outline-none cursor-pointer shadow-sm"
                >
                  <option value="All">All Topics / Crops</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Basmati">Basmati Rice</option>
                  <option value="Soil">Soil Health</option>
                  <option value="Pest">Pest Control</option>
                  <option value="Fertilizer">Fertilizer</option>
                </select>

                {/* Ask CTA */}
                <button
                  onClick={() => setIsAskingQuestion(!isAskingQuestion)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow cursor-pointer transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  {isAskingQuestion ? "Close Form" : "Ask a Question"}
                </button>
              </div>
            </div>

            {/* Ask a Question Sliding Form */}
            {isAskingQuestion && (
              <form onSubmit={handleAskQuestion} className="bg-slate-50 border-2 border-indigo-100 rounded-2xl p-5 space-y-4 shadow-sm animate-fadeIn">
                <div className="flex justify-between items-center border-b border-indigo-50/60 pb-2">
                  <h5 className="text-[11px] font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4" />
                    Submit a New Community Query
                  </h5>
                  <button
                    type="button"
                    onClick={() => setIsAskingQuestion(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Question Title / Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Whitefly infestation on cotton leaves after light rain"
                      value={qaNewTitle}
                      onChange={(e) => setQaNewTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-[11px] text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400 shadow-inner"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Crop Category & Topic</label>
                    <select
                      value={qaNewCropTopic}
                      onChange={(e) => setQaNewCropTopic(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="Tomato / Pest Management">Tomato / Pest Management</option>
                      <option value="Basmati Rice / Bio-Control">Basmati Rice / Bio-Control</option>
                      <option value="Soil Health / Fertilizer">Soil Health / Fertilizer</option>
                      <option value="Wheat / Moisture Level">Wheat / Moisture Level</option>
                      <option value="Maize / Intercropping">Maize / Intercropping</option>
                      <option value="General / Organic Advisory">General / Organic Advisory</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Detailed Description</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details of your crop's current stage, visible symptoms, regional weather context, and any methods already attempted..."
                    value={qaNewDescription}
                    onChange={(e) => setQaNewDescription(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-[11px] text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400 shadow-inner resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAskingQuestion(false)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-md transition-colors"
                  >
                    Post Question
                  </button>
                </div>
              </form>
            )}

            {/* Questions List Render */}
            <div className="space-y-4">
              {filteredQaQuestions.length > 0 ? (
                filteredQaQuestions.map((q) => (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-indigo-100 transition-all">
                    
                    {/* Header Details */}
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            q.isSolved 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse"
                          }`}>
                            {q.isSolved ? "✓ Resolved" : "● Open Discussion"}
                          </span>
                          <span className="text-[9.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                            📂 {q.cropTopic}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 leading-snug">{q.title}</h4>
                      </div>

                      {/* Vote Question Button */}
                      <button
                        onClick={() => handleUpvoteQuestion(q.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 rounded-xl border border-slate-150 text-[10px] font-extrabold cursor-pointer transition-colors"
                        title="Upvote this question"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{q.upvotes} Upvotes</span>
                      </button>
                    </div>

                    {/* Question Body Description */}
                    <p className="text-[11px] text-slate-600 font-semibold leading-relaxed whitespace-pre-wrap">
                      {q.description}
                    </p>

                    {/* Author Footer */}
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold font-mono border-t border-dashed border-slate-100 pt-3.5">
                      <span>👤 Author: <span className="text-slate-600">{q.author}</span></span>
                      <span>📅 Posted on: {q.createdAt}</span>
                    </div>

                    {/* Answers Section (Inner Box) */}
                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-150 space-y-3.5">
                      <h5 className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
                        Responses ({q.answers.length})
                      </h5>

                      {q.answers.length > 0 ? (
                        <div className="space-y-3">
                          {q.answers.map((ans) => (
                            <div
                              key={ans.id}
                              className={`p-3 rounded-xl text-[11px] space-y-2 border transition-all ${
                                ans.isAccepted
                                  ? "bg-emerald-50/50 border-emerald-300 shadow-sm"
                                  : ans.isExpert
                                  ? "bg-indigo-50/30 border-indigo-200"
                                  : "bg-white border-slate-200"
                              }`}
                            >
                              {/* Answer Header */}
                              <div className="flex justify-between items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[9.5px] font-black ${ans.isExpert ? 'text-indigo-700' : 'text-slate-700'}`}>
                                    {ans.author}
                                  </span>
                                  {ans.isExpert && (
                                    <span className="text-[8px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                                      Expert Advisory
                                    </span>
                                  )}
                                  {ans.isAccepted && (
                                    <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black uppercase tracking-wider flex items-center gap-0.5">
                                      <Check className="h-2.5 w-2.5" /> Accepted Solution
                                    </span>
                                  )}
                                </div>

                                {/* Upvote Answer and Accept Buttons */}
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleUpvoteAnswer(q.id, ans.id)}
                                    className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border text-[9px] font-bold text-slate-500 rounded flex items-center gap-1 cursor-pointer"
                                  >
                                    <ThumbsUp className="h-2.5 w-2.5" />
                                    <span>{ans.upvotes}</span>
                                  </button>

                                  {/* Author or Expert can accept */}
                                  <button
                                    onClick={() => handleToggleAcceptAnswer(q.id, ans.id)}
                                    className={`px-2 py-0.5 border text-[9px] font-black rounded flex items-center gap-0.5 transition-all cursor-pointer ${
                                      ans.isAccepted
                                        ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300"
                                    }`}
                                    title={ans.isAccepted ? "Remove accepted mark" : "Mark as Accepted Solution"}
                                  >
                                    <CheckCircle className={`h-3 w-3 ${ans.isAccepted ? 'text-white' : 'text-slate-400 hover:text-emerald-500'}`} />
                                    <span>{ans.isAccepted ? "Accepted" : "Accept"}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Answer Text */}
                              <p className="font-semibold text-slate-600 leading-normal">
                                {ans.text}
                              </p>

                              {/* Answer Date */}
                              <div className="text-[8.5px] text-slate-400 font-bold font-mono text-right">
                                Posted on: {ans.createdAt}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-white/60 border border-dashed rounded-xl space-y-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">No answers yet</p>
                          <p className="text-[9.5px] text-slate-400 font-semibold">Be the first to provide helpful regional field tips!</p>
                        </div>
                      )}

                      {/* Add new Answer Input Field */}
                      <div className="border-t border-slate-200/60 pt-3 flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Type community feedback or expert diagnostic advice..."
                          value={qaNewAnswerTexts[q.id] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQaNewAnswerTexts((prev) => ({
                              ...prev,
                              [q.id]: val
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddAnswer(q.id);
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-[10.5px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold shadow-inner"
                        />
                        <button
                          onClick={() => handleAddAnswer(q.id)}
                          className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer flex items-center justify-center transition-colors shadow"
                          title="Post Answer"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-slate-50 border-2 border-dashed rounded-2xl space-y-2">
                  <HelpCircle className="h-8 w-8 text-slate-400 mx-auto" />
                  <h5 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">No matching questions</h5>
                  <p className="text-[10.5px] text-slate-400 font-semibold max-w-md mx-auto">
                    We couldn't find any community discussions matching your filter or query term. Try broadening your keywords.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* SIMULATED VIDEO PLAYER OVERLAY MODAL */}
      {activePlayingVideo && (
        <div id="simulated-video-player-modal" className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="p-4 border-b border-slate-800/60 bg-slate-900/40 flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-[8.5px] bg-indigo-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Category: {activePlayingVideo.category}
                </span>
                <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5 leading-snug">
                  <Video className="h-4 w-4 text-indigo-400 animate-pulse" />
                  {activePlayingVideo.title}
                </h4>
              </div>
              <button
                id="close-player-button"
                onClick={() => {
                  setIsPlaySimulating(false);
                  setActivePlayingVideo(null);
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Save & Close
              </button>
            </div>

            {/* Video Stage / Canvas */}
            <div className="relative aspect-video bg-slate-900 flex flex-col justify-between p-6 overflow-hidden">
              {/* Spinning background effect indicating media streaming */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 flex flex-col items-center justify-center space-y-4">
                {isPlaySimulating ? (
                  /* Animated visual audio/wave form representation */
                  <div className="flex items-center gap-1 h-12">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1, 3, 5, 2, 4].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-indigo-500 rounded-full animate-pulse"
                        style={{
                          height: `${h * 8}px`,
                          animationDelay: `${i * 100}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 bg-indigo-600/25 border border-indigo-500/30 rounded-full">
                    <Play className="h-10 w-10 text-indigo-400 fill-current ml-1" />
                  </div>
                )}
                
                <span className="text-xs font-bold tracking-widest text-indigo-300 animate-pulse font-mono uppercase">
                  {isPlaySimulating ? "Simulating Streaming Broadcast..." : "Broadcasting Paused"}
                </span>

                <div className="text-[10px] text-slate-500 font-bold font-mono">
                  Audio Track: <span className="text-slate-300 font-extrabold">{selectedLanguage}</span> • Speed: <span className="text-slate-300 font-extrabold">{videoPlaybackSpeed}x</span> • Resolution: <span className="text-slate-300 font-extrabold">1080p HD</span>
                </div>
              </div>

              {/* Volume status floating element */}
              <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-1 rounded flex items-center gap-1 z-10">
                {videoMuted ? <VolumeX className="h-3 w-3 text-rose-400" /> : <Volume2 className="h-3 w-3 text-emerald-400" />}
                <span>{videoMuted ? "Muted" : `${videoVolume}%`}</span>
              </div>

              {/* Progress counter at bottom left */}
              <div className="mt-auto z-10 flex justify-between w-full text-[10px] font-mono text-slate-400 bg-black/60 p-2 rounded backdrop-blur-sm border border-white/5">
                <span>Instructor: {activePlayingVideo.instructor}</span>
                <span>{Math.round((activePlayingVideo.durationSeconds * playingProgress) / 100)}s / {activePlayingVideo.durationSeconds}s</span>
              </div>
            </div>

            {/* Video Controls bar */}
            <div className="p-4 bg-slate-900 border-t border-slate-800/80 space-y-4">
              
              {/* Scrubbing bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold font-mono text-indigo-400">
                  <span>Playback Position</span>
                  <span>{Math.round(playingProgress)}% Watched</span>
                </div>
                <div className="relative group">
                  <input
                    id="video-scrubber-slider"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={playingProgress}
                    onChange={(e) => handleSeekVideo(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer appearance-none transition-all focus:outline-none"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  {isPlaySimulating ? (
                    <button
                      id="pause-simulation-button"
                      onClick={handlePauseVideo}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <Pause className="h-4 w-4" /> Pause Video
                    </button>
                  ) : (
                    <button
                      id="resume-simulation-button"
                      onClick={handleResumeVideo}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <Play className="h-4 w-4 fill-current" /> Resume Video
                    </button>
                  )}

                  <button
                    id="rewind-video-button"
                    onClick={() => handleSeekVideo(playingProgress - 10)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                    title="Rewind 10%"
                  >
                    <span className="text-[10px] font-bold">-10%</span>
                  </button>
                  <button
                    id="forward-video-button"
                    onClick={() => handleSeekVideo(playingProgress + 10)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                    title="Fast Forward 10%"
                  >
                    <span className="text-[10px] font-bold">+10%</span>
                  </button>
                </div>

                {/* Secondary controls: speed and audio */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                  {/* Volume Slider */}
                  <div className="flex items-center gap-1.5">
                    <button id="toggle-mute-button" onClick={() => setVideoMuted(!videoMuted)} className="p-1 hover:text-white">
                      {videoMuted || videoVolume === 0 ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-slate-300" />}
                    </button>
                    <input
                      id="volume-slider"
                      type="range"
                      min="0"
                      max="100"
                      value={videoVolume}
                      onChange={(e) => {
                        setVideoVolume(parseInt(e.target.value));
                        setVideoMuted(false);
                      }}
                      className="w-16 accent-indigo-500 h-1 bg-slate-800 rounded-full"
                    />
                  </div>

                  {/* Playback speed multiplier */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase px-1">Speed</span>
                    {[1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setVideoPlaybackSpeed(speed)}
                        className={`px-1.5 py-0.5 rounded text-[9.5px] font-extrabold ${
                          videoPlaybackSpeed === speed
                            ? "bg-indigo-600 text-white"
                            : "hover:text-white"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <button
                    id="finish-video-button"
                    onClick={() => handleSeekVideo(100)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    Mark Finished
                  </button>
                </div>
              </div>

              {/* Information disclaimer */}
              <div className="text-[10px] text-slate-500 bg-black/30 p-2.5 border border-slate-800/60 rounded-xl leading-relaxed">
                ℹ️ **Interactive Simulation Note:** This player simulates active playback streaming. When &quot;Resume Video&quot; is active, progress advances periodically. You can manually drag the position bar or click the seek buttons to skip around. Closing the player preserves your current position in the **Continue Watching** section.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED WEBINAR STREAM / RECORDING OVERLAY MODAL */}
      {activeWebinarRoom && (
        <div id="simulated-webinar-modal" className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 text-white rounded-2xl max-w-4xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[550px] max-h-full">
            
            {/* Left Column: Stream Screen Stage (60%) */}
            <div className="md:w-3/5 p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-850 bg-slate-900/40 h-1/2 md:h-full">
              {/* Header Info */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                    activeWebinarRoom.status === "Live" ? "bg-rose-600 text-white" : "bg-indigo-600 text-white"
                  }`}>
                    {activeWebinarRoom.status === "Live" ? "🔴 Live Broadcast" : "📼 Recorded Session"}
                  </span>
                  <span className="text-[8.5px] font-mono text-slate-400">
                    Host: {activeWebinarRoom.speaker}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-100 leading-snug">
                  {activeWebinarRoom.title}
                </h4>
              </div>

              {/* Central Video / Wave Stage */}
              <div className="relative aspect-video my-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col items-center justify-center space-y-4 overflow-hidden flex-1 max-h-[220px]">
                {activeWebinarRoom.status === "Live" ? (
                  <>
                    {/* Pulsing graphic dots representing streaming data */}
                    <div className="flex items-end gap-1.5 h-16">
                      {[1, 3, 2, 5, 4, 3, 6, 2, 4, 5, 1, 3, 2].map((val, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-rose-500 rounded-full animate-bounce"
                          style={{
                            height: `${val * 16}px`,
                            animationDuration: `${0.6 + (idx % 3) * 0.2}s`,
                            animationDelay: `${idx * 80}ms`
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-center space-y-1 z-10">
                      <span className="text-[10px] font-black tracking-widest text-rose-400 uppercase animate-pulse">
                        Receiving HD Telecast...
                      </span>
                      <p className="text-[9px] text-slate-500 font-mono">
                        Stream Ingress: <span className="text-slate-300 font-bold">rtmp://172.16.2.3/live</span> • Latency: <span className="text-slate-300 font-bold">120ms</span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                      <Play className="h-8 w-8 text-indigo-400 fill-current ml-0.5 animate-pulse" />
                    </div>
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-black tracking-wider text-indigo-300 uppercase">
                        Playback Ready
                      </span>
                      <p className="text-[9px] text-slate-500 font-mono">
                        Duration: <span className="text-slate-300 font-bold">1 hr 12 mins</span> • Resolution: <span className="text-slate-300 font-bold">1080p FHD</span>
                      </p>
                    </div>
                  </>
                )}
                
                {/* Floating attendee counter */}
                <div className="absolute top-2 right-2 text-[9px] font-mono font-black bg-black/60 px-2 py-0.5 rounded-full border border-white/5 flex items-center gap-1">
                  <Users className="h-3 w-3 text-indigo-400" />
                  <span>{activeWebinarRoom.status === "Live" ? "142 Watching" : "2.4k Views"}</span>
                </div>
              </div>

              {/* Bottom detail / Tip Box */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-[9.5px] text-slate-400 leading-normal font-semibold">
                💡 **Broadcast Note:** Ask questions in the right chat sidebar. The expert speaker receives messages and responds within moments based on historical case patterns.
              </div>
            </div>

            {/* Right Column: Q&A / Chat Room Sidebar (40%) */}
            <div className="md:w-2/5 p-4 flex flex-col justify-between h-1/2 md:h-full bg-slate-950 text-slate-300">
              {/* Header */}
              <div className="border-b border-slate-850 pb-2 mb-2 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-indigo-400" />
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-200">
                    Live Q&A Chatroom
                  </span>
                </div>
                <button
                  onClick={() => setActiveWebinarRoom(null)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  Close & Exit
                </button>
              </div>

              {/* Chat messages box */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 py-1 max-h-[300px]">
                {(webinarChatMessages[activeWebinarRoom.id] || [
                  { sender: "System", text: "Streaming chat room initialized. Ask the speaker anything!", timestamp: "00:00" }
                ]).map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-xl text-[10px] max-w-[90%] leading-relaxed ${
                      msg.sender === "System"
                        ? "bg-slate-900 border border-slate-850 text-slate-400 text-center mx-auto"
                        : msg.sender === "You (Farmer)"
                        ? "bg-indigo-600 text-white ml-auto"
                        : msg.isExpert
                        ? "bg-slate-900 border-l-2 border-l-emerald-500 text-emerald-100"
                        : "bg-slate-900 text-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2 mb-0.5 font-bold font-mono text-[8px] text-slate-400">
                      <span>{msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="font-semibold">{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Send message text input */}
              <div className="border-t border-slate-850 pt-2.5 mt-2.5 flex gap-1.5 items-center">
                <input
                  type="text"
                  placeholder="Type a question for the expert..."
                  value={newWebinarQuestion}
                  onChange={(e) => setNewWebinarQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAskWebinarQuestion(activeWebinarRoom.id);
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-[10px] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                />
                <button
                  onClick={() => handleAskWebinarQuestion(activeWebinarRoom.id)}
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer flex items-center justify-center transition-colors"
                  title="Send Question"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
