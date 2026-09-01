import React, { useState, useEffect, useMemo } from "react";
import {
  Coins,
  Scale,
  DollarSign,
  TrendingUp,
  Clock,
  ShieldCheck,
  FileText,
  Camera,
  Percent,
  Truck,
  Globe,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Upload,
  User,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Info,
  Sliders,
  Maximize2,
  Calendar,
  Layers,
  Award,
  ChevronDown,
  Lock,
  Flame,
  Snowflake,
  ShieldAlert,
  ThumbsUp
} from "lucide-react";

// Interfaces
export interface CropListing {
  id: string;
  cropName: string;
  farmerName: string;
  quantity: number; // in Tons
  qualityGrade: "Grade A" | "Grade B" | "Grade C" | "Pending";
  pricePerTon: number;
  harvestDate: string;
  location: string;
  sellingType: "Direct" | "Dutch Auction" | "Contract Farming";
  status: "Available" | "Sold" | "Active Auction" | "Signed Contract";
  exportReadiness: number; // percentage
  packagingRecommendation: string;
  coldChainRequired: boolean;
  dutchAuctionData?: {
    initialPrice: number;
    currentPrice: number;
    reservePrice: number;
    timeRemaining: number; // seconds
    priceDropInterval: number; // seconds
    dropAmount: number;
  };
  directNegotiation?: {
    offers: { author: string; role: "Farmer" | "Buyer"; price: number; timestamp: string; status: "Accepted" | "Rejected" | "Pending" }[];
  };
  contractSpecs?: {
    buyerName: string;
    preHarvestGuarantee: number;
    deliveryMilestone: string;
    terms: string;
  };
}

interface CropSellingMarketplaceProps {
  currentRole?: "Farmer" | "Buyer";
}

