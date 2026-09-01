import React, { useState, useMemo, useEffect } from "react";
import {
  Award,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Upload,
  CreditCard,
  DollarSign,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Download,
  Star,
  Zap,
  Info,
  Calendar,
  Layers,
  Sparkles,
  User,
  ExternalLink,
  RefreshCw,
  Search,
  Check,
  X,
  Globe,
  FlaskConical,
  AlertTriangle
} from "lucide-react";
import { getAuditTrail, addAuditEntry, AuditLogEntry } from "../../utils/auditLogger";

interface CertificationHubProps {
  onClose: () => void;
  trustScore: number;
  onUpdateCertificates: (approvedCerts: string[]) => void;
}

interface Application {
  id: string;
  typeId: string;
  typeName: string;
  submittedAt: string;
  feePaid: number;
  paymentMethod: string;
  status: "Submitted" | "Under Review" | "Approved" | "Rejected";
  documentName: string;
  documentType: string;
  rejectionReason?: string;
  approvedAt?: string;
  certificateNumber?: string;
}

interface CertType {
  id: string;
  name: string;
  authority: string;
  description: string;
  validityYears: number;
  fee: number;
  requiredDocs: string[];
  badgeColor: string;
}

const CERT_TYPES: CertType[] = [
  {
    id: "gov-approved",
    name: "Government-Approved Supplier",
    authority: "National Agricultural Board of India (NAB)",
    description: "Highest state recognition, unlocks federal seed subsidies, cooperative supply quota prioritization, and public procurement bidding rights.",
    validityYears: 3,
    fee: 5000,
    requiredDocs: ["Wholesale Seed Trading License", "GST-3B Filing history", "Audited financial declarations"],
    badgeColor: "from-amber-500 to-yellow-600"
  },
  {
    id: "organic-certified",
    name: "Organic Certified (NPOP / USDA Equivalent)",
    authority: "APEDA (Agricultural & Processed Food Products Export Development Authority)",
    description: "Validates all input batches are 100% organic, chemical-free, and comply with the National Programme for Organic Production standards.",
    validityYears: 2,
    fee: 7500,
    requiredDocs: ["NPOP soil testing logs", "Raw inputs tracing report", "Intertek chemical residue clearance report"],
    badgeColor: "from-emerald-500 to-teal-700"
  },
  {
    id: "iso-9001",
    name: "ISO 9001:2015 Quality Management",
    authority: "International Quality Registrar (IQR-India)",
    description: "Certifies world-class warehousing operations, customer grievance protocols, packaging resilience, and batch shipment tracking pipelines.",
    validityYears: 5,
    fee: 10000,
    requiredDocs: ["Corporate Quality manual", "Standard operating procedures (SOP)", "Internal audit assessment sheet"],
    badgeColor: "from-blue-500 to-indigo-700"
  },
  {
    id: "fssai-license",
    name: "FSSAI Food-Safety License",
    authority: "Food Safety and Standards Authority of India",
    description: "Mandatory compliance certifying safety, packaging hygiene, and contamination-free handling of agricultural edible outputs.",
    validityYears: 5,
    fee: 3500,
    requiredDocs: ["FSSAI Registration application", "Water potability test report", "Warehouse fire-clearance certificate"],
    badgeColor: "from-cyan-500 to-teal-600"
  },
  {
    id: "export-quality",
    name: "Export Quality Certified (EQC)",
    authority: "Export Inspection Agency of India (EIA)",
    description: "Validates compliance with phytosanitary international standards, enabling high-volume shipments to APAC, Europe, and Middle East cooperatives.",
    validityYears: 3,
    fee: 8000,
    requiredDocs: ["Phytosanitary laboratory test", "Customs IE Code registration", "Cold storage validation certificate"],
    badgeColor: "from-purple-500 to-fuchsia-700"
  }
];

export default function CertificationHub({ onClose, trustScore, onUpdateCertificates }: CertificationHubProps) {
  // Application listing and state
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem("agriconnect_supplier_applications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default initial portfolio for testing (matching requested seed certifications)
    return [
      {
        id: "CERT-APP-1001",
        typeId: "gov-approved",
        typeName: "Government-Approved Supplier",
        submittedAt: "2026-05-10",
        feePaid: 5000,
        paymentMethod: "UPI Direct Transfer",
        status: "Approved",
        documentName: "gov_wholesale_seed_license.pdf",
        documentType: "Trading License",
        approvedAt: "2026-05-15",
        certificateNumber: "NAB-GOV-2026-4921"
      },
      {
        id: "CERT-APP-1002",
        typeId: "iso-9001",
        typeName: "ISO 9001:2015 Quality Management",
        submittedAt: "2026-06-15",
        feePaid: 10000,
        paymentMethod: "Corporate Credit Line",
        status: "Under Review",
        documentName: "iso_qms_v2_signed.pdf",
        documentType: "Quality Manual & SOP"
      },
      {
        id: "CERT-APP-1003",
        typeId: "organic-certified",
        typeName: "Organic Certified (NPOP / USDA Equivalent)",
        submittedAt: "2026-07-01",
        feePaid: 7500,
        paymentMethod: "UPI Direct Transfer",
        status: "Submitted",
        documentName: "organic_soil_logs_current.pdf",
        documentType: "Soil Testing Logs"
      }
    ];
  });

  // Current selected tab: "portfolio" or "apply" or "compliance"
  const [activeTab, setActiveTab] = useState<"portfolio" | "apply" | "compliance">("portfolio");

  // 9.2 Compliance Dashboard state
  const [complianceSubTab, setComplianceSubTab] = useState<"regulatory" | "export" | "audit">("regulatory");
  
  // 9.3 Audit Trail States
  const [auditSearch, setAuditSearch] = useState<string>("");
  const [auditCategory, setAuditCategory] = useState<"all" | "login" | "product" | "order" | "inventory">("all");
  const [auditList, setAuditList] = useState<AuditLogEntry[]>([]);
  
  // Load audit trail whenever tab changes
  useEffect(() => {
    if (activeTab === "compliance" && complianceSubTab === "audit") {
      setAuditList(getAuditTrail());
    }
  }, [activeTab, complianceSubTab]);

  const filteredAudits = useMemo(() => {
    return auditList.filter(log => {
      const matchesCategory = auditCategory === "all" || log.category === auditCategory;
      const searchLower = auditSearch.toLowerCase();
      const matchesSearch = 
        log.action.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower) ||
        log.user.toLowerCase().includes(searchLower) ||
        log.id.toLowerCase().includes(searchLower) ||
        log.ipAddress.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [auditList, auditCategory, auditSearch]);

  const handleExportAuditPDF = () => {
    const currentDateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    });

    const rowsHTML = filteredAudits.map(log => `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 10.5px;">
        <td style="padding: 10px; font-family: monospace; color: #64748b;">${new Date(log.timestamp).toLocaleString()}</td>
        <td style="padding: 10px; font-family: monospace; font-weight: bold; color: #334155;">${log.id}</td>
        <td style="padding: 10px;">
          <span style="padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; ${
            log.category === "login" ? "background-color: #dbeafe; color: #1e40af;" :
            log.category === "product" ? "background-color: #d1fae5; color: #065f46;" :
            log.category === "order" ? "background-color: #f3e8ff; color: #581c87;" :
            "background-color: #fef3c7; color: #92400e;"
          }">${log.category}</span>
        </td>
        <td style="padding: 10px; font-weight: bold; color: #1e293b;">${log.action}</td>
        <td style="padding: 10px; color: #475569; line-height: 1.4;">${log.details}</td>
        <td style="padding: 10px; font-family: monospace; font-weight: 600; color: #64748b;">${log.user}</td>
        <td style="padding: 10px; font-family: monospace; color: #94a3b8;">${log.ipAddress}</td>
      </tr>
    `).join("");

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AgriConnect Compliance Audit Ledger - Export</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            .no-print { display: none; }
            body { padding: 0; background: white; }
            @page { margin: 1.5cm; }
        }
    </style>
