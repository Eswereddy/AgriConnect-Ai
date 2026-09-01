import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  FileCheck,
  Calendar,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  TrendingDown,
  ChevronRight,
  Info,
  CheckCircle,
  FileText,
  Download,
  Printer,
  X,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  Search,
  Check,
  FlaskConical,
  Scale,
  DollarSign,
  AlertTriangle,
  Upload,
  Image
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
  qualityGrade: string; // Ordered quality (e.g., "Grade A")
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
  refundReason?: string;
  refundDescription?: string;
}

interface QualityInspection {
  id: string;
  orderId: string;
  lotId: string;
  cropName: string;
  farmerName: string;
  quantity: number;
  orderedGrade: string;
  certifiedGrade: "Grade A" | "Grade B" | "Grade C";
  scheduledDate: string;
  scheduledTime: string;
  labTesting: boolean;
  status: "Scheduled" | "Sample Collected" | "Analyzing" | "Report Generated";
  // Metrics
  moisture: number; // e.g., %
  foreignMatter: number; // %
  brokenGrains: number; // %
  aflatoxin: number; // ppb
  inspectorName: string;
  verifiedAt?: string;
  remarks: string;
  // Extra Lab Testing fields
  testType?: "pesticide_residue" | "nutrient_content" | "freshness";
  sampleLogistics?: "lab_pickup" | "buyer_ship";
  pesticideResidue?: number; // ppm (fails if > 0.01)
  nutrientProtein?: number; // % (fails if < 11.0)
  freshnessIndex?: number; // % (fails if < 80)
  defectsDetected?: string[];
  recommendation?: "Approve" | "Reject";
}

