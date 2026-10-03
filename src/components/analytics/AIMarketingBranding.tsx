import React, { useState, useRef } from "react";
import {
  Sparkles,
  Award,
  Megaphone,
  Printer,
  QrCode,
  Tag,
  Users,
  Target,
  DollarSign,
  PenTool,
  Instagram,
  Camera,
  Video,
  MessageSquare,
  Gift,
  Globe,
  CheckCircle,
  TrendingUp,
  Image,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  Bookmark,
  Sliders,
  Play,
  Heart,
  Share2,
  Download,
  Info,
  RefreshCw,
  Copy,
  Check,
  Eye,
  FileText
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// --- TYPES & INTERFACES ---
interface BuyerPersona {
  id: string;
  name: string;
  title: string;
  demographics: string;
  behaviors: string[];
  painPoints: string[];
  strategy: string;
  premiumMatch: string; // How to market
  imageUrl: string;
}

interface SocialPostTemplate {
  id: string;
  platform: "Instagram" | "LinkedIn" | "Facebook";
  title: string;
  scenario: string;
  generatedText: string;
  hashtags: string[];
}

interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  reviewText: string;
  productBought: string;
  aiSuggestedReply: string;
  status: "Unanswered" | "Replied";
  actualReply?: string;
}

interface PackagingTemplate {
  id: string;
  name: string;
  material: string;
  description: string;
  environmentalBenefit: string;
  baseCost: number;
  recommendedCrops: string[];
}