</head>
<body class="bg-slate-50 p-6 md:p-12 text-slate-800 font-sans">
    <div class="max-w-6xl mx-auto bg-white border border-slate-300 rounded-3xl p-10 shadow-lg relative overflow-hidden">
        
        <!-- Watermark -->
        <div class="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none">
            <h1 class="text-9xl font-black rotate-45 uppercase">CONFIDENTIAL AUDIT</h1>
        </div>

        <!-- Action bar -->
        <div class="no-print flex justify-between items-center mb-8 pb-5 border-b border-slate-200">
            <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-amber-500 rounded-full animate-ping"></span>
                <span class="text-xs text-slate-500 font-black tracking-widest uppercase">AGRICONNECT COMPLIANCE ASSURANCE SECURE SYSTEM</span>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="window.print()" class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
                    🖨️ PRINT / SAVE TO COMPLIANCE PDF
                </button>
            </div>
        </div>

        <!-- Letterhead Header -->
        <div class="flex justify-between items-start mb-10 pb-6 border-b-2 border-slate-900">
            <div class="space-y-1">
                <h1 class="text-3xl font-black uppercase tracking-tight text-slate-900">AgriConnect Supplier Network</h1>
                <p class="text-sm font-black uppercase tracking-widest text-amber-600">Secure Audit trail & Compliance Ledger</p>
                <p class="text-xs text-slate-400 font-mono">Governed strictly via Agricultural Policy Audits & APEDA Standards</p>
            </div>
            <div class="text-right space-y-1">
                <div class="inline-block p-1 bg-amber-50 border border-amber-200 text-amber-800 font-mono font-black text-[9px] rounded uppercase tracking-widest mb-2">
                    ✓ SECURITY LEVEL: RESTRICTED
                </div>
                <p class="text-xs text-slate-500 font-bold">Report Date: ${currentDateStr}</p>
                <p class="text-xs text-slate-500 font-bold">Generated By: jakkireddyeswarreddy@gmail.com</p>
                <p class="text-xs text-slate-400 font-mono">System ID: AGR-SUP-AUD-7749</p>
            </div>
        </div>

        <!-- System overview -->
        <div class="grid grid-cols-4 gap-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-left">
            <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">Total Activities</span>
                <p class="text-2xl font-black text-slate-800 font-mono">${filteredAudits.length}</p>
            </div>
            <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">Security Gateways</span>
                <p class="text-sm font-bold text-emerald-700 font-mono">● Active / Enforced</p>
            </div>
            <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">Database Engine</span>
                <p class="text-sm font-bold text-slate-700 font-mono">Local-Secure Vault</p>
            </div>
            <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400">Compliance Audit Status</span>
                <p class="text-sm font-black text-amber-700 font-mono">READY FOR REVIEW</p>
            </div>
        </div>

        <!-- Ledger Table -->
        <div class="mb-10 text-left">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-200 pb-1.5">Activity Record List</h3>
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-100 border-b-2 border-slate-300 text-[10px] font-black uppercase tracking-wider text-slate-600">
                        <th class="py-2 px-3">Timestamp</th>
                        <th class="py-2 px-2">ID</th>
                        <th class="py-2 px-2">Category</th>
                        <th class="py-2 px-2">Action / Event Name</th>
                        <th class="py-2 px-3">Action Description</th>
                        <th class="py-2 px-2">Actor (User)</th>
                        <th class="py-2 px-2">IP Address</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHTML || `<tr><td colspan="7" class="py-10 text-center text-slate-400 font-bold italic text-xs">No active compliance audits in current selection window.</td></tr>`}
                </tbody>
            </table>
        </div>

        <!-- Validation footer -->
        <div class="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 items-end">
            <div class="text-[9.5px] text-slate-400 leading-relaxed font-sans font-medium text-left">
                * This document constitutes a legally certified transaction history and security state ledger of AgriConnect's local and cloud persistence interfaces. It has been signed off digitally under AES-256 standard and complies with regional ISO 27001 procurement auditing standards.
            </div>
            <div class="text-right space-y-2">
                <p class="text-[8px] font-black uppercase text-slate-400">Cryptographic Seal Authorized Signature</p>
                <div class="inline-block p-1 bg-amber-50 border border-amber-200 text-amber-800 font-mono font-black text-[9.5px] rounded uppercase tracking-widest">
                    ✓ SECURE_GATE_COMPLIANCE_PASS_7749
                </div>
                <p class="text-[10px] text-slate-500 font-bold">AgriConnect Central Audit Controller</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AgriConnect_Compliance_Audit_Trail_Report_${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    triggerFeedback("📥 Exported professional audit ledger. Open downloaded report to print to PDF.");
  };
  
  // GST States
  const [gstin, setGstin] = useState<string>("29AAAAA1111A1Z1");
  const [gstr1Status, setGstr1Status] = useState<string>("Filed (June 2026)");
  const [gstr3bStatus, setGstr3bStatus] = useState<string>("Filed (June 2026)");
  const [gstHistory, setGstHistory] = useState(() => {
    const saved = localStorage.getItem("agriconnect_supplier_gst_history");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { period: "June 2026", type: "GSTR-1", filedAt: "2026-07-10", status: "Filed", arn: "ARN290626019482" },
      { period: "June 2026", type: "GSTR-3B", filedAt: "2026-07-10", status: "Filed", arn: "ARN290626019485" },
      { period: "May 2026", type: "GSTR-1", filedAt: "2026-06-11", status: "Filed", arn: "ARN290526012491" },
      { period: "May 2026", type: "GSTR-3B", filedAt: "2026-06-12", status: "Filed", arn: "ARN290526012493" }
    ];
  });
  
  const [isFilingGst, setIsFilingGst] = useState(false);
  const [gstFilingPeriod, setGstFilingPeriod] = useState("July 2026");
  const [gstFilingStep, setGstFilingStep] = useState<"review" | "otp" | "success">("review");
  const [gstOtpInput, setGstOtpInput] = useState("");
  const [gstFilingLoading, setGstFilingLoading] = useState(false);

  // License Expiry States (Alerts for upcoming expiry)
  const [licenses, setLicenses] = useState(() => {
    const saved = localStorage.getItem("agriconnect_supplier_licenses");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "lic-fssai", name: "FSSAI Food-Safety License", typeId: "fssai-license", authority: "Food Safety & Standards Authority", expiryDate: "2026-08-01", status: "Active" },
      { id: "lic-organic", name: "NPOP Organic Soil Certification", typeId: "organic-certified", authority: "APEDA India", expiryDate: "2026-08-15", status: "Active" },
      { id: "lic-iso", name: "ISO 9001:2015 Quality Standards", typeId: "iso-9001", authority: "IQR-India Registrars", expiryDate: "2031-06-15", status: "Active" },
      { id: "lic-seed", name: "Wholesale Seed Trading License", typeId: "gov-approved", authority: "National Agricultural Board (NAB)", expiryDate: "2026-07-28", status: "Active" }
    ];
  });

  // Product Safety Certifications mapping product to safety reports
  const [products, setProducts] = useState<any[]>(() => {
    // Read localItems
    const stored = localStorage.getItem("agriconnect_supplier_items");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: "prod-1", name: "Organic Basmati Rice (Premium)", category: "Seeds" },
      { id: "prod-2", name: "Hybrid Mustard Seeds (M-11)", category: "Seeds" },
      { id: "prod-3", name: "Kashmiri Red Chili Powder", category: "Seeds" },
      { id: "prod-4", name: "Sulphur-Free Potash Bio-Fertilizer", category: "Fertilizers" }
    ];
  });

  const [productSafety, setProductSafety] = useState(() => {
    const saved = localStorage.getItem("agriconnect_supplier_product_safety");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      "prod-1": { pesticideResidue: "Compliant", heavyMetals: "Compliant", moistureLevel: "Optimal (11.8%)", lastTested: "2026-06-10", reports: ["HeavyMetal_Basmati_Passed.pdf", "PesticideResidue_Basmati_Passed.pdf"] },
      "prod-2": { pesticideResidue: "Compliant", heavyMetals: "Compliant", moistureLevel: "Optimal (7.2%)", lastTested: "2026-06-18", reports: ["MustardSeeds_Pesticides_Compliant.pdf"] },
      "prod-3": { pesticideResidue: "Under Evaluation", heavyMetals: "Compliant", moistureLevel: "Warning (14.2% - High)", lastTested: "2026-07-02", reports: ["RedChili_HeavyMetals_Passed.pdf"] },
      "prod-4": { pesticideResidue: "Not Applicable", heavyMetals: "Compliant", moistureLevel: "Dry Powder (2.4%)", lastTested: "2026-05-22", reports: [] }
    };
  });

  const [selectedProductId, setSelectedProductId] = useState<string>("prod-1");
  const [testingProductId, setTestingProductId] = useState<string | null>(null);
  const [testingStep, setTestingStep] = useState<string>("");
  const [testingProgress, setTestingProgress] = useState<number>(0);

  // Phytosanitary Certificate State
  const [phytoCropId, setPhytoCropId] = useState<string>("prod-1");
  const [phytoWeight, setPhytoWeight] = useState<string>("24");
  const [phytoCountry, setPhytoCountry] = useState<string>("EU");
  const [phytoConsignee, setPhytoConsignee] = useState<string>("EuroAgri Cooperatives GmbH");
  const [phytoApplications, setPhytoApplications] = useState(() => {
    const saved = localStorage.getItem("agriconnect_supplier_phyto_apps");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "PSC-IN-EU-4819", cropName: "Organic Basmati Rice (Premium)", weight: "20 MT", country: "EU", consignee: "EuroAgri Cooperatives GmbH", date: "2026-06-25", status: "Approved", certificateNo: "PSC-948122-EU" }
    ];
  });
  const [isRequestingPhyto, setIsRequestingPhyto] = useState(false);
  const [phytoStep, setPhytoStep] = useState<"input" | "labs" | "success">("input");
  const [phytoLabProgress, setPhytoLabProgress] = useState(0);
  const [phytoLabMessage, setPhytoLabMessage] = useState("");
  const [activePhytoCert, setActivePhytoCert] = useState<any | null>(null);

  // Country Readiness Auditor
  const [auditCountry, setAuditCountry] = useState<"EU" | "USA" | "Japan">("EU");
  const [auditProductId, setAuditProductId] = useState<string>("prod-1");
  const [countryRegistrations, setCountryRegistrations] = useState(() => {
    const saved = localStorage.getItem("agriconnect_supplier_country_regs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      "EU": true,
      "USA": false,
      "Japan": false
    };
  });
  const [isRegisteringCountry, setIsRegisteringCountry] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem("agriconnect_supplier_gst_history", JSON.stringify(gstHistory));
  }, [gstHistory]);

  useEffect(() => {
    localStorage.setItem("agriconnect_supplier_licenses", JSON.stringify(licenses));
  }, [licenses]);

  useEffect(() => {
    localStorage.setItem("agriconnect_supplier_product_safety", JSON.stringify(productSafety));
  }, [productSafety]);

  useEffect(() => {
    localStorage.setItem("agriconnect_supplier_phyto_apps", JSON.stringify(phytoApplications));
  }, [phytoApplications]);

  useEffect(() => {
    localStorage.setItem("agriconnect_supplier_country_regs", JSON.stringify(countryRegistrations));
  }, [countryRegistrations]);

  // Apply form state
  const [selectedTypeId, setSelectedTypeId] = useState<string>("gov-approved");
  const [docName, setDocName] = useState<string>("");
  const [docTypeSelected, setDocTypeSelected] = useState<string>("Trading License");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false);

  // View specific active certificate certificate details modal
  const [selectedCertificate, setSelectedCertificate] = useState<Application | null>(null);

  // Feedback notifications
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Track and save applications
  const saveApplications = (updated: Application[]) => {
    setApplications(updated);
    localStorage.setItem("agriconnect_supplier_applications", JSON.stringify(updated));
    
    // Notify the parent SupplierView about newly approved certificates
    const approvedCerts = updated
      .filter(app => app.status === "Approved")
      .map(app => app.typeId);
    onUpdateCertificates(approvedCerts);
  };

  // Sync state with parent on mounting
  useEffect(() => {
    const approvedCerts = applications
      .filter(app => app.status === "Approved")
      .map(app => app.typeId);
    onUpdateCertificates(approvedCerts);
  }, []);

  const triggerFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4500);
  };

  const selectedTypeDetails = useMemo(() => {
    return CERT_TYPES.find(c => c.id === selectedTypeId) || CERT_TYPES[0];
  }, [selectedTypeId]);

  // Simulate file upload
  const handleSimulatedFileUpload = (mockFile: string) => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      setIsUploading(false);
      setDocName(mockFile);
      triggerFeedback(`📄 File "${mockFile}" uploaded & scanned for phytosanitary signatures successfully.`);
    }, 800);
  };

  // Handle application submission
  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) {
      alert("Please upload/attach required compliance paperwork to proceed.");
      return;
    }
    setPaymentStep(true);
  };

  const handlePayAndComplete = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      
      const newApp: Application = {
        id: `CERT-APP-${Math.floor(Math.random() * 9000) + 1000}`,
        typeId: selectedTypeDetails.id,
        typeName: selectedTypeDetails.name,
        submittedAt: new Date().toISOString().split("T")[0],
        feePaid: selectedTypeDetails.fee,
        paymentMethod: paymentMethod === "upi" ? "UPI QuickPay" : paymentMethod === "netbank" ? "Corporate Netbanking" : "Government Subsidized Voucher",
        status: "Submitted",
        documentName: docName,
        documentType: docTypeSelected
      };

      saveApplications([newApp, ...applications]);
      triggerFeedback(`🎉 Success! Application fee of ₹${selectedTypeDetails.fee.toLocaleString()} processed. Your request for "${selectedTypeDetails.name}" has been submitted to the National Agri-Permit Council.`);
      
      // Reset form
      setDocName("");
      setPaymentStep(false);
      setActiveTab("portfolio");
    }, 1500);
  };

  // SIMULATOR CONTROLS: To test approval and rejection instantly
  const handleSimulateStatusChange = (appId: string, newStatus: "Approved" | "Rejected") => {
    const updated = applications.map(app => {
      if (app.id === appId) {
        if (newStatus === "Approved") {
          return {
            ...app,
            status: "Approved" as const,
            approvedAt: new Date().toISOString().split("T")[0],
            certificateNumber: `${app.typeId.toUpperCase().slice(0, 4)}-REG-${Math.floor(Math.random() * 900000) + 100000}`,
            rejectionReason: undefined
          };
        } else {
          return {
            ...app,
            status: "Rejected" as const,
            rejectionReason: `Audit team flagged inconsistency in uploaded test reports. Re-upload a valid compliance certificate containing certified seal stamps.`
          };
        }
      }
      return app;
    });

    saveApplications(updated);
    triggerFeedback(`⚡ SIMULATOR: Application ${appId} changed to "${newStatus}"`);
  };

  const handleReapply = (app: Application) => {
    setSelectedTypeId(app.typeId);
    setDocName("");
    setPaymentStep(false);
    setActiveTab("apply");
    triggerFeedback(`🔄 Re-applying for ${app.typeName}. Corrected documents must be uploaded.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-7xl w-full h-[92vh] shadow-2xl relative flex flex-col space-y-5 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-600 shrink-0" />
            <div className="text-left">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">9.1 Compliance Certifications & Badges Hub</h3>
              <p className="text-slate-400 text-[10px] font-semibold">
                Earn global organic badges, ISO quality stamps, FSSAI clearance, and display official credentials on listings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FEEDBACK */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-100/60 rounded-xl text-left flex items-center gap-2 animate-fadeIn shrink-0">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold text-emerald-800 leading-tight">{successMsg}</span>
          </div>
        )}

        {/* WORKSPACE NAVIGATION */}
        <div className="flex items-center justify-between bg-slate-100/60 border border-slate-200/50 p-2 rounded-xl shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab("portfolio"); setPaymentStep(false); }}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === "portfolio" ? "bg-white text-indigo-900 shadow-3xs border border-indigo-100" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-indigo-600" /> Active Portfolio & Tracking
            </button>
            <button
              onClick={() => { setActiveTab("apply"); setPaymentStep(false); }}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === "apply" ? "bg-white text-indigo-900 shadow-3xs border border-indigo-100" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Apply for New Certification
            </button>
            <button
              onClick={() => { setActiveTab("compliance"); setPaymentStep(false); }}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === "compliance" ? "bg-white text-indigo-900 shadow-3xs border border-indigo-100" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 9.2 Compliance & Export Dashboard
            </button>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[9px] uppercase font-black text-slate-400 block leading-none">Supplier Trust Standing</span>
            <span className="text-xs font-black text-emerald-600 font-mono">Rating: {trustScore}% Rating</span>
          </div>
        </div>

        {/* MAIN SPLIT WORKSPACE */}
        <div className="flex-1 flex gap-6 min-h-0">
          
          {/* TAB 1: ACTIVE PORTFOLIO & TRACKING */}
          {activeTab === "portfolio" && (
            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 w-full">
              
              {/* Left Column: Applications Tracker & Audit Boards */}
              <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1">
                <div className="text-left border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Official Certification Registry</h4>
                  <p className="text-[10px] text-slate-400">Track validation stages, review audit reports, and test system workflows</p>
                </div>

                {applications.length === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-2xl text-center space-y-2">
                    <Award className="h-8 w-8 text-slate-300 mx-auto" />
                    <span className="font-extrabold text-xs text-slate-700 block">No application logs on record</span>
                    <p className="text-[10px] text-slate-400 max-w-sm mx-auto">Apply for government approvals, USDA Organics, or ISO clearances to build cooperative market credibility.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {applications.map(app => {
                      const isApproved = app.status === "Approved";
                      const isRejected = app.status === "Rejected";
                      const isReview = app.status === "Under Review" || app.status === "Submitted";
                      
                      return (
                        <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-3xs hover:border-indigo-200 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                            <div>
                              <span className="text-[8px] font-mono font-black uppercase px-2 py-0.5 bg-slate-100 border rounded-md text-slate-500">
                                {app.id}
                              </span>
                              <h5 className="font-black text-xs text-slate-800 mt-1 uppercase tracking-tight">{app.typeName}</h5>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isApproved && (
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-emerald-600" /> Active Approved
                                </span>
                              )}
                              {isReview && (
                                <span className="bg-amber-50 text-amber-800 border border-amber-100 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                  <Clock className="h-3 w-3 text-amber-600" /> {app.status}
                                </span>
                              )}
                              {isRejected && (
                                <span className="bg-rose-50 text-rose-800 border border-rose-100 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                                  <XCircle className="h-3 w-3 text-rose-600" /> Rejected
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 text-[10px]">
                            <div>
                              <span className="text-[8px] uppercase font-black text-slate-400 block">Submitted At</span>
                              <span className="font-bold text-slate-700">{app.submittedAt}</span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase font-black text-slate-400 block">Application Fee</span>
                              <span className="font-bold text-slate-700">₹{app.feePaid.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase font-black text-slate-400 block">Attached Audit Paper</span>
                              <span className="font-bold text-indigo-700 flex items-center gap-1 truncate" title={app.documentName}>
                                <FileText className="h-3 w-3 shrink-0 text-indigo-500" /> {app.documentName}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase font-black text-slate-400 block">Processed Method</span>
                              <span className="font-bold text-slate-700">{app.paymentMethod}</span>
                            </div>
                          </div>

                          {/* Rejection Details */}
                          {isRejected && app.rejectionReason && (
                            <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[9.5px] text-rose-800 font-semibold space-y-1 mt-2">
                              <p className="font-bold flex items-center gap-1">
                                <AlertCircle className="h-3.5 w-3.5 text-rose-600" /> REJECTION REASON:
                              </p>
                              <p className="leading-tight text-rose-900">{app.rejectionReason}</p>
                              <button
                                onClick={() => handleReapply(app)}
                                className="mt-1.5 px-3 py-1 bg-white hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold uppercase rounded-lg text-[8.5px] cursor-pointer transition-colors block"
                              >
                                Re-Apply & Update Documents
                              </button>
                            </div>
                          )}

                          {/* Approved details & certificate button */}
                          {isApproved && (
                            <div className="mt-1 border-t border-slate-100 pt-2 flex items-center justify-between gap-4">
                              <div className="text-[9px]">
                                <span className="text-slate-400 font-semibold">Certificate ID: </span>
                                <code className="font-black text-slate-700">{app.certificateNumber}</code>
                              </div>
                              <button
                                onClick={() => setSelectedCertificate(app)}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1 shadow-3xs"
                              >
                                <Printer className="h-3 w-3 text-indigo-300" /> View Premium Certificate
                              </button>
                            </div>
                          )}

                          {/* INTERACTIVE SIMULATOR EVALUATION CONTROLS */}
                          {!isApproved && (
                            <div className="mt-3.5 bg-slate-50 border border-slate-200 p-2 rounded-xl flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-1 text-[8.5px] font-extrabold text-indigo-900 uppercase">
                                <Zap className="h-3.5 w-3.5 text-amber-500 fill-current" /> Instant Evaluation Sim:
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleSimulateStatusChange(app.id, "Approved")}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[8px] font-black uppercase tracking-wider rounded-md cursor-pointer transition-colors"
                                >
                                  Simulate Approve
                                </button>
                                <button
                                  onClick={() => handleSimulateStatusChange(app.id, "Rejected")}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[8px] font-black uppercase tracking-wider rounded-md cursor-pointer transition-colors"
                                >
                                  Simulate Reject
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Active badges guide & standards checklist */}
              <div className="w-full lg:w-[360px] bg-slate-50 p-4 border border-slate-200 rounded-2xl overflow-y-auto text-left space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Active Trust Badges
                  </h4>
                  <p className="text-[10px] text-slate-400">These official badges are active on your profile and digital listings</p>
                </div>

                <div className="space-y-3">
                  {CERT_TYPES.map(type => {
                    const isPassed = applications.some(app => app.typeId === type.id && app.status === "Approved");
                    return (
                      <div
                        key={type.id}
                        className={`p-3 bg-white border rounded-xl flex items-start gap-3 transition-all ${
                          isPassed ? "border-emerald-200 bg-emerald-50/10 shadow-3xs" : "border-slate-200/60 opacity-60"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isPassed ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400"}`}>
                          <Award className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10.5px] font-extrabold text-slate-800 leading-tight block truncate">
                              {type.name.split("(")[0]}
                            </span>
                            {isPassed ? (
                              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded-md shrink-0">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-md shrink-0">
                                INACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[9.5px] text-slate-400 leading-tight">
                            Authority: {type.authority}
                          </p>
                          {isPassed && (
                            <span className="inline-flex text-[8px] bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-black px-2 py-0.2 rounded-full uppercase tracking-wider shadow-3xs mt-1">
                              ★ Govt Approved Gold Seal
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 bg-indigo-900 text-white rounded-xl space-y-2.5">
                  <h5 className="text-[10.5px] font-black uppercase tracking-tight flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-amber-400" /> Compliance Benchmark
                  </h5>
                  <p className="text-[9px] text-indigo-200 leading-relaxed">
                    Licensed status provides a **1.4x trust multiplier** on search catalogs. Buyers filtering by "Organic" or "ISO Quality" can isolate certified partners in one click.
                  </p>
                  <div className="h-1.5 w-full bg-indigo-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500"
                      style={{ width: `${Math.min(trustScore, 100)}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-mono font-bold block text-indigo-300 text-right">
                    Trust standing: {trustScore}/100 points
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: APPLY FOR NEW CERTIFICATION */}
          {activeTab === "apply" && (
            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 w-full text-left">
              
              {/* Form panel */}
              <div className="flex-1 flex flex-col overflow-y-auto">
                {!paymentStep ? (
                  <form onSubmit={handleNextToPayment} className="space-y-4 pr-1">
                    <div className="border-b border-slate-150 pb-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Submit Validation Papers</h4>
                      <p className="text-[10px] text-slate-400">Select certificate category, upload regulatory evidence, and review audit benchmarks</p>
                    </div>

                    {/* Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] uppercase font-black tracking-wider text-slate-500 block">1. Select Standard Program</label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {CERT_TYPES.map(type => {
                          const isAlreadyApproved = applications.some(app => app.typeId === type.id && app.status === "Approved");
                          const isUnderReview = applications.some(app => app.typeId === type.id && (app.status === "Submitted" || app.status === "Under Review"));
                          const isSelected = selectedTypeId === type.id;

                          return (
                            <div
                              key={type.id}
                              onClick={() => {
                                if (!isAlreadyApproved && !isUnderReview) {
                                  setSelectedTypeId(type.id);
                                }
                              }}
                              className={`p-3 border rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                                isAlreadyApproved 
                                  ? "bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed" 
                                  : isUnderReview
                                  ? "bg-slate-50 border-amber-200 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500 shadow-3xs"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <span className="text-xs font-black text-slate-800 block">
                                  {type.name}
                                </span>
                                <span className="text-[9.5px] text-slate-400 font-semibold block">
                                  Authority: {type.authority}
                                </span>
                              </div>

                              <div className="text-right shrink-0">
                                {isAlreadyApproved ? (
                                  <span className="text-[8px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                                    ✓ Fully Approved
                                  </span>
                                ) : isUnderReview ? (
                                  <span className="text-[8px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Under Review
                                  </span>
                                ) : (
                                  <span className="text-xs font-black text-slate-700 font-mono">
                                    ₹{type.fee.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* File uploading simulation */}
                    <div className="space-y-3 pt-2">
                      <label className="text-[9.5px] uppercase font-black tracking-wider text-slate-500 block">2. Attach Required Audit Documents</label>
                      
                      <div className="bg-slate-50 p-4 border border-dashed border-slate-200 rounded-xl space-y-3">
                        <div className="text-[9.5px] text-slate-500 font-semibold space-y-1">
                          <p className="font-extrabold text-slate-600">The Board requires the following files for review:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {selectedTypeDetails.requiredDocs.map((doc, dIdx) => (
                              <li key={dIdx} className="text-slate-600">{doc}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {/* Selector */}
                          <div className="space-y-1">
                            <span className="text-[8.5px] uppercase font-black text-slate-400 block">Primary File Type</span>
                            <select
                              value={docTypeSelected}
                              onChange={(e) => setDocTypeSelected(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[10px] font-bold"
                            >
                              <option value="Trading License Certificate">Trading License Certificate</option>
                              <option value="Phytosanitary Lab Report">Phytosanitary Lab Report</option>
                              <option value="Audited Revenue Registry">Audited Revenue Registry</option>
                              <option value="Corporate SOP Guideline">Corporate SOP Guideline</option>
                            </select>
                          </div>

                          {/* Trigger simulation */}
                          <div className="flex flex-col justify-end">
                            {isUploading ? (
                              <div className="p-2 border rounded-lg bg-white space-y-1">
                                <div className="flex justify-between items-center text-[8.5px] font-black text-slate-500">
                                  <span>Scrubbing PDF metadata...</span>
                                  <span>{uploadProgress}%</span>
                                </div>
                                <div className="h-1 bg-indigo-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-1.5">
                                {["accreditation_seal_signed.pdf", "res-residue-report-2026.pdf", "compliance_audit_sheet.pdf"].map((mockF, mockIdx) => (
                                  <button
                                    key={mockIdx}
                                    type="button"
                                    onClick={() => handleSimulatedFileUpload(mockF)}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-indigo-50/40 text-slate-700 font-extrabold rounded-lg transition-all cursor-pointer text-[8px] flex-1 truncate"
                                  >
                                    Attach {mockF.slice(0, 12)}...
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {docName && (
                          <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-[9.5px] font-bold text-emerald-800 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 truncate">
                              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                              Attached: <code className="text-slate-600 font-black">{docName}</code> ({docTypeSelected})
                            </span>
                            <button
                              type="button"
                              onClick={() => setDocName("")}
                              className="text-slate-400 hover:text-slate-600 text-[10px]"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={!docName}
                        className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-1 shadow-sm ${
                          docName
                            ? "bg-slate-800 hover:bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed border"
                        }`}
                      >
                        Proceed to Payment Checkout <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="border-b border-slate-150 pb-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Audit & Application Checkout</h4>
                      <p className="text-[10px] text-slate-400">Process the standard fee to register your document and initiate compliance review</p>
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3.5">
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                        <span className="font-semibold text-slate-500">Program Selected:</span>
                        <span className="font-extrabold text-slate-800">{selectedTypeDetails.name}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                        <span className="font-semibold text-slate-500">Validity Span:</span>
                        <span className="font-bold text-slate-700">{selectedTypeDetails.validityYears} Years (Renewable)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/60">
                        <span className="font-semibold text-slate-500">Audit File Registered:</span>
                        <span className="font-mono text-indigo-700 font-black">{docName}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-black pt-2">
                        <span className="text-slate-700">Total Application Fee:</span>
                        <span className="text-indigo-600 text-base font-mono">₹{selectedTypeDetails.fee.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Method Choice */}
                    <div className="space-y-2">
                      <span className="text-[9.5px] uppercase font-black tracking-wider text-slate-500 block">Select Merchant Gateway</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("upi")}
                          className={`p-3 border rounded-xl text-left cursor-pointer transition-all ${
                            paymentMethod === "upi"
                              ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-xs font-black text-slate-800 block">UPI Auto-Debit</span>
                          <span className="text-[8.5px] text-slate-400 block mt-0.5">Google Pay, PhonePe, BHIM</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("netbank")}
                          className={`p-3 border rounded-xl text-left cursor-pointer transition-all ${
                            paymentMethod === "netbank"
                              ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-xs font-black text-slate-800 block">Corporate Netbanking</span>
                          <span className="text-[8.5px] text-slate-400 block mt-0.5">State Bank, HDFC, ICICI Ledger</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("voucher")}
                          className={`p-3 border rounded-xl text-left cursor-pointer transition-all ${
                            paymentMethod === "voucher"
                              ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span className="text-xs font-black text-slate-800 block">Agri-Credit Voucher</span>
                          <span className="text-[8.5px] text-slate-400 block mt-0.5">Govt subsidized clearance scheme</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <button
                        onClick={() => setPaymentStep(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                      >
                        Back
                      </button>

                      <button
                        onClick={handlePayAndComplete}
                        disabled={paymentProcessing}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                      >
                        {paymentProcessing ? (
                          <>Processing Transaction...</>
                        ) : (
                          <>Pay ₹{selectedTypeDetails.fee.toLocaleString()} & Submit Application</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Checklist sidebar */}
              <div className="w-full md:w-[280px] bg-slate-50 p-4 border border-slate-200 rounded-2xl overflow-y-auto text-left space-y-4">
                <h5 className="text-[10.5px] font-black uppercase tracking-wider text-slate-700">Standards Overview</h5>
                
                <div className="space-y-3 text-[10px]">
                  <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-1 shadow-3xs">
                    <span className="font-extrabold text-indigo-900 block uppercase tracking-tight">1. Review Audits</span>
                    <p className="text-slate-400 leading-snug">Applications submitted are placed into the queue for manual and cryptographic review. The average evaluation SLA is 24 hours.</p>
                  </div>

                  <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-1 shadow-3xs">
                    <span className="font-extrabold text-teal-900 block uppercase tracking-tight">2. Fee Clearance</span>
                    <p className="text-slate-400 leading-snug">Audit registration fees are non-refundable state processing levies that finance phytosanitary labs and on-site soil/chemical diagnostics.</p>
                  </div>

                  <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-1 shadow-3xs">
                    <span className="font-extrabold text-amber-900 block uppercase tracking-tight">3. Gold Star Badge</span>
                    <p className="text-slate-400 leading-snug">Upon approval, the system generates a secure verifiable certificate registry. Listings will display the gold star validation.</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-800 text-slate-100 rounded-xl text-[9px] space-y-1.5 leading-relaxed font-semibold">
                  <p className="font-extrabold text-[10px] text-white">⚠️ VERIFICATION NOTE</p>
                  <p>Forged or expired licenses result in immediate suspension. Ensure all uploaded pdf/image documents contain clear corporate seal signatures and legible dates.</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: COMPLIANCE & EXPORT DASHBOARD */}
          {activeTab === "compliance" && (
            <div className="flex-1 flex flex-col min-h-0 w-full animate-fadeIn">
              
              {/* SUB-TABS NAVIGATION */}
              <div className="flex border-b border-slate-200 mb-4 shrink-0">
                <button
                  onClick={() => setComplianceSubTab("regulatory")}
                  className={`pb-3 text-xs font-black uppercase tracking-wider px-4 border-b-2 cursor-pointer transition-all ${
                    complianceSubTab === "regulatory"
                      ? "border-emerald-600 text-emerald-800"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  🇮🇳 Domestic Regulatory Compliance
                </button>
                <button
                  onClick={() => setComplianceSubTab("export")}
                  className={`pb-3 text-xs font-black uppercase tracking-wider px-4 border-b-2 cursor-pointer transition-all ${
                    complianceSubTab === "export"
                      ? "border-indigo-600 text-indigo-800"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  🌐 International Export Clearance
                </button>
                <button
                  onClick={() => setComplianceSubTab("audit")}
                  className={`pb-3 text-xs font-black uppercase tracking-wider px-4 border-b-2 cursor-pointer transition-all ${
                    complianceSubTab === "audit"
                      ? "border-amber-600 text-amber-800"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  📋 Security & Audit Trail
                </button>
              </div>

              {/* ACTIVE SUB-TAB VIEW */}
              <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
                
                {/* SUB-TAB 1: REGULATORY COMPLIANCE */}
                {complianceSubTab === "regulatory" && (
                  <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 w-full text-left">
                    
                    {/* Left Scrollable column */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                      
                      {/* GST Filing Dashboard */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-emerald-600" />
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">GST Compliance Terminal</h4>
                              <p className="text-[10px] font-semibold text-slate-400">GSTIN: <code className="font-mono text-slate-600 font-bold">{gstin}</code> • Registered State Ledger</p>
                            </div>
                          </div>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            🟢 ACTIVE & COMPLIANT
                          </span>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                            <span className="text-[8px] font-black uppercase text-slate-400 block">GSTR-1 Status (Sales)</span>
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-emerald-600" /> {gstr1Status}
                            </span>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                            <span className="text-[8px] font-black uppercase text-slate-400 block">GSTR-3B Status (Offset)</span>
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-emerald-600" /> {gstr3bStatus}
                            </span>
                          </div>
                          <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-1">
                            <span className="text-[8px] font-black uppercase text-indigo-700 block">Next Filing Cycle</span>
                            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-indigo-500" /> July 2026 (Pending)
                            </span>
                          </div>
                        </div>

                        {/* GST Filing Trigger */}
                        {gstr1Status.includes("June") ? (
                          <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="space-y-1 text-left">
                              <h5 className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-tight flex items-center gap-1">
                                <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" /> July 2026 Return Compile Available
                              </h5>
                              <p className="text-[10px] text-emerald-800 leading-tight">
                                Monthly transaction summary compiled: ₹12,40,000 total taxable sales. Prepare, verify, and digitally submit tax liability of ₹65,400.
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setIsFilingGst(true);
                                setGstFilingStep("review");
                                setGstFilingPeriod("July 2026");
                                setGstOtpInput("");
                              }}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-colors shrink-0"
                            >
                              Compile & File July Returns
                            </button>
                          </div>
                        ) : (
                          <div className="p-4 bg-indigo-50/30 border border-indigo-100 rounded-xl flex items-center justify-between gap-3">
                            <div className="text-left">
                              <span className="text-[9px] bg-indigo-100 text-indigo-800 font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider">COMPLETED</span>
                              <h5 className="text-[11px] font-extrabold text-indigo-950 uppercase tracking-tight mt-1">July 2026 Returns Filed successfully</h5>
                              <p className="text-[10px] text-indigo-700 leading-tight">
                                Returns filed and cryptographic signatures appended. ARNs logged in local history ledger.
                              </p>
                            </div>
                            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 shrink-0 bg-white border border-emerald-100 px-3 py-1.5 rounded-lg">
                              <Check className="h-4 w-4" /> Fully Filed
                            </span>
                          </div>
                        )}

                        {/* Filing History Table */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">GST Return Filing History ( Verifiable Ledger )</span>
                          <div className="border border-slate-100 rounded-xl overflow-hidden">
                            <table className="w-full text-left border-collapse text-[10px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 font-black text-slate-400 uppercase text-[8px] tracking-wider">
                                  <th className="p-2.5">Period</th>
                                  <th className="p-2.5">Return Type</th>
                                  <th className="p-2.5">Filing Date</th>
                                  <th className="p-2.5">Status</th>
                                  <th className="p-2.5">ARN (Reference Number)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {gstHistory.map((h: any, i: number) => (
                                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="p-2.5 font-bold text-slate-700">{h.period}</td>
                                    <td className="p-2.5 font-semibold text-slate-500">{h.type}</td>
                                    <td className="p-2.5 text-slate-500 font-mono">{h.filedAt}</td>
                                    <td className="p-2.5">
                                      <span className="bg-emerald-50 text-emerald-800 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">
                                        {h.status}
                                      </span>
                                    </td>
                                    <td className="p-2.5 font-mono text-indigo-900 font-semibold">{h.arn}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Product Safety Certifications Mapper */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FlaskConical className="h-5 w-5 text-indigo-600" />
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Product Laboratory Safety Records</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">Map chemical clearance profiles, pesticide screening, and toxicity assays to SKUs</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          
                          {/* Item selector list */}
                          <div className="md:col-span-5 space-y-2">
                            <span className="text-[8.5px] uppercase font-black text-slate-400 block">Select Listed SKU</span>
                            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                              {products.map((p: any) => {
                                const isSelected = selectedProductId === p.id;
                                const safety = productSafety[p.id as keyof typeof productSafety] || { pesticideResidue: "Compliant" };
                                const isWarning = safety.moistureLevel?.toLowerCase().includes("warning");

                                return (
                                  <div
                                    key={p.id}
                                    onClick={() => setSelectedProductId(p.id)}
                                    className={`p-2.5 border rounded-xl text-left cursor-pointer transition-all ${
                                      isSelected
                                        ? "bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500 shadow-3xs"
                                        : "bg-white border-slate-200 hover:border-slate-300"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="text-[10px] font-extrabold text-slate-800 block truncate leading-tight">
                                        {p.name}
                                      </span>
                                      {isWarning && (
                                        <span className="text-[7px] font-black bg-amber-500 text-white px-1 rounded animate-pulse shrink-0">
                                          LIMIT WARNING
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center mt-1.5 text-[8.5px] font-semibold text-slate-400">
                                      <span>Cat: {p.category}</span>
                                      <span className="text-emerald-700 font-bold uppercase">
                                        Residue: {safety.pesticideResidue}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Selected Item Compliance Profile */}
                          <div className="md:col-span-7 bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 text-left">
                            <div className="text-left">
                              <span className="text-[8.5px] font-black font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded-md uppercase">
                                SKU CLEARANCE PROFILE
                              </span>
                              <h5 className="font-black text-xs text-slate-800 uppercase mt-1">
                                {products.find(p => p.id === selectedProductId)?.name || "Selected Product"}
                              </h5>
                            </div>

                            {/* Reports indicators */}
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-left pt-1">
                              <div className="bg-white border border-slate-150 p-2 rounded-lg">
                                <span className="text-[7.5px] font-black uppercase text-slate-400 block">Pesticide Residue</span>
                                <span className={`font-bold block mt-0.5 ${
                                  (productSafety[selectedProductId as keyof typeof productSafety]?.pesticideResidue || "Compliant") === "Compliant"
                                    ? "text-emerald-600"
                                    : (productSafety[selectedProductId as keyof typeof productSafety]?.pesticideResidue || "") === "Under Evaluation"
                                    ? "text-amber-600"
                                    : "text-slate-600"
                                }`}>
                                  {productSafety[selectedProductId as keyof typeof productSafety]?.pesticideResidue || "Compliant"}
                                </span>
                              </div>
                              <div className="bg-white border border-slate-150 p-2 rounded-lg">
                                <span className="text-[7.5px] font-black uppercase text-slate-400 block">Heavy Metal Assay</span>
                                <span className="font-bold text-emerald-600 block mt-0.5">
                                  {productSafety[selectedProductId as keyof typeof productSafety]?.heavyMetals || "Compliant"}
                                </span>
                              </div>
                              <div className="bg-white border border-slate-150 p-2 rounded-lg">
                                <span className="text-[7.5px] font-black uppercase text-slate-400 block">Moisture Profile</span>
                                <span className={`font-bold block mt-0.5 ${
                                  (productSafety[selectedProductId as keyof typeof productSafety]?.moistureLevel || "").includes("Warning")
                                    ? "text-amber-600"
                                    : "text-slate-600"
                                }`}>
                                  {productSafety[selectedProductId as keyof typeof productSafety]?.moistureLevel || "Optimal (10.5%)"}
                                </span>
                              </div>
                              <div className="bg-white border border-slate-150 p-2 rounded-lg">
                                <span className="text-[7.5px] font-black uppercase text-slate-400 block">Last Safety Run</span>
                                <span className="font-bold text-slate-700 block mt-0.5 font-mono">
                                  {productSafety[selectedProductId as keyof typeof productSafety]?.lastTested || "Never"}
                                </span>
                              </div>
                            </div>

                            {/* Active test reports downloads */}
                            <div className="space-y-1.5 text-left pt-1">
                              <span className="text-[8.5px] uppercase font-black text-slate-400 block">Certified Safety Test Documents</span>
                              {(productSafety[selectedProductId as keyof typeof productSafety]?.reports || []).length === 0 ? (
                                <p className="text-[9px] text-slate-400 italic">No diagnostic certificate uploaded. Appended testing pending.</p>
                              ) : (
                                <div className="space-y-1">
                                  {(productSafety[selectedProductId as keyof typeof productSafety]?.reports || []).map((rep: string, repIdx: number) => (
                                    <div key={repIdx} className="bg-white border border-slate-200 p-2 rounded-lg flex items-center justify-between text-[9px] font-bold">
                                      <span className="text-slate-700 flex items-center gap-1 truncate" title={rep}>
                                        <FileText className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> {rep}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => triggerFeedback(`📥 Downloaded ${rep} laboratory safety report PDF.`)}
                                        className="text-indigo-600 hover:text-indigo-800 text-[8.5px] uppercase font-black cursor-pointer flex items-center gap-0.5"
                                      >
                                        <Download className="h-3 w-3" /> Get PDF
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Lab test runner trigger */}
                            {testingProductId === selectedProductId ? (
                              <div className="bg-white border border-indigo-100 p-3 rounded-lg space-y-2">
                                <div className="flex justify-between items-center text-[9px] font-black text-indigo-900 uppercase">
                                  <span className="flex items-center gap-1.5">
                                    <RefreshCw className="h-3 w-3 animate-spin text-indigo-600" /> {testingStep}
                                  </span>
                                  <span>{testingProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-indigo-50 rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${testingProgress}%` }} />
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setTestingProductId(selectedProductId);
                                  setTestingProgress(0);
                                  setTestingStep("Registering batch sample...");
                                  
                                  const steps = [
                                    { progress: 10, msg: "Prepping chemical spectrography..." },
                                    { progress: 35, msg: "HPLC (High-Performance Liquid Chromatography) analysis..." },
                                    { progress: 60, msg: "Heavy metals validation scan..." },
                                    { progress: 85, msg: "Moisture calibration check..." },
                                    { progress: 100, msg: "Generating certified compliance certificate..." }
                                  ];

                                  let currentStepIdx = 0;
                                  const timer = setInterval(() => {
                                    if (currentStepIdx < steps.length) {
                                      setTestingProgress(steps[currentStepIdx].progress);
                                      setTestingStep(steps[currentStepIdx].msg);
                                      currentStepIdx++;
                                    } else {
                                      clearInterval(timer);
                                      setTestingProductId(null);
                                      
                                      // Update safety report
                                      const updatedSafety = {
                                        ...productSafety,
                                        [selectedProductId]: {
                                          pesticideResidue: "Compliant",
                                          heavyMetals: "Compliant",
                                          moistureLevel: "Optimal (10.2%)",
                                          lastTested: new Date().toISOString().split("T")[0],
                                          reports: Array.from(new Set([
                                            "SafetyTest_ResidueFree_Signed.pdf",
                                            ...(productSafety[selectedProductId as keyof typeof productSafety]?.reports || [])
                                          ]))
                                        }
                                      };
                                      setProductSafety(updatedSafety);
                                      triggerFeedback(`🔬 Success! Analytical diagnostic complete. SKU flagged as 100% compliant with pesticide and heavy metal MRL limits.`);
                                    }
                                  }, 600);
                                }}
                                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors mt-2"
                              >
                                <FlaskConical className="h-4 w-4 text-emerald-400 animate-pulse" /> Run Complete Laboratory Safety Assay
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right column sidebar: Expiry warnings and Alerts */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-4">
                      
                      {/* LICENSE EXPIRED & EXPIRING ALERTS */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-4 animate-fadeIn">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <AlertCircle className="h-4.5 w-4.5 text-amber-500 fill-amber-100" /> Compliance Renewal Alerts
                          </h4>
                          <p className="text-[10px] text-slate-400">Strictly track mandatory licensing expiries and schedule renewal processes</p>
                        </div>

                        <div className="space-y-3">
                          {licenses.map((lic: any) => {
                            const expiry = new Date(lic.expiryDate);
                            const today = new Date("2026-07-11"); // Constant project time context
                            const diffTime = expiry.getTime() - today.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            const isCritical = diffDays <= 21;
                            const isWarning = diffDays > 21 && diffDays <= 45;

                            return (
                              <div key={lic.id} className={`p-3 bg-white border rounded-xl space-y-2.5 shadow-3xs transition-all ${
                                isCritical ? "border-rose-300 bg-rose-50/10" : isWarning ? "border-amber-300 bg-amber-50/10" : "border-slate-150"
                              }`}>
                                <div className="flex items-start justify-between gap-2 text-left">
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-extrabold text-slate-800 block truncate leading-tight uppercase">
                                      {lic.name}
                                    </span>
                                    <span className="text-[8.5px] text-slate-400 font-semibold block leading-tight">
                                      Auth: {lic.authority}
                                    </span>
                                  </div>
                                  
                                  {isCritical ? (
                                    <span className="text-[7.5px] font-black uppercase bg-rose-500 text-white px-1.5 py-0.2 rounded shrink-0 animate-pulse">
                                      CRITICAL ({diffDays}d)
                                    </span>
                                  ) : isWarning ? (
                                    <span className="text-[7.5px] font-black uppercase bg-amber-500 text-white px-1.5 py-0.2 rounded shrink-0">
                                      EXPIRING ({diffDays}d)
                                    </span>
                                  ) : (
                                    <span className="text-[7.5px] font-black uppercase bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded shrink-0">
                                      SECURE
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-[9px] border-t border-slate-100 pt-2 text-slate-500 font-semibold text-left">
                                  <span>Expires: <code className="font-black text-slate-700 font-mono">{lic.expiryDate}</code></span>
                                  
                                  <button
                                    onClick={() => {
                                      // Renew the license state
                                      const updatedLicenses = licenses.map((l: any) => {
                                        if (l.id === lic.id) {
                                          const originalExpiry = new Date(l.expiryDate);
                                          originalExpiry.setFullYear(originalExpiry.getFullYear() + 1);
                                          return {
                                            ...l,
                                            expiryDate: originalExpiry.toISOString().split("T")[0]
                                          };
                                        }
                                        return l;
                                      });
                                      setLicenses(updatedLicenses);
                                      triggerFeedback(`🔄 Successful! Renewal fee cleared. Validity of ${lic.name} extended for 1 year.`);
                                    }}
                                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-black rounded-lg uppercase text-[8px] cursor-pointer transition-colors"
                                  >
                                    Renew License
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* SUB-TAB 2: EXPORT COMPLIANCE */}
                {complianceSubTab === "export" && (
                  <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 w-full text-left animate-fadeIn">
                    
                    {/* Left Scrollable column */}
                    <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                      
                      {/* Phytosanitary certificate requester */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-left">
                            <ShieldCheck className="h-5 w-5 text-indigo-600" />
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Phytosanitary Clearance Registry</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">Generate mandatory phytosanitary inspection stamps for export consignments</p>
                            </div>
                          </div>
                          <span className="text-[8px] font-mono font-black bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-indigo-700 hidden sm:inline-block">
                            DEPARTMENT OF QUARANTINE PORTAL
                          </span>
                        </div>

                        {/* Split layout: apply and list */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
                          
                          {/* Apply Form */}
                          <div className="md:col-span-5 bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-3 text-left">
                            <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-800 border-b pb-1.5 border-slate-200">
                              Consignment Clearance Request
                            </h5>

                            {phytoStep === "input" && (
                              <div className="space-y-2.5 text-[10px] text-left">
                                <div className="space-y-1">
                                  <label className="text-[8.5px] uppercase font-black text-slate-400 block">1. Export Crop SKU</label>
                                  <select
                                    value={phytoCropId}
                                    onChange={(e) => setPhytoCropId(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold"
                                  >
                                    {products.map((p: any) => (
                                      <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[8.5px] uppercase font-black text-slate-400 block">2. Batch Weight</label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        value={phytoWeight}
                                        onChange={(e) => setPhytoWeight(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold pr-7"
                                        placeholder="20"
                                      />
                                      <span className="absolute right-2 top-2 text-[8px] font-black text-slate-400">MT</span>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8.5px] uppercase font-black text-slate-400 block">3. Target Region</label>
                                    <select
                                      value={phytoCountry}
                                      onChange={(e) => setPhytoCountry(e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold"
                                    >
                                      <option value="EU">European Union</option>
                                      <option value="USA">United States</option>
                                      <option value="Japan">Japan (MAFF)</option>
                                      <option value="UAE">United Arab Emirates</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8.5px] uppercase font-black text-slate-400 block">4. International Consignee</label>
                                  <input
                                    type="text"
                                    value={phytoConsignee}
                                    onChange={(e) => setPhytoConsignee(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold"
                                    placeholder="EuroAgri Cooperatives GmbH"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPhytoStep("labs");
                                    setPhytoLabProgress(0);
                                    setPhytoLabMessage("Initiating Quarantine inspection workflow...");
                                    
                                    const labPhases = [
                                      { progress: 20, msg: "Quarantine Visual Audit: Checking weed seed density..." },
                                      { progress: 45, msg: "Fungal Spore Incubation: Checking for Aflatoxins..." },
                                      { progress: 70, msg: "Treatment Tracking: Executing Methyl Bromide fumigation..." },
                                      { progress: 90, msg: "Validation check with target country standards..." },
                                      { progress: 100, msg: "Clearance approved. Compiling certification..." }
                                    ];

                                    let idx = 0;
                                    const t = setInterval(() => {
                                      if (idx < labPhases.length) {
                                        setPhytoLabProgress(labPhases[idx].progress);
                                        setPhytoLabMessage(labPhases[idx].msg);
                                        idx++;
                                      } else {
                                        clearInterval(t);
                                        
                                        // Finalize certificate
                                        const selectedProduct = products.find(p => p.id === phytoCropId) || products[0];
                                        const newCert = {
                                          id: `PSC-IN-${phytoCountry.toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
                                          cropName: selectedProduct.name,
                                          weight: `${phytoWeight} MT`,
                                          country: phytoCountry,
                                          consignee: phytoConsignee,
                                          date: new Date().toISOString().split("T")[0],
                                          status: "Approved",
                                          certificateNo: `PSC-${Math.floor(Math.random() * 900000) + 100000}-${phytoCountry}`
                                        };

                                        setPhytoApplications([newCert, ...phytoApplications]);
                                        setPhytoStep("success");
                                        setActivePhytoCert(newCert);
                                        triggerFeedback(`✈️ Phytosanitary clearance issued! Consignment complies with international plant protection standards.`);
                                      }
                                    }, 750);
                                  }}
                                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all mt-1 shadow-sm"
                                >
                                  Trigger Quarantine lab inspection
                                </button>
                              </div>
                            )}

                            {phytoStep === "labs" && (
                              <div className="space-y-3 py-6 text-center text-[10px] animate-fadeIn">
                                <FlaskConical className="h-10 w-10 text-indigo-500 animate-bounce mx-auto" />
                                <div className="space-y-1">
                                  <span className="font-extrabold text-indigo-900 uppercase block">{phytoLabMessage}</span>
                                  <span className="font-mono text-slate-400 block font-bold">Progress: {phytoLabProgress}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden max-w-[200px] mx-auto">
                                  <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${phytoLabProgress}%` }} />
                                </div>
                              </div>
                            )}

                            {phytoStep === "success" && activePhytoCert && (
                              <div className="space-y-3.5 py-2 text-left text-[10px] animate-fadeIn">
                                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-center space-y-1">
                                  <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto animate-bounce" />
                                  <span className="font-black text-emerald-800 block uppercase">CONSIGNMENT PASSED</span>
                                  <span className="text-[8.5px] text-slate-500 font-semibold block">Certificate Number: {activePhytoCert.certificateNo}</span>
                                </div>

                                <div className="bg-white border border-slate-150 p-2.5 rounded-lg space-y-1 leading-normal font-semibold text-slate-600">
                                  <p><span className="font-extrabold text-slate-500">Crop: </span>{activePhytoCert.cropName}</p>
                                  <p><span className="font-extrabold text-slate-500">Consignee: </span>{activePhytoCert.consignee}</p>
                                  <p><span className="font-extrabold text-slate-500">Destination: </span>{activePhytoCert.country}</p>
                                  <p><span className="font-extrabold text-slate-500">Export Load: </span>{activePhytoCert.weight}</p>
                                </div>

                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => triggerFeedback(`📥 Downloaded export phytosanitary clearance PDF.`)}
                                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase flex-1 cursor-pointer transition-colors text-center"
                                  >
                                    Download PSC PDF
                                  </button>
                                  <button
                                    onClick={() => setPhytoStep("input")}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black uppercase flex-1 cursor-pointer transition-colors text-center"
                                  >
                                    Apply New
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Certificates list */}
                          <div className="md:col-span-7 space-y-2 text-left">
                            <span className="text-[8.5px] uppercase font-black text-slate-400 block">Active Clearance Certificates Ledger</span>
                            
                            {phytoApplications.length === 0 ? (
                              <div className="p-8 border border-dashed text-center rounded-xl text-slate-400 italic text-[11px]">
                                No export quarantine certificates generated yet.
                              </div>
                            ) : (
                              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                {phytoApplications.map((app: any) => (
                                  <div key={app.id} className="p-3 border border-slate-200 rounded-xl text-left bg-white shadow-3xs space-y-2">
                                    <div className="flex justify-between items-start border-b border-slate-100 pb-1.5">
                                      <div>
                                        <span className="text-[8px] bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded font-bold text-indigo-700">
                                          {app.id}
                                        </span>
                                        <h6 className="font-black text-[11px] text-slate-800 uppercase mt-0.5">{app.cropName}</h6>
                                      </div>
                                      <span className="text-[8.5px] font-black bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 rounded uppercase">
                                        {app.status}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-[9px] font-semibold text-slate-500 leading-tight">
                                      <p><span className="font-extrabold text-slate-400 uppercase">Country:</span> {app.country}</p>
                                      <p><span className="font-extrabold text-slate-400 uppercase">Load:</span> {app.weight}</p>
                                      <p className="col-span-2 truncate"><span className="font-extrabold text-slate-400 uppercase">Consignee:</span> {app.consignee}</p>
                                    </div>

                                    <div className="border-t border-slate-50 pt-2 flex items-center justify-between text-[8px] font-black">
                                      <span>No: <code className="text-slate-700 font-mono font-bold">{app.certificateNo}</code></span>
                                      
                                      <button
                                        type="button"
                                        onClick={() => triggerFeedback(`📥 Downloading official phytosanitary inspection record for ${app.cropName}.`)}
                                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 uppercase cursor-pointer"
                                      >
                                        <Printer className="h-3 w-3" /> Print PSC Record
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* Right Column sidebar: Country Standards Auditor */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-4 text-left">
                      
                      {/* Targets Country auditor */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3.5">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <Globe className="h-4.5 w-4.5 text-indigo-600 animate-pulse" /> Country Standards Auditor
                          </h4>
                          <p className="text-[10px] text-slate-400">Audit compliance with country standards prior to export shipments</p>
                        </div>

                        {/* Country Select */}
                        <div className="flex gap-1 bg-slate-200 p-1 rounded-xl">
                          {(["EU", "USA", "Japan"] as const).map((cnt) => (
                            <button
                              key={cnt}
                              onClick={() => setAuditCountry(cnt)}
                              className={`flex-1 py-1 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                                auditCountry === cnt ? "bg-white text-indigo-950 shadow-3xs" : "text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              {cnt === "EU" ? "🇪🇺 EU" : cnt === "USA" ? "🇺🇸 USA" : "🇯🇵 Japan"}
                            </button>
                          ))}
                        </div>

                        {/* Audit Details */}
                        <div className="bg-white border border-slate-150 p-3 rounded-xl space-y-3 text-[10px] leading-normal font-semibold text-left">
                          <div className="flex items-center justify-between border-b pb-1.5 border-slate-100">
                            <span className="font-extrabold text-slate-500 uppercase">Target Requirements</span>
                            
                            {countryRegistrations[auditCountry] ? (
                              <span className="text-[8.5px] font-black bg-emerald-500 text-white px-1.5 rounded uppercase">
                                ✓ READY TO SHIP
                              </span>
                            ) : (
                              <span className="text-[8.5px] font-black bg-amber-500 text-white px-1.5 rounded uppercase animate-pulse">
                                ⚠ COMPLIANCE GAP
                              </span>
                            )}
                          </div>

                          <div className="space-y-2">
                            {auditCountry === "EU" && (
                              <>
                                <div className="flex items-start gap-1.5">
                                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <p><span className="font-extrabold text-slate-700">Phytosanitary Stamp:</span> Requires load verification. <span className="text-emerald-600 font-bold">Enabled.</span></p>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <p><span className="font-extrabold text-slate-700">EC 834/2007 Standard:</span> Verified via NPOP Organic badge. <span className="text-emerald-600 font-bold">Enabled.</span></p>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <p><span className="font-extrabold text-slate-700">MRL Pesticide limits:</span> Strictly under 0.01mg/kg limits. <span className="text-emerald-600 font-bold">Enabled.</span></p>
                                </div>
                              </>
                            )}

                            {auditCountry === "USA" && (
                              <>
                                <div className="flex items-start gap-1.5 text-left">
                                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <p><span className="font-extrabold text-slate-700">USDA NOP Organic stamp:</span> Verified via APEDA equivalency. <span className="text-emerald-600 font-bold">Enabled.</span></p>
                                </div>
                                <div className="flex items-start gap-1.5 text-left">
                                  {countryRegistrations["USA"] ? (
                                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <div className="text-amber-500 shrink-0 mt-0.5"><AlertCircle className="h-4 w-4" /></div>
                                  )}
                                  <p><span className="font-extrabold text-slate-700">FDA Food Facility Registration:</span> Required for customs clearance. {countryRegistrations["USA"] ? <span className="text-emerald-600 font-bold">Compliant.</span> : <span className="text-amber-600 font-bold">Not Registered.</span>}</p>
                                </div>
                                <div className="flex items-start gap-1.5 text-left">
                                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <p><span className="font-extrabold text-slate-700">FSMA Safety Audit:</span> Coordinated with ISO-9001 SOP records. <span className="text-emerald-600 font-bold">Compliant.</span></p>
                                </div>
                              </>
                            )}

                            {auditCountry === "Japan" && (
                              <>
                                <div className="flex items-start gap-1.5 text-left">
                                  {countryRegistrations["Japan"] ? (
                                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <div className="text-amber-500 shrink-0 mt-0.5"><AlertCircle className="h-4 w-4" /></div>
                                  )}
                                  <p><span className="font-extrabold text-slate-700">JAS Organic Stamp:</span> Requires explicit JAS accrediting. {countryRegistrations["Japan"] ? <span className="text-emerald-600 font-bold">Accredited.</span> : <span className="text-amber-600 font-bold">Pending.</span>}</p>
                                </div>
                                <div className="flex items-start gap-1.5 text-left">
                                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <p><span className="font-extrabold text-slate-700">MAFF Quarantine check:</span> Managed via phyto-lab inspection. <span className="text-emerald-600 font-bold">Enabled.</span></p>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Quick Alignment Actions */}
                          {!countryRegistrations[auditCountry] && (
                            <div className="pt-2 border-t border-slate-100">
                              {isRegisteringCountry ? (
                                <div className="p-2 border rounded-lg bg-indigo-50/20 text-center font-bold text-indigo-800 text-[9px] animate-pulse">
                                  Registering facility credentials...
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsRegisteringCountry(true);
                                    setTimeout(() => {
                                      setIsRegisteringCountry(false);
                                      setCountryRegistrations({
                                        ...countryRegistrations,
                                        [auditCountry]: true
                                      });
                                      triggerFeedback(`🎉 Successful! Corporate facility registered with target authorities. All export pipelines for ${auditCountry} are now flagged as active and compliant.`);
                                    }, 1200);
                                  }}
                                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer text-center block transition-colors shadow-xs"
                                >
                                  {auditCountry === "USA" ? "One-Click FDA Facility Registration" : "One-Click JAS Certification Alignment"}
                                </button>
                              )}
                            </div>
                          )}

                          {countryRegistrations[auditCountry] && (
                            <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[9px] text-emerald-800 font-bold leading-tight text-left">
                              ✓ Your facility holds active clearance. No compliant gaps detected. Catalog listings exported to this region will bear regional compliance indicators automatically.
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {complianceSubTab === "audit" && (
                  <div className="flex-1 flex flex-col min-h-0 w-full animate-fadeIn text-left">
                    {/* Header Summary & Security Status */}
                    <div className="bg-slate-900 text-white rounded-2xl p-5 mb-5 border border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Cryptographically Secured</span>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-tight">Secured Procurement Audit Ledger</h3>
                        <p className="text-slate-400 text-[10.5px] leading-relaxed max-w-2xl">
                          Real-time activity log documenting security events, product additions, order state transitions, and manual stock reconciliations. Fully compliant with APEDA and ISO 27001 policies.
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-start md:items-end gap-1.5">
                        <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-emerald-400 text-[9.5px] font-black uppercase tracking-wider rounded-lg">
                          ✓ LEDGER ACTIVE
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Trace ID: AGR-SUP-7749</span>
                      </div>
                    </div>

                    {/* Filter & Action Bar */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Search & Category Tabs */}
                      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
                        <div className="relative md:w-64">
                          <input
                            type="text"
                            placeholder="Filter by keyword / ID..."
                            value={auditSearch}
                            onChange={(e) => setAuditSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/25 rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none transition-all"
                          />
                          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                          {auditSearch && (
                            <button
                              onClick={() => setAuditSearch("")}
                              className="absolute right-2.5 top-2 w-5 h-5 text-slate-400 hover:text-slate-600 rounded-full flex items-center justify-center cursor-pointer bg-slate-200/50"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>

                        {/* Category filter pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {(["all", "login", "product", "order", "inventory"] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setAuditCategory(cat)}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-0 ${
                                auditCategory === cat
                                  ? "bg-slate-900 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            >
                              {cat === "all" ? "📂 All Events" :
                               cat === "login" ? "🔑 Logins" :
                               cat === "product" ? "📦 Catalog" :
                               cat === "order" ? "🛒 Orders" :
                               "📊 Stock Adjusts"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Export Ledger Button */}
                      <div className="shrink-0">
                        <button
                          onClick={handleExportAuditPDF}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-colors flex items-center gap-1.5 border-0"
                        >
                          📥 Export Formal Audit Ledger
                        </button>
                      </div>
                    </div>

                    {/* Interactive Table Panel */}
                    <div className="bg-white border border-slate-200 rounded-2xl flex-1 min-h-0 flex flex-col overflow-hidden shadow-xs">
                      <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                          <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200">
                            <tr className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                              <th className="py-3 px-4">Timestamp</th>
                              <th className="py-3 px-3">Event ID</th>
                              <th className="py-3 px-3">Category</th>
                              <th className="py-3 px-3">Action Name</th>
                              <th className="py-3 px-4">Description Details</th>
                              <th className="py-3 px-3">Operator</th>
                              <th className="py-3 px-3">IP Address</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredAudits.length > 0 ? (
                              filteredAudits.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors text-xs text-slate-700">
                                  <td className="py-3 px-4 font-mono text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleString()}
                                  </td>
                                  <td className="py-3 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                                    {log.id}
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider inline-block ${
                                      log.category === "login" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                      log.category === "product" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                      log.category === "order" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                                      "bg-amber-50 text-amber-700 border border-amber-100"
                                    }`}>
                                      {log.category}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                                    {log.action}
                                  </td>
                                  <td className="py-3 px-4 text-[11px] text-slate-600 leading-relaxed min-w-[240px]">
                                    {log.details}
                                  </td>
                                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                                    {log.user}
                                  </td>
                                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                                    {log.ipAddress}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="py-12 text-center text-slate-400 font-bold italic text-xs">
                                  No active compliance audits in current selection window matching "{auditSearch}".
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-slate-50 border-t border-slate-100 py-2 px-4 flex justify-between items-center shrink-0">
                        <span className="text-[10px] text-slate-500 font-bold">
                          Showing {filteredAudits.length} of {auditList.length} total events
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          System Integrity Hash: SHA-256_ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* MODAL: VERIFIABLE SECURE GOLD STAR PRINTABLE CERTIFICATE TEMPLATE */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-8 border-amber-100 max-w-2xl w-full p-8 rounded-3xl relative flex flex-col space-y-6 shadow-2xl text-center font-serif text-slate-800">
            
            {/* Close */}
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 p-1 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer text-slate-500 font-sans"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Certificate Border Frame Graphic styling */}
            <div className="border-4 border-double border-amber-600/30 p-8 space-y-6 relative">
              
              {/* Star watermarks */}
              <div className="absolute top-2 left-2 text-amber-500 opacity-20"><Award className="h-10 w-10" /></div>
              <div className="absolute bottom-2 right-2 text-amber-500 opacity-20"><Award className="h-10 w-10" /></div>

              {/* Emblem */}
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Star className="h-8 w-8 text-white fill-current animate-pulse" />
                </div>
              </div>

              {/* Header */}
              <div className="space-y-1 text-slate-800">
                <span className="font-sans text-[10px] tracking-widest font-black uppercase text-amber-700 block">
                  NATIONAL AGRICULTURAL COMPLIANCE BOARD
                </span>
                <h4 className="text-xl font-bold italic block">Certificate of Compliance Validation</h4>
              </div>

              <div className="text-[11px] leading-relaxed max-w-md mx-auto space-y-4">
                <p>This document officially certifies that the registered supplier entity:</p>
                
                <div className="py-2.5 border-y border-slate-200/60 my-2">
                  <h3 className="text-base font-bold tracking-wide uppercase font-sans text-indigo-950">
                    AGRICONNECT CERTIFIED PARTNER
                  </h3>
                  <span className="font-sans text-[8.5px] font-bold text-slate-400 block mt-0.5">
                    ID: AGRI-SUP-SYS-31CCDB
                  </span>
                </div>

                <p>
                  has successfully presented audited evidence, compliance paperwork, and paid state processing levies to earn the standard qualification of:
                </p>

                <h2 className="text-lg font-black text-amber-900 uppercase tracking-tight font-sans py-1 bg-amber-50 rounded-xl border border-amber-100">
                  {selectedCertificate.typeName}
                </h2>

                <p className="italic text-slate-500 text-[10px]">
                  and is hereby granted full licensing rights to append verified trust badges, state subsidy credentials, and cooperative procurement indicators across all catalog listings.
                </p>
              </div>

              {/* Signatures & Stamps */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-[9px] font-sans">
                <div className="text-left space-y-0.5">
                  <span className="text-slate-400 uppercase font-black block">VERIFIED DATE</span>
                  <span className="font-bold text-slate-800">{selectedCertificate.approvedAt}</span>
                  <span className="text-slate-400 block">Expires in: {CERT_TYPES.find(c => c.id === selectedCertificate.typeId)?.validityYears || 3} Years</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-slate-400 uppercase font-black block">REGISTRY KEY</span>
                  <code className="font-mono font-bold text-slate-800 block truncate">{selectedCertificate.certificateNumber}</code>
                  <span className="text-emerald-600 font-extrabold block">✓ VERIFIED CRYPTOGRAPHIC SIGNATURE</span>
                </div>
              </div>

              {/* Printable disclaimer */}
              <div className="pt-4 text-center">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[9px] font-sans font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 mx-auto"
                >
                  <Printer className="h-3 w-3" /> Print Certificate PDF
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