export default function BuyerQualityVerification() {
  const [orders, setOrders] = useState<WonOrder[]>([]);
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  
  // Tab/Grading Mode Toggle State
  const [gradingMethod, setGradingMethod] = useState<"onsite" | "ai" | "labtest">("onsite");

  // Form State (On-Site)
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // default 2 days out
    return date.toISOString().split("T")[0];
  });
  const [scheduledTime, setScheduledTime] = useState<string>("11:00");
  const [labTesting, setLabTesting] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // AI Remote Grading Form State
  const [aiOrderId, setAiOrderId] = useState<string>("");
  const [aiPresetSample, setAiPresetSample] = useState<"premium" | "standard" | "substandard" | "custom">("premium");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageMime, setUploadedImageMime] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);

  // Image Cropping States
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cropX, setCropX] = useState<number>(10); // Percentage from left (0-100)
  const [cropY, setCropY] = useState<number>(10); // Percentage from top (0-100)
  const [cropW, setCropW] = useState<number>(80); // Width percentage (0-100)
  const [cropH, setCropH] = useState<number>(80); // Height percentage (0-100)
  const [isCropApplied, setIsCropApplied] = useState<boolean>(false);
  const [isDraggingCrop, setIsDraggingCrop] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [startCropPos, setStartCropPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Lab Testing Form State
  const [labOrderId, setLabOrderId] = useState<string>("");
  const [labTestType, setLabTestType] = useState<"pesticide_residue" | "nutrient_content" | "freshness">("pesticide_residue");
  const [labSampleLogistics, setLabSampleLogistics] = useState<"lab_pickup" | "buyer_ship">("lab_pickup");
  const [labSuccessMessage, setLabSuccessMessage] = useState<string | null>(null);
  const [labErrorMessage, setLabErrorMessage] = useState<string | null>(null);

  // Active viewing/interaction states
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
  
  // Refund Form State
  const [refundReason, setRefundReason] = useState<string>("Quality below standard");
  const [refundDescription, setRefundDescription] = useState<string>("");
  const [refundSuccess, setRefundSuccess] = useState<boolean>(false);

  // Load orders & inspections from localStorage
  const loadData = () => {
    // 1. Load orders
    const savedOrders = localStorage.getItem("agriconnect_buyer_orders");
    let loadedOrders: WonOrder[] = [];
    if (savedOrders) {
      try {
        loadedOrders = JSON.parse(savedOrders);
        setOrders(loadedOrders);
      } catch (e) {
        console.error("Error loading orders", e);
      }
    }

    // 2. Load inspections or generate default ones to show full system capabilities
    const savedInspections = localStorage.getItem("agriconnect_buyer_inspections");
    if (savedInspections) {
      try {
        setInspections(JSON.parse(savedInspections));
      } catch (e) {
        console.error("Error loading inspections", e);
      }
    } else {
      // Seed initial mock inspection reports tied to the pre-existing orders
      const defaultInspections: QualityInspection[] = [
        {
          id: "INSP-2026-001",
          orderId: "ORD-2026-9102",
          lotId: "LOT-9102",
          cropName: "Premium Basmati Rice (Pusa 1121)",
          farmerName: "Baldev Singh Sandhu",
          quantity: 15,
          orderedGrade: "Grade A",
          certifiedGrade: "Grade C", // Below Standard to showcase return/refund trigger
          scheduledDate: "2026-07-04",
          scheduledTime: "10:30",
          labTesting: true,
          status: "Report Generated",
          moisture: 16.8, // standard is below 14%
          foreignMatter: 2.1, // standard is below 1%
          brokenGrains: 8.5, // standard is below 3%
          aflatoxin: 18.2, // standard is below 15 ppb
          inspectorName: "Dr. Ramesh Chander (SGS India Lab)",
          verifiedAt: "2026-07-05 14:20",
          remarks: "Moisture content is significantly higher than safe storage limit of 14%. Broken grains exceed parameters. Elevated risk of mold development."
        },
        {
          id: "INSP-2026-002",
          orderId: "ORD-2026-5541",
          lotId: "LOT-5541",
          cropName: "Non-GMO Feed Corn (Yellow Maize)",
          farmerName: "Devender Deswal",
          quantity: 24,
          orderedGrade: "Grade A",
          certifiedGrade: "Grade A", // Pass standard
          scheduledDate: "2026-07-05",
          scheduledTime: "14:00",
          labTesting: false,
          status: "Report Generated",
          moisture: 12.1,
          foreignMatter: 0.4,
          brokenGrains: 1.2,
          aflatoxin: 4.5,
          inspectorName: "Amit Sharma (NABL Accredited Assayer)",
          verifiedAt: "2026-07-06 09:15",
          remarks: "Excellent parameters across all indices. Grain is dense, clean, and perfectly dried. Fully approved for warehousing."
        }
      ];
      localStorage.setItem("agriconnect_buyer_inspections", JSON.stringify(defaultInspections));
      setInspections(defaultInspections);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveInspections = (updated: QualityInspection[]) => {
    localStorage.setItem("agriconnect_buyer_inspections", JSON.stringify(updated));
    setInspections(updated);
    window.dispatchEvent(new Event("storage"));
  };

  // Only Paid or Delivered/Scheduled orders can be inspected
  const eligibleOrders = orders.filter(
    (o) => o.paymentStatus === "Paid" && o.refundStatus !== "Refunded"
  );

  // Submit new inspection
  const handleScheduleInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) {
      setFormError("Please select an active crop contract.");
      return;
    }

    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) {
      setFormError("Order not found.");
      return;
    }

    // Check if an inspection already exists for this order
    const alreadyExists = inspections.find((i) => i.orderId === selectedOrderId);
    if (alreadyExists && alreadyExists.status !== "Report Generated") {
      setFormError(`An inspection is already active for Order ${selectedOrderId}.`);
      return;
    }

    const newInspection: QualityInspection = {
      id: `INSP-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      lotId: order.lotId,
      cropName: order.cropName,
      farmerName: order.farmerName,
      quantity: order.quantity,
      orderedGrade: order.qualityGrade || "Grade A",
      certifiedGrade: "Grade A", // default until report generated
      scheduledDate,
      scheduledTime,
      labTesting,
      status: "Scheduled",
      moisture: 13.0,
      foreignMatter: 0.5,
      brokenGrains: 2.0,
      aflatoxin: 5.0,
      inspectorName: "AgriConnect Regional Assayer Unit",
      remarks: "On-site visit scheduled. Waiting for physical sampling."
    };

    const updated = [newInspection, ...inspections];
    saveInspections(updated);
    setSelectedOrderId("");
    setFormSuccess(true);
    setFormError(null);
    
    // Auto clear success message
    setTimeout(() => {
      setFormSuccess(false);
    }, 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setOriginalImage(base64);
        setUploadedImage(base64);
        setUploadedImageMime(file.type);
        setAiPresetSample("custom");
        setIsCropApplied(false);
        setCropX(10);
        setCropY(10);
        setCropW(80);
        setCropH(80);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCropAction = () => {
    if (!originalImage) return;

    const img = new window.Image();
    img.src = originalImage;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const pxX = (cropX / 100) * img.width;
      const pxY = (cropY / 100) * img.height;
      const pxW = (cropW / 100) * img.width;
      const pxH = (cropH / 100) * img.height;

      canvas.width = pxW;
      canvas.height = pxH;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, pxX, pxY, pxW, pxH, 0, 0, pxW, pxH);
        const croppedBase64 = canvas.toDataURL(uploadedImageMime || "image/jpeg");
        setUploadedImage(croppedBase64);
        setIsCropApplied(true);
      }
    };
  };

  const resetCropAction = () => {
    if (originalImage) {
      setUploadedImage(originalImage);
      setIsCropApplied(false);
      setCropX(10);
      setCropY(10);
      setCropW(80);
      setCropH(80);
    }
  };

  const handleCropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    // Position relative to container
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;

    // Check if pointer is inside the current crop selection box
    const insideX = xPct >= cropX && xPct <= (cropX + cropW);
    const insideY = yPct >= cropY && yPct <= (cropY + cropH);

    if (insideX && insideY) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragStart({ x: clientX, y: clientY });
      setStartCropPos({ x: cropX, y: cropY });
      setIsDraggingCrop(true);
    } else {
      // Reposition the box center here
      let newX = Math.max(0, Math.min(100 - cropW, xPct - cropW / 2));
      let newY = Math.max(0, Math.min(100 - cropH, yPct - cropH / 2));
      setCropX(Math.round(newX));
      setCropY(Math.round(newY));
    }
  };

  const handleCropPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingCrop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dxPct = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dyPct = ((e.clientY - dragStart.y) / rect.height) * 100;

    let newX = Math.max(0, Math.min(100 - cropW, startCropPos.x + dxPct));
    let newY = Math.max(0, Math.min(100 - cropH, startCropPos.y + dyPct));

    setCropX(Math.round(newX));
    setCropY(Math.round(newY));
  };

  const handleCropPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingCrop) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDraggingCrop(false);
    }
  };

  const handleAiGrading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiOrderId) {
      setAiErrorMessage("Please select an active crop contract.");
      return;
    }

    const order = orders.find((o) => o.id === aiOrderId);
    if (!order) {
      setAiErrorMessage("Order not found.");
      return;
    }

    setIsAiAnalyzing(true);
    setAiErrorMessage(null);
    setAiSuccessMessage(null);
    setAiResult(null);

    try {
      let presetDescription = "";
      let base64ToSend = uploadedImage ? uploadedImage.split(",")[1] : null;
      let mimeToSend = uploadedImageMime;

      if (aiPresetSample === "premium") {
        presetDescription = "Consignment shows exceptionally high uniformity, brilliant natural luster, perfect kernel density, zero dust or foreign particles, and moisture estimated around 11%. Premium Grade.";
      } else if (aiPresetSample === "standard") {
        presetDescription = "Consignment exhibits standard quality, mostly uniform color, minor chaff dust, standard broken ratio, and moisture around 13%. Grade A.";
      } else if (aiPresetSample === "substandard") {
        presetDescription = "Consignment shows high moisture spots, yellow-brown discoloration indicating light mold/fermentation, multiple cracked/fractured kernels, and significant dust. Below standard (Grade B/C).";
      } else {
        presetDescription = "Custom uploaded photo of crop consignment.";
      }

      const payload = {
        cropName: order.cropName,
        imageBase64: base64ToSend,
        imageMime: mimeToSend,
        presetSample: aiPresetSample,
        presetDescription: presetDescription
      };

      const response = await fetch("/api/quality-grading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to grade crop quality. Server returned ${response.status}`);
      }

      const data = await response.json();
      setAiResult(data);

      // Map dynamic certifiedGrade to the restricted local union type if necessary
      let mappedGrade: "Grade A" | "Grade B" | "Grade C" = "Grade A";
      if (data.certifiedGrade === "Premium" || data.certifiedGrade === "Grade A") {
        mappedGrade = "Grade A";
      } else if (data.certifiedGrade === "Grade B") {
        mappedGrade = "Grade B";
      } else if (data.certifiedGrade === "Grade C") {
        mappedGrade = "Grade C";
      }

      // Create a new automatic inspection report in the list!
      const newInspection: QualityInspection = {
        id: `AI-${Math.floor(100 + Math.random() * 900)}`,
        orderId: order.id,
        lotId: order.lotId,
        cropName: `${order.cropName} [AI REMOTE SCAN]`,
        farmerName: order.farmerName,
        quantity: order.quantity,
        orderedGrade: order.qualityGrade || "Grade A",
        certifiedGrade: mappedGrade,
        scheduledDate: new Date().toISOString().split("T")[0],
        scheduledTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
        labTesting: true,
        status: "Report Generated",
        moisture: data.moisture,
        foreignMatter: data.foreignMatter,
        brokenGrains: data.brokenGrains,
        aflatoxin: data.aflatoxin,
        defectsDetected: data.defectsDetected || [],
        recommendation: data.recommendation || "Approve",
        inspectorName: "AgriConnect AI Vision Engine (v3.5)",
        verifiedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        remarks: `[AI Quality Check Report] Remarks: ${data.inspectorRemarks}. Explanation: ${data.confidenceExplanation}`
      };

      const updatedInspections = [newInspection, ...inspections];
      saveInspections(updatedInspections);

      setAiSuccessMessage(`Quality Grading Complete! Certified as ${data.certifiedGrade} with ${data.confidenceScore}% confidence.`);
    } catch (err: any) {
      console.error("AI grading error:", err);
      setAiErrorMessage(err.message || "An error occurred during AI analysis.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleRequestLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labOrderId) {
      setLabErrorMessage("Please select an active crop contract.");
      return;
    }

    const order = orders.find((o) => o.id === labOrderId);
    if (!order) {
      setLabErrorMessage("Order not found.");
      return;
    }

    // Check if an inspection already exists for this order & testType
    const alreadyExists = inspections.find((i) => i.orderId === labOrderId && i.testType === labTestType);
    if (alreadyExists && alreadyExists.status !== "Report Generated") {
      setLabErrorMessage(`A ${labTestType.replace("_", " ")} test is already active for Order ${labOrderId}.`);
      return;
    }

    const newInspection: QualityInspection = {
      id: `LAB-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      lotId: order.lotId,
      cropName: `${order.cropName} [LAB TEST]`,
      farmerName: order.farmerName,
      quantity: order.quantity,
      orderedGrade: order.qualityGrade || "Grade A",
      certifiedGrade: "Grade A", // default until report generated
      scheduledDate: new Date().toISOString().split("T")[0],
      scheduledTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
      labTesting: true,
      status: "Scheduled",
      moisture: 13.0,
      foreignMatter: 0.5,
      brokenGrains: 2.0,
      aflatoxin: 5.0,
      testType: labTestType,
      sampleLogistics: labSampleLogistics,
      inspectorName: "NABL Central Agricultural Science Lab",
      remarks: labSampleLogistics === "lab_pickup"
        ? "Lab courier scheduled for sample pickup from farm site. Waiting for extraction."
        : "Waiting for buyer to ship sample to Central Lab hub."
    };

    const updated = [newInspection, ...inspections];
    saveInspections(updated);
    setLabOrderId("");
    setLabSuccessMessage(`Certified Lab Test requested! Sample transfer mode: ${labSampleLogistics === "lab_pickup" ? "Lab Pickup Courier" : "Buyer Self-Ship"}.`);
    setLabErrorMessage(null);

    setTimeout(() => {
      setLabSuccessMessage(null);
    }, 4000);
  };

  // Simulate progress of an inspection for testing purposes
  const handleSimulateInspectionProgress = (inspId: string) => {
    const updated = inspections.map((insp) => {
      if (insp.id === inspId) {
        if (insp.status === "Scheduled") {
          const sampleMsg = insp.sampleLogistics === "buyer_ship"
            ? "Buyer package received at laboratory loading dock. Sample logged and verified."
            : "Lab courier successfully picked up sample from producer. Registered in tracking system.";
          return { ...insp, status: "Sample Collected" as const, remarks: `${sampleMsg} Sent to processing area.` };
        } else if (insp.status === "Sample Collected") {
          return { ...insp, status: "Analyzing" as const, remarks: insp.testType 
            ? `Specialized ${insp.testType.replace("_", " ")} diagnostic testing in progress using HPLC/Spectroscopy.`
            : "Chromatography and digital moisture scanning active." };
        } else if (insp.status === "Analyzing") {
          // Generate a randomized result (50% chance of failing specifications to let the user test refund triggers!)
          const failTest = Math.random() > 0.45;
          
          let pesticideResidue: number | undefined;
          let nutrientProtein: number | undefined;
          let freshnessIndex: number | undefined;
          let remarks = "";
          
          if (insp.testType === "pesticide_residue") {
            pesticideResidue = failTest ? 0.08 : 0.004;
            remarks = failTest 
              ? "Critical Hazard Alert: Organophosphate pesticide residues detected at 0.08 ppm, exceeding the statutory safe maximum limit of 0.01 ppm. Consignment is unfit for direct consumer shipment."
              : "Zero harmful pesticide residues detected. Chromatography analysis confirms levels of 0.004 ppm, well within the safety threshold limit of 0.01 ppm.";
          } else if (insp.testType === "nutrient_content") {
            nutrientProtein = failTest ? 8.4 : 12.8;
            remarks = failTest
              ? "Substandard Nutritional Level: Grain protein content tested at 8.4%, falling below the premium contract specification requirement of 11.0% protein content."
              : "Nutrient standards exceeded. Crude protein level stands at 12.8%, satisfying premium grade gluten and carbohydrate index requirements.";
          } else if (insp.testType === "freshness") {
            freshnessIndex = failTest ? 62 : 94;
            remarks = failTest
              ? "Stale/Overheated Consignment: Viability check shows standard mold activity with freshness index at 62%, falling below the contractually required 80% minimum."
              : "Excellent viability. Grain freshness index tested at 94% with standard seed respiration activity and zero pre-germination discoloration.";
          } else {
            remarks = failTest
              ? "Moisture levels exceed the standard 14% safety benchmark. Grains show severe milling fragmentation and standard contamination risk."
              : "Grain standards conform perfectly to contract specification guidelines.";
          }

          return {
            ...insp,
            status: "Report Generated" as const,
            certifiedGrade: failTest ? ("Grade C" as const) : ("Grade A" as const),
            moisture: failTest ? 17.5 : 12.8,
            foreignMatter: failTest ? 2.4 : 0.5,
            brokenGrains: failTest ? 9.2 : 1.8,
            aflatoxin: failTest ? 19.5 : 3.2,
            pesticideResidue,
            nutrientProtein,
            freshnessIndex,
            inspectorName: "SGS India Agricultural Testing Labs",
            verifiedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
            remarks
          };
        } else {
          return { ...insp, status: "Scheduled" as const, remarks: "On-site visit scheduled. Waiting for physical sampling." };
        }
      }
      return insp;
    });

    saveInspections(updated);
  };

  const handleOpenReport = (insp: QualityInspection) => {
    setSelectedInspectionId(insp.id);
    setShowReportModal(true);
  };

  const currentViewingInspection = inspections.find((i) => i.id === selectedInspectionId);

  // Trigger Return / Refund
  const handleOpenRefundRequest = () => {
    setShowReportModal(false);
    setShowRefundModal(true);
  };

  const handleSubmitRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentViewingInspection) return;

    // Update the parent order refund state
    const savedOrders = localStorage.getItem("agriconnect_buyer_orders");
    if (savedOrders) {
      try {
        const parsed: WonOrder[] = JSON.parse(savedOrders);
        const updatedOrders = parsed.map((o) => {
          if (o.id === currentViewingInspection.orderId) {
            return {
              ...o,
              refundStatus: "Pending Approval" as const,
              refundReason,
              refundDescription
            };
          }
          return o;
        });
        localStorage.setItem("agriconnect_buyer_orders", JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Refund submit error", e);
      }
    }

    setRefundSuccess(true);
    setTimeout(() => {
      setShowRefundModal(false);
      setRefundSuccess(false);
      setRefundDescription("");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-cyan-900 to-slate-900 rounded-3xl p-6.5 text-white shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12">
          <FlaskConical className="h-64 w-64 text-white" />
        </div>
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] bg-teal-500/20 text-teal-300 font-extrabold uppercase px-3 py-1 rounded-full border border-teal-500/30 tracking-wider">
            🧪 ACCREDITED LAB TESTING PLATFORM
          </span>
          <h2 className="text-xl font-black tracking-tight font-sans uppercase">Quality Verification & Refund Desk</h2>
          <p className="text-xs text-teal-100/90 leading-relaxed font-medium">
            AgriConnect works with NABL certified assayers to provide unbiased, physical, on-site sampling. Verify moisture levels, toxicities, and grade specifications before funds are disbursed. Secure your transaction with standard refund protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* REQUEST QUALITY CHECK FORM - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Method Selector Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
            <button
              type="button"
              onClick={() => setGradingMethod("onsite")}
              className={`flex-1 py-2 text-center rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                gradingMethod === "onsite"
                  ? "bg-white text-teal-800 shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Calendar className="h-3 w-3" />
              On-Site
            </button>
            <button
              type="button"
              onClick={() => setGradingMethod("ai")}
              className={`flex-1 py-2 text-center rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                gradingMethod === "ai"
                  ? "bg-teal-600 text-white shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              AI Remote
            </button>
            <button
              type="button"
              onClick={() => setGradingMethod("labtest")}
              className={`flex-1 py-2 text-center rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                gradingMethod === "labtest"
                  ? "bg-amber-600 text-white shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FlaskConical className="h-3 w-3" />
              Lab Testing
            </button>
          </div>

          {gradingMethod === "onsite" ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <FlaskConical className="h-4.5 w-4.5 text-teal-600" />
                Request On-Site Inspection
              </h3>

              {formSuccess && (
                <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3.5 flex items-start gap-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wide">Inspection Scheduled!</p>
                    <p className="text-[9px] text-emerald-700/90 leading-normal mt-0.5 font-medium">
                      Our certified regional assayer has been notified. You can track their status and download reports below.
                    </p>
                  </div>
                </div>
              )}

              {formError && (
                <div className="bg-rose-50 border border-rose-150 rounded-xl p-3.5 flex items-start gap-2.5">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-rose-800 font-bold leading-normal">{formError}</p>
                </div>
              )}

              <form onSubmit={handleScheduleInspection} className="space-y-4">
                {/* Select crop order */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Select Agri Contract</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-medium text-slate-800"
                  >
                    <option value="">-- Choose active paid contract --</option>
                    {eligibleOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.cropName} ({o.quantity} Tons) - {o.farmerName}
                      </option>
                    ))}
                  </select>
                  <p className="text-[8px] text-slate-400 font-semibold">Only escrow-funded paid orders are eligible for official assay checks.</p>
                </div>

                {/* Schedule coordinates */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Requested Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-mono text-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Preferred Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-mono text-slate-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Lab Testing selection */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="lab-testing-opt"
                      checked={labTesting}
                      onChange={(e) => setLabTesting(e.target.checked)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5 cursor-pointer"
                    />
                    <div>
                      <label htmlFor="lab-testing-opt" className="block text-[10px] font-black text-slate-700 uppercase tracking-wide cursor-pointer">
                        🧬 Request Lab Chemical Analysis
                      </label>
                      <p className="text-[9px] text-slate-400 mt-0.5 leading-normal font-medium">
                        Highly recommended for food grains. Adds multi-spectral gas chromatography check to certify heavy metals, pesticide residues, and AFLA toxin values.
                      </p>
                    </div>
                  </div>
                  {labTesting && (
                    <div className="border-t border-slate-200 pt-2 font-mono text-[9px] text-teal-800 font-bold flex justify-between items-center bg-teal-50/50 p-2 rounded">
                      <span>🧪 Advanced Toxicology Lab Fee:</span>
                      <span>₹3,500 (Escrow Covered)</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <FileCheck className="h-4.5 w-4.5" /> Book Assayer Dispatch
                </button>
              </form>
            </div>
          ) : gradingMethod === "ai" ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-teal-600 animate-pulse" />
                  AI Remote Quality Grading
                </h3>
                <span className="text-[8px] bg-teal-50 text-teal-700 font-black px-2 py-0.5 rounded font-mono uppercase tracking-wider border border-teal-150">
                  ⚡ INSTANT
                </span>
              </div>

              {aiSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3.5 flex items-start gap-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wide">Analysis Succeeded</p>
                    <p className="text-[9px] text-emerald-700/90 leading-normal mt-0.5 font-medium">{aiSuccessMessage}</p>
                  </div>
                </div>
              )}

              {aiErrorMessage && (
                <div className="bg-rose-50 border border-rose-150 rounded-xl p-3.5 flex items-start gap-2.5">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-rose-800 font-bold leading-normal">{aiErrorMessage}</p>
                </div>
              )}

              <form onSubmit={handleAiGrading} className="space-y-4">
                {/* Select crop order */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Select Agri Contract</label>
                  <select
                    value={aiOrderId}
                    onChange={(e) => setAiOrderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-medium text-slate-800"
                  >
                    <option value="">-- Choose active paid contract --</option>
                    {eligibleOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.cropName} ({o.quantity} Tons)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preset Scan Options */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Select Consignment Scan Preset</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAiPresetSample("premium");
                        setUploadedImage(null);
                      }}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                        aiPresetSample === "premium"
                          ? "border-teal-600 bg-teal-50/50"
                          : "border-slate-150 bg-slate-50/50 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base mt-0.5">🌾</span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-[10px] text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                          Sample 1: Premium Quality (Clean)
                          {aiPresetSample === "premium" && <span className="text-teal-600">●</span>}
                        </p>
                        <p className="text-[9px] text-slate-500 font-medium leading-tight">Bright golden grains, complete size consistency, zero foreign admix, perfectly dried.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAiPresetSample("standard");
                        setUploadedImage(null);
                      }}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                        aiPresetSample === "standard"
                          ? "border-teal-600 bg-teal-50/50"
                          : "border-slate-150 bg-slate-50/50 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base mt-0.5">🍚</span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-[10px] text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                          Sample 2: Standard Commercial (Grade A)
                          {aiPresetSample === "standard" && <span className="text-teal-600">●</span>}
                        </p>
                        <p className="text-[9px] text-slate-500 font-medium leading-tight">Good natural luster, normal grain density, minor chaff dust, within safe thresholds.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAiPresetSample("substandard");
                        setUploadedImage(null);
                      }}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                        aiPresetSample === "substandard"
                          ? "border-teal-600 bg-teal-50/50"
                          : "border-slate-150 bg-slate-50/50 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-base mt-0.5">🍂</span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-[10px] text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                          Sample 3: High Moisture / Damaged
                          {aiPresetSample === "substandard" && <span className="text-red-600">●</span>}
                        </p>
                        <p className="text-[9px] text-slate-500 font-medium leading-tight">Yellowish fermentation stains, damp clusters, cracked kernels, high dust mixture.</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Custom Photo Upload Option */}
                <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      📸 Custom Consignment Image & Verifier Crop
                    </label>
                    {uploadedImage && (
                      <span className="text-[8px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-black uppercase tracking-wide">
                        {isCropApplied ? "Cropped & Verified" : "Cropping Workspace Active"}
                      </span>
                    )}
                  </div>

                  {!uploadedImage ? (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            setOriginalImage(base64);
                            setUploadedImage(base64);
                            setUploadedImageMime(file.type);
                            setAiPresetSample("custom");
                            setIsCropApplied(false);
                            setCropX(10);
                            setCropY(10);
                            setCropW(80);
                            setCropH(80);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-6 text-center transition-colors cursor-pointer bg-white relative shadow-3xs"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-1.5 text-slate-400">
                        <Upload className="h-7 w-7 mx-auto text-slate-400" />
                        <p className="text-[10px] font-bold text-slate-600">Drag & drop your crop photo, or click to browse</p>
                        <p className="text-[8px] font-semibold text-slate-400">Supports PNG, JPG, WEBP up to 10MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Active Workspace */}
                      {!isCropApplied ? (
                        <div className="space-y-3">
                          {/* Draggable Viewport Container */}
                          <div 
                            onPointerDown={handleCropPointerDown}
                            onPointerMove={handleCropPointerMove}
                            onPointerUp={handleCropPointerUp}
                            className="relative w-full aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden touch-none select-none border border-slate-700 shadow-inner"
                          >
                            <img
                              src={originalImage || ""}
                              alt="Crop alignment source"
                              className="w-full h-full object-contain pointer-events-none"
                            />
                            
                            {/* Styled Highlighted Crop Box Overlay */}
                            <div
                              style={{
                                position: "absolute",
                                top: `${cropY}%`,
                                left: `${cropX}%`,
                                width: `${cropW}%`,
                                height: `${cropH}%`,
                                touchAction: "none"
                              }}
                              className="absolute border-2 border-dashed border-teal-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] cursor-move transition-shadow"
                            >
                              {/* Corner decorations */}
                              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-teal-400 -mt-[2px] -ml-[2px]" />
                              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-teal-400 -mt-[2px] -mr-[2px]" />
                              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-teal-400 -mb-[2px] -ml-[2px]" />
                              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-teal-400 -mb-[2px] -mr-[2px]" />
                              
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-slate-900/80 backdrop-blur-3xs text-[8px] text-teal-300 font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 border border-teal-400/30">
                                  <span>✂️</span> Crop Region
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-[8px] text-slate-500 font-semibold italic text-center">
                            👆 Drag the highlighted box above to re-center the crop frame, or use the precision sliders below.
                          </p>

                          {/* Precision Sliders */}
                          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-3xs">
                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100 flex justify-between items-center">
                              <span>Precision Sliders</span>
                              <span className="font-mono text-[8px] text-slate-400 lowercase">normalized coordinates</span>
                            </p>
                            
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                              {/* X Axis */}
                              <div className="space-y-0.5">
                                <div className="flex justify-between text-[8px] font-bold text-slate-500">
                                  <span>X Position (Horizontal)</span>
                                  <span className="font-mono text-slate-800">{cropX}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max={Math.max(0, 100 - cropW)}
                                  value={cropX}
                                  onChange={(e) => setCropX(Number(e.target.value))}
                                  className="w-full accent-teal-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              {/* Y Axis */}
                              <div className="space-y-0.5">
                                <div className="flex justify-between text-[8px] font-bold text-slate-500">
                                  <span>Y Position (Vertical)</span>
                                  <span className="font-mono text-slate-800">{cropY}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max={Math.max(0, 100 - cropH)}
                                  value={cropY}
                                  onChange={(e) => setCropY(Number(e.target.value))}
                                  className="w-full accent-teal-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              {/* Width */}
                              <div className="space-y-0.5">
                                <div className="flex justify-between text-[8px] font-bold text-slate-500">
                                  <span>Crop Box Width</span>
                                  <span className="font-mono text-slate-800">{cropW}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max={100 - cropX}
                                  value={cropW}
                                  onChange={(e) => setCropW(Number(e.target.value))}
                                  className="w-full accent-teal-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              {/* Height */}
                              <div className="space-y-0.5">
                                <div className="flex justify-between text-[8px] font-bold text-slate-500">
                                  <span>Crop Box Height</span>
                                  <span className="font-mono text-slate-800">{cropH}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max={100 - cropY}
                                  value={cropH}
                                  onChange={(e) => setCropH(Number(e.target.value))}
                                  className="w-full accent-teal-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Crop Actions */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={applyCropAction}
                              className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase text-[10px] tracking-wide rounded-xl transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                            >
                              <span>✂️</span> Apply Crop Selection
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImage(null);
                                setUploadedImageMime(null);
                                setOriginalImage(null);
                                setAiPresetSample("premium");
                              }}
                              className="px-3.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Cropped Preview Card */}
                          <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-3xs">
                            <img
                              src={uploadedImage}
                              alt="Cropped crop scan"
                              className="h-16 w-16 rounded-lg object-cover border border-slate-200 shadow-4xs"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                Photo Cropped & Calibrated
                              </p>
                              <p className="text-[8px] text-slate-400 font-medium leading-tight mt-0.5">
                                Visual features locked in. Prepared for high-fidelity computer vision diagnostics with Gemini AI.
                              </p>
                            </div>
                          </div>

                          {/* Recrop & Remove controls */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={resetCropAction}
                              className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-black uppercase text-[10px] tracking-wide rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>🔄</span> Recrop / Adjust Crop Frame
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImage(null);
                                setUploadedImageMime(null);
                                setOriginalImage(null);
                                setAiPresetSample("premium");
                              }}
                              className="px-3.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isAiAnalyzing}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  {isAiAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Analyzing Grains with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze Crop Quality Grade
                    </>
                  )}
                </button>
              </form>

              {aiResult && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono text-[9px] text-slate-700 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <p className="font-sans font-black uppercase text-[10px] text-slate-800 flex items-center gap-1">
                      <span>🤖</span> Real-Time AI Vision Diagnostics
                    </p>
                    <span className="text-[7px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">v3.5 active</span>
                  </div>

                  {/* Recommendation Alert Banner */}
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 font-sans ${
                    aiResult.recommendation === "Approve"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}>
                    {aiResult.recommendation === "Approve" ? (
                      <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider">
                        Recommendation: {aiResult.recommendation === "Approve" ? "APPROVE CONSIGNMENT" : "REJECT / DISPUTE CROP"}
                      </p>
                      <p className="text-[8px] text-slate-500 font-semibold leading-normal mt-0.5">
                        {aiResult.recommendation === "Approve" 
                          ? "Quality parameters are within contractual tolerance. Safe for warehousing."
                          : "Critical defects detected! Highly advised to trigger escrow refund."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white border border-slate-200 rounded-xl p-2.5">
                    <div>
                      <span className="text-slate-400">CERTIFIED GRADE:</span>{" "}
                      <strong className={`font-black text-[10px] ${
                        aiResult.certifiedGrade === "Premium" || aiResult.certifiedGrade === "Grade A"
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}>{aiResult.certifiedGrade}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">CONFIDENCE:</span>{" "}
                      <strong className="font-black text-slate-900">{aiResult.confidenceScore}%</strong>
                    </div>
                  </div>

                  {/* Defects Detected Panel */}
                  <div className="border border-slate-200 rounded-xl p-2.5 bg-white space-y-1.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Defects Detected</p>
                    {aiResult.defectsDetected && aiResult.defectsDetected.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {aiResult.defectsDetected.map((defect: string, idx: number) => (
                          <span key={idx} className="bg-rose-50 border border-rose-150 text-rose-700 text-[8px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 font-sans">
                            <span className="text-[10px]">●</span> {defect}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[8px] text-emerald-700 font-bold flex items-center gap-1 font-sans">
                        <CheckCircle className="h-3 w-3" /> No defects detected. Highly clean consignment.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2.5 text-[8px]">
                    <div>Moisture: <strong className="text-slate-900">{aiResult.moisture}%</strong></div>
                    <div>Foreign Matter: <strong className="text-slate-900">{aiResult.foreignMatter}%</strong></div>
                    <div>Broken Grains: <strong className="text-slate-900">{aiResult.brokenGrains}%</strong></div>
                    <div>Aflatoxin: <strong className="text-slate-900">{aiResult.aflatoxin} ppb</strong></div>
                  </div>

                  <p className="font-sans text-[8px] text-slate-500 leading-normal border-t border-slate-200 pt-2 italic">
                    Remarks: {aiResult.inspectorRemarks}
                  </p>
                  
                  {aiResult.confidenceExplanation && (
                    <p className="font-sans text-[8px] text-slate-400 leading-normal border-t border-slate-150 pt-1.5">
                      Explanation: {aiResult.confidenceExplanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <FlaskConical className="h-4.5 w-4.5 text-amber-600 animate-pulse" />
                Request Certified Lab Test
              </h3>

              {labSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3.5 flex items-start gap-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wide">Lab Request Registered!</p>
                    <p className="text-[9px] text-emerald-700/90 leading-normal mt-0.5 font-medium">{labSuccessMessage}</p>
                  </div>
                </div>
              )}

              {labErrorMessage && (
                <div className="bg-rose-50 border border-rose-150 rounded-xl p-3.5 flex items-start gap-2.5">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-rose-800 font-bold leading-normal">{labErrorMessage}</p>
                </div>
              )}

              <form onSubmit={handleRequestLabTest} className="space-y-4">
                {/* Select crop order */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Select Agri Contract</label>
                  <select
                    value={labOrderId}
                    onChange={(e) => setLabOrderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-medium text-slate-800"
                  >
                    <option value="">-- Choose active paid contract --</option>
                    {eligibleOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} - {o.cropName} ({o.quantity} Tons) - {o.farmerName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Test Type selector */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Select Test Type</label>
                  <select
                    value={labTestType}
                    onChange={(e) => setLabTestType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 font-medium text-slate-800"
                  >
                    <option value="pesticide_residue">🔬 Pesticide Residue Analysis (Max Limit: 0.01 ppm)</option>
                    <option value="nutrient_content">🌾 Nutritional Content & Protein Index (Target: 11.0%)</option>
                    <option value="freshness">🍏 Freshness & Grain Viability Index (Target: 80%)</option>
                  </select>
                  <p className="text-[8px] text-slate-400 mt-1 leading-normal font-medium italic">
                    {labTestType === "pesticide_residue" && "Gas chromatography testing for organophosphate chemical residues."}
                    {labTestType === "nutrient_content" && "Kjeldahl digestion analysis to certify exact gluten and protein metrics."}
                    {labTestType === "freshness" && "Conductivity & respiration rate scanning to verify storage freshness index."}
                  </p>
                </div>

                {/* Sample transfer mode logistics */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Sample Transfer Logistics</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLabSampleLogistics("lab_pickup")}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        labSampleLogistics === "lab_pickup"
                          ? "border-amber-600 bg-amber-50 text-amber-800 shadow-3xs"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <span>🚚 Lab Pickup</span>
                      <span className="text-[8px] font-medium lowercase text-slate-400">Courier collects from farm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLabSampleLogistics("buyer_ship")}
                      className={`py-2 px-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        labSampleLogistics === "buyer_ship"
                          ? "border-amber-600 bg-amber-50 text-amber-800 shadow-3xs"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <span>📦 Buyer Direct Ship</span>
                      <span className="text-[8px] font-medium lowercase text-slate-400">You ship sample directly</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 font-mono text-[9px] text-slate-500 flex justify-between items-center">
                  <span>Chemical Lab Processing SLA:</span>
                  <span className="font-bold text-slate-800">24-48 Hours</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <FlaskConical className="h-4.5 w-4.5" /> Book Certified Lab Test
                </button>
              </form>
            </div>
          )}

          {/* Refund policy widget */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-slate-600" /> AgriConnect Escrow SLA
            </h4>
            <div className="space-y-2 font-medium text-[10px] text-slate-600 leading-relaxed">
              <p>
                🔒 **Grade Dispute Resolution**: When a contract is booked, the purchase amount remains in a secure holding vault.
              </p>
              <p>
                🌾 **Certified Quality discrepancy**: If physical lab results or remote AI grade checks confirm the crop is below the requested grade specification, the buyer has the immediate statutory right to initiate returns.
              </p>
              <p>
                ⚖️ **Instant Escrow Refund**: Approved quality returns trigger a 100% immediate automatic refund to the buyer's balance.
              </p>
            </div>
          </div>
        </div>

        {/* ACTIVE INSPECTION LISTS & REPORTS - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
            <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Quality Inspection Logs</span>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                {inspections.length} Reports
              </span>
            </h3>

            {inspections.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <FlaskConical className="h-8 w-8 mx-auto text-slate-200 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-wider">No Inspections Booked</p>
                <p className="text-[9px] max-w-sm mx-auto text-slate-500 leading-normal">
                  Schedule your first certified on-site assayer check-up using the scheduler panel to evaluate moisture, aflatoxins, and crop standards.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inspections.map((insp) => {
                  const matchingOrder = orders.find((o) => o.id === insp.orderId);
                  const isRefunded = matchingOrder?.refundStatus === "Refunded";
                  const isRefundPending = matchingOrder?.refundStatus === "Pending Approval";
                  
                  return (
                    <div
                      key={insp.id}
                      className="border border-slate-150 hover:border-slate-250 bg-white rounded-xl p-4 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black font-mono text-slate-800">{insp.id}</span>
                            <span className="text-[9px] text-slate-400 font-bold">({insp.orderId})</span>
                          </div>
                          <p className="text-xs font-black text-slate-800 leading-tight">{insp.cropName}</p>
                        </div>

                        {/* Status tags */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {insp.status === "Report Generated" ? (
                            <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              insp.certifiedGrade === insp.orderedGrade
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800 animate-pulse"
                            }`}>
                              {insp.certifiedGrade === insp.orderedGrade ? "✓ Grade Verified" : "⚠️ Grade Mismatch"}
                            </span>
                          ) : (
                            <span className="text-[8px] font-black bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                              {insp.status}
                            </span>
                          )}

                          {isRefunded && (
                            <span className="text-[8px] font-black bg-red-100 text-red-800 px-2 py-0.5 rounded uppercase">
                              REJECTED & REFUNDED
                            </span>
                          )}
                          {isRefundPending && (
                            <span className="text-[8px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase animate-pulse">
                              REFUND PENDING
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Schedule parameters */}
                      <div className="bg-slate-50 p-2.5 rounded-lg grid grid-cols-3 gap-2 text-[9px] font-mono text-slate-500 border border-slate-100">
                        <div>
                          <p className="font-bold uppercase text-[8px] text-slate-400">Assay Date</p>
                          <p className="font-semibold text-slate-700 mt-0.5">{insp.scheduledDate}</p>
                        </div>
                        <div>
                          <p className="font-bold uppercase text-[8px] text-slate-400">Assay Time</p>
                          <p className="font-semibold text-slate-700 mt-0.5">{insp.scheduledTime}</p>
                        </div>
                        <div>
                          <p className="font-bold uppercase text-[8px] text-slate-400">Lab Analysis</p>
                          <p className="font-semibold text-slate-700 mt-0.5">{insp.labTesting ? "🧪 Advanced" : "✓ Physical Only"}</p>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 font-medium leading-relaxed italic bg-slate-50/50 p-2 rounded-lg border border-dashed border-slate-200">
                        💬 <strong className="font-bold text-slate-700">Remarks:</strong> {insp.remarks}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                        {/* Simulation triggers */}
                        {insp.status !== "Report Generated" ? (
                          <button
                            onClick={() => handleSimulateInspectionProgress(insp.id)}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase rounded border border-indigo-150 cursor-pointer flex items-center gap-1.5"
                          >
                            <RefreshCw className="h-3 w-3 animate-spin" /> Advance Simulation Status
                          </button>
                        ) : (
                          <div className="text-[9px] text-slate-400 font-mono">
                            VERIFIED BY: <span className="font-bold text-slate-600">{insp.inspectorName}</span>
                          </div>
                        )}

                        {insp.status === "Report Generated" && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenReport(insp)}
                              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[9px] font-black uppercase rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-3xs"
                            >
                              <FileText className="h-3 w-3" /> View Quality Certificate (PDF)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ON-SITE INSPECTION PDF MODAL REPORT */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showReportModal && currentViewingInspection && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-150 overflow-hidden relative"
            >
              <button
                onClick={() => setShowReportModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* PDF Document Styling Wrapper */}
              <div className="space-y-6">
                
                {/* PDF Header Block */}
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🛡️</span>
                      <h4 className="font-black text-slate-900 text-sm tracking-tight uppercase">AgriConnect Laboratory Network</h4>
                    </div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">NABL ACCREDITATION NO: MC-9912 / ISO 9001:2015</p>
                    <p className="text-[9px] text-slate-500 font-medium">Headquarters: Pusa Hill Crop Science Complex, New Delhi - 110012</p>
                  </div>
                  <div className="text-right font-mono text-[9px] space-y-0.5 text-slate-500">
                    <p>REPORT NO: <span className="font-bold text-slate-800">{currentViewingInspection.id}-PDF</span></p>
                    <p>DATE ASSAYED: <span className="font-bold text-slate-800">{currentViewingInspection.verifiedAt || "2026-07-05"}</span></p>
                    <p>STATUS: <span className="text-emerald-700 font-black">✓ OFFICIAL CERTIFICATE</span></p>
                  </div>
                </div>

                {/* PDF Document Title */}
                <div className="text-center bg-slate-50 border border-slate-200 py-3 rounded-lg">
                  <h3 className="font-black text-slate-950 text-xs uppercase tracking-widest font-mono">CERTIFICATE OF INDEPENDENT AGRICULTURAL QUALITY ASSAY</h3>
                </div>

                {/* Logistics Metadata */}
                <div className="grid grid-cols-2 gap-4 text-[10px] font-mono border-b border-slate-150 pb-4">
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase text-[8px] font-bold font-sans">1. Consignment Details</p>
                    <p><strong className="text-slate-700">Contract ID:</strong> {currentViewingInspection.orderId}</p>
                    <p><strong className="text-slate-700">Lot ID:</strong> {currentViewingInspection.lotId}</p>
                    <p><strong className="text-slate-700">Crop Name:</strong> {currentViewingInspection.cropName}</p>
                    <p><strong className="text-slate-700">Consigned Qty:</strong> {currentViewingInspection.quantity} Metric Tons</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 uppercase text-[8px] font-bold font-sans">2. Sourcing Node Details</p>
                    <p><strong className="text-slate-700">Farmer Name:</strong> {currentViewingInspection.farmerName}</p>
                    <p><strong className="text-slate-700">Assay Location:</strong> Regional Mandi Cooperative Yard</p>
                    <p><strong className="text-slate-700">Inspector Name:</strong> {currentViewingInspection.inspectorName}</p>
                    <p><strong className="text-slate-700">Analysis Type:</strong> {currentViewingInspection.labTesting ? "Laboratory Gas Chromatography" : "Physical Organoleptic Assay"}</p>
                  </div>
                </div>

                {/* Core Grains Metric Table */}
                <div className="space-y-2">
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">3. Laboratory Analytical Parameters</p>
                  <table className="w-full text-left font-mono text-[10px] border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold uppercase text-[8px] border-b border-slate-250">
                        <th className="py-2 px-3">Analyzed Parameter</th>
                        <th className="py-2 px-3">Tested Metric Value</th>
                        <th className="py-2 px-3">Standard Guideline Limit (Grade A)</th>
                        <th className="py-2 px-3 text-right">Result Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">Moisture Content</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{currentViewingInspection.moisture}%</td>
                        <td className="py-2.5 px-3 text-slate-500">Max 14.0%</td>
                        <td className={`py-2.5 px-3 text-right font-black uppercase text-[8px] ${currentViewingInspection.moisture <= 14.0 ? 'text-emerald-700' : 'text-rose-700 animate-pulse'}`}>
                          {currentViewingInspection.moisture <= 14.0 ? '✓ COMPLIANT' : '❌ OUT-OF-RANGE'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">Foreign Matter & Admixture</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{currentViewingInspection.foreignMatter}%</td>
                        <td className="py-2.5 px-3 text-slate-500">Max 1.0%</td>
                        <td className={`py-2.5 px-3 text-right font-black uppercase text-[8px] ${currentViewingInspection.foreignMatter <= 1.0 ? 'text-emerald-700' : 'text-rose-700 animate-pulse'}`}>
                          {currentViewingInspection.foreignMatter <= 1.0 ? '✓ COMPLIANT' : '❌ OUT-OF-RANGE'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-700">Broken Grain Ratio</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{currentViewingInspection.brokenGrains}%</td>
                        <td className="py-2.5 px-3 text-slate-500">Max 3.0%</td>
                        <td className={`py-2.5 px-3 text-right font-black uppercase text-[8px] ${currentViewingInspection.brokenGrains <= 3.0 ? 'text-emerald-700' : 'text-rose-700 animate-pulse'}`}>
                          {currentViewingInspection.brokenGrains <= 3.0 ? '✓ COMPLIANT' : '❌ OUT-OF-RANGE'}
                        </td>
                      </tr>
                      {currentViewingInspection.labTesting && (
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">Aflatoxin (Toxic Mold Mycotoxin)</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{currentViewingInspection.aflatoxin} ppb</td>
                          <td className="py-2.5 px-3 text-slate-500">Max 15.0 ppb</td>
                          <td className={`py-2.5 px-3 text-right font-black uppercase text-[8px] ${currentViewingInspection.aflatoxin <= 15.0 ? 'text-emerald-700' : 'text-rose-700 animate-pulse'}`}>
                            {currentViewingInspection.aflatoxin <= 15.0 ? '✓ COMPLIANT' : '❌ OUT-OF-RANGE'}
                          </td>
                        </tr>
                      )}
                      {currentViewingInspection.testType === "pesticide_residue" && currentViewingInspection.pesticideResidue !== undefined && (
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">Pesticide Residue Analysis</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{currentViewingInspection.pesticideResidue} ppm</td>
                          <td className="py-2.5 px-3 text-slate-500">Max 0.01 ppm</td>
                          <td className={`py-2.5 px-3 text-right font-black uppercase text-[8px] ${currentViewingInspection.pesticideResidue <= 0.01 ? 'text-emerald-700' : 'text-rose-700 animate-pulse'}`}>
                            {currentViewingInspection.pesticideResidue <= 0.01 ? '✓ COMPLIANT' : '❌ OUT-OF-RANGE'}
                          </td>
                        </tr>
                      )}
                      {currentViewingInspection.testType === "nutrient_content" && currentViewingInspection.nutrientProtein !== undefined && (
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">Nutritional Protein Content</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{currentViewingInspection.nutrientProtein}%</td>
                          <td className="py-2.5 px-3 text-slate-500">Min 11.0%</td>
                          <td className={`py-2.5 px-3 text-right font-black uppercase text-[8px] ${currentViewingInspection.nutrientProtein >= 11.0 ? 'text-emerald-700' : 'text-rose-700 animate-pulse'}`}>
                            {currentViewingInspection.nutrientProtein >= 11.0 ? '✓ COMPLIANT' : '❌ OUT-OF-RANGE'}
                          </td>
                        </tr>
                      )}
                      {currentViewingInspection.testType === "freshness" && currentViewingInspection.freshnessIndex !== undefined && (
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-700">Grain Freshness Index</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{currentViewingInspection.freshnessIndex}%</td>
                          <td className="py-2.5 px-3 text-slate-500">Min 80%</td>
                          <td className={`py-2.5 px-3 text-right font-black uppercase text-[8px] ${currentViewingInspection.freshnessIndex >= 80 ? 'text-emerald-700' : 'text-rose-700 animate-pulse'}`}>
                            {currentViewingInspection.freshnessIndex >= 80 ? '✓ COMPLIANT' : '❌ OUT-OF-RANGE'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Defects & AI Recommendation overlay (if present) */}
                {(currentViewingInspection.defectsDetected || currentViewingInspection.recommendation) && (
                  <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-150 grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider font-sans">Defects Detected</p>
                      {currentViewingInspection.defectsDetected && currentViewingInspection.defectsDetected.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {currentViewingInspection.defectsDetected.map((defect: string, idx: number) => (
                            <span key={idx} className="bg-rose-100 border border-rose-200 text-rose-800 text-[8px] font-bold px-2 py-0.5 rounded uppercase font-sans">
                              ⚠️ {defect}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[9px] text-emerald-800 font-bold flex items-center gap-1 font-sans">
                          ✓ No defects detected.
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider font-sans">AI Decision Recommendation</p>
                      <p className={`text-[10px] font-black uppercase ${
                        currentViewingInspection.recommendation === "Approve" ? "text-emerald-700" : "text-rose-700"
                      }`}>
                        {currentViewingInspection.recommendation === "Approve" ? "🟩 RECOMMENDED: APPROVE" : "🟥 RECOMMENDED: REJECT"}
                      </p>
                      <p className="text-[8px] text-slate-500 font-medium leading-tight font-sans">
                        {currentViewingInspection.recommendation === "Approve"
                          ? "Grains demonstrate pristine geometry and metrics. Ready for collection."
                          : "Defects breach compliance standards. Return/refund recommended."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Grade Confirmation Display */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[8px] text-slate-400 font-black uppercase">4. Quality Grade Confirmation</p>
                    <div className="flex items-center gap-3">
                      <div className="text-xs">
                        <span className="text-slate-400 font-mono">CONTRACTED SPEC:</span>{" "}
                        <strong className="font-bold text-slate-800 font-mono bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">{currentViewingInspection.orderedGrade}</strong>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      <div className="text-xs">
                        <span className="text-slate-400 font-mono">LAB CERTIFIED SPEC:</span>{" "}
                        <strong className={`font-black font-mono px-2 py-0.5 rounded text-[10px] ${
                          currentViewingInspection.certifiedGrade === currentViewingInspection.orderedGrade
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}>{currentViewingInspection.certifiedGrade}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[8px] text-slate-400 font-black uppercase">Certificate Status</p>
                    <p className={`text-xs font-black uppercase tracking-wider font-mono ${
                      currentViewingInspection.certifiedGrade === currentViewingInspection.orderedGrade
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                    }`}>
                      {currentViewingInspection.certifiedGrade === currentViewingInspection.orderedGrade
                        ? '🟢 Approved / Compliant'
                        : '🔴 Grade Discrepancy Found'}
                    </p>
                  </div>
                </div>

                {/* Remarks & Signatures */}
                <div className="space-y-3 font-mono text-[9px] text-slate-500">
                  <p>
                    <strong className="font-bold text-slate-700">INSPECTOR CONCLUSION:</strong> {currentViewingInspection.remarks}
                  </p>
                  <div className="flex justify-between items-end pt-4 border-t border-slate-150">
                    <p>Digital Cryptographic ID Hash: <span className="text-[8px] text-slate-400">0x9FA238BC2198DF7764A91B8721</span></p>
                    <div className="text-right">
                      <p className="font-bold uppercase text-[8px] text-slate-400">AUTHORIZED DIGITAL SEAL</p>
                      <p className="font-black text-slate-800 font-serif italic mt-0.5">AgriConnect Labs Bureau</p>
                    </div>
                  </div>
                </div>

                {/* Grade mismatch warning & action */}
                {currentViewingInspection.certifiedGrade !== currentViewingInspection.orderedGrade && (
                  <div className="bg-red-50 border border-red-150 rounded-xl p-4 space-y-3.5">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-red-800 tracking-wide">QUALITY ANOMALY DISRUPTS SPECIFICATIONS</h4>
                        <p className="text-[9px] text-red-700 leading-normal mt-0.5 font-medium">
                          The physical crop parameters checked at the farm do not comply with the {currentViewingInspection.orderedGrade} specification outlined in the contract. Under the AgriConnect escrow framework, you are fully authorized to refuse dispatch and initiate an escrow refund dispute.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleOpenRefundRequest}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all shadow-xs"
                      >
                        🚨 Initiate Return / Escrow Refund Request
                      </button>
                    </div>
                  </div>
                )}

                {/* Print/Download controls footer */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 font-sans">
                  <span className="text-[8px] text-slate-400">PDF generated in compliance with Ministry of Agricultural Procurement Guidelines.</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Printer className="h-3.5 w-3.5" /> Print
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Mock PDF report successfully saved to your downloads directory.")}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* INITIATE RETURN / REFUND FORM MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showRefundModal && currentViewingInspection && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative"
            >
              <button
                onClick={() => setShowRefundModal(false)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShieldAlert className="h-5 w-5 text-red-600 animate-pulse" />
                  <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Escrow Refund & Contract Dispute</h3>
                </div>

                {refundSuccess ? (
                  <div className="py-6 text-center space-y-3">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100 shadow-3xs animate-bounce">
                      <Check className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase text-slate-800">Refund Claim Successfully Filed!</h4>
                      <p className="text-[9px] text-slate-500 max-w-xs mx-auto leading-normal mt-1 font-medium">
                        Your claim has been authenticated with SGS laboratory findings. Funds have been flagged in escrow and are queued for automatic return reversal.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitRefund} className="space-y-4">
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      You are registering a quality dispute against Contract <strong className="text-slate-800 font-bold">{currentViewingInspection.orderId}</strong> based on Certified Certificate findings (<strong className="text-red-700 font-extrabold">{currentViewingInspection.certifiedGrade}</strong> instead of {currentViewingInspection.orderedGrade}).
                    </p>

                    {/* Refund Reason */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Dispute Category</label>
                      <select
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-medium text-slate-800"
                      >
                        <option value="Quality below standard">Quality metrics below contract standards</option>
                        <option value="Severe moisture/Rot risk">Elevated moisture content / Rot hazard</option>
                        <option value="Insect infestation">Insects / pest infestation detected</option>
                        <option value="Foreign materials admix">Foreign matter admix exceeding limit</option>
                      </select>
                    </div>

                    {/* Refund Description */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Detailed Description of Defect</label>
                      <textarea
                        required
                        value={refundDescription}
                        onChange={(e) => setRefundDescription(e.target.value)}
                        placeholder="Please write down explicit observations (e.g., Moisture read 16.8% instead of contract's 14.0% limit. Grains smell moldy.)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 min-h-[90px] font-medium"
                      />
                    </div>

                    {/* Return logistics disclaimer */}
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[9px] text-amber-800 leading-normal flex gap-1.5 font-medium">
                      <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold uppercase text-[8px] tracking-wide">Sourcing Fleet Diverted</p>
                        <p className="text-[8px] text-amber-700/80 mt-0.5">
                          Since the crop has not left the farm premises yet, confirming this refund will automatically cancel the logistics booking and free up the carrier.
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer transition-colors text-center flex items-center justify-center gap-2"
                    >
                      <ShieldAlert className="h-4.5 w-4.5" /> Submit Claim & Reverse Escrow
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