export const CropSellingMarketplace: React.FC<CropSellingMarketplaceProps> = ({
  currentRole = "Farmer"
}) => {
  // Toggle between viewing as Farmer or Buyer to fully demonstrate the system.
  const [activeRoleMode, setActiveRoleMode] = useState<"Farmer" | "Buyer">(currentRole);

  // Sync role mode when props update
  useEffect(() => {
    setActiveRoleMode(currentRole);
  }, [currentRole]);

  // Initial Seed Data
  const [listings, setListings] = useState<CropListing[]>([
    {
      id: "crop-1",
      cropName: "Premium Basmati Rice Lot 12",
      farmerName: "Amir Patel",
      quantity: 18,
      qualityGrade: "Grade A",
      pricePerTon: 640,
      harvestDate: "2026-06-20",
      location: "Gurdaspur Sector 4",
      sellingType: "Direct",
      status: "Available",
      exportReadiness: 96,
      packagingRecommendation: "Hermetic High-Density Polypropylene (HDPE) bags (50kg bag specifications)",
      coldChainRequired: false,
      directNegotiation: {
        offers: [
          { author: "Global Agrifood Corp", role: "Buyer", price: 610, timestamp: "2026-06-27 14:30", status: "Rejected" },
          { author: "Amir Patel", role: "Farmer", price: 640, timestamp: "2026-06-27 16:15", status: "Pending" }
        ]
      }
    },
    {
      id: "crop-2",
      cropName: "Organically Grown Vine-Ripened Tomato Lot 4",
      farmerName: "Eswar Reddy",
      quantity: 8,
      qualityGrade: "Grade A",
      pricePerTon: 1050,
      harvestDate: "2026-06-25",
      location: "Amritsar North Block",
      sellingType: "Dutch Auction",
      status: "Active Auction",
      exportReadiness: 84,
      packagingRecommendation: "Corrugated ventilated moisture-resistant fiberboard crates (20kg capacity)",
      coldChainRequired: true,
      dutchAuctionData: {
        initialPrice: 1200,
        currentPrice: 1050,
        reservePrice: 800,
        timeRemaining: 120, // countdown starts from 120s
        priceDropInterval: 15, // drops every 15s
        dropAmount: 30
      }
    },
    {
      id: "crop-3",
      cropName: "Yellow Dent Maize Lot 8",
      farmerName: "Rajinder Singh",
      quantity: 35,
      qualityGrade: "Grade B",
      pricePerTon: 310,
      harvestDate: "2026-06-15",
      location: "Ludhiana South Field",
      sellingType: "Contract Farming",
      status: "Signed Contract",
      exportReadiness: 90,
      packagingRecommendation: "Breathable heavy-duty jute burlap sacks with moisture-barrier liner",
      coldChainRequired: false,
      contractSpecs: {
        buyerName: "Indus Milling Group",
        preHarvestGuarantee: 295,
        deliveryMilestone: "2026-08-10",
        terms: "Buyer pays 30% advanced escrow, 70% on terminal grain humidity verification under 13.5%."
      }
    },
    {
      id: "crop-4",
      cropName: "Golden Honey Mangoes (Alphonso)",
      farmerName: "Amir Patel",
      quantity: 4,
      qualityGrade: "Grade A",
      pricePerTon: 1800,
      harvestDate: "2026-06-27",
      location: "Gurdaspur Block C",
      sellingType: "Direct",
      status: "Available",
      exportReadiness: 92,
      packagingRecommendation: "Ventilated cardboard trays with cellular fruit partition wraps",
      coldChainRequired: true,
      directNegotiation: {
        offers: []
      }
    }
  ]);

  // Selected crop ID for active details
  const [selectedListingId, setSelectedListingId] = useState<string>("crop-1");

  // Selected crop computed properties
  const selectedCrop = useMemo(() => {
    return listings.find((l) => l.id === selectedListingId) || listings[0];
  }, [listings, selectedListingId]);

  // --- ESCROW TRANSACTION SIMULATOR STATES ---
  const [escrowStatus, setEscrowStatus] = useState<{
    contractId: string;
    amount: number;
    status: "Idle" | "Funds Locked" | "Quality Certified" | "Dispatched" | "Funds Released";
    shipperName: string;
  }>({
    contractId: "ESC-823901",
    amount: 11520,
    status: "Funds Locked",
    shipperName: "Punjab Logistics Reefer Corp"
  });

  // --- Dutch Auction Timer Simulator ---
  useEffect(() => {
    const timer = setInterval(() => {
      setListings((prevListings) => {
        return prevListings.map((listing) => {
          if (listing.sellingType === "Dutch Auction" && listing.status === "Active Auction" && listing.dutchAuctionData) {
            const data = listing.dutchAuctionData;
            let nextTime = data.timeRemaining - 1;
            let nextPrice = data.currentPrice;

            if (nextTime <= 0) {
              // Timer reset and price drops
              nextTime = 120; // reset
              const droppedPrice = data.currentPrice - data.dropAmount;
              nextPrice = droppedPrice >= data.reservePrice ? droppedPrice : data.reservePrice;
            }

            return {
              ...listing,
              dutchAuctionData: {
                ...data,
                timeRemaining: nextTime,
                currentPrice: nextPrice
              }
            };
          }
          return listing;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- NEW LISTING UPLOAD FORM STATES (FARMER) ---
  const [newCropName, setNewCropName] = useState("Premium Sona Masuri Rice");
  const [newQty, setNewQty] = useState(12);
  const [newPrice, setNewPrice] = useState(580);
  const [newGrade, setNewGrade] = useState<"Grade A" | "Grade B" | "Grade C" | "Pending">("Pending");
  const [newSellingType, setNewSellingType] = useState<"Direct" | "Dutch Auction" | "Contract Farming">("Direct");
  const [newLocation, setNewLocation] = useState("Ludhiana West Sector");
  const [newHarvestDate, setNewHarvestDate] = useState("2026-07-05");
  const [newColdChain, setNewColdChain] = useState(false);

  // Dutch auction specific input states
  const [newReservePrice, setNewReservePrice] = useState(480);
  const [newDropInterval, setNewDropInterval] = useState(15);
  const [newDropAmt, setNewDropAmt] = useState(25);

  // Contract specs inputs
  const [newContractTerms, setNewContractTerms] = useState("Requires 20% advance payout.");

  // For Quality Grading simulator
  const [uploadedImageName, setUploadedImageName] = useState<string>("");
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradedResult, setGradedResult] = useState<{
    grade: "Grade A" | "Grade B" | "Grade C";
    readiness: number;
    defectRatio: string;
    packaging: string;
  } | null>(null);

  // Submit Listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `crop-${Date.now()}`;
    const item: CropListing = {
      id,
      cropName: newCropName,
      farmerName: "Amir Patel",
      quantity: newQty,
      qualityGrade: gradedResult ? gradedResult.grade : newGrade,
      pricePerTon: newPrice,
      harvestDate: newHarvestDate,
      location: newLocation,
      sellingType: newSellingType,
      status: newSellingType === "Dutch Auction" ? "Active Auction" : "Available",
      exportReadiness: gradedResult ? gradedResult.readiness : 88,
      packagingRecommendation: gradedResult ? gradedResult.packaging : "Standard breathable poly-ventilated heavy bags",
      coldChainRequired: newColdChain,
      ...(newSellingType === "Dutch Auction" ? {
        dutchAuctionData: {
          initialPrice: newPrice,
          currentPrice: newPrice,
          reservePrice: newReservePrice,
          timeRemaining: 120,
          priceDropInterval: newDropInterval,
          dropAmount: newDropAmt
        }
      } : {}),
      ...(newSellingType === "Direct" ? {
        directNegotiation: { offers: [] }
      } : {}),
      ...(newSellingType === "Contract Farming" ? {
        contractSpecs: {
          buyerName: "Pre-Contract Pool",
          preHarvestGuarantee: newPrice,
          deliveryMilestone: newHarvestDate,
          terms: newContractTerms
        }
      } : {})
    };

    setListings((prev) => [item, ...prev]);
    setSelectedListingId(id);
    setGradedResult(null);
    setUploadedImageName("");
    alert(`✓ Crop Listing for "${newCropName}" successfully published to regional buyer channels!`);
  };

  // Negotiation Offers handling
  const [counterPrice, setCounterPrice] = useState<number>(620);
  const handleNegotiate = () => {
    const author = activeRoleMode === "Farmer" ? "Amir Patel" : "Global Agrifood Corp (Procurement)";
    const role = activeRoleMode === "Farmer" ? "Farmer" : "Buyer";
    const timestamp = new Date().toLocaleTimeString();

    const updatedOffers = [
      ...(selectedCrop.directNegotiation?.offers || []),
      { author, role, price: counterPrice, timestamp, status: "Pending" as const }
    ];

    setListings((prev) =>
      prev.map((l) =>
        l.id === selectedListingId
          ? {
              ...l,
              directNegotiation: { offers: updatedOffers }
            }
          : l
      )
    );
  };

  const handleUpdateOfferStatus = (offerIndex: number, newStatus: "Accepted" | "Rejected") => {
    const origOffers = selectedCrop.directNegotiation?.offers || [];
    const updated = origOffers.map((o, idx) => {
      if (idx === offerIndex) {
        return { ...o, status: newStatus };
      }
      return o;
    });

    setListings((prev) =>
      prev.map((l) => {
        if (l.id === selectedListingId) {
          return {
            ...l,
            pricePerTon: newStatus === "Accepted" ? origOffers[offerIndex].price : l.pricePerTon,
            status: newStatus === "Accepted" ? "Sold" as const : l.status,
            directNegotiation: { offers: updated }
          };
        }
        return l;
      })
    );

    if (newStatus === "Accepted") {
      setEscrowStatus({
        contractId: `ESC-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: origOffers[offerIndex].price * selectedCrop.quantity,
        status: "Funds Locked",
        shipperName: selectedCrop.coldChainRequired ? "Punjab Logistics Reefer Corp" : "Standard Ambient Truck Dispatch"
      });
      alert(`✓ Negotiation contract settled! Escrow funds locked at $${origOffers[offerIndex].price * selectedCrop.quantity}. ready for logistics planning.`);
    }
  };

  // Buy Dutch Auction listing
  const handleBuyDutchNow = () => {
    const finalPrice = selectedCrop.dutchAuctionData?.currentPrice || selectedCrop.pricePerTon;
    const finalTotal = finalPrice * selectedCrop.quantity;

    setListings((prev) =>
      prev.map((l) =>
        l.id === selectedListingId
          ? { ...l, status: "Sold" as const, pricePerTon: finalPrice }
          : l
      )
    );

    setEscrowStatus({
      contractId: `ESC-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: finalTotal,
      status: "Funds Locked",
      shipperName: selectedCrop.coldChainRequired ? "Punjab Logistics Reefer Corp" : "Standard Ambient Truck Dispatch"
    });

    alert(`✓ SUCCESS! You purchased ${selectedCrop.quantity} Tons of "${selectedCrop.cropName}" at the current Dutch drop rate of $${finalPrice}/Ton! Grand Total escrow lock: $${finalTotal.toFixed(2)}.`);
  };

  // Quality grading vision analysis trigger
  const triggerImageScan = (mockType: "tomato" | "grain" | "corn") => {
    setIsGrading(true);
    setUploadedImageName(mockType === "tomato" ? "tomato_scan_rgb.png" : mockType === "corn" ? "maize_kernel_inspection.jpg" : "wheat_grading_iso.png");
    
    setTimeout(() => {
      setIsGrading(false);
      if (mockType === "tomato") {
        setGradedResult({
          grade: "Grade A",
          readiness: 94,
          defectRatio: "0.8% blemish index",
          packaging: "High airflow ventilated pulp containers in standard crates"
        });
      } else if (mockType === "corn") {
        setGradedResult({
          grade: "Grade B",
          readiness: 88,
          defectRatio: "2.4% cracked kernel ratio",
          packaging: "Double-walled jute poly-lined dry weight sacks"
        });
      } else {
        setGradedResult({
          grade: "Grade A",
          readiness: 97,
          defectRatio: "0.2% moisture foreign debris content",
          packaging: "Hermetic seal grain bulk protective bags"
        });
      }
    }, 1500);
  };

  // --- DISCOUNTS & LOGISTICS ESTIMATORS ---
  const [deliveryDistance, setDeliveryDistance] = useState<number>(35); // in km
  const [coldTransportSelection, setColdTransportSelection] = useState<boolean>(selectedCrop.coldChainRequired);

  // Sync cold transport selection when selection changes
  useEffect(() => {
    setColdTransportSelection(selectedCrop.coldChainRequired);
  }, [selectedListingId]);

  // Bulk Discount Math
  const calculatedBulkDiscount = useMemo(() => {
    const qty = selectedCrop.quantity;
    if (qty >= 40) return { percent: 18, label: "Super Bulk Discount (18% Off)" };
    if (qty >= 15) return { percent: 8, label: "Wholesale Tier (8% Off)" };
    return { percent: 0, label: "Standard pricing" };
  }, [selectedCrop.quantity]);

  // Logistics cost math
  const logisticsEstimate = useMemo(() => {
    const baseRatePerKm = 1.25;
    const distanceCost = deliveryDistance * baseRatePerKm;
    
    // Cold chain premium (reefer fuel & digital temp monitors)
    const refrigerationPremium = coldTransportSelection ? 150.0 + (deliveryDistance * 0.45) : 0;
    
    // Bulk handling weight charge
    const weightPremium = selectedCrop.quantity * 8.5;

    const subtotal = distanceCost + refrigerationPremium + weightPremium;
    return {
      distanceCost,
      refrigerationPremium,
      weightPremium,
      total: subtotal
    };
  }, [deliveryDistance, coldTransportSelection, selectedCrop.quantity]);

  // Buyer Credit score database representing corporate entities
  const buyersCreditDatabase = [
    { name: "Global Agrifood Corp", score: 810, risk: "Excellent", verifiedStatus: "Govt Cleared Sovereign Buyer" },
    { name: "Indus Milling Group", score: 765, risk: "Low Risk", verifiedStatus: "Cooperative Certified Dealer" },
    { name: "Himalayan Organic Sourcing", score: 690, risk: "Moderate", verifiedStatus: "Affiliated Merchant" }
  ];

  const matchedBuyerCredit = useMemo(() => {
    const currentBuyer = selectedCrop.contractSpecs?.buyerName || "Global Agrifood Corp";
    return buyersCreditDatabase.find((b) => b.name.toLowerCase().includes(currentBuyer.toLowerCase().split(" ")[0])) || buyersCreditDatabase[0];
  }, [selectedCrop]);

  return (
    <div id="crop-selling-marketplace" className="space-y-6">

      {/* Role Demonstration Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-teal-400 animate-pulse" />
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-widest">Crop Selling & Sovereign Trade Hub</h3>
            <p className="text-slate-400 text-[10px] font-medium">Bilateral auction rooms, smart contract escrow protection, and AI image computer-vision grading.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-[9px] font-bold text-slate-400 px-2 uppercase">Switch Mode:</span>
          <button
            type="button"
            onClick={() => setActiveRoleMode("Farmer")}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeRoleMode === "Farmer"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Farmer Seller
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleMode("Buyer")}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeRoleMode === "Buyer"
                ? "bg-teal-600 text-white shadow-md"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Corporate Buyer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: UPLOAD / SEED GRADED INPUTS (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* AI Crop Grading computer vision */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[9px] uppercase font-black text-emerald-700 tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Computer-Vision Grader
              </span>
              <h4 className="text-xs font-black text-slate-900 mt-0.5">Instant AI Quality Certifier</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Simulate image upload to run RGB blemish, diameter, and moisture evaluation.</p>
            </div>

            {/* Simulated file upload options */}
            <div className="space-y-3">
              <label className="block text-slate-500 text-[10px] font-bold uppercase">Simulate Camera Scanner Snap</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => triggerImageScan("tomato")}
                  className="p-2 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10 rounded-xl transition-all text-center cursor-pointer"
                >
                  <Camera className="h-4.5 w-4.5 text-slate-400 mx-auto mb-1" />
                  <span className="block text-[9px] font-black text-slate-700">Scan Tomatoes</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerImageScan("grain")}
                  className="p-2 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10 rounded-xl transition-all text-center cursor-pointer"
                >
                  <Camera className="h-4.5 w-4.5 text-slate-400 mx-auto mb-1" />
                  <span className="block text-[9px] font-black text-slate-700">Scan Wheat</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerImageScan("corn")}
                  className="p-2 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10 rounded-xl transition-all text-center cursor-pointer"
                >
                  <Camera className="h-4.5 w-4.5 text-slate-400 mx-auto mb-1" />
                  <span className="block text-[9px] font-black text-slate-700">Scan Maize</span>
                </button>
              </div>

              {uploadedImageName && (
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between text-[10px]">
                  <span className="text-slate-600 font-bold flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    {uploadedImageName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImageName("");
                      setGradedResult(null);
                    }}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Clear
                  </button>
                </div>
              )}

              {isGrading && (
                <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50/30 border border-emerald-100 rounded-lg text-[10px] text-emerald-800 font-bold">
                  <div className="h-3.5 w-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  Running Neural RGB Pixel Analysis...
                </div>
              )}

              {/* Grading Results Readout */}
              {gradedResult && (
                <div className="bg-emerald-50/40 border border-emerald-200/50 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-emerald-700 text-white font-black px-2 py-0.5 rounded uppercase">
                      Certified: {gradedResult.grade}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold">
                      {gradedResult.readiness}% Export Ready
                    </span>
                  </div>

                  <div className="text-[9px] space-y-1 text-slate-700 font-semibold">
                    <p>
                      <strong className="text-slate-900 font-extrabold">Defect Ratio:</strong> {gradedResult.defectRatio}
                    </p>
                    <p>
                      <strong className="text-slate-900 font-extrabold">Packaging Standard:</strong> {gradedResult.packaging}
                    </p>
                  </div>
                  <div className="bg-white border border-emerald-100 p-2 rounded text-[8px] text-slate-500 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                    Digital Quality stamp signed & hash logged onto ledger.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Crop Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Farmer Trading Terminal</span>
              <h4 className="text-xs font-black text-slate-900 mt-0.5">Upload Harvest Lot for Sale</h4>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Crop Type & Variety</label>
                <select
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Premium Sona Masuri Rice">Premium Sona Masuri Rice</option>
                  <option value="Organically Grown Vine-Ripened Tomato">Organically Grown Vine-Ripened Tomato</option>
                  <option value="Kashmiri Sweet Honey Apples">Kashmiri Sweet Honey Apples</option>
                  <option value="Golden Alphonso Mangoes">Golden Alphonso Mangoes</option>
                  <option value="Yellow Dent Milling Corn">Yellow Dent Milling Corn</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Quantity (Tons)</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Certified Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="Pending">Pending (Use Scan Above)</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Contract Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Direct", "Dutch Auction", "Contract Farming"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewSellingType(type)}
                      className={`py-2 rounded-lg text-[9px] font-bold border transition-colors cursor-pointer text-center ${
                        newSellingType === type
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dutch Auction inputs */}
              {newSellingType === "Dutch Auction" && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider block">Dutch Auction Config</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase">Reserve Price ($)</label>
                      <input
                        type="number"
                        value={newReservePrice}
                        onChange={(e) => setNewReservePrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded p-1 text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase">Price Drop ($)</label>
                      <input
                        type="number"
                        value={newDropAmt}
                        onChange={(e) => setNewDropAmt(parseInt(e.target.value) || 1)}
                        className="w-full bg-white border border-slate-200 rounded p-1 text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contract Farming inputs */}
              {newSellingType === "Contract Farming" && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[9px] font-black text-blue-700 uppercase tracking-wider block">Pre-Harvest Contract Specifications</span>
                  <label className="block text-[8px] font-bold text-slate-500 uppercase">Contract Terms & Conditions</label>
                  <textarea
                    value={newContractTerms}
                    onChange={(e) => setNewContractTerms(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-[10px]"
                    rows={2}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Target Price ($/Ton)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5 cursor-pointer text-[10px] font-bold text-slate-600">
                    <input
                      type="checkbox"
                      checked={newColdChain}
                      onChange={(e) => setNewColdChain(e.target.checked)}
                      className="accent-emerald-600 h-4.5 w-4.5"
                    />
                    Requires Cold Chain
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">Location GPS Block</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                Upload Certified Harvest
              </button>
            </form>
          </div>

        </div>

        {/* MIDDLE COLUMN: CROP LISTINGS MATRIX (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 min-h-[500px]">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Live Trading Exchange</span>
              <h4 className="text-xs font-black text-slate-900 mt-0.5">Bilateral Sovereign Listings</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Select a listed crop lot to engage negotiations, verify quality certifications, or lock auctions.</p>
            </div>

            {/* Listings loop */}
            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
              {listings.map((l) => {
                const isSelected = l.id === selectedListingId;
                return (
                  <div
                    key={l.id}
                    onClick={() => setSelectedListingId(l.id)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer relative space-y-3 hover:shadow-md ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-600/20"
                        : "border-slate-150 bg-white"
                    }`}
                  >
                    {/* Corner Tag */}
                    <span className={`absolute top-2.5 right-2.5 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      l.status === "Available" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      l.status === "Active Auction" ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" :
                      l.status === "Signed Contract" ? "bg-blue-50 text-blue-700 border-blue-100" :
                      "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {l.status}
                    </span>

                    <div className="space-y-1">
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400">
                        {l.sellingType} • {l.location.split(" ")[0]}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 pr-16 leading-snug">{l.cropName}</h5>
                      <span className="text-[9px] text-slate-500 font-semibold block">Farmer: {l.farmerName}</span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-100/60">
                      <div>
                        <span className="text-slate-400 text-[8px] uppercase font-bold block">Volume</span>
                        <span className="text-slate-800 text-xs font-bold">{l.quantity} Tons</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[8px] uppercase font-bold block">Certified Grade</span>
                        <span className="text-emerald-700 text-xs font-extrabold">{l.qualityGrade}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[8px] uppercase font-bold block">Rate / Ton</span>
                        <span className="text-slate-900 text-xs font-black">
                          ${l.sellingType === "Dutch Auction" && l.dutchAuctionData ? l.dutchAuctionData.currentPrice : l.pricePerTon}
                        </span>
                      </div>
                    </div>

                    {/* Dutch Auction specific live counter ribbon */}
                    {l.sellingType === "Dutch Auction" && l.status === "Active Auction" && l.dutchAuctionData && (
                      <div className="bg-amber-50 border border-amber-200/50 rounded-lg p-2 flex items-center justify-between text-[9px] text-amber-800 font-extrabold">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
                          DUTCH PRICE DROP
                        </span>
                        <span>Next drop in {l.dutchAuctionData.timeRemaining}s</span>
                      </div>
                    )}

                    {l.coldChainRequired && (
                      <div className="bg-blue-50/50 border border-blue-100/40 rounded-lg px-2 py-1 flex items-center gap-1 text-[8px] text-blue-700 font-bold">
                        <Snowflake className="h-3 w-3 text-blue-500" />
                        Reefer Cold Chain Container Required
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL WORKSPACE (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Detailed Crop Card & Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Active Workspace Engagement</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                  ID: {selectedCrop.id}
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-1 leading-snug">{selectedCrop.cropName}</h3>
              <div className="flex flex-wrap gap-2 mt-1.5 text-[10px]">
                <span className="bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-bold">
                  {selectedCrop.sellingType}
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  {selectedCrop.qualityGrade} Certified
                </span>
              </div>
            </div>

            {/* Quality & Packing spec sheets */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3">
              <h5 className="text-[9px] uppercase font-black text-slate-500 tracking-wider border-b border-slate-200/40 pb-1.5 flex justify-between items-center">
                <span>Agronomic Quality Certifications</span>
                <span className="text-emerald-700 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Approved
                </span>
              </h5>
              <div className="text-[10px] space-y-2 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-500">Harvest Date:</span>
                  <span className="text-slate-800">{selectedCrop.harvestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location block:</span>
                  <span className="text-slate-800">{selectedCrop.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Export Readiness:</span>
                  <span className={`font-extrabold ${selectedCrop.exportReadiness >= 90 ? "text-emerald-700" : "text-amber-700"}`}>
                    {selectedCrop.exportReadiness}%
                  </span>
                </div>
                <div className="space-y-1 pt-1.5 border-t border-slate-200/40">
                  <span className="text-slate-500 block">Packaging Recommendation:</span>
                  <p className="text-slate-700 text-[9px] italic leading-normal">"{selectedCrop.packagingRecommendation}"</p>
                </div>
              </div>
            </div>

            {/* DYNAMIC BIDDING ROOM / DUTCH INTERACTION / PRE-HARVEST AGREEMENTS ROOM */}
            {selectedCrop.sellingType === "Dutch Auction" && (
              <div className="border border-amber-200 bg-amber-50/10 rounded-xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] uppercase font-black text-amber-800 tracking-wider flex items-center gap-1">
                    <Flame className="h-4 w-4 text-amber-600" />
                    Dutch Auction Room
                  </h5>
                  <span className="text-[9px] font-bold text-amber-700">Reverse Bidding Engine</span>
                </div>

                <div className="grid grid-cols-2 gap-3.5 bg-white border border-amber-100 p-3 rounded-lg text-center">
                  <div>
                    <span className="text-slate-400 text-[8px] uppercase font-bold block">Current Price</span>
                    <p className="text-base font-black text-amber-700">${selectedCrop.dutchAuctionData?.currentPrice || selectedCrop.pricePerTon}</p>
                    <span className="text-[8px] text-slate-400">Drops ${selectedCrop.dutchAuctionData?.dropAmount} / cycle</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] uppercase font-bold block">Time to next drop</span>
                    <p className="text-base font-black text-slate-800">{selectedCrop.dutchAuctionData?.timeRemaining}s</p>
                    <span className="text-[8px] text-slate-400">Limit: ${selectedCrop.dutchAuctionData?.reservePrice} reserve</span>
                  </div>
                </div>

                {selectedCrop.status === "Active Auction" ? (
                  activeRoleMode === "Buyer" ? (
                    <button
                      type="button"
                      onClick={handleBuyDutchNow}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="h-4 w-4" />
                      Buy Now (Lock Escrow at ${selectedCrop.dutchAuctionData?.currentPrice || selectedCrop.pricePerTon}/Ton)
                    </button>
                  ) : (
                    <div className="bg-amber-100/30 border border-amber-200/40 rounded p-2.5 text-[9px] text-amber-900 leading-normal text-center font-bold">
                      Your Reverse Auction is live. Corporate buyers see the price decrease of ${selectedCrop.dutchAuctionData?.dropAmount} every {selectedCrop.dutchAuctionData?.priceDropInterval}s. First buyer to hit "BUY NOW" locks the crop lot.
                    </div>
                  )
                ) : (
                  <div className="bg-slate-100 border border-slate-200 rounded p-3 text-center text-xs font-bold text-slate-500">
                    Auction concluded. Harvest Sold.
                  </div>
                )}
              </div>
            )}

            {/* DIRECT NEGOTIATION VIEW */}
            {selectedCrop.sellingType === "Direct" && (
              <div className="border border-slate-200 rounded-xl p-4 space-y-4">
                <h5 className="text-[10px] uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Coins className="h-4.5 w-4.5 text-emerald-600" />
                  Live Negotiation Board
                </h5>

                {/* Offer lists */}
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {selectedCrop.directNegotiation?.offers.map((offer, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-[9px] font-semibold space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-700">{offer.author} ({offer.role})</span>
                        <span className="text-[8px] text-slate-400">{offer.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-900 font-extrabold text-[10px]">${offer.price} / Ton</span>
                        
                        {offer.status === "Pending" ? (
                          // Actionable buttons if role matches the other party
                          ((activeRoleMode === "Farmer" && offer.role === "Buyer") || 
                           (activeRoleMode === "Buyer" && offer.role === "Farmer")) ? (
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateOfferStatus(idx, "Accepted")}
                                className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[8px] font-black cursor-pointer"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateOfferStatus(idx, "Rejected")}
                                className="px-2 py-0.5 bg-red-150 text-red-700 rounded text-[8px] font-black cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-amber-600 text-[8px] font-black uppercase">Awaiting review</span>
                          )
                        ) : (
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                            offer.status === "Accepted" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                          }`}>
                            {offer.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {selectedCrop.directNegotiation?.offers.length === 0 && (
                    <div className="text-center py-4 text-slate-400 text-[10px] font-medium italic">
                      No negotiation offers submitted yet. Proposed counter-rates show up here.
                    </div>
                  )}
                </div>

                {/* Submitting Counter-offered rates */}
                {selectedCrop.status === "Available" && (
                  <div className="space-y-2 pt-1.5 border-t border-slate-100">
                    <label className="block text-slate-500 text-[9px] font-bold uppercase">Propose Counter Price ($/Ton)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-2 text-[10px] text-slate-400">$</span>
                        <input
                          type="number"
                          value={counterPrice}
                          onChange={(e) => setCounterPrice(parseInt(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded pl-6 pr-2 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleNegotiate}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-[10px] cursor-pointer"
                      >
                        Submit Counter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CONTRACT FARMING AGREEMENT */}
            {selectedCrop.sellingType === "Contract Farming" && (
              <div className="border border-blue-200 bg-blue-50/10 rounded-xl p-4 space-y-3">
                <h5 className="text-[10px] uppercase font-black text-blue-800 tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Contract Farming Agreement
                </h5>

                <div className="bg-white border border-blue-100 p-3 rounded-lg text-[9px] space-y-1.5 font-semibold text-slate-700 leading-relaxed">
                  <p>
                    <strong className="text-slate-900 font-extrabold">Agreement Partner:</strong> {selectedCrop.contractSpecs?.buyerName || "Indus Milling Group"}
                  </p>
                  <p>
                    <strong className="text-slate-900 font-extrabold">Pre-Harvest Price Guarantee:</strong> ${selectedCrop.contractSpecs?.preHarvestGuarantee}/Ton
                  </p>
                  <p>
                    <strong className="text-slate-900 font-extrabold">Arbitration & Settlement terms:</strong> {selectedCrop.contractSpecs?.terms}
                  </p>
                </div>
                <div className="bg-blue-600 text-white rounded p-2 text-center text-[9px] font-black tracking-wide flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Sovereign Legal SLA Locked & Sealed
                </div>
              </div>
            )}

            {/* BULK DISCOUNT & LOGISTICS CALCULATOR PANELS */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-4">
              <h5 className="text-[10px] uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5">
                <Truck className="h-4.5 w-4.5 text-emerald-600" />
                SLA Logistics & Pricing Estimator
              </h5>

              {/* Bulk discount indicator */}
              <div className="bg-emerald-50/30 border border-emerald-100 rounded-lg p-2.5 flex justify-between items-center text-[9px]">
                <div className="font-semibold text-emerald-950">
                  <span className="font-black block text-[10px] text-emerald-800 flex items-center gap-1">
                    <Percent className="h-3.5 w-3.5" /> Bulk Quantity Discount
                  </span>
                  Volume: {selectedCrop.quantity} Tons
                </div>
                <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase text-[8px]">
                  {calculatedBulkDiscount.percent}% discount
                </span>
              </div>

              {/* Transport slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-bold">
                  <span className="text-slate-500">Delivery Distance (KM):</span>
                  <span className="text-slate-900 font-extrabold">{deliveryDistance} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  value={deliveryDistance}
                  onChange={(e) => setDeliveryDistance(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Cold Chain Toggle */}
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex items-center justify-between text-[10px] font-semibold text-slate-700">
                <span className="flex items-center gap-1 text-slate-800">
                  <Snowflake className="h-3.5 w-3.5 text-blue-500" />
                  Refrigerated Reefer Cold Chain (Maintain Temp)
                </span>
                <input
                  type="checkbox"
                  checked={coldTransportSelection}
                  onChange={(e) => setColdTransportSelection(e.target.checked)}
                  className="accent-blue-600 h-4.5 w-4.5"
                />
              </div>

              {/* Costing Breakdowns */}
              <div className="bg-slate-950 text-slate-300 p-3 rounded-lg text-[9px] space-y-1.5 font-bold">
                <div className="flex justify-between">
                  <span>Distance Transit Charge:</span>
                  <span className="text-white">${logisticsEstimate.distanceCost.toFixed(2)}</span>
                </div>
                {coldTransportSelection && (
                  <div className="flex justify-between text-blue-400">
                    <span>Cold Reefer Premium (Monitoring & cooling):</span>
                    <span>+${logisticsEstimate.refrigerationPremium.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Weight Bulk Handling Premium:</span>
                  <span className="text-white">+${logisticsEstimate.weightPremium.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1.5 text-white font-black text-[10px]">
                  <span>Total Estimated Transit SLA:</span>
                  <span className="text-emerald-400">${logisticsEstimate.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* CORPORATE BUYER CREDIT SCORE CARD */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
              <h5 className="text-[10px] uppercase font-black text-slate-800 tracking-wider">
                Corporate Risk & Buyer Verification
              </h5>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-800 font-extrabold text-[11px] block">{matchedBuyerCredit.name}</span>
                  <span className="text-slate-400 text-[8px] font-bold block">{matchedBuyerCredit.verifiedStatus}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100 font-black block">
                    Credit: {matchedBuyerCredit.score}
                  </span>
                  <span className="text-[8px] font-black uppercase text-emerald-600 block mt-0.5">{matchedBuyerCredit.risk}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* LOWER SECTION: ESCROW PAYMENTS FLOW TRACKER */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-600" />
            <div>
              <h4 className="text-xs font-black text-slate-950 uppercase tracking-wide">Escrow & Secure Settlement ledger</h4>
              <p className="text-[10px] text-slate-400">Escrow funds lock instantly on purchase agreement and clear step-by-step strictly based on physical verified checks.</p>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md border border-emerald-100">
            Escrow ID: {escrowStatus.contractId}
          </span>
        </div>

        {/* Milestones Flow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-2 text-center text-xs">
          {[
            { id: "Funds Locked", label: "1. Escrow Funded", desc: "Corporate Buyer deposit cleared in full into trust ledger." },
            { id: "Quality Certified", label: "2. Quality Clearance", desc: "Digital blemish cert verified by Agronomy Grader." },
            { id: "Dispatched", label: "3. Logistics Dispatch", desc: "Assigned transporter checked out from farm block." },
            { id: "Funds Released", label: "4. Settlement Released", desc: "Payout cleared to Farmer's digital cooperative wallet." }
          ].map((milestone, mIdx) => {
            // Determine active/previous/completed classes
            const currentOrderIndex = ["Funds Locked", "Quality Certified", "Dispatched", "Funds Released"].indexOf(escrowStatus.status);
            const thisIndex = mIdx;
            
            const isCompleted = thisIndex <= currentOrderIndex;
            const isActive = thisIndex === currentOrderIndex;

            return (
              <div
                key={milestone.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                  isActive ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-100" :
                  isCompleted ? "bg-slate-50 border-emerald-100 text-slate-600" :
                  "bg-slate-50/50 border-slate-200 text-slate-400 opacity-65"
                }`}
              >
                <div>
                  <span className={`block text-[10px] font-black uppercase ${
                    isActive ? "text-emerald-800" : isCompleted ? "text-slate-700" : "text-slate-400"
                  }`}>
                    {milestone.label}
                  </span>
                  <p className="text-[9px] font-semibold text-slate-500 mt-1.5 leading-relaxed">{milestone.desc}</p>
                </div>

                <div className="pt-2">
                  {isCompleted ? (
                    <span className="text-[9px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mx-auto">
                      ✓ Completed
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">Pending action</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Interactive controls block to change escrow stage in demo */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 flex flex-col justify-between text-left border border-slate-800">
            <div>
              <span className="text-[8px] uppercase font-black text-slate-300">Milestone Control</span>
              <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Advance escrow steps to simulate delivery & release workflows.</p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const sequence: ("Funds Locked" | "Quality Certified" | "Dispatched" | "Funds Released")[] = [
                    "Funds Locked", "Quality Certified", "Dispatched", "Funds Released"
                  ];
                  const currentIdx = sequence.indexOf(escrowStatus.status);
                  const nextIdx = (currentIdx + 1) % sequence.length;
                  setEscrowStatus((prev) => ({
                    ...prev,
                    status: sequence[nextIdx]
                  }));
                }}
                className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white rounded text-[9px] font-black text-center cursor-pointer uppercase tracking-wider"
              >
                Simulate Next Step
              </button>
            </div>
          </div>
        </div>

        {/* Informational SLA ribbon */}
        <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg text-[9px] leading-relaxed text-slate-600 flex items-start gap-2 font-semibold">
          <Info className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-900">Dynamic Bilateral Arbitration Protocol:</strong> All listings and bids processed through AgriConnect are governed by APEDA and regional Co-Op agreements. In case of harvest quality grade disputes, certified regional extension officers will audit physical properties on-site prior to Escrow release, ensuring robust fraud prevention.
          </p>
        </div>
      </div>

    </div>
  );
};
