import React, { useState, useEffect } from "react";
import {
  Building,
  Smartphone,
  Mail,
  Lock,
  ShieldCheck,
  Globe,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  FileText,
  Upload,
  CreditCard,
  UserCheck,
  Check,
  Fingerprint,
  Laptop,
  Tablet,
  Trash2,
  X,
  KeyRound,
  ShieldAlert,
  Calendar,
  MapPin,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SupplierOnboardingData {
  businessName: string;
  gstNumber: string;
  panNumber: string;
  tradeLicense: string;
  mobile: string;
  email: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  gstDocName: string;
  licenseDocName: string;
  bankDocName: string;
  isVerified: boolean;
  businessType?: "Manufacturer" | "Distributor" | "Retailer" | "Importer";
  contactName?: string;
  address?: string;
  website?: string;
  productCategories?: string[];
}

interface SupplierAuthOnboardingProps {
  onComplete: (data: SupplierOnboardingData) => void;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function SupplierAuthOnboarding({ onComplete }: SupplierAuthOnboardingProps) {
  // Navigation: "login" | "register" | "verification" | "forgot-password" | "sessions"
  const [view, setView] = useState<"login" | "register" | "verification" | "forgot-password" | "sessions">("login");
  const [authMethod, setAuthMethod] = useState<"email" | "mobile">("email");
  const [mobileMethod, setMobileMethod] = useState<"password" | "otp">("otp");

  // Remember Me toggle
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("agriconnect_supplier_remember") === "true";
  });

  // Registration & Login fields
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration business fields
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [tradeLicense, setTradeLicense] = useState("");
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Success alert from password reset
  const [successBanner, setSuccessBanner] = useState("");

  // OTP Simulation states
  const [otpVerificationOpen, setOtpVerificationOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpSentCount, setOtpSentCount] = useState(0);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Forgot Password flow states
  const [forgotDest, setForgotDest] = useState("");
  const [forgotOtpCode, setForgotOtpCode] = useState("");
  const [forgotStep, setForgotStep] = useState<"enter" | "otp" | "reset">("enter");
  const [forgotTimer, setForgotTimer] = useState(60);
  const [forgotError, setForgotError] = useState("");
  const [isForgotSending, setIsForgotSending] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Biometric animation state
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricStage, setBiometricStage] = useState<"handshake" | "scan" | "success" | "error">("handshake");
  const [biometricMsg, setBiometricMsg] = useState("");

  // Business verification upload simulation states
  const [gstDoc, setGstDoc] = useState<File | null>(null);
  const [licenseDoc, setLicenseDoc] = useState<File | null>(null);
  const [bankDoc, setBankDoc] = useState<File | null>(null);
  const [kycDoc, setKycDoc] = useState<File | null>(null);
  
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Profile Onboarding Wizard Steps & Fields
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [businessType, setBusinessType] = useState<"Manufacturer" | "Distributor" | "Retailer" | "Importer" | "">("Manufacturer");
  const [contactName, setContactName] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Seeds", "Fertilizers"]);

  // Active Sessions state
  const [sessions, setSessions] = useState<ActiveSession[]>(() => {
    const stored = localStorage.getItem("agriconnect_supplier_sessions");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: "sess-1",
        device: "Corporate Desktop PC",
        browser: "Chrome v126.0 (Windows)",
        location: "Mumbai, Maharashtra, India",
        ipAddress: "103.45.2.19",
        lastActive: "Active now",
        isCurrent: true
      },
      {
        id: "sess-2",
        device: "AgriConnect Companion Mobile",
        browser: "Android Native Shell",
        location: "Krishna, Maharashtra, India",
        ipAddress: "110.22.45.1",
        lastActive: "2 hours ago",
        isCurrent: false
      },
      {
        id: "sess-3",
        device: "Field Tablet Pro",
        browser: "Safari (iPadOS)",
        location: "New Delhi, Delhi, India",
        ipAddress: "202.89.120.55",
        lastActive: "2 days ago",
        isCurrent: false
      }
    ];
  });

  // Pre-fill if Remember Me is checked
  useEffect(() => {
    if (rememberMe) {
      const savedEmail = localStorage.getItem("agriconnect_supplier_saved_email") || "";
      const savedMobile = localStorage.getItem("agriconnect_supplier_saved_mobile") || "";
      if (savedEmail) setEmail(savedEmail);
      if (savedMobile) setMobile(savedMobile);
    }
  }, []);

  // Save Sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("agriconnect_supplier_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Countdown timer for simulated OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpVerificationOpen && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpVerificationOpen, otpTimer]);

  // Countdown timer for Forgot Password OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (forgotStep === "otp" && forgotTimer > 0) {
      interval = setInterval(() => {
        setForgotTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [forgotStep, forgotTimer]);

  const handleSendOtp = () => {
    if (!mobile || mobile.length < 10) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsOtpSending(true);
    setOtpError("");
    
    // Simulate Twilio trigger
    setTimeout(() => {
      setIsOtpSending(false);
      setOtpVerificationOpen(true);
      setOtpTimer(60);
      setOtpSentCount((prev) => prev + 1);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otpCode === "123456" || otpCode.length === 6) {
      setOtpVerificationOpen(false);
      setOtpError("");
      if (view === "login") {
        handleSuccessLogin();
      } else {
        setView("verification");
      }
    } else {
      setOtpError("Incorrect verification code. Please use code '123456' for instant access.");
    }
  };

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "No Password", color: "bg-slate-200", percent: 0, textColor: "text-slate-400" };
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 25;
    if (/\d/.test(pass)) score += 25;
    if (/[@$!%*?&]/.test(pass)) score += 25;

    if (score <= 25) return { label: "Weak Security", color: "bg-rose-500", percent: 25, textColor: "text-rose-500" };
    if (score <= 50) return { label: "Fair Protection", color: "bg-amber-500", percent: 50, textColor: "text-amber-500" };
    if (score <= 75) return { label: "Good Shield", color: "bg-blue-500", percent: 75, textColor: "text-blue-500" };
    return { label: "Military-Grade Secure", color: "bg-emerald-500", percent: 100, textColor: "text-emerald-500" };
  };

  const strength = getPasswordStrength(password);
  const resetStrength = getPasswordStrength(newPassword);

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms || !agreePrivacy) {
      alert("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (!gstNumber) {
      alert("GST registration number is mandatory for wholesale suppliers.");
      return;
    }
    setView("verification");
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleSuccessLogin();
  };

  const handleMobilePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setOtpError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!password) {
      setOtpError("Please enter your account security password.");
      return;
    }
    handleSuccessLogin();
  };

  const handleSuccessLogin = () => {
    // Save Remember Me settings
    if (rememberMe) {
      localStorage.setItem("agriconnect_supplier_remember", "true");
      if (email) localStorage.setItem("agriconnect_supplier_saved_email", email);
      if (mobile) localStorage.setItem("agriconnect_supplier_saved_mobile", mobile);
    } else {
      localStorage.removeItem("agriconnect_supplier_remember");
      localStorage.removeItem("agriconnect_supplier_saved_email");
      localStorage.removeItem("agriconnect_supplier_saved_mobile");
    }

    const defaultData: SupplierOnboardingData = {
      businessName: businessName || "Green Harvest Supplies Pvt Ltd",
      gstNumber: gstNumber || "29FGHIJ5678K1L2",
      panNumber: panNumber || "ABCDE1234F",
      tradeLicense: tradeLicense || "TL-8821948",
      mobile: mobile || "9876543212",
      email: email || "suresh.kumar@greenharvest.in",
      bankName: bankName || "State Bank of India",
      accountNumber: accountNumber || "384102941031",
      ifscCode: ifscCode || "SBIN0001042",
      gstDocName: "gst_certificate_signed.pdf",
      licenseDocName: "trade_license_validated.pdf",
      bankDocName: "canceled_cheque.pdf",
      isVerified: true,
      contactName: contactName || "Suresh Kumar",
      businessType: businessType || "Manufacturer",
      productCategories: selectedCategories || ["Seeds", "Fertilizers", "Equipment"]
    };
    localStorage.setItem("agriconnect_supplier_auth", "true");
    localStorage.setItem("agriconnect_supplier_data", JSON.stringify(defaultData));
    onComplete(defaultData);
  };

  // Trigger simulated biometric verification scan
  const handleTriggerBiometrics = () => {
    setBiometricScanning(true);
    setBiometricStage("handshake");
    setBiometricMsg("Establishing encrypted challenge handshake...");

    setTimeout(() => {
      setBiometricStage("scan");
      setBiometricMsg("Scanning live fingerprint/face template data from secure enclave...");
    }, 900);

    setTimeout(() => {
      setBiometricStage("success");
      setBiometricMsg("Credential match verified! Secure session key decrypted.");
    }, 2100);

    setTimeout(() => {
      setBiometricScanning(false);
      handleSuccessLogin();
    }, 2900);
  };

  // Request Reset Password OTP
  const handleRequestForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotDest) {
      setForgotError("Please enter your registered Corporate Email or Mobile.");
      return;
    }
    setIsForgotSending(true);
    setForgotError("");

    setTimeout(() => {
      setIsForgotSending(false);
      setForgotStep("otp");
      setForgotTimer(60);
    }, 1200);
  };

  // Verify Reset Password OTP
  const handleVerifyForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtpCode === "123456" || forgotOtpCode.length === 6) {
      setForgotError("");
      setForgotStep("reset");
    } else {
      setForgotError("Invalid verification code. Please enter '123456' for simulated approval.");
    }
  };

  // Reset Password Complete Action
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match. Please verify.");
      return;
    }
    if (newPassword.length < 8) {
      setForgotError("Security rules mandate at least 8 characters.");
      return;
    }

    // Simulate database write
    localStorage.setItem("agriconnect_supplier_saved_pass", newPassword);
    setSuccessBanner("Your account security password has been updated. Please sign in below.");
    setForgotStep("enter");
    setForgotDest("");
    setForgotOtpCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setView("login");
  };

  // Session Management handlers
  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleRevokeAllSessions = () => {
    // Keep only the current session
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  };

  const handleUploadVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingVerification(true);
    
    // Simulate smart business verification checking GST records
    setTimeout(() => {
      setIsSubmittingVerification(false);
      setVerificationSuccess(true);
      
      setTimeout(() => {
        const finalData: SupplierOnboardingData = {
          businessName: businessName || "AgriInput Global Ltd",
          gstNumber: gstNumber || "27AAAAA1111A1Z1",
          panNumber: panNumber || "ABCDE1234F",
          tradeLicense: tradeLicense || "TL-8821948",
          mobile: mobile || "9876543210",
          email: email || "supplier@agriconnect.com",
          bankName: bankName || "HDFC Bank Ltd",
          accountNumber: accountNumber || "501002938482",
          ifscCode: ifscCode || "HDFC0000012",
          gstDocName: gstDoc ? gstDoc.name : "gst_cert_ocr_extracted.pdf",
          licenseDocName: licenseDoc ? licenseDoc.name : "trade_license_extracted.pdf",
          bankDocName: bankDoc ? bankDoc.name : "bank_proof_passbook.pdf",
          isVerified: true,
          businessType: businessType || "Manufacturer",
          contactName: contactName || "Rajesh Kumar",
          address: address || "45, MIDC Industrial Area, Mumbai",
          website: website || "https://agriinputglobal.com",
          productCategories: selectedCategories
        };
        localStorage.setItem("agriconnect_supplier_auth", "true");
        localStorage.setItem("agriconnect_supplier_data", JSON.stringify(finalData));
        onComplete(finalData);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      {/* Biometric Scan Modal Overlay */}
      <AnimatePresence>
        {biometricScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
            >
              {/* Dynamic decorative radar beam */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none animate-pulse" />

              <div className="relative z-10 space-y-6">
                <div className="flex justify-center">
                  <div className="relative p-6 bg-slate-800/80 rounded-full border border-slate-700/80">
                    <Fingerprint className={`h-16 w-16 text-emerald-400 ${biometricStage === "scan" ? "animate-pulse scale-105" : ""}`} />
                    
                    {/* Laser scanner effect */}
                    {biometricStage === "scan" && (
                      <motion.div
                        className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] z-20"
                        animate={{ top: ["15%", "85%", "15%"] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      />
                    )}

                    {biometricStage === "success" && (
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500">
                        <Check className="h-10 w-10 text-emerald-400 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-black uppercase tracking-wider text-emerald-400">
                    {biometricStage === "handshake" && "Handshake Initializing"}
                    {biometricStage === "scan" && "Scanning Biometric ID"}
                    {biometricStage === "success" && "Biometrics Confirmed"}
                  </h4>
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed min-h-[36px]">
                    {biometricMsg}
                  </p>
                </div>

                {biometricStage !== "success" && (
                  <button
                    onClick={() => setBiometricScanning(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Cancel Authentication
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Decorative Column (Left side) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#164e63] to-[#0f172a] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl" />
          
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                  <Building className="h-6 w-6 text-emerald-400" />
                </div>
                <span className="font-extrabold text-sm tracking-widest uppercase text-emerald-300">Supplier Portal</span>
              </div>
              
              {/* Active Sessions view entry point */}
              {view === "login" && (
                <button
                  type="button"
                  onClick={() => setView("sessions")}
                  className="p-1.5 hover:bg-white/10 text-teal-200 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Sessions ({sessions.length})
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
                Empower your wholesale distribution
              </h2>
              <p className="text-slate-300 text-xs leading-relaxed">
                List certified seeds, solar-powered machinery, climate-resilient composts, and high-tech tools. Connect directly with over 50,000 farmers and bulk buyers across India's largest agri-marketplace.
              </p>
            </div>
          </div>

          <div className="relative space-y-4 pt-10 border-t border-white/10 mt-8 md:mt-0">
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>100% Tax Compliant Sourcing</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
              <Globe className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Pan-India Logistics Support</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-200">
              <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Smart Credit Settlement Ledger</span>
            </div>
          </div>
        </div>

        {/* Action Column (Right side) */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center bg-slate-50/50">
          
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: LOGIN */}
            {view === "login" && (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl font-extrabold text-slate-850">Welcome back, Partner</h3>
                  <p className="text-slate-500 text-xs mt-1">Sign in to manage your AgriConnect storefront and bulk orders</p>
                </div>

                {/* Seed Data Demo quick access */}
                <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Seed Demo Account</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail("suresh.kumar@greenharvest.in");
                        setMobile("9876543212");
                        setPassword("supplier123");
                        setBusinessName("Green Harvest Supplies Pvt Ltd");
                        setGstNumber("29FGHIJ5678K1L2");
                        setPanNumber("ABCDE1234F");
                        setBankName("State Bank of India");
                        setAccountNumber("384102941031");
                        setIfscCode("SBIN0001042");
                        // Automatically authenticate
                        setTimeout(() => {
                          handleSuccessLogin();
                        }, 200);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      Instant Login
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-600">
                    <div><span className="font-bold text-slate-500">Partner:</span> Suresh Kumar</div>
                    <div><span className="font-bold text-slate-500">Mobile:</span> 9876543212</div>
                    <div><span className="font-bold text-slate-500">Company:</span> Green Harvest Supplies</div>
                    <div><span className="font-bold text-slate-500">Password:</span> supplier123</div>
                  </div>
                </div>

                {successBanner && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3.5 rounded-2xl flex items-start gap-2"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] font-semibold leading-relaxed">{successBanner}</span>
                  </motion.div>
                )}

                {/* Login Method Toggle */}
                <div className="flex border border-slate-200 rounded-2xl p-1 bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("email");
                      setOtpError("");
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      authMethod === "email" ? "bg-[#164e63] text-white shadow" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Mail className="h-4.5 w-4.5 inline mr-1.5" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod("mobile");
                      setOtpError("");
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      authMethod === "mobile" ? "bg-[#164e63] text-white shadow" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Smartphone className="h-4.5 w-4.5 inline mr-1.5" /> Mobile Number
                  </button>
                </div>

                {/* Email Login Form */}
                {authMethod === "email" ? (
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Corporate Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="partner@agriinput.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 animate-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Password</label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotDest(email || "");
                            setForgotStep("enter");
                            setView("forgot-password");
                          }}
                          className="text-[10px] text-teal-600 font-bold hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-500 font-bold">Remember my credentials</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleTriggerBiometrics}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-extrabold flex items-center gap-1 hover:underline cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 transition-all"
                      >
                        <Fingerprint className="h-4 w-4" /> Biometric Login
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      Authenticate Account <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  /* Mobile Login Forms */
                  <div className="space-y-4">
                    {/* Switch between Mobile + Password vs Mobile + OTP */}
                    <div className="flex gap-4 border-b border-slate-200 pb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMethod("otp");
                          setOtpVerificationOpen(false);
                          setOtpError("");
                        }}
                        className={`text-xs font-extrabold cursor-pointer transition-colors ${
                          mobileMethod === "otp" ? "text-emerald-600 border-b-2 border-emerald-500 pb-1" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        Sign in via SMS OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMethod("password");
                          setOtpVerificationOpen(false);
                          setOtpError("");
                        }}
                        className={`text-xs font-extrabold cursor-pointer transition-colors ${
                          mobileMethod === "password" ? "text-emerald-600 border-b-2 border-emerald-500 pb-1" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        Sign in via Password
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Registered Mobile Number</label>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500">+91</span>
                        <div className="relative flex-1">
                          <Smartphone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="98765 43210"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                    </div>

                    {mobileMethod === "password" ? (
                      <form onSubmit={handleMobilePasswordLogin} className="space-y-3.5">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Security Password</label>
                            <button
                              type="button"
                              onClick={() => {
                                setForgotDest(mobile || "");
                                setForgotStep("enter");
                                setView("forgot-password");
                              }}
                              className="text-[10px] text-teal-600 font-bold hover:underline cursor-pointer"
                            >
                              Forgot password?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              placeholder="••••••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Remember Me toggle & Biometrics */}
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600 cursor-pointer"
                            />
                            <span className="text-[11px] text-slate-500 font-bold">Remember Me</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleTriggerBiometrics}
                            className="text-[11px] text-emerald-600 hover:text-emerald-700 font-extrabold flex items-center gap-1 hover:underline cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 transition-all"
                          >
                            <Fingerprint className="h-4 w-4" /> Biometric login
                          </button>
                        </div>

                        {otpError && (
                          <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> {otpError}</p>
                        )}

                        <button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          Verify & Access Console <ArrowRight className="h-4 w-4" />
                        </button>
                      </form>
                    ) : (
                      /* SMS OTP Flow */
                      <div className="space-y-4">
                        {otpVerificationOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-teal-800 uppercase tracking-widest flex items-center gap-1">
                                <Info className="h-3.5 w-3.5" /> Enter 6-Digit SMS OTP
                              </span>
                              <span className="text-[10px] font-mono font-bold text-teal-600">
                                {otpTimer > 0 ? `Resend in ${otpTimer}s` : "OTP ready to resend"}
                              </span>
                            </div>
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="Enter SMS OTP Code"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                              className="w-full bg-white border border-teal-200 text-center tracking-widest text-lg font-black font-mono py-2 rounded-xl focus:outline-none focus:border-teal-500 text-[#164e63]"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                            >
                              Verify Code & Log In
                            </button>
                          </motion.div>
                        )}

                        {otpError && (
                          <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> {otpError}</p>
                        )}

                        {/* Remember Me checkbox */}
                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600 cursor-pointer"
                            />
                            <span className="text-[11px] text-slate-500 font-bold">Remember Me</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleTriggerBiometrics}
                            className="text-[11px] text-emerald-600 hover:text-emerald-700 font-extrabold flex items-center gap-1 hover:underline cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 transition-all"
                          >
                            <Fingerprint className="h-4 w-4" /> Biometric login
                          </button>
                        </div>

                        {!otpVerificationOpen ? (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isOtpSending}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-75"
                          >
                            {isOtpSending ? (
                              <>
                                <RefreshCw className="h-4 w-4 animate-spin" /> Issuing Twilio OTP...
                              </>
                            ) : (
                              <>
                                Request SMS Verification OTP <ArrowRight className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        ) : (
                          otpTimer === 0 && (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="w-full border border-[#164e63] text-[#164e63] font-bold py-2.5 rounded-2xl text-xs hover:bg-teal-50/50 cursor-pointer transition-colors"
                            >
                              Resend SMS OTP Code (Twilio)
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Social Login Integrations */}
                <div className="space-y-3 pt-2">
                  <div className="relative flex py-1.5 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-wider">Or Social Sign In</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={handleSuccessLogin}
                      className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-rose-500 font-extrabold font-sans">G</span> Google
                    </button>
                    <button
                      type="button"
                      onClick={handleSuccessLogin}
                      className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-blue-600 font-extrabold font-sans">f</span> Facebook
                    </button>
                    <button
                      type="button"
                      onClick={handleSuccessLogin}
                      className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-teal-600 font-extrabold font-sans">in</span> LinkedIn
                    </button>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs font-semibold text-slate-500">
                    New to AgriConnect?{" "}
                    <button
                      type="button"
                      onClick={() => setView("register")}
                      className="text-emerald-600 font-black hover:underline cursor-pointer"
                    >
                      Create Supplier Account
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* VIEW: FORGOT PASSWORD FLOW */}
            {view === "forgot-password" && (
              <motion.div
                key="forgot-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl font-extrabold text-slate-850">Reset Security Credentials</h3>
                  <p className="text-slate-500 text-xs mt-1">We will send a 6-digit OTP code to authorize password replacement</p>
                </div>

                {forgotError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 shrink-0" /> {forgotError}
                  </div>
                )}

                {forgotStep === "enter" && (
                  <form onSubmit={handleRequestForgotOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Corporate Email or Mobile Number</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="partner@agriinput.com or 9876543210"
                          value={forgotDest}
                          onChange={(e) => setForgotDest(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 pl-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isForgotSending}
                      className="w-full bg-[#164e63] hover:bg-teal-950 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                    >
                      {isForgotSending ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> Issuing Recovery Token...
                        </>
                      ) : (
                        <>
                          Request OTP Token <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {forgotStep === "otp" && (
                  <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
                    <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-teal-800 uppercase tracking-widest flex items-center gap-1">
                          <Info className="h-3.5 w-3.5" /> Enter 6-Digit SMS OTP
                        </span>
                        <span className="text-[10px] font-mono font-bold text-teal-600">
                          {forgotTimer > 0 ? `Resend in ${forgotTimer}s` : "OTP ready to resend"}
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-Digit Code"
                        value={forgotOtpCode}
                        onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-white border border-teal-200 text-center tracking-widest text-lg font-black font-mono py-2 rounded-xl focus:outline-none focus:border-teal-500 text-[#164e63]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Authorize Verification <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}

                {forgotStep === "reset" && (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">New Access Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      {newPassword && (
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Strength Indicator:</span>
                            <span className={`text-[8px] font-black uppercase ${resetStrength.textColor}`}>{resetStrength.label}</span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${resetStrength.color} transition-all duration-300`}
                              style={{ width: `${resetStrength.percent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      Update Password & Sign In <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}

                <div className="text-center pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setForgotError("");
                    }}
                    className="text-[#164e63] text-xs font-black hover:underline cursor-pointer flex items-center justify-center mx-auto gap-1"
                  >
                    Return to Login
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW: SESSIONS & ACTIVE DEVICES */}
            {view === "sessions" && (
              <motion.div
                key="sessions-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5.5 w-5.5 text-emerald-600 shrink-0" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">Session Management</h3>
                      <p className="text-slate-400 text-[10px] font-semibold">Audit active devices authorized to access your merchant store</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="p-1.5 bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full cursor-pointer transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        sess.isCurrent
                          ? "bg-emerald-50/50 border-emerald-200/80 shadow-sm"
                          : "bg-white border-slate-200/60"
                      } flex items-center justify-between gap-3`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                          sess.isCurrent ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                        }`}>
                          {sess.device.includes("Mobile") ? (
                            <Smartphone className="h-4 w-4" />
                          ) : sess.device.includes("Tablet") ? (
                            <Tablet className="h-4 w-4" />
                          ) : (
                            <Laptop className="h-4 w-4" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-extrabold text-slate-800">{sess.device}</span>
                            {sess.isCurrent && (
                              <span className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <Check className="h-2 w-2 stroke-[3]" /> THIS DEVICE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-semibold space-y-0.5">
                            <p className="flex items-center gap-1"><Info className="h-3 w-3 shrink-0" /> {sess.browser} • IP: {sess.ipAddress}</p>
                            <p className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0 text-slate-400" /> {sess.location}</p>
                            <p className="flex items-center gap-1"><Calendar className="h-3 w-3 shrink-0 text-slate-400" /> Last Active: {sess.lastActive}</p>
                          </div>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleRevokeSession(sess.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100 shrink-0"
                          title="Revoke session key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {sessions.length > 1 && (
                  <button
                    type="button"
                    onClick={handleRevokeAllSessions}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200/50 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ShieldAlert className="h-4 w-4 shrink-0 animate-bounce" /> Revoke All Other Active Sessions
                  </button>
                )}

                <div className="text-center pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-[#164e63] text-xs font-black hover:underline cursor-pointer"
                  >
                    Return to Credentials Login
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: REGISTER */}
            {view === "register" && (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl font-extrabold text-slate-850">Apply as Wholesale Supplier</h3>
                  <p className="text-slate-500 text-xs mt-1">Submit business details and verify GST credentials</p>
                </div>

                <form onSubmit={handleEmailSignUp} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Company / Business Name</label>
                      <input
                        type="text"
                        required
                        placeholder="AgriInput Global Ltd"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-[#164e63] uppercase tracking-wider block flex items-center gap-0.5">
                        GSTIN Number <span className="text-rose-500 font-black">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={15}
                        placeholder="27AAAAA1111A1Z1"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-teal-200 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Company PAN Code</label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        placeholder="ABCDE1234F"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Trade License Number</label>
                      <input
                        type="text"
                        required
                        placeholder="TL-99210-2026"
                        value={tradeLicense}
                        onChange={(e) => setTradeLicense(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Official Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="partner@agriinput.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Contact Mobile Number</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Create Access Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Choose a robust password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-10 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Interactive Password Strength meter */}
                    {password && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Strength Indicator:</span>
                          <span className={`text-[8px] font-black uppercase ${strength.textColor}`}>{strength.label}</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strength.color} transition-all duration-300`}
                            style={{ width: `${strength.percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Consents and terms */}
                  <div className="space-y-2 pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 accent-emerald-600"
                      />
                      <span className="text-[10px] text-slate-500 leading-tight">
                        I agree to the <span className="text-emerald-600 font-extrabold hover:underline">AgriConnect Wholesale Merchant Terms & Conditions</span> and verify my tax clearance status.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreePrivacy}
                        onChange={(e) => setAgreePrivacy(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 accent-emerald-600"
                      />
                      <span className="text-[10px] text-slate-500 leading-tight">
                        I authorize AgriConnect to perform automatic GSTIN lookup and run audit logs in compliance with state policies.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!agreeTerms || !agreePrivacy || !gstNumber}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm mt-3 cursor-pointer"
                  >
                    Register Business & Onboard <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500">
                    Already registered with us?{" "}
                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className="text-[#164e63] font-black hover:underline cursor-pointer"
                    >
                      Login Here
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: BUSINESS DOCUMENT VERIFICATION WIZARD (ONBOARDING WIZARD) */}
            {view === "verification" && (
              <motion.div
                key="verification-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Onboarding Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5.5 w-5.5 text-emerald-600 shrink-0" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">Supplier Profile Onboarding</h3>
                      <p className="text-slate-400 text-[10px] font-semibold">Complete profile setups to activate wholesale inventory trading</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl">
                    Step {wizardStep} of 4
                  </span>
                </div>

                {/* Progress Bar (Shows 25%, 50%, 75%, 100% completion) */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-150 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-600 uppercase tracking-wider text-[10px]">Onboarding Stage Progress</span>
                    <span className="font-mono text-emerald-700 font-black text-xs bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50">
                      {wizardStep === 1 ? "25% Complete" : wizardStep === 2 ? "50% Complete" : wizardStep === 3 ? "75% Complete" : "100% Complete"}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 rounded-full"
                      style={{ width: `${wizardStep * 25}%` }}
                    />
                  </div>
                  {/* Step labels */}
                  <div className="grid grid-cols-4 gap-1 text-[9px] font-extrabold uppercase tracking-tight text-center pt-1 text-slate-400">
                    <span className={wizardStep >= 1 ? "text-emerald-700 font-black" : ""}>1. Business</span>
                    <span className={wizardStep >= 2 ? "text-emerald-700 font-black" : ""}>2. Contact</span>
                    <span className={wizardStep >= 3 ? "text-emerald-700 font-black" : ""}>3. Categories</span>
                    <span className={wizardStep >= 4 ? "text-emerald-700 font-black" : ""}>4. Verify</span>
                  </div>
                </div>

                {/* STEP 1: BUSINESS DETAILS */}
                {wizardStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-[#164e63]/5 p-3.5 rounded-2xl border border-[#164e63]/10">
                      <p className="text-xs font-bold text-[#164e63] flex items-center gap-1">
                        <Building className="h-4 w-4 shrink-0" /> Step 1: Legal Business Details
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Please specify your corporate registration and tax status.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Company / Business Name</label>
                        <input
                          type="text"
                          required
                          placeholder="AgriInput Global Ltd"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">GSTIN Registration Number</label>
                          <input
                            type="text"
                            required
                            maxLength={15}
                            placeholder="27AAAAA1111A1Z1"
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Company PAN Code</label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="ABCDE1234F"
                            value={panNumber}
                            onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      {/* Business Type Selector */}
                      <div className="space-y-2 pt-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Corporate Business Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "Manufacturer", label: "Manufacturer", desc: "Chemical processors, seed breeders & formulators" },
                            { value: "Distributor", label: "Distributor", desc: "Bulk local importers & regional logisticians" },
                            { value: "Retailer", label: "Retailer", desc: "Franchise seed shops & state retail dealers" },
                            { value: "Importer", label: "Importer", desc: "Global specialized technology import agents" }
                          ].map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => setBusinessType(type.value as any)}
                              className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                                businessType === type.value
                                  ? "bg-emerald-50/60 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30"
                                  : "bg-white border-slate-200 hover:border-slate-350 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-black uppercase tracking-tight">{type.label}</span>
                                {businessType === type.value && (
                                  <span className="p-0.5 bg-emerald-500 text-white rounded-full">
                                    <Check className="h-3 w-3 stroke-[3]" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-400 font-medium leading-tight mt-1">{type.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="button"
                        disabled={!businessName || !gstNumber || !panNumber || !businessType}
                        onClick={() => setWizardStep(2)}
                        className="bg-[#164e63] hover:bg-teal-950 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        Next Step: Contact Details <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: CONTACT DETAILS */}
                {wizardStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-[#164e63]/5 p-3.5 rounded-2xl border border-[#164e63]/10">
                      <p className="text-xs font-bold text-[#164e63] flex items-center gap-1">
                        <Smartphone className="h-4 w-4 shrink-0" /> Step 2: Contact & Website Details
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Define corporate liaison representatives and communication addresses.</p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Liaison Name / Representative Contact</label>
                        <input
                          type="text"
                          required
                          placeholder="Rajesh Kumar (Managing Director)"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Official Mobile Number</label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="9876543210"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Corporate Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="partner@agriinput.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Registered Office / Warehouse Address</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Plot 45-B, MIDC Industrial Area Phase II, Maharashtra, 400013"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Corporate Website URL (Optional)</label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="url"
                            placeholder="https://www.agriinputglobal.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setWizardStep(1)}
                        className="border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        disabled={!contactName || !mobile || !email || !address}
                        onClick={() => setWizardStep(3)}
                        className="bg-[#164e63] hover:bg-teal-950 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        Next Step: Product Categories <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: PRODUCT CATEGORIES */}
                {wizardStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-[#164e63]/5 p-3.5 rounded-2xl border border-[#164e63]/10">
                      <p className="text-xs font-bold text-[#164e63] flex items-center gap-1">
                        <Sparkles className="h-4 w-4 shrink-0 text-amber-500" /> Step 3: Product Categories
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Select the primary categories of farm inputs your enterprise plans to supply.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: "Seeds", label: "Seeds", desc: "High-yield hybrid seeds, field crop varieties" },
                        { id: "Fertilizers", label: "Fertilizers", desc: "Bio-fertilizers, organic manures, potash & chemical complexes" },
                        { id: "Pesticides", label: "Pesticides", desc: "Insecticides, organic biopesticides, weed killers" },
                        { id: "Equipment", label: "Equipment", desc: "Modern farm tools, tillers, mechanical seed drills" },
                        { id: "Irrigation", label: "Irrigation", desc: "Drip kits, high-pressure pipes, sprinkler nozzles" },
                        { id: "Organic Inputs", label: "Organic Inputs", desc: "Vermicompost, organic nutrient boosts, natural additives" }
                      ].map((cat) => {
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedCategories(selectedCategories.filter((c) => c !== cat.id));
                              } else {
                                setSelectedCategories([...selectedCategories, cat.id]);
                              }
                            }}
                            className={`p-3 text-left rounded-xl border transition-all flex items-start gap-2 cursor-pointer ${
                              isSelected
                                ? "bg-teal-50/50 border-teal-500 text-teal-950 ring-1 ring-teal-500/20"
                                : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="mt-1 rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5 accent-teal-600 pointer-events-none"
                            />
                            <div>
                              <span className="text-xs font-extrabold block">{cat.label}</span>
                              <span className="text-[9px] text-slate-400 font-medium leading-normal mt-0.5 block">{cat.desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-3 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setWizardStep(2)}
                        className="border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        disabled={selectedCategories.length === 0}
                        onClick={() => setWizardStep(4)}
                        className="bg-[#164e63] hover:bg-teal-950 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        Next Step: Verification <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: VERIFICATION */}
                {wizardStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-[#164e63]/5 p-3.5 rounded-2xl border border-[#164e63]/10">
                      <p className="text-xs font-bold text-[#164e63] flex items-center gap-1">
                        <Shield className="h-4 w-4 shrink-0 text-emerald-600" /> Step 4: Verification & Banking Clearance
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Upload mandatory compliance certificates and link your settlement clearing account.</p>
                    </div>

                    <form onSubmit={handleUploadVerification} className="space-y-4">
                      {/* Document uploaders */}
                      <div className="space-y-2.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Compliance Documents & Identity KYC</label>
                        
                        {/* GST Certificate */}
                        <div className="flex items-center justify-between p-2.5 border border-dashed border-slate-200 rounded-xl bg-white">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-slate-700 block">GST certificate (mandatory)</span>
                              <span className="text-[8px] text-slate-400 block font-semibold">{gstDoc ? gstDoc.name : "Format: PDF, JPG (Max 5MB)"}</span>
                            </div>
                          </div>
                          <label className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                            <Upload className="h-3 w-3" /> Select File
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => setGstDoc(e.target.files ? e.target.files[0] : null)}
                            />
                          </label>
                        </div>

                        {/* Trade License */}
                        <div className="flex items-center justify-between p-2.5 border border-dashed border-slate-200 rounded-xl bg-white">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-sky-50 text-sky-700 rounded-lg shrink-0">
                              <Building className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-slate-700 block">Trade License / Incorporation proof</span>
                              <span className="text-[8px] text-slate-400 block font-semibold">{licenseDoc ? licenseDoc.name : "Format: PDF, JPG, PNG"}</span>
                            </div>
                          </div>
                          <label className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                            <Upload className="h-3 w-3" /> Select File
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => setLicenseDoc(e.target.files ? e.target.files[0] : null)}
                            />
                          </label>
                        </div>

                        {/* KYC Proof (Identity Card) */}
                        <div className="flex items-center justify-between p-2.5 border border-dashed border-slate-200 rounded-xl bg-white">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg shrink-0">
                              <Fingerprint className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-slate-700 block">Owner ID PAN / Aadhaar Card</span>
                              <span className="text-[8px] text-slate-400 block font-semibold">{kycDoc ? kycDoc.name : "Format: PDF, JPG, PNG"}</span>
                            </div>
                          </div>
                          <label className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                            <Upload className="h-3 w-3" /> Select File
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => setKycDoc(e.target.files ? e.target.files[0] : null)}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Bank Details section */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 space-y-2.5">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-emerald-600" /> Merchant Settlement Bank details
                        </span>
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bank Name</label>
                            <input
                              type="text"
                              required
                              placeholder="HDFC Bank"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Account Number</label>
                            <input
                              type="text"
                              required
                              placeholder="50100293848"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">IFS Code</label>
                            <input
                              type="text"
                              required
                              maxLength={11}
                              placeholder="HDFC0000012"
                              value={ifscCode}
                              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Canceled Cheque file */}
                        <div className="flex items-center justify-between p-2 border border-slate-200 rounded-xl bg-white mt-2">
                          <div className="flex items-center gap-1.5">
                            <div className="p-1 bg-amber-50 text-amber-700 rounded-md shrink-0">
                              <CreditCard className="h-3 w-3" />
                            </div>
                            <div>
                              <span className="text-[9px] font-extrabold text-slate-600 block">Canceled Cheque / Passbook page</span>
                              <span className="text-[7.5px] text-slate-400 block font-semibold">{bankDoc ? bankDoc.name : "Format: PDF, JPG, PNG"}</span>
                            </div>
                          </div>
                          <label className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[8.5px] font-black rounded cursor-pointer flex items-center gap-0.5 transition-colors">
                            <Upload className="h-2.5 w-2.5" /> Upload File
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => setBankDoc(e.target.files ? e.target.files[0] : null)}
                            />
                          </label>
                        </div>
                      </div>

                      {verificationSuccess ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center gap-2.5">
                          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xs font-black uppercase tracking-wider">KYC Verification Succeeded!</p>
                            <p className="text-[9.5px] text-emerald-700 font-semibold leading-tight">Digital certificates match corporate databases. Booting storefront...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setWizardStep(3)}
                              className="border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmittingVerification || !bankName || !accountNumber || !ifscCode}
                              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black uppercase tracking-wider text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              {isSubmittingVerification ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Credentials...
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4.5 w-4.5" /> Finalize Merchant Onboarding
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
