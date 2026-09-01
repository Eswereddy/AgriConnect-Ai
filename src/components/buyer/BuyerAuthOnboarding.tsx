import React, { useState, useEffect, useRef } from "react";
import {
  Smartphone,
  Mail,
  Lock,
  Building,
  Check,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  FileText,
  Upload,
  X,
  Sparkles,
  Info,
  Clock,
  Briefcase,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Fingerprint,
  Laptop,
  Tablet,
  LogOut,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BuyerAuthOnboardingProps {
  onComplete: (buyerData: any) => void;
}

export default function BuyerAuthOnboarding({ onComplete }: BuyerAuthOnboardingProps) {
  // Navigation: "login" | "register"
  const [view, setView] = useState<"login" | "register">("register");
  
  // 1.2 Login States
  const [loginType, setLoginType] = useState<"email" | "mobile">("email");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginOtpCode, setLoginOtpCode] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpTimer, setLoginOtpTimer] = useState(60);
  const [loginIsOtpSending, setLoginIsOtpSending] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Biometric states
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);

  // Forgot Password flow states
  const [showForgotFlow, setShowForgotFlow] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtpCode, setForgotOtpCode] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotShowPassword, setForgotShowPassword] = useState(false);

  // Active sessions management state
  const [activeSessions, setActiveSessions] = useState([
    { id: "sess-1", device: "Safari on macOS", location: "Mumbai, India", isCurrent: true, date: "Active now" },
    { id: "sess-2", device: "AgriConnect iOS App", location: "New Delhi, India", isCurrent: false, date: "3 hours ago" },
    { id: "sess-3", device: "Chrome on Windows 11", location: "Chandigarh, India", isCurrent: false, date: "2 days ago" }
  ]);
  const [sessionAlert, setSessionAlert] = useState<string | null>(null);

  // Onboarding Wizard step: 1 | 2 | 3 | 4
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Personal Details
  const [onboardingName, setOnboardingName] = useState("");
  const [onboardingMobile, setOnboardingMobile] = useState("");
  const [onboardingEmail, setOnboardingEmail] = useState("");
  const [onboardingCompany, setOnboardingCompany] = useState("");
  const [onboardingGst, setOnboardingGst] = useState("");

  // Step 2: Business Details
  const [onboardingBusinessType, setOnboardingBusinessType] = useState("Retailer");
  const [onboardingEmployeeCount, setOnboardingEmployeeCount] = useState("10-50");
  const [onboardingAnnualVolume, setOnboardingAnnualVolume] = useState("500 Tons");
  const [onboardingTradeCapacity, setOnboardingTradeCapacity] = useState("High Frequency");

  // Step 3: Purchase Preferences
  const [onboardingPreferredCrops, setOnboardingPreferredCrops] = useState<string[]>([]);
  const [onboardingPreferredRegions, setOnboardingPreferredRegions] = useState<string[]>([]);
  const [onboardingPurchaseFrequency, setOnboardingPurchaseFrequency] = useState("Monthly");
  const [onboardingBudgetRange, setOnboardingBudgetRange] = useState("$10k - $50k");

  // Step 4: Verification (Documents & KYC)
  const [onboardingGstFile, setOnboardingGstFile] = useState<File | null>(null);
  const [onboardingKycFile, setOnboardingKycFile] = useState<File | null>(null);
  const [onboardingLicenseFile, setOnboardingLicenseFile] = useState<File | null>(null);
  
  const [gstDragOver, setGstDragOver] = useState(false);
  const [kycDragOver, setKycDragOver] = useState(false);
  const [licenseDragOver, setLicenseDragOver] = useState(false);

  // Checkbox Agreements
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Refs for manual triggers
  const gstInputRef = useRef<HTMLInputElement>(null);
  const kycInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  // Error & Info alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password Strength calculations
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "None", color: "bg-slate-200", percent: 0, criteria: [] };
    const criteria = [
      { met: pass.length >= 8, text: "At least 8 characters" },
      { met: /[A-Z]/.test(pass) && /[a-z]/.test(pass), text: "Uppercase & Lowercase" },
      { met: /\d/.test(pass), text: "At least one digit (0-9)" },
      { met: /[^A-Za-z0-9]/.test(pass), text: "At least one special character" }
    ];
    const score = criteria.filter(c => c.met).length;
    const percent = (score / 4) * 100;
    
    let label = "Weak";
    let color = "bg-rose-500";
    if (score === 2) {
      label = "Fair";
      color = "bg-amber-500";
    } else if (score === 3) {
      label = "Good";
      color = "bg-teal-500";
    } else if (score === 4) {
      label = "Strong (Enterprise Grade)";
      color = "bg-emerald-600";
    }

    return { label, color, percent, criteria };
  };

  // OTP Countdown timer for login
  useEffect(() => {
    let interval: any;
    if (loginOtpSent && loginOtpTimer > 0) {
      interval = setInterval(() => {
        setLoginOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loginOtpSent, loginOtpTimer]);

  // Request Mobile OTP for Login (Simulated Twilio SMS Gateway)
  const handleSendLoginOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginMobile || loginMobile.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMsg(null);
    setLoginIsOtpSending(true);
    
    // Simulate SMS dispatch
    setTimeout(() => {
      setLoginIsOtpSending(false);
      setLoginOtpSent(true);
      setLoginOtpTimer(60);
      setSuccessMsg("SMS OTP '448102' dispatched to +" + loginMobile);
    }, 1200);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (loginType === "email") {
      if (!loginEmail) {
        setErrorMsg("Please enter your email address.");
        return;
      }
      if (!loginPassword) {
        setErrorMsg("Please enter your password.");
        return;
      }
      
      // Seed account support
      if (loginEmail === "priya.sharma@agromart.in" && loginPassword === "buyer123") {
        setSuccessMsg("Priya Sharma authorized! Fetching AgroMart India Pvt Ltd workspace...");
        
        const demoBuyerData = {
          authType: "Email + Password",
          name: "Priya Sharma",
          contactName: "Priya Sharma",
          businessName: "AgroMart India Pvt Ltd",
          company: "AgroMart India Pvt Ltd",
          gstin: "29ABCDE1234F1Z5",
          gstNumber: "29ABCDE1234F1Z5",
          contactNumber: "9876543211",
          mobile: "9876543211",
          email: "priya.sharma@agromart.in",
          businessType: "Wholesaler",
          preferredCrops: ["Wheat", "Rice", "Corn"],
          trustScore: 85,
          rating: 4.25,
          isVerified: true,
          verificationProgress: {
            emailVerified: true,
            mobileVerified: true,
            gstVerified: true,
            bankVerified: true,
            creditVerified: true
          }
        };

        localStorage.setItem("agriconnect_user_active_bids", JSON.stringify({
          "LOT-8432": 25000,
          "LOT-9102": 31200,
          "LOT-6650": 19000
        }));

        localStorage.setItem("agriconnect_buyer_orders", JSON.stringify([
          {
            id: "ORD-2026-001",
            lotId: "LOT-8432",
            cropName: "Wheat",
            variety: "PBW 343 Premium",
            farmerName: "Rajesh Patel",
            quantity: 10,
            qualityGrade: "Grade A",
            finalBidAmount: 250000,
            paymentDeadline: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            paymentStatus: "Paid",
            pickupStatus: "Scheduled",
            pickupDetails: {
              modeOfTransport: "Standard Freight Logistics",
              pickupDate: "2026-07-01",
              pickupTime: "11:00",
              driverName: "Sohan Singh Brar",
              driverPhone: "+91 94142 83012",
              vehicleNumber: "PB-12-FG-7431",
              targetWarehouse: "Adani Agri-Logistics Terminal (Anand)"
            },
            orderConfirmationNumber: "CONF-001-K5Y",
            paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-001"
          },
          {
            id: "ORD-2026-002",
            lotId: "LOT-6650",
            cropName: "Corn",
            variety: "Hybrid 1 Premium Quality",
            farmerName: "Suresh Kumar",
            quantity: 8,
            qualityGrade: "Premium",
            finalBidAmount: 152000,
            paymentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            paymentStatus: "Pending",
            pickupStatus: "Unscheduled",
            orderConfirmationNumber: "CONF-002-M2W",
            paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-002"
          }
        ]));

        setTimeout(() => {
          onComplete(demoBuyerData);
        }, 1000);
        return;
      }

      // Email authentication
      setSuccessMsg("Email login authorized! Syncing workspace sessions...");
      setTimeout(() => {
        onComplete({
          authType: "Email + Password",
          email: loginEmail,
          isVerified: true,
          remembered: rememberMe,
          businessName: loginEmail.includes("grains") ? "Universal Grains & Pulses" : "AgriConnect Bulk Buyer"
        });
      }, 1000);
    } else {
      // Mobile Login (can be Password or OTP)
      if (!loginMobile || loginMobile.length < 10) {
        setErrorMsg("Please enter a valid 10-digit mobile number.");
        return;
      }

      // Seed account support for mobile
      if (loginMobile === "9876543211" && (loginPassword === "buyer123" || loginOtpCode === "448102" || loginOtpCode === "000000")) {
        setSuccessMsg("Priya Sharma authorized! Syncing AgroMart India Pvt Ltd workspace...");
        
        const demoBuyerData = {
          authType: "Mobile Login",
          name: "Priya Sharma",
          contactName: "Priya Sharma",
          businessName: "AgroMart India Pvt Ltd",
          company: "AgroMart India Pvt Ltd",
          gstin: "29ABCDE1234F1Z5",
          gstNumber: "29ABCDE1234F1Z5",
          contactNumber: "9876543211",
          mobile: "9876543211",
          email: "priya.sharma@agromart.in",
          businessType: "Wholesaler",
          preferredCrops: ["Wheat", "Rice", "Corn"],
          trustScore: 85,
          rating: 4.25,
          isVerified: true,
          verificationProgress: {
            emailVerified: true,
            mobileVerified: true,
            gstVerified: true,
            bankVerified: true,
            creditVerified: true
          }
        };

        localStorage.setItem("agriconnect_user_active_bids", JSON.stringify({
          "LOT-8432": 25000,
          "LOT-9102": 31200,
          "LOT-6650": 19000
        }));

        localStorage.setItem("agriconnect_buyer_orders", JSON.stringify([
          {
            id: "ORD-2026-001",
            lotId: "LOT-8432",
            cropName: "Wheat",
            variety: "PBW 343 Premium",
            farmerName: "Rajesh Patel",
            quantity: 10,
            qualityGrade: "Grade A",
            finalBidAmount: 250000,
            paymentDeadline: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            paymentStatus: "Paid",
            pickupStatus: "Scheduled",
            pickupDetails: {
              modeOfTransport: "Standard Freight Logistics",
              pickupDate: "2026-07-01",
              pickupTime: "11:00",
              driverName: "Sohan Singh Brar",
              driverPhone: "+91 94142 83012",
              vehicleNumber: "PB-12-FG-7431",
              targetWarehouse: "Adani Agri-Logistics Terminal (Anand)"
            },
            orderConfirmationNumber: "CONF-001-K5Y",
            paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-001"
          },
          {
            id: "ORD-2026-002",
            lotId: "LOT-6650",
            cropName: "Corn",
            variety: "Hybrid 1 Premium Quality",
            farmerName: "Suresh Kumar",
            quantity: 8,
            qualityGrade: "Premium",
            finalBidAmount: 152000,
            paymentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            paymentStatus: "Pending",
            pickupStatus: "Unscheduled",
            orderConfirmationNumber: "CONF-002-M2W",
            paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-002"
          }
        ]));

        setTimeout(() => {
          onComplete(demoBuyerData);
        }, 1000);
        return;
      }

      if (loginOtpSent) {
        // OTP verification step
        if (loginOtpCode !== "448102" && loginOtpCode !== "000000") {
          setErrorMsg("Invalid OTP. Enter '448102' or bypass with '000000'.");
          return;
        }
        setSuccessMsg("Mobile OTP authenticated! Entering Buyer Workspace...");
        setTimeout(() => {
          onComplete({
            authType: "Mobile OTP",
            mobile: loginMobile,
            isVerified: true,
            remembered: rememberMe,
            businessName: "Premium Grain Trader"
          });
        }, 1000);
      } else {
        // Password login on mobile
        if (!loginPassword) {
          setErrorMsg("Please enter your password, or request an SMS OTP above.");
          return;
        }
        setSuccessMsg("Mobile password authentication approved! Fetching escrow ledger...");
        setTimeout(() => {
          onComplete({
            authType: "Mobile + Password",
            mobile: loginMobile,
            isVerified: true,
            remembered: rememberMe,
            businessName: "Punjab Agro Corp"
          });
        }, 1000);
      }
    }
  };

  // Biometric login trigger (FaceID/Fingerprint)
  const handleBiometricLogin = () => {
    setErrorMsg(null);
    setBiometricScanning(true);
    setBiometricSuccess(false);

    // Simulate scanning delay
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      setSuccessMsg("Biometric signature matched (Face ID/Touch ID verified)!");
      
      setTimeout(() => {
        onComplete({
          authType: "Biometric authentication",
          isVerified: true,
          businessName: "AgriConnect Enterprise Buyer (Biometric Secure)"
        });
      }, 1000);
    }, 2000);
  };

  // Forgot Password step-by-step logic
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (forgotStep === 1) {
      if (!forgotIdentifier) {
        setErrorMsg("Please provide your registered Email or Mobile number.");
        return;
      }
      setSuccessMsg(`OTP reset dispatch initiated to ${forgotIdentifier}!`);
      setTimeout(() => {
        setForgotStep(2);
        setSuccessMsg("A 6-digit password reset code '712953' has been sent.");
      }, 1000);
    } else if (forgotStep === 2) {
      if (forgotOtpCode !== "712953" && forgotOtpCode !== "000000") {
        setErrorMsg("Incorrect verification OTP code. Use '712953' or bypass with '000000'.");
        return;
      }
      setSuccessMsg("Code verified! You may now establish a new password.");
      setTimeout(() => {
        setForgotStep(3);
      }, 1000);
    } else if (forgotStep === 3) {
      const resetStrength = getPasswordStrength(forgotNewPassword);
      if (resetStrength.percent < 50) {
        setErrorMsg("New password must satisfy at least 2 security criteria.");
        return;
      }
      setSuccessMsg("Password successfully reset! You can now log in with your new credentials.");
      setTimeout(() => {
        setShowForgotFlow(false);
        setForgotStep(1);
        setForgotIdentifier("");
        setForgotOtpCode("");
        setForgotNewPassword("");
        setView("login");
      }, 1500);
    }
  };

  // Revoke other device sessions
  const handleRevokeAllOtherSessions = () => {
    setSessionAlert("Revocation request dispatched. Terminating alternative sockets...");
    setTimeout(() => {
      setActiveSessions([
        { id: "sess-1", device: "Safari on macOS", location: "Mumbai, India", isCurrent: true, date: "Active now" }
      ]);
      setSessionAlert("All other active device sessions have been successfully logged out!");
      setTimeout(() => setSessionAlert(null), 3000);
    }, 1200);
  };

  // Onboarding Wizard Navigation & Validation
  const handleWizardNext = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (wizardStep === 1) {
      if (!onboardingName.trim()) {
        setErrorMsg("Please enter your full personal or representative name.");
        return;
      }
      if (!onboardingMobile || onboardingMobile.length < 10) {
        setErrorMsg("Please provide a valid 10-digit mobile phone number.");
        return;
      }
      if (!onboardingEmail || !onboardingEmail.includes("@")) {
        setErrorMsg("Please provide a valid business email address.");
        return;
      }
      if (!onboardingCompany.trim()) {
        setErrorMsg("Please provide your registered Company or Firm Name.");
        return;
      }
      if (!onboardingGst || onboardingGst.length < 15) {
        setErrorMsg("Please provide your official 15-digit GSTIN ID.");
        return;
      }
      setSuccessMsg("Step 1 validation succeeded! Transitioning to business configurations...");
      setTimeout(() => {
        setWizardStep(2);
        setSuccessMsg(null);
      }, 600);
    } 
    else if (wizardStep === 2) {
      if (!onboardingBusinessType) {
        setErrorMsg("Please specify a business classification.");
        return;
      }
      setSuccessMsg("Business profile configured! Proceeding to commodity preferences...");
      setTimeout(() => {
        setWizardStep(3);
        setSuccessMsg(null);
      }, 600);
    } 
    else if (wizardStep === 3) {
      if (onboardingPreferredCrops.length === 0) {
        setErrorMsg("Select at least one crop category to establish matches.");
        return;
      }
      if (onboardingPreferredRegions.length === 0) {
        setErrorMsg("Select at least one preferred sourcing region.");
        return;
      }
      setSuccessMsg("Procurement profiles updated! Moving to credential audit validation...");
      setTimeout(() => {
        setWizardStep(4);
        setSuccessMsg(null);
      }, 600);
    }
  };

  const handleWizardPrev = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (wizardStep > 1) {
      setWizardStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!onboardingGstFile) {
      setErrorMsg("Official GST Certificate upload is required for verification.");
      return;
    }
    if (!onboardingKycFile) {
      setErrorMsg("Personal or Business KYC Identification file is required.");
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      setErrorMsg("Please confirm compliance with standard regulatory audits and the privacy terms.");
      return;
    }

    setSuccessMsg("Verification packet assembled! Transmitting credentials to AgriConnect Ledger...");
    setTimeout(() => {
      onComplete({
        authType: "Multi-Step Onboarding Wizard Completed",
        personalDetails: {
          name: onboardingName,
          mobile: onboardingMobile,
          email: onboardingEmail,
          companyName: onboardingCompany,
          gstNumber: onboardingGst,
        },
        businessDetails: {
          businessType: onboardingBusinessType,
          employeeCount: onboardingEmployeeCount,
          annualVolume: onboardingAnnualVolume,
          tradeCapacity: onboardingTradeCapacity,
        },
        purchasePreferences: {
          crops: onboardingPreferredCrops,
          regions: onboardingPreferredRegions,
          frequency: onboardingPurchaseFrequency,
          budgetRange: onboardingBudgetRange,
        },
        verification: {
          gstFilename: onboardingGstFile.name,
          kycFilename: onboardingKycFile.name,
          licenseFilename: onboardingLicenseFile ? onboardingLicenseFile.name : "N/A",
          isVerified: true,
          auditStatus: "PENDING_MANUAL_REVIEW",
        },
        businessName: onboardingCompany,
        isVerified: true,
      });
    }, 1500);
  };

  // Social identity handshake simulation
  const handleSocialAuth = (provider: string) => {
    setErrorMsg(null);
    setSuccessMsg(`Initiating handshake with secure ${provider} OAuth endpoint...`);
    
    setTimeout(() => {
      onComplete({
        authType: `Social (${provider})`,
        email: `buyer.${provider.toLowerCase()}@agriconnect.org`,
        isVerified: true,
        businessName: `${provider} Grain Buyer`
      });
    }, 1500);
  };

  // Handle Drag Events
  const handleDragOver = (e: React.DragEvent, type: "gst" | "kyc" | "license") => {
    e.preventDefault();
    if (type === "gst") setGstDragOver(true);
    else if (type === "kyc") setKycDragOver(true);
    else setLicenseDragOver(true);
  };

  const handleDragLeave = (type: "gst" | "kyc" | "license") => {
    if (type === "gst") setGstDragOver(false);
    else if (type === "kyc") setKycDragOver(false);
    else setLicenseDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, type: "gst" | "kyc" | "license") => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (type === "gst") {
        setGstDragOver(false);
        setOnboardingGstFile(files[0]);
      } else if (type === "kyc") {
        setKycDragOver(false);
        setOnboardingKycFile(files[0]);
      } else {
        setLicenseDragOver(false);
        setOnboardingLicenseFile(files[0]);
      }
    }
  };

  // Handle Manual File Choice
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "gst" | "kyc" | "license") => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (type === "gst") setOnboardingGstFile(files[0]);
      else if (type === "kyc") setOnboardingKycFile(files[0]);
      else setOnboardingLicenseFile(files[0]);
    }
  };

  return (
    <div id="buyer-auth-container" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dynamic Background Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-slate-950/80 backdrop-blur-lg rounded-3xl border border-slate-800 shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row">
        
        {/* Left Interactive Information Rail */}
        <div className="md:w-5/12 bg-gradient-to-br from-teal-950 via-slate-950 to-cyan-950 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-teal-500/15 border border-teal-500/20 rounded-2xl text-teal-400">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-md font-black tracking-tight text-white font-display">Buyer Portal</h2>
                <p className="text-[9px] uppercase font-bold tracking-wider text-teal-400">AgriConnect Global Hub</p>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              <h3 className="text-lg font-bold text-slate-100 font-display leading-tight">
                Secure Procurement Gateway
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Source directly from agricultural co-ops and farms. Bid on escrowed lots, inspect crop diagnostics, and coordinate direct-to-warehouse logistics schedules.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-2.5 text-[11px]">
                <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">GST-vetted bulk corporate transaction support.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[11px]">
                <Sparkles className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Intelligent soil & diagnostic crop traceability metrics.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[11px]">
                <Clock className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">Secure escrow release protocols protecting contracts.</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 md:mt-0">
            <div className="bg-slate-900/50 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <p className="text-[8px] uppercase font-black text-slate-500 tracking-wider">Quick Sandbox Entrance</p>
                <p className="text-[11px] text-teal-400 font-semibold mt-0.5">Bypass login and browse commodities</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onComplete({
                    authType: "Sandbox Bypass",
                    businessName: "AgriConnect Guest Procure",
                    isVerified: false
                  });
                }}
                className="p-2 bg-teal-600/10 hover:bg-teal-600/20 border border-teal-500/20 text-teal-400 rounded-xl transition-all cursor-pointer"
                title="Bypass onboarding and login directly"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Active Registration Form Workspace */}
        <div className="md:w-7/12 p-8 flex flex-col justify-center min-h-[500px]">
          
          {/* Top Info Messages */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2"
              >
                <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2"
              >
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VIEW SWITCHER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-md font-extrabold text-white font-display">
                {view === "register" ? "Create Buyer Account" : "Access Buyer Dashboard"}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {view === "register" ? "Join the sovereign agricultural marketplace" : "Provide your credentials to access your escrow portfolio"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setView(view === "register" ? "login" : "register");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-[11px] text-teal-400 hover:underline font-bold"
            >
              {view === "register" ? "Already have account?" : "Create new account"}
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {/* 1. REGISTRATION TAB VIEWS */}
            {view === "register" && (
              <motion.div
                key="register-flow"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Onboarding Wizard Header with Step Indicator */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-black text-teal-400 tracking-wider block">
                        Buyer Onboarding Wizard
                      </span>
                      <h4 className="text-xs font-bold text-white mt-0.5">
                        {wizardStep === 1 && "Step 1: Personal Details"}
                        {wizardStep === 2 && "Step 2: Business Demographics"}
                        {wizardStep === 3 && "Step 3: Procurement Preferences"}
                        {wizardStep === 4 && "Step 4: Audit & Document Verification"}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                      {wizardStep === 1 && "25%"}
                      {wizardStep === 2 && "50%"}
                      {wizardStep === 3 && "75%"}
                      {wizardStep === 4 && "100%"} Complete
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 transition-all duration-500"
                        style={{
                          width: `${
                            wizardStep === 1 ? 25 : wizardStep === 2 ? 50 : wizardStep === 3 ? 75 : 100
                          }%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-extrabold uppercase text-slate-500">
                      <span className={wizardStep >= 1 ? "text-teal-400 font-black" : ""}>1. Personal</span>
                      <span className={wizardStep >= 2 ? "text-teal-400 font-black" : ""}>2. Business</span>
                      <span className={wizardStep >= 3 ? "text-teal-400 font-black" : ""}>3. Sourcing</span>
                      <span className={wizardStep >= 4 ? "text-teal-400 font-black" : ""}>4. Verify</span>
                    </div>
                  </div>
                </div>

                {/* STEP 1: PERSONAL DETAILS */}
                {wizardStep === 1 && (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Full Contact Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Satnam Singh"
                          value={onboardingName}
                          onChange={(e) => setOnboardingName(e.target.value)}
                          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Direct Mobile Number</label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            placeholder="9876543210"
                            value={onboardingMobile}
                            onChange={(e) => setOnboardingMobile(e.target.value.replace(/\D/g, ""))}
                            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-teal-500 font-mono tracking-wider font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Business Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            placeholder="satnam@foodcorp.com"
                            value={onboardingEmail}
                            onChange={(e) => setOnboardingEmail(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Company / Firm Name</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Satnam Sovereign Grains Ltd"
                            value={onboardingCompany}
                            onChange={(e) => setOnboardingCompany(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Enterprise GSTIN Number</label>
                        <input
                          type="text"
                          required
                          maxLength={15}
                          placeholder="e.g. 03AAAAA1111A1Z1"
                          value={onboardingGst}
                          onChange={(e) => setOnboardingGst(e.target.value.toUpperCase())}
                          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-teal-500 font-mono tracking-widest font-bold"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleWizardNext}
                      className="w-full mt-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-teal-950/25"
                    >
                      <span>Configure Business Details (Step 2)</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* STEP 2: BUSINESS DETAILS */}
                {wizardStep === 2 && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Business Type Classification</label>
                        <select
                          value={onboardingBusinessType}
                          onChange={(e) => setOnboardingBusinessType(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                        >
                          <option value="Retailer">Retailer / Supermarket Chain</option>
                          <option value="Wholesaler">Wholesaler / Bulk Trader</option>
                          <option value="Exporter">International Crop Exporter</option>
                          <option value="Processor">Mill Processor / Flourist</option>
                          <option value="Restaurant chain">Restaurant / Food Chain</option>
                          <option value="Cooperative">Agriculture Sourcing Cooperative</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Employee Headcount</label>
                        <select
                          value={onboardingEmployeeCount}
                          onChange={(e) => setOnboardingEmployeeCount(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                        >
                          <option value="1-10">1 - 10 (Boutique Trade)</option>
                          <option value="10-50">10 - 50 (SME Procurement)</option>
                          <option value="50-250">50 - 250 (Mid-Market Enterprise)</option>
                          <option value="250+">250+ Employees (Mega Sourcing Corporates)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Annual Procurement Volume</label>
                        <select
                          value={onboardingAnnualVolume}
                          onChange={(e) => setOnboardingAnnualVolume(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                        >
                          <option value="Under 100 Tons">Under 100 Tons / Year</option>
                          <option value="100 - 500 Tons">100 - 500 Tons / Year</option>
                          <option value="500 Tons">500 - 2,500 Tons / Year</option>
                          <option value="2,500 - 10,000 Tons">2,500 - 10,000 Tons / Year</option>
                          <option value="10,000+ Tons">10,000+ Tons (High Volume Purchaser)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Procurement Intent / Urgency</label>
                        <select
                          value={onboardingTradeCapacity}
                          onChange={(e) => setOnboardingTradeCapacity(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                        >
                          <option value="Spot Deals">Spot Procurement / Immediate fulfillment</option>
                          <option value="High Frequency">High Frequency / Rolling agreements</option>
                          <option value="Seasonal Contracts">Seasonal Crop harvest locking</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleWizardPrev}
                        className="w-1/3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleWizardNext}
                        className="w-2/3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Sourcing Preferences (Step 3)</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PURCHASE PREFERENCES */}
                {wizardStep === 3 && (
                  <div className="space-y-3.5">
                    {/* Interactive Preferred Crops Choice */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                        Preferred Agricultural Crop Categories
                      </label>
                      <p className="text-[9px] text-slate-500 leading-none">Select all matching grains or pulses</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          "Premium Basmati Rice",
                          "Organic Durum Wheat",
                          "Yellow Grain Maize",
                          "Sorghum Millets",
                          "Red Lentils (Masoor)",
                          "Spiced Cardamom",
                          "Soybeans",
                          "Black Gram (Urad)"
                        ].map((crop) => {
                          const isSelected = onboardingPreferredCrops.includes(crop);
                          return (
                            <button
                              key={crop}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setOnboardingPreferredCrops(onboardingPreferredCrops.filter(c => c !== crop));
                                } else {
                                  setOnboardingPreferredCrops([...onboardingPreferredCrops, crop]);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all ${
                                isSelected
                                  ? "bg-teal-950/40 border-teal-500 text-teal-400"
                                  : "bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                              }`}
                            >
                              {crop}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive Preferred Regions Choice */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                        Preferred Sourcing Regions / States
                      </label>
                      <p className="text-[9px] text-slate-500 leading-none">Select the primary agrarian regions for sourcing</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          "Punjab",
                          "Haryana",
                          "Maharashtra",
                          "Madhya Pradesh",
                          "Karnataka",
                          "Tamil Nadu",
                          "Gujarat",
                          "Rajasthan"
                        ].map((reg) => {
                          const isSelected = onboardingPreferredRegions.includes(reg);
                          return (
                            <button
                              key={reg}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setOnboardingPreferredRegions(onboardingPreferredRegions.filter(r => r !== reg));
                                } else {
                                  setOnboardingPreferredRegions([...onboardingPreferredRegions, reg]);
                                }
                              }}
                              className={`px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all ${
                                isSelected
                                  ? "bg-emerald-950/40 border-emerald-500 text-emerald-400"
                                  : "bg-slate-950/50 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300"
                              }`}
                            >
                              {reg}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Procurement Frequency</label>
                        <select
                          value={onboardingPurchaseFrequency}
                          onChange={(e) => setOnboardingPurchaseFrequency(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                        >
                          <option value="Weekly">Weekly (Continuous bulk supply)</option>
                          <option value="Monthly">Monthly (Scheduled shipments)</option>
                          <option value="Seasonal">Seasonal (Crop harvest cycles)</option>
                          <option value="Quarterly">Quarterly (Strategic Restocking)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Target Procurement Budget Range</label>
                        <select
                          value={onboardingBudgetRange}
                          onChange={(e) => setOnboardingBudgetRange(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                        >
                          <option value="Under $10k">Under $10,000 per shipment</option>
                          <option value="$10k - $50k">$10,000 - $50,000 per shipment</option>
                          <option value="$50k - $250k">$50,000 - $250,000 per shipment</option>
                          <option value="$250k+">$250,000+ (Enterprise Sourcing)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleWizardPrev}
                        className="w-1/3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={handleWizardNext}
                        className="w-2/3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Documents Verification (Step 4)</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: VERIFICATION & DOCUMENT UPLOADS */}
                {wizardStep === 4 && (
                  <form onSubmit={handleWizardSubmit} className="space-y-3.5">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      Compliance Audit Document Verification
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* File 1: GST Certificate */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 block">GST Certificate (PDF/Image)</label>
                        <div
                          onDragOver={(e) => handleDragOver(e, "gst")}
                          onDragLeave={() => handleDragLeave("gst")}
                          onDrop={(e) => handleDrop(e, "gst")}
                          onClick={() => gstInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[90px] ${
                            gstDragOver ? "border-teal-500 bg-teal-500/10" : "border-slate-800 hover:border-teal-600 bg-slate-900/30"
                          }`}
                        >
                          <input
                            type="file"
                            ref={gstInputRef}
                            onChange={(e) => handleFileChange(e, "gst")}
                            className="hidden"
                            accept=".pdf,image/*"
                          />
                          {onboardingGstFile ? (
                            <div className="space-y-1 flex flex-col items-center">
                              <FileText className="h-5 w-5 text-emerald-400" />
                              <p className="text-[9px] text-slate-200 font-bold truncate max-w-[140px]">{onboardingGstFile.name}</p>
                              <span className="text-[7.5px] text-slate-500">{(onboardingGstFile.size / 1024).toFixed(1)} KB</span>
                            </div>
                          ) : (
                            <div className="space-y-1 flex flex-col items-center">
                              <Upload className="h-5 w-5 text-slate-500 animate-pulse" />
                              <p className="text-[8px] text-slate-300 font-bold">GST Certificate</p>
                              <p className="text-[7.5px] text-slate-500">Drag & Drop or click</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* File 2: KYC Identity */}
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 block">KYC Verification (Aadhaar/PAN/Passport)</label>
                        <div
                          onDragOver={(e) => handleDragOver(e, "kyc")}
                          onDragLeave={() => handleDragLeave("kyc")}
                          onDrop={(e) => handleDrop(e, "kyc")}
                          onClick={() => kycInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[90px] ${
                            kycDragOver ? "border-teal-500 bg-teal-500/10" : "border-slate-800 hover:border-teal-600 bg-slate-900/30"
                          }`}
                        >
                          <input
                            type="file"
                            ref={kycInputRef}
                            onChange={(e) => handleFileChange(e, "kyc")}
                            className="hidden"
                            accept=".pdf,image/*"
                          />
                          {onboardingKycFile ? (
                            <div className="space-y-1 flex flex-col items-center">
                              <FileText className="h-5 w-5 text-emerald-400" />
                              <p className="text-[9px] text-slate-200 font-bold truncate max-w-[140px]">{onboardingKycFile.name}</p>
                              <span className="text-[7.5px] text-slate-500">{(onboardingKycFile.size / 1024).toFixed(1)} KB</span>
                            </div>
                          ) : (
                            <div className="space-y-1 flex flex-col items-center">
                              <Upload className="h-5 w-5 text-slate-500 animate-pulse" />
                              <p className="text-[8px] text-slate-300 font-bold">KYC Identity File</p>
                              <p className="text-[7.5px] text-slate-500">Drag & Drop or click</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <label className="flex items-start gap-2.5 text-[10px] text-slate-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="rounded border-slate-800 bg-slate-900 text-teal-600 focus:ring-teal-500 mt-0.5"
                        />
                        <span>We declare the uploaded documents as official business credentials matching GST registry listings.</span>
                      </label>

                      <label className="flex items-start gap-2.5 text-[10px] text-slate-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                          className="rounded border-slate-800 bg-slate-900 text-teal-600 focus:ring-teal-500 mt-0.5"
                        />
                        <span>We authorize AgriConnect audit compliance officers to verify our trade state records under standard rules.</span>
                      </label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleWizardPrev}
                        className="w-1/3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <span>Submit Business Registration</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* SOCIAL SIGNUP (GOOGLE, FACEBOOK, LINKEDIN) */}
                <div className="pt-3 border-t border-slate-900 space-y-2.5">
                  <span className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                    Or secure social credential handshake
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSocialAuth("Google")}
                      className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 text-[9.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialAuth("Facebook")}
                      className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 text-[9.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Facebook
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialAuth("LinkedIn")}
                      className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 text-[9.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      LinkedIn
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. LOGIN TAB VIEWS */}
            {view === "login" && (
              <motion.div
                key="login-flow"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* Seed Demo Account Quick Access Card */}
                <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-teal-400 animate-pulse" />
                      <span className="text-xs font-black text-slate-200 uppercase tracking-wider">Seed Demo Account</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail("priya.sharma@agromart.in");
                        setLoginMobile("9876543211");
                        setLoginPassword("buyer123");
                        
                        const demoBuyerData = {
                          authType: "Seed Demo Login",
                          name: "Priya Sharma",
                          contactName: "Priya Sharma",
                          businessName: "AgroMart India Pvt Ltd",
                          company: "AgroMart India Pvt Ltd",
                          gstin: "29ABCDE1234F1Z5",
                          gstNumber: "29ABCDE1234F1Z5",
                          contactNumber: "9876543211",
                          mobile: "9876543211",
                          email: "priya.sharma@agromart.in",
                          businessType: "Wholesaler",
                          preferredCrops: ["Wheat", "Rice", "Corn"],
                          trustScore: 85,
                          rating: 4.25,
                          isVerified: true,
                          verificationProgress: {
                            emailVerified: true,
                            mobileVerified: true,
                            gstVerified: true,
                            bankVerified: true,
                            creditVerified: true
                          }
                        };
                        
                        localStorage.setItem("agriconnect_user_active_bids", JSON.stringify({
                          "LOT-8432": 25000,
                          "LOT-9102": 31200,
                          "LOT-6650": 19000
                        }));

                        localStorage.setItem("agriconnect_buyer_orders", JSON.stringify([
                          {
                            id: "ORD-2026-001",
                            lotId: "LOT-8432",
                            cropName: "Wheat",
                            variety: "PBW 343 Premium",
                            farmerName: "Rajesh Patel",
                            quantity: 10,
                            qualityGrade: "Grade A",
                            finalBidAmount: 250000,
                            paymentDeadline: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                            paymentStatus: "Paid",
                            pickupStatus: "Scheduled",
                            pickupDetails: {
                              modeOfTransport: "Standard Freight Logistics",
                              pickupDate: "2026-07-01",
                              pickupTime: "11:00",
                              driverName: "Sohan Singh Brar",
                              driverPhone: "+91 94142 83012",
                              vehicleNumber: "PB-12-FG-7431",
                              targetWarehouse: "Adani Agri-Logistics Terminal (Anand)"
                            },
                            orderConfirmationNumber: "CONF-001-K5Y",
                            paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-001"
                          },
                          {
                            id: "ORD-2026-002",
                            lotId: "LOT-6650",
                            cropName: "Corn",
                            variety: "Hybrid 1 Premium Quality",
                            farmerName: "Suresh Kumar",
                            quantity: 8,
                            qualityGrade: "Premium",
                            finalBidAmount: 152000,
                            paymentDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
                            paymentStatus: "Pending",
                            pickupStatus: "Unscheduled",
                            orderConfirmationNumber: "CONF-002-M2W",
                            paymentLink: "https://sandbox.agri-escrow.gov.in/pay/ORD-2026-002"
                          }
                        ]));

                        setSuccessMsg("Instant authentication initialized! Enjoy your seed workspace...");
                        setTimeout(() => {
                          onComplete(demoBuyerData);
                        }, 800);
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      Instant Login
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-300">
                    <div><span className="font-bold text-slate-400">Buyer:</span> Priya Sharma</div>
                    <div><span className="font-bold text-slate-400">Mobile:</span> 9876543211</div>
                    <div><span className="font-bold text-slate-400">Company:</span> AgroMart India</div>
                    <div><span className="font-bold text-slate-400">Password:</span> buyer123</div>
                  </div>
                </div>

                {showForgotFlow ? (
                  /* FORGOT PASSWORD MULTI-STEP FLOW */
                  <form onSubmit={handleForgotSubmit} className="space-y-4 bg-slate-900/40 p-5 border border-slate-800 rounded-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Forgot Password Helper</h4>
                        <p className="text-[9px] text-slate-400">Step {forgotStep} of 3: Secure credentials recovery</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotFlow(false);
                          setForgotStep(1);
                        }}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </div>

                    {forgotStep === 1 && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-300 leading-normal">
                          Provide your registered email address or mobile number to dispatch a secure 6-digit confirmation OTP.
                        </p>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-400 block">Email or Mobile Number</label>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <input
                              type="text"
                              required
                              placeholder="buyer@agriconnect.org or 9876543210"
                              value={forgotIdentifier}
                              onChange={(e) => setForgotIdentifier(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Generate Recovery OTP
                        </button>
                      </div>
                    )}

                    {forgotStep === 2 && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-300 leading-normal">
                          A 6-digit validation key has been dispatched to <span className="font-bold text-teal-400 font-mono">{forgotIdentifier}</span>.
                        </p>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-400 block">Verification OTP Code</label>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            placeholder="Type code (e.g. 712953)"
                            value={forgotOtpCode}
                            onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ""))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-center text-sm text-teal-300 font-mono tracking-widest focus:outline-none focus:border-teal-500"
                          />
                          <span className="text-[8px] text-slate-500 block text-center">
                            Test Bypass: Enter <span className="font-bold text-teal-400 font-mono">712953</span> or <span className="font-bold text-teal-400 font-mono">000000</span>
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                        >
                          Verify Recovery Code
                        </button>
                      </div>
                    )}

                    {forgotStep === 3 && (
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-300 leading-normal">
                          Verification successfully confirmed. Establish a new sovereign password for your enterprise portal account.
                        </p>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-slate-400 block">New Secret Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <input
                              type={forgotShowPassword ? "text" : "password"}
                              required
                              placeholder="Minimum 8 characters"
                              value={forgotNewPassword}
                              onChange={(e) => setForgotNewPassword(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-teal-500"
                            />
                            <button
                              type="button"
                              onClick={() => setForgotShowPassword(!forgotShowPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                            >
                              {forgotShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Password strength widget */}
                        {forgotNewPassword && (
                          <div className="space-y-1 bg-slate-950/50 p-2 rounded-xl border border-slate-850">
                            <div className="flex justify-between items-center text-[8.5px] font-semibold text-slate-400">
                              <span>Sovereignty Rating:</span>
                              <span className={getPasswordStrength(forgotNewPassword).percent > 50 ? "text-emerald-400" : "text-rose-400"}>
                                {getPasswordStrength(forgotNewPassword).label}
                              </span>
                            </div>
                            <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getPasswordStrength(forgotNewPassword).color} transition-all`}
                                style={{ width: `${getPasswordStrength(forgotNewPassword).percent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer animate-pulse"
                        >
                          Complete Sovereign Password Reset
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  /* STANDARD LOGIN PANEL WITH ALL CREDENTIAL OPTIONS */
                  <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                    {/* Login Type Switcher */}
                    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginType("email");
                          setErrorMsg(null);
                        }}
                        className={`py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                          loginType === "email" ? "bg-slate-800 text-teal-400 shadow-xs" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Email Address
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginType("mobile");
                          setErrorMsg(null);
                        }}
                        className={`py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                          loginType === "mobile" ? "bg-slate-800 text-teal-400 shadow-xs" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Mobile / OTP
                      </button>
                    </div>

                    {/* Email Log In */}
                    {loginType === "email" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <input
                              type="email"
                              required
                              placeholder="buyer@agriconnect.org"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <input
                              type={showLoginPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                            >
                              {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mobile Log In */}
                    {loginType === "mobile" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">10-Digit Mobile Number</label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              placeholder="9876543210"
                              value={loginMobile}
                              onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ""))}
                              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-teal-500 font-mono font-bold tracking-widest"
                            />
                          </div>
                        </div>

                        {loginOtpSent ? (
                          /* OTP input step */
                          <div className="space-y-2 bg-slate-900/50 p-3.5 border border-slate-800 rounded-2xl">
                            <div className="text-center space-y-1">
                              <span className="text-[10px] font-black uppercase text-teal-400 tracking-widest block">Login Verification OTP Sent</span>
                              <p className="text-[9px] text-slate-400">Code sent to +{loginMobile}</p>
                            </div>

                            <input
                              type="text"
                              maxLength={6}
                              required
                              placeholder="Type code (e.g. 448102)"
                              value={loginOtpCode}
                              onChange={(e) => setLoginOtpCode(e.target.value.replace(/\D/g, ""))}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 px-3 text-center text-xs font-mono tracking-[0.4em] font-extrabold text-teal-300 focus:outline-none focus:border-teal-500"
                            />
                            <div className="flex items-center justify-between text-[8px] text-slate-400">
                              <span>Expires in {loginOtpTimer}s</span>
                              <button
                                type="button"
                                disabled={loginOtpTimer > 0}
                                onClick={handleSendLoginOtp}
                                className={loginOtpTimer > 0 ? "text-slate-600" : "text-teal-400 hover:underline"}
                              >
                                Resend code
                              </button>
                            </div>
                            <span className="text-[8px] text-slate-500 block text-center font-semibold">
                              Test code: <span className="text-teal-400 font-mono font-bold">448102</span>
                            </span>
                          </div>
                        ) : (
                          /* Password or Request OTP choice */
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Account Password</label>
                                <button
                                  type="button"
                                  onClick={handleSendLoginOtp}
                                  disabled={loginIsOtpSending}
                                  className="text-[9px] text-teal-400 hover:underline font-bold"
                                >
                                  {loginIsOtpSending ? "Sending OTP..." : "Or log in with OTP Code instead"}
                                </button>
                              </div>
                              <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                <input
                                  type={showLoginPassword ? "text" : "password"}
                                  placeholder="Enter password"
                                  value={loginPassword}
                                  onChange={(e) => setLoginPassword(e.target.value)}
                                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                                >
                                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Remember Me & Forgot Password triggers */}
                    <div className="flex justify-between items-center text-[10px] text-slate-400 select-none pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-800 bg-slate-900 text-teal-600 focus:ring-teal-500"
                        />
                        <span>Remember me on this machine</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotFlow(true);
                          setForgotStep(1);
                        }}
                        className="text-teal-400 hover:underline font-bold text-[10px]"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    {/* Quick Biometrics Button */}
                    <div className="pt-1.5">
                      <button
                        type="button"
                        onClick={handleBiometricLogin}
                        disabled={biometricScanning}
                        className={`w-full py-2 border rounded-xl flex items-center justify-center gap-2 text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                          biometricScanning
                            ? "bg-slate-900 border-teal-500/30 text-teal-400"
                            : "bg-slate-950/40 border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-teal-400"
                        }`}
                      >
                        <Fingerprint className={`h-4.5 w-4.5 text-teal-500 ${biometricScanning ? "animate-pulse" : ""}`} />
                        <span>
                          {biometricScanning
                            ? "Verifying Biometric Credentials..."
                            : "Quick Biometric Log In (FaceID / Fingerprint)"}
                        </span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-teal-950/30"
                    >
                      {loginOtpSent ? "Verify & Enter Workspace" : "Secure Log In"}
                    </button>
                  </form>
                )}

                {/* SOCIAL LOGIN */}
                <div className="pt-3.5 border-t border-slate-900 space-y-2.5">
                  <span className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                    Or handshake secure social credential
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSocialAuth("Google")}
                      className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 text-[9.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialAuth("Facebook")}
                      className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 text-[9.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Facebook
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialAuth("LinkedIn")}
                      className="py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 text-[9.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      LinkedIn
                    </button>
                  </div>
                </div>

                {/* SESSION MANAGEMENT SUB-WORKSPACE */}
                <div className="pt-4 mt-2 border-t border-slate-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                      Sovereign Device Session Registry
                    </span>
                    <span className="text-[8px] bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold px-1.5 py-0.5 rounded-full">
                      {activeSessions.length} Active
                    </span>
                  </div>

                  {sessionAlert && (
                    <div className="text-[9px] bg-teal-950/30 border border-teal-500/20 text-teal-300 p-2 rounded-xl mb-2 flex items-center gap-1.5 animate-pulse">
                      <Clock className="h-3 w-3 animate-spin text-teal-400" />
                      <span>{sessionAlert}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                    {activeSessions.map((sess) => (
                      <div
                        key={sess.id}
                        className="bg-slate-950/40 border border-slate-850/80 p-2 rounded-xl flex items-center justify-between gap-2 hover:border-slate-800 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-900 rounded-lg text-slate-400">
                            {sess.device.includes("App") || sess.device.includes("iOS") ? (
                              <Smartphone className="h-3.5 w-3.5" />
                            ) : (
                              <Laptop className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9.5px] font-extrabold text-slate-200">{sess.device}</span>
                              {sess.isCurrent && (
                                <span className="text-[7.5px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 font-black uppercase px-1 rounded-sm">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-[8px] text-slate-500 font-semibold">{sess.location} • {sess.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeSessions.length > 1 && (
                    <button
                      type="button"
                      onClick={handleRevokeAllOtherSessions}
                      className="w-full mt-2 py-1.5 bg-rose-950/20 hover:bg-rose-950/30 border border-rose-900/30 text-rose-400 hover:text-rose-300 font-extrabold text-[8.5px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="h-3 w-3" />
                      <span>Terminate all other devices & sessions</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy Footnote */}
          <div className="text-center pt-5 border-t border-slate-900 mt-6 text-[9.5px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
            <span>Encrypted with TLS 1.3 SHA-256 standard. Escrow reserves active.</span>
          </div>

        </div>

      </div>
      
    </div>
  );
}