export default function AIMarketingBranding() {
  // --- SUB-TABS STATE ---
  const [activeTab, setActiveTab] = useState<
    "branding" | "personas" | "storytelling" | "social" | "reviews" | "export"
  >("branding");

  // --- BRAND GENERATOR STATE ---
  const [farmName, setFarmName] = useState("Vedic Green Acres");
  const [tagline, setTagline] = useState("Purely Grown, Earthly Sourced");
  const [primaryColor, setPrimaryColor] = useState("#0f766e"); // Teal 700
  const [secondaryColor, setSecondaryColor] = useState("#f59e0b"); // Amber 500
  const [logoIcon, setLogoIcon] = useState<"leaf" | "sprout" | "sun" | "droplet" | "flower">("leaf");
  const [selectedTemplate, setSelectedTemplate] = useState("eco-kraft");

  // Copy state helper
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // --- 1. BRANDING & PACKAGING TEMPLATES ---
  const packagingTemplates: PackagingTemplate[] = [
    {
      id: "eco-kraft",
      name: "Organic Kraft Paper Pouch",
      material: "100% Recyclable Kraft + Plant starch lining",
      description: "Excellent for grains, seeds, pulses, and dry spices. Features a high-barrier aroma seal.",
      environmentalBenefit: "Reduces plastic carbon footprint by 84%. Fully home compostable.",
      baseCost: 0.18,
      recommendedCrops: ["Basmati Rice", "Quinoa", "Turmeric Pods", "Lentils"]
    },
    {
      id: "bio-mesh",
      name: "Sugarcane Bagasse Mesh Tub",
      material: "Repurposed sugarcane bagasse pulp fiber",
      description: "Rigid yet highly breathable container ideal for fresh produce, berries, and vegetables.",
      environmentalBenefit: "Zero petroleum plastics. Dissolves fully in damp commercial compost in 45 days.",
      baseCost: 0.24,
      recommendedCrops: ["Vine-Ripened Tomatoes", "Strawberries", "Baby Corn", "Capsicum"]
    },
    {
      id: "glass-amber",
      name: "Apothecary Amber Glass Bottle",
      material: "Recycled amber silica glass with natural cork seal",
      description: "Protects delicate cold-pressed oils and liquid bio-fertilizers from degradation due to UV light.",
      environmentalBenefit: "Infinitely recyclable. Zero chemical leaching to preserve biological vitality.",
      baseCost: 0.65,
      recommendedCrops: ["Cold-Pressed Mustard Oil", "Neem Pest Concentrate", "Herbal Tonic Extractor"]
    }
  ];

  // --- 2. BUYER PERSONAS ---
  const buyerPersonas: BuyerPersona[] = [
    {
      id: "per-1",
      name: "Aanya Sharma",
      title: "The Eco-Conscious Urban Parent",
      demographics: "Age 28-42 • Metros • Household Income: Upper-Middle",
      behaviors: [
        "Checks QR codes for organic NPOP and pesticide-free verification.",
        "Willingly pays up to 35% premium for authentic chemical-free cereals.",
        "Advocates for zero-waste lifestyle on community forums."
      ],
      painPoints: [
        "Fears 'greenwashed' labels that pretend to be organic without actual certification IDs.",
        "Seeks reliable farm-to-shelf trace verification."
      ],
      strategy: "Highlight NPOP standard certifications directly in branding. Use the Organic QR Code prominently on the Kraft pouch. Write stories detailing natural weeding methods.",
      premiumMatch: "High Premium potential (30% - 40% over wholesale pricing)",
      imageUrl: "https://picsum.photos/seed/aanya/150/150"
    },
    {
      id: "per-2",
      name: "Chef Marcus Vance",
      title: "The High-End Farm-to-Table Gastronomer",
      demographics: "Age 35-55 • Boutique Restaurants & Hotels",
      behaviors: [
        "Demands fresh harvest batches with direct-from-origin logistics delivery.",
        "Values exotic/indigenous heirloom crop varieties (e.g. black rice, wild varieties).",
        "Wants to showcase the actual farmer's portrait and story in the restaurant menu."
      ],
      painPoints: [
        "Inconsistent crop shape/sizes from poor sorting.",
        "Interrupted supply chains during off-seasons."
      ],
      strategy: "Provide bulk-packaged sugarcane mesh tubs with custom restaurant-grade tags. Emphasize multi-cropping benefits and rich volcanic loam minerals in crop descriptions.",
      premiumMatch: "Exceptional Premium potential (40% - 60% markup for custom direct crops)",
      imageUrl: "https://picsum.photos/seed/marcus/150/150"
    },
    {
      id: "per-3",
      name: "Rajesh K.",
      title: "The Holistic Health Enthusiast",
      demographics: "Age 45-65 • Wellness Center Regulars",
      behaviors: [
        "Searches for nutrient-dense functional superfoods (cold-pressed, unpolished).",
        "Buys in bulk directly from organic farming cooperatives.",
        "Deeply respects Vedic zero-budget farming traditions."
      ],
      painPoints: [
        "Loss of biological vitality in highly processed products.",
        "Lack of high-potency ingredients in modern high-yield cultivars."
      ],
      strategy: "Use apothecary amber bottles with nostalgic kraft labels. Describe traditional composting methods, Vedic mantras applied, and cold-press wood-churned processes.",
      premiumMatch: "Moderate-High Premium potential (25% - 35% markup on superfoods)",
      imageUrl: "https://picsum.photos/seed/rajesh/150/150"
    }
  ];

  // --- 3. TARGET MARKET ANALYSIS CHARTS DATA ---
  const demandData = [
    { name: "Urban Organic Grains", PremiumDemand: 82, OrganicMarketGrowth: 18 },
    { name: "Cold-Pressed Oils", PremiumDemand: 94, OrganicMarketGrowth: 26 },
    { name: "Exotic Heirloom Herbs", PremiumDemand: 75, OrganicMarketGrowth: 15 },
    { name: "Certified Fruits/Veg", PremiumDemand: 88, OrganicMarketGrowth: 22 }
  ];

  const premiumPricingData = [
    { crop: "Heirloom Rice", Wholesale: 110, CertifiedOrganicRetail: 215, MarginImprovement: 95 },
    { crop: "Mustard Oil (Ltr)", Wholesale: 140, ColdPressedPremium: 280, MarginImprovement: 100 },
    { crop: "Spiced Turmeric", Wholesale: 90, HighCurcuminOrganic: 195, MarginImprovement: 116 },
    { crop: "Fresh Vine Tomatoes", Wholesale: 45, PesticideFreeTray: 110, MarginImprovement: 144 }
  ];

  // --- 4. STORYTELLING GENERATOR ---
  const [cropForStory, setCropForStory] = useState("Heirloom Black Basmati");
  const [farmHeritage, setFarmHeritage] = useState("Third-generation soil stewards in the Andhra Pradesh foothills");
  const [soilSecret, setSoilSecret] = useState("Aged bio-inoculants, rich Vermicompost, and zero chemical inputs for 5 years");
  const [generatedStory, setGeneratedStory] = useState("");

  const handleGenerateStory = () => {
    const stories = [
      `Harvested with extreme care from the foothills of the Himalayas, our ${cropForStory} is more than just food—it is a covenant with nature. Nourished exclusively by ${soilSecret}, this batch represents a legacy of ${farmHeritage}. Every single grain is sun-dried, unpolished, and packed in biodegradable plant pouches to keep the pure botanical vitality intact from our family field to your dining table.`,
      `In a world of mass-produced, chemical-heavy agriculture, we chose a different path. Our ${cropForStory} is nurtured using zero-budget Vedic techniques. Our family, acting as ${farmHeritage}, applies natural pest control with neem extracts. Grown in soil enriched with ${soilSecret}, you can taste the biological honesty and crisp field air in every bite.`,
      `From soil to soul. We believe that true nutrition starts beneath the earth. That is why our family, ${farmHeritage}, has dedicated years to rebuilding the soil biome. Feeding our crops exclusively with ${soilSecret}, this pristine ${cropForStory} yields magnificent minerals, deep natural flavor, and an outstanding pesticide-free guarantee verified by our NPOP blockchain QR code.`
    ];
    // Random selector
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    setGeneratedStory(randomStory);
  };

  // --- 5. SOCIAL MEDIA POST GENERATOR ---
  const [socialCrop, setSocialCrop] = useState("Aged Mustard Seed");
  const [socialTone, setSocialTone] = useState("Inspiring & Educational");
  const [generatedPost, setGeneratedPost] = useState("");

  const handleGenerateSocial = () => {
    let text = "";
    if (socialTone === "Inspiring & Educational") {
      text = `🌱 Healthy Soil = Healthy Humanity. Did you know that our premium ${socialCrop} is grown under zero-tillage conditions? This means we don't disturb the natural fungal networks beneath the ground. The result? A crop with twice the mineral load, absolute chemical-free purity, and a carbon offset you can feel proud to support. Clean food is a human right. Grab your direct-to-farm certified pack today! 👇`;
    } else if (socialTone === "Rustic & Cozy Storytelling") {
      text = `🍂 Golden hour over the crop fields, and the scent of ripe ${socialCrop} fills the air. Our family has spent this season working alongside ladybugs and honeybees instead of synthetic chemical sprays. When you purchase this certified batch, you're directly backing smallholders who protect regional biodiversity. Farm-to-shelf, verified clean, and packed with love. ✨`;
    } else {
      text = `🔬 THE ORGANIC DIFFERENCE: Why we refuse to spray synthetic glyphosates on our ${socialCrop}. Standard weeds are suppressed using rich straw mulch and cover-cropping. It takes more physical labor, but the rich, robust nutrient density and pure aroma make it worth every single drop. Verified with 100% trace-integrity QR codes. Support conscious agricultural practices today! 🌎`;
    }
    setGeneratedPost(text);
  };

  // --- 6. CUSTOMER REVIEWS & AI DRAFT REPLY SIMULATION ---
  const [reviews, setReviews] = useState<CustomerReview[]>([
    {
      id: "rev-1",
      customerName: "Sneha Sen",
      rating: 5,
      date: "2026-06-25",
      productBought: "Heirloom Basmati Rice Lot B3",
      reviewText: "Absolutely divine aroma! Reminds me of the organic grains from my childhood. The packaging is fully compostable too, which is fantastic. Thank you for doing this!",
      aiSuggestedReply: "Dear Sneha, thank you so much for the kind words! Nurturing our crops with organic Vermicompost and packaging them in biodegradable starch pouched bags is our way of protecting both your family and our planet. We're honored to be on your dining table!",
      status: "Unanswered"
    },
    {
      id: "rev-2",
      customerName: "David Miller",
      rating: 4,
      date: "2026-06-21",
      productBought: "Cold-Pressed Wood-Churned Mustard Oil",
      reviewText: "Superb golden color and pungent kick. High-quality extraction indeed. The only thing is that the cork bottle seal was slightly tight to open. Otherwise, outstanding product.",
      aiSuggestedReply: "Hi David, we are thrilled you enjoyed the robust aroma and golden quality of our wood-churned oil! Thank you for the helpful note regarding the natural cork seal—we will refine our cork dimensions with our artisan suppliers to ensure a smooth opening experience. Your feedback keeps us growing!",
      status: "Unanswered"
    }
  ]);

  const handleApproveReply = (id: string) => {
    setReviews(prev => prev.map(rev => {
      if (rev.id === id) {
        return {
          ...rev,
          status: "Replied",
          actualReply: rev.aiSuggestedReply
        };
      }
      return rev;
    }));
  };

  // --- LOYALTY TIER PROGRAM DETAILS ---
  const loyaltyTiers = [
    { name: "Seedling Core", points: "0 - 150 pts", benefit: "Receive baseline crop provenance traceability logs via QR. 5% community market discount." },
    { name: "Sprout Guild", points: "151 - 500 pts", benefit: "Access to limited micro-lot heirloom harvest reservations. 10% discount on cold-pressed oils." },
    { name: "Harvest Sovereign", points: "501+ pts", benefit: "Dedicated customized wooden storage gift crates with laser-engraved farm logo. Direct chef consulting calls and 15% discount." }
  ];

  return (
    <div id="ai-marketing-branding" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-xs space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 border border-indigo-150 text-indigo-700 rounded-lg">
              <Megaphone className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              🎯 AI-Driven Marketing, Farm Branding & Loyalty Hub
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-bold tracking-wide uppercase">
            Formulate premium pricing markups, identify buyer personas, generate brand stories, and automate response workflows
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center bg-slate-50 border p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab("branding")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "branding" ? "bg-white text-indigo-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            Brand & Package Builder
          </button>
          <button
            onClick={() => setActiveTab("personas")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "personas" ? "bg-white text-indigo-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Buyer Personas & Markets
          </button>
          <button
            onClick={() => setActiveTab("storytelling")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "storytelling" ? "bg-white text-indigo-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookMarkedIcon />
            Farm Storytelling
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "social" ? "bg-white text-indigo-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Instagram className="h-3.5 w-3.5" />
            Social Copy Generator
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "reviews" ? "bg-white text-indigo-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Review Management
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === "export" ? "bg-white text-indigo-700 shadow-xs border" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            Export Label Guides
          </button>
        </div>
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. BRANDING & PACKAGING DESIGN BUILDER */}
      {activeTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Customizer Sidebar (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-50 border rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                🎨 Real-time Brand Customizer
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Farm / Business Name</label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full bg-white border text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Vedic Green Acres"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Core Brand Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-white border text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Purely Grown, Earthly Sourced"
                  />
                </div>

                {/* Color pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Primary Theme</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-8 w-10 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-full bg-white border text-[11px] font-mono font-bold px-2 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Accent Highlight</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="h-8 w-10 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-full bg-white border text-[11px] font-mono font-bold px-2 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Icon Selector */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Logo Icon Shape</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: "leaf", label: "🌿 Leaf" },
                      { id: "sprout", label: "🌱 Sprout" },
                      { id: "sun", label: "☀️ Sun" },
                      { id: "droplet", label: "💧 Drop" },
                      { id: "flower", label: "🌸 Zen" }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLogoIcon(item.id as any)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all text-center cursor-pointer ${
                          logoIcon === item.id ? "bg-indigo-600 border-indigo-700 text-white shadow-xs" : "bg-white hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Templates */}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Mock Packaging Style</label>
                  <div className="space-y-2">
                    {packagingTemplates.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`w-full text-left p-3 border rounded-xl flex justify-between items-start transition-all cursor-pointer ${
                          selectedTemplate === t.id ? "bg-white border-indigo-600 ring-2 ring-indigo-500/10" : "bg-white hover:bg-slate-100"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-800 block">{t.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block">{t.material}</span>
                        </div>
                        <span className="text-[11px] font-mono font-black text-slate-600">${t.baseCost}/unit</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Label Blueprint Preview (7 Columns) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-50 border rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    👁️ Interactive Packaging Preview & Print Sheet
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Simulated high-contrast package label printing draft. Fully responsive rendering.
                  </p>
                </div>

                {/* Print button */}
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Labels
                </button>
              </div>

              {/* Box Preview container */}
              <div className="p-6 bg-white border shadow-sm rounded-xl max-w-md mx-auto space-y-6 relative border-t-8" style={{ borderTopColor: primaryColor }}>
                
                {/* Brand Seal */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-14 w-14 rounded-full border-2 flex items-center justify-center font-bold text-lg" style={{ borderColor: secondaryColor, color: primaryColor, backgroundColor: primaryColor + "0a" }}>
                    {logoIcon === "leaf" && "🌿"}
                    {logoIcon === "sprout" && "🌱"}
                    {logoIcon === "sun" && "☀️"}
                    {logoIcon === "droplet" && "💧"}
                    {logoIcon === "flower" && "🌸"}
                  </div>

                  <div className="space-y-0.5">
                    <h2 className="text-xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
                      {farmName}
                    </h2>
                    <p className="text-xs italic font-bold text-slate-500">
                      &ldquo;{tagline}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Label Middle Body */}
                <div className="p-3 bg-slate-50 border rounded-lg text-center space-y-2 text-xs">
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block">Product Certification Seals</span>
                  <div className="flex justify-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-[8.5px] rounded">100% ORGANIC NPOP</span>
                    <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 font-black text-[8.5px] rounded">FAIR TRADE VETTED</span>
                    <span className="px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-800 font-black text-[8.5px] rounded">NON-GMO SEED</span>
                  </div>
                </div>

                {/* Packaging spec details */}
                <div className="grid grid-cols-2 gap-3 text-xs border-y py-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Material Tech</span>
                    <span className="font-bold text-slate-700">
                      {packagingTemplates.find(t => t.id === selectedTemplate)?.material}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Env Benefit</span>
                    <span className="font-bold text-emerald-600">
                      {packagingTemplates.find(t => t.id === selectedTemplate)?.environmentalBenefit}
                    </span>
                  </div>
                </div>

                {/* Bottom row: QR trace and bar-code */}
                <div className="flex justify-between items-center pt-2">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase block">Scan to Trace Origin</span>
                    <div className="p-1 border rounded bg-white shrink-0">
                      <QrCode className="h-10 w-10 text-slate-800" />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] font-black text-slate-400 uppercase block">Sovereign Ledger ID</span>
                    <span className="font-mono text-[10px] font-black text-slate-800 block">BATCH-2026-NPOP-B3</span>
                    <span className="text-[9px] text-slate-400 block font-semibold">Grown in Andhra Pradesh Loam</span>
                  </div>
                </div>

                {/* Product Photo tip inline box */}
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-[10.5px] leading-relaxed text-indigo-900 font-semibold flex gap-2">
                  <Camera className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Photography Tip:</strong> Place this package on a raw wooden table under soft lateral morning sunlight (golden hour). Introduce dry wheat stalks in the background to emphasize rustic, pesticide-free origin.
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. BUYER PERSONAS & TARGET MARKET ANALYSIS */}
      {activeTab === "personas" && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-5 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-2xl border border-indigo-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-indigo-300 tracking-wider">AI Customer Alignment Engine</span>
              <h4 className="text-sm font-black text-slate-100">Market Persona Identification & Price Elasticity</h4>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                Unlock high-margin retail channels by adapting your packaging descriptions and certificates to specific high-value buyer groups.
              </p>
            </div>
            <div className="bg-indigo-950/40 border border-indigo-700/50 p-3 rounded-xl text-center font-bold text-xs shrink-0">
              <span className="text-indigo-400 text-[9px] uppercase tracking-wider block">Est. Market Size Increase</span>
              <span className="text-lg text-emerald-400 font-black">+45% Premium Pool</span>
            </div>
          </div>

          {/* Personas Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {buyerPersonas.map(p => (
              <div key={p.id} className="p-5 bg-white border rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 rounded-full border bg-slate-100 object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-800 leading-tight">{p.name}</h4>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wide">{p.title}</span>
                    </div>
                  </div>

                  <span className="text-[10.5px] font-bold text-slate-400 block font-mono">
                    👥 {p.demographics}
                  </span>

                  {/* Buying behaviors */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Key Purchasing Behaviors:</span>
                    <ul className="space-y-1">
                      {p.behaviors.map((b, i) => (
                        <li key={i} className="text-[11px] text-slate-600 font-medium leading-snug flex items-start gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pain points */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Pain Points:</span>
                    <ul className="space-y-1">
                      {p.painPoints.map((bp, i) => (
                        <li key={i} className="text-[11px] text-slate-600 font-medium leading-snug flex items-start gap-1.5">
                          <span className="text-rose-500 shrink-0 mt-0.5 font-bold">✕</span>
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2">
                  <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[10.5px] font-semibold text-indigo-900 leading-snug">
                    <strong>AI Sourcing Pitch:</strong> {p.strategy}
                  </div>
                  <div className="text-right">
                    <span className="text-[9.5px] font-black text-emerald-600 uppercase tracking-wider font-mono">{p.premiumMatch}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Recharts Analytics Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                📈 Certified Premium Pricing Margin Analysis
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                Wholesale bulk rates compared to retail sales under registered NPOP organic logo badges. Highlighting dynamic margin improvements.
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={premiumPricingData}>
                    <XAxis dataKey="crop" tick={{ fill: "#64748b", fontSize: 9, fontWeight: "bold" }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                    <Bar name="Standard Bulk Wholesale ($)" dataKey="Wholesale" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar name="Certified Organic Retail ($)" dataKey="CertifiedOrganicRetail" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                🌾 Consumer Organic Product Interest Index
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                Survey indicators showing premium pricing willingness-to-pay and corresponding growth trends across primary crop groups.
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demandData} layout="vertical">
                    <XAxis type="number" tick={{ fill: "#64748b", fontSize: 9 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#64748b", fontSize: 9, fontWeight: "bold" }} width={120} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                    <Bar name="Premium Interest (%)" dataKey="PremiumDemand" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                    <Bar name="Market Growth YoY (%)" dataKey="OrganicMarketGrowth" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. PRODUCT STORYTELLING NARRATOR */}
      {activeTab === "storytelling" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Interactive Form (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
                Farm-to-Table Narrative Engine
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                Input your crop specifics and soil stewardship history to draft a highly premium product story suitable for the back label.
              </p>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Target Crop / Product</label>
                  <input
                    type="text"
                    value={cropForStory}
                    onChange={(e) => setCropForStory(e.target.value)}
                    className="w-full bg-white border text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
                    placeholder="e.g. Saffron-Infused Honey"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Farm Heritage & Context</label>
                  <input
                    type="text"
                    value={farmHeritage}
                    onChange={(e) => setFarmHeritage(e.target.value)}
                    className="w-full bg-white border text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
                    placeholder="e.g. Hillside family cooperative operating since 1984"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Soil/Growing Secret</label>
                  <textarea
                    value={soilSecret}
                    onChange={(e) => setSoilSecret(e.target.value)}
                    rows={3}
                    className="w-full bg-white border text-xs font-semibold text-slate-700 px-3 py-2 rounded-xl focus:outline-none resize-none"
                    placeholder="e.g. Fed with cold-pressed neem cakes, cow compost, and rainwater drip"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateStory}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="h-4 w-4" /> Synthesize Premium Story
                </button>
              </div>
            </div>
          </div>

          {/* Generated Narrative Output (7 Columns) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white border rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                📄 Synthesized Narrative Draft
              </h4>

              {generatedStory ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-gradient-to-br from-indigo-50/40 to-slate-50/50 border border-indigo-150 rounded-2xl relative">
                    <span className="text-[8px] font-black uppercase tracking-wider text-indigo-500 bg-white border px-2 py-0.5 rounded absolute -top-2.5 left-4">
                      Brand Narrative (label draft)
                    </span>
                    <p className="text-slate-700 text-sm italic font-medium leading-relaxed font-serif pt-1">
                      &ldquo;{generatedStory}&rdquo;
                    </p>
                  </div>

                  {/* Actions row */}
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => handleCopy(generatedStory, "story")}
                      className="px-3 py-2 border hover:bg-slate-50 text-slate-700 text-xs font-black rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      {copiedText === "story" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied Story
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-500" /> Copy to Clipboard
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleGenerateStory()}
                      className="px-3 py-2 border hover:bg-slate-50 text-slate-700 text-xs font-black rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-slate-400" /> Draft Alternative
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 font-semibold text-xs bg-slate-50 border rounded-2xl border-dashed">
                  <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  No narrative drafted yet. Fill in your farm secret parameters and click &quot;Synthesize&quot; to begin!
                </div>
              )}

              {/* Printing & export advice */}
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-[11px] leading-relaxed text-amber-900 font-semibold space-y-1">
                <span className="block font-black text-amber-950">🏷️ Packaging Integration Advice:</span>
                <p>
                  For maximum organic appeal, place this story on a rustic kraft-textured label. Pair it with a clean minimalist font like &quot;Inter&quot; for high readability, alongside an NPOP certification badge at the lower margin.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 4. SOCIAL MEDIA CONTENT GENERATOR */}
      {activeTab === "social" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Form Side (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Instagram className="h-4 w-4 text-indigo-600" />
                Social Media Campaign Generator
              </h4>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                Generate highly engaging, informative post captions for Instagram, Facebook, or LinkedIn targeting conscious consumer pools.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Crop / Harvest Feature</label>
                  <input
                    type="text"
                    value={socialCrop}
                    onChange={(e) => setSocialCrop(e.target.value)}
                    className="w-full bg-white border text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
                    placeholder="e.g. Raw Forest Honey"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Campaign Vibe / Tone</label>
                  <select
                    value={socialTone}
                    onChange={(e) => setSocialTone(e.target.value)}
                    className="w-full bg-white border text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
                  >
                    <option value="Inspiring & Educational">Inspiring & Educational (Carbon Offsets & Health)</option>
                    <option value="Rustic & Cozy Storytelling">Rustic & Cozy Storytelling (Autumn Golden Hour)</option>
                    <option value="Scientific Purity Proof">Scientific Purity Proof (Pesticide Testing & Lab Integrity)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateSocial}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1 shadow-xs"
                >
                  Create Social Caption
                </button>
              </div>
            </div>
          </div>

          {/* Simulated Preview Box (7 Columns) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-50 border rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                📱 Simulated Instagram Post Mockup
              </h4>

              {generatedPost ? (
                <div className="bg-white border rounded-2xl shadow-xs overflow-hidden max-w-sm mx-auto animate-fadeIn">
                  
                  {/* Inst Head */}
                  <div className="p-3 border-b flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 p-0.5">
                      <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs">
                        🌾
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] font-black text-slate-800 block">@vedic_green_acres</span>
                      <span className="text-[9px] text-slate-400 font-bold block">Andhra Pradesh Foothills Organic Sourcing</span>
                    </div>
                  </div>

                  {/* Simulated Image */}
                  <div className="h-60 bg-slate-100 flex flex-col items-center justify-center relative">
                    <img
                      src="https://picsum.photos/seed/organicfarm/400/400"
                      alt="Organic Farm Mock"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">
                      100% Pesticide Free
                    </div>
                  </div>

                  {/* Inst Interactions */}
                  <div className="p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <div className="flex gap-3">
                        <Heart className="h-5 w-5 text-rose-500 fill-rose-500 cursor-pointer" />
                        <MessageSquare className="h-5 w-5 cursor-pointer" />
                        <Share2 className="h-5 w-5 cursor-pointer" />
                      </div>
                      <Bookmark className="h-5 w-5 cursor-pointer" />
                    </div>

                    <div className="font-bold text-[11px]">
                      Liked by <strong>chef_marcus</strong> and <strong>148 others</strong>
                    </div>

                    <p className="text-[11.5px] text-slate-700 leading-relaxed font-semibold">
                      <strong>vedic_green_acres</strong> {generatedPost}
                    </p>

                    <div className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                      #organicfarming #pesticidefree #vedicagriculture #sustainableearth
                    </div>
                  </div>

                  {/* Action */}
                  <div className="p-3 border-t bg-slate-50 text-center">
                    <button
                      onClick={() => handleCopy(generatedPost, "social-copy")}
                      className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center justify-center gap-1 mx-auto"
                    >
                      {copiedText === "social-copy" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" /> Caption Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Caption for App Posting
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 font-semibold text-xs bg-white border rounded-2xl border-dashed max-w-sm mx-auto">
                  <Instagram className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  Provide campaign criteria on the left to see your simulated Instagram post!
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* 5. CUSTOMER REVIEW MANAGEMENT & RESPONSE AGENT */}
      {activeTab === "reviews" && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-5 bg-slate-50 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-indigo-600" />
                Pesticide-Free Customer Loyalty & Review Panel
              </h4>
              <p className="text-xs text-slate-500 font-semibold">
                Build long-term customer relationships. Approve pre-drafted AI answers to reviews left by urban organic buyers.
              </p>
            </div>

            {/* Loyalty indicator */}
            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center font-bold text-xs shrink-0">
              <span className="text-emerald-700 text-[9px] uppercase tracking-wider block">Active Loyalty Members</span>
              <span className="text-lg text-emerald-800 font-black">284 Subscribers</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Reviews List & Approval (7 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                🌟 Pending Buyer Reviews ({reviews.filter(r => r.status === "Unanswered").length})
              </h4>

              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="p-5 bg-white border rounded-2xl shadow-xs space-y-3.5">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{r.customerName}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block">{r.productBought} • {r.date}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <span key={i} className="text-sm">★</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11.5px] text-slate-600 italic font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      &ldquo;{r.reviewText}&rdquo;
                    </p>

                    {/* AI draft approval box */}
                    {r.status === "Unanswered" ? (
                      <div className="p-4 bg-indigo-50/50 border border-indigo-150 rounded-xl space-y-3">
                        <div className="flex justify-between items-center text-[9px] font-black text-indigo-500 uppercase tracking-wider">
                          <span>🤖 AI Draft Reply Response</span>
                          <span className="text-[8px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">High Engagement Vibe</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                          {r.aiSuggestedReply}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveReply(r.id)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10.5px] font-black rounded-lg cursor-pointer transition-colors"
                          >
                            Approve & Publish Response
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider block">✓ Published Response:</span>
                        <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                          {r.actualReply}
                        </p>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

            {/* Loyalty tier system (5 Columns) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white border rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                  <Gift className="h-4 w-4 text-emerald-600 animate-pulse" />
                  Farm-to-Shelf Loyalty Tier Rules
                </h4>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  Establish purchase reward tiers to incentivize urban bulk families to maintain multi-season crop subscriptions.
                </p>

                <div className="space-y-3">
                  {loyaltyTiers.map((tier, index) => (
                    <div key={index} className="p-3.5 bg-slate-50 border rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-800 block">🏅 {tier.name}</span>
                        <span className="text-[9.5px] font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{tier.points}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                        {tier.benefit}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Loyalty action button */}
                <button
                  onClick={() => alert("Loyalty Campaign Notification successfully dispatched to all 284 registered retail buyers via SMS & Email!")}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="h-3.5 w-3.5" /> Dispatch Points Bonus Update
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 6. EXPORT BRANDING & INTERNATIONAL LABELS */}
      {activeTab === "export" && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Global Sourcing compliance</span>
              <h4 className="text-sm font-black text-slate-100">Export Branding & International Labeling Handbook</h4>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                Ensure compliance with USDA Organic, EU Eco-Regulation, and Japanese JAS standards before printing batch crates.
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/50 p-3 rounded-xl text-center font-mono text-xs shrink-0">
              <span className="text-slate-400 text-[8.5px] uppercase tracking-wider block">Target Export Countries</span>
              <span className="text-emerald-400 font-black">EU, US, Middle East</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="p-5 bg-white border rounded-2xl space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇺🇸</span>
                <h4 className="text-xs font-black text-slate-800 uppercase">USDA Organic Seal Regulations</h4>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-600 font-semibold leading-relaxed list-disc pl-4">
                <li>Must declare the name of the certifying agent (e.g., OneCert) immediately below the farm distributor address.</li>
                <li>Pesticide residue testing logs must be submitted within 72 hours of international harbor landing.</li>
                <li>Must print USDA Organic Logo without color edits (pure green/brown or black/white).</li>
              </ul>
            </div>

            <div className="p-5 bg-white border rounded-2xl space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇪🇺</span>
                <h4 className="text-xs font-black text-slate-800 uppercase">EU Eco-Leaf Compliance</h4>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-600 font-semibold leading-relaxed list-disc pl-4">
                <li>Code number of the certification body must appear on the same visual pane as the Eco-Leaf (e.g. IN-BIO-149).</li>
                <li>Complete breakdown of raw agricultural raw materials (including &quot;EU Agriculture&quot; or &quot;Non-EU Agriculture&quot;) is mandatory.</li>
                <li>Wood-box packaging pallets must carry the ISPM-15 heat-treatment stamp.</li>
              </ul>
            </div>

            <div className="p-5 bg-white border rounded-2xl space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇯🇵</span>
                <h4 className="text-xs font-black text-slate-800 uppercase">Japanese JAS Organic Law</h4>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-600 font-semibold leading-relaxed list-disc pl-4">
                <li>Requires the registered circular JAS organic seal printed directly on the main retail label.</li>
                <li>GMO testing is mandatory for all soy, maize, and potato cultivars.</li>
                <li>Trace-back document numbering should link back directly to local land surveyor maps.</li>
              </ul>
            </div>

          </div>

          {/* Video marketing tips wrapper box */}
          <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Video className="h-4 w-4 text-indigo-600" />
              🎥 Premium Video Marketing Guide for Social Exports
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold leading-relaxed">
              <div className="bg-white p-4 border rounded-xl space-y-2">
                <span className="text-indigo-600 font-black uppercase text-[9.5px] block">Script Template A: &quot;Behind the Harvest&quot; (60s)</span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  <strong>0s-15s:</strong> Close up of dry autumn leaves, then transition to a healthy worm digging in dark organic humus. &quot;This isn't dirt. This is a living home.&quot;<br />
                  <strong>15s-40s:</strong> Showcase hand weeding alongside marigolds. &quot;We spend 3x more time weeding so you never have to eat glyphosates.&quot;<br />
                  <strong>40s-60s:</strong> Premium wood packaging reveal with custom farm stamp. &quot;Direct farm trace to your family. Clean food, honest stewardship.&quot;
                </p>
              </div>

              <div className="bg-white p-4 border rounded-xl space-y-2">
                <span className="text-indigo-600 font-black uppercase text-[9.5px] block">Short-Form Video Photography Guidelines</span>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  <strong>framing:</strong> Shoot in vertical 9:16 aspect ratio. Keep subjects centered. Utilize generous negative space.<br />
                  <strong>Aesthetic:</strong> Enable grid lines on your phone camera. Tap to focus on the dew droplets on the crop leaf to enhance natural biological texture. Use warm, cozy background instrumental music.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

// --- BOOKMARKED ICON HELPER ---
function BookMarkedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  );
}
