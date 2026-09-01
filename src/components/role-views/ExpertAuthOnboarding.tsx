import React, { useState, useEffect } from "react";
import {
  Award,
  Mail,
  Smartphone,
  Lock,
  User,
  ShieldCheck,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Upload,
  Link,
  BookOpen,
  UserCheck,
  Fingerprint,
  Laptop,
  Key,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExpertProfile {
  name: string;
  designation: string;
  department: string;
  email: string;
  mobile: string;
  dob?: string;
  gender?: string;
  feePerCall?: number;
  feePerQuestion?: number;
  availableDays?: string[];
  availableHours?: string;
  languages?: string[];
  bankAccount?: string;
  bankIfsc?: string;
  bankUpi?: string;
  degree: string;
  certifications: string;
  experience: number;
  specializations: string[];
  aadhaar: string;
  pan: string;
  govtRegNo: string;
  linkedin: string;
  recommendations: string[];
  photoUrl?: string;
  rating?: number;
  consultations?: number;
}

interface ExpertAuthOnboardingProps {
  onComplete: (profile: ExpertProfile) => void;
}

const DEFAULT_EXPERT: ExpertProfile = {
  name: "Dr. Rachel Carter",
  designation: "Senior Plant Pathologist",
  department: "Division of Plant Pathology, Agri University",
  email: "rachel.carter@agriuni.edu",
  mobile: "+91 98765 43213",
  dob: "1988-04-12",
  gender: "Female",
  feePerCall: 500,
  feePerQuestion: 150,
  availableDays: ["Monday", "Wednesday", "Friday"],
  availableHours: "09:00 AM - 05:00 PM",
  languages: ["English", "Hindi", "Telugu"],
  bankAccount: "918273645019",
  bankIfsc: "SBIN0001234",
  bankUpi: "rachel.carter@oksbi",
  degree: "PhD in Plant Pathology",
  certifications: "ICAR Certified Agronomist, Registered Plant Pathologist",
  experience: 12,
  specializations: ["Crops", "Pests", "Soil"],
  aadhaar: "1234-5678-9012",
  pan: "ABCD1234E",
  govtRegNo: "ICAR-PATH-2026-9810",
  linkedin: "https://linkedin.com/in/rachelcarter-agri",
  recommendations: ["dr.sharma@icar.org.in", "prof.patil@agriuni.edu"],
  photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  rating: 4.9,
  consultations: 162
};

export default function ExpertAuthOnboarding({ onComplete }: ExpertAuthOnboardingProps) {
  // Auth view switcher: "login" | "register"
  const [view, setView] = useState<"login" | "register">("login");
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("agriconnect_expert_remember_me") === "true");

  // Biometric login states
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState("");
  const [biometricType, setBiometricType] = useState<"finger" | "face">("finger");

  // Active Device sessions state
  const [sessions, setSessions] = useState<Array<{ id: string; device: string; ip: string; location: string; active: boolean; icon: "Laptop" | "Smartphone" }>>(() => {
    const saved = localStorage.getItem("agriconnect_expert_sessions");
    if (saved) return JSON.parse(saved);
    return [
      { id: "sess-1", device: "Chrome on macOS (Current Device)", ip: "192.168.1.102", location: "New Delhi, IN", active: true, icon: "Laptop" },
      { id: "sess-2", device: "Safari on iPhone 15 Pro", ip: "103.45.22.18", location: "Pune, IN", active: false, icon: "Smartphone" },
      { id: "sess-3", device: "Chrome on Windows 11 Workspace", ip: "203.111.45.92", location: "Hyderabad, IN", active: false, icon: "Laptop" }
    ];
  });
  const [sessionsPanelOpen, setSessionsPanelOpen] = useState(false);

  // Forgot password states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"request" | "otp" | "reset" | "success">("request");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Registration wizard steps (1 to 5)
  const [regStep, setRegStep] = useState(1);

  // Registration credentials
  const [regName, setRegName] = useState("");
  const [regDesignation, setRegDesignation] = useState("");
  const [regDepartment, setRegDepartment] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regDob, setRegDob] = useState("");
  const [regGender, setRegGender] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Consultation Preferences
  const [feePerCall, setFeePerCall] = useState<string>("500");
  const [feePerQuestion, setFeePerQuestion] = useState<string>("150");
  const [availableDays, setAvailableDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [availableHoursStart, setAvailableHoursStart] = useState<string>("09:00");
  const [availableHoursEnd, setAvailableHoursEnd] = useState<string>("17:00");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English", "Hindi"]);

  // Payment & Bank Details
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankUpi, setBankUpi] = useState("");

  // Verification & documents states
  const [regAadhaar, setRegAadhaar] = useState("");
  const [regPan, setRegPan] = useState("");
  const [uploadedAadhaar, setUploadedAadhaar] = useState<File | null>(null);
  const [uploadedPan, setUploadedPan] = useState<File | null>(null);
  const [uploadedIdCard, setUploadedIdCard] = useState<File | null>(null);
  const [uploadedDegreeCert, setUploadedDegreeCert] = useState<File | null>(null);

  // Drag and drop helper hover states
  const [aadhaarDragOver, setAadhaarDragOver] = useState(false);
  const [panDragOver, setPanDragOver] = useState(false);
  const [idDragOver, setIdDragOver] = useState(false);
  const [degreeCertDragOver, setDegreeCertDragOver] = useState(false);

  // Step 3: Academic/Professional states
  const [regDegree, setRegDegree] = useState("PhD");
  const [regCertifications, setRegCertifications] = useState("");
  const [regExperience, setRegExperience] = useState(5);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  // Step 4: Government/Peer verify states
  const [govtRegNo, setGovtRegNo] = useState("");
  const [uploadedGovtCert, setUploadedGovtCert] = useState<File | null>(null);
  const [govCertDragOver, setGovCertDragOver] = useState(false);
  const [linkedinLink, setLinkedinLink] = useState("");
  const [peerRec1, setPeerRec1] = useState("");
  const [peerRec2, setPeerRec2] = useState("");

  // OTP Verification states
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [isOtpSending, setIsOtpSending] = useState(false);

  // Password strength meter calculation helper
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "No Password", color: "bg-slate-200 text-slate-500", percent: 0, score: 0 };
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 25;
    if (/\d/.test(pwd)) score += 25;
    if (/[@$!%*?&]/.test(pwd)) score += 25;

    if (score <= 25) return { label: "Weak Security", color: "bg-red-500 text-white", percent: 25, score: 1 };
    if (score <= 50) return { label: "Fair Protection", color: "bg-amber-500 text-white", percent: 50, score: 2 };
    if (score <= 75) return { label: "Good Shield", color: "bg-indigo-500 text-white", percent: 75, score: 3 };
    return { label: "Bulletproof", color: "bg-emerald-600 text-white", percent: 100, score: 4 };
  };

  const regPwdStrength = getPasswordStrength(regPassword);

  // Email validation helper: must be institutional, academic, or government domain
  const isOfficialEmail = (emailStr: string) => {
    if (!emailStr) return false;
    const lower = emailStr.toLowerCase().trim();
    // Common academic, gov, institutional and organizational domains
    return (
      lower.endsWith(".edu") ||
      lower.endsWith(".gov") ||
      lower.endsWith(".org") ||
      lower.endsWith(".res.in") ||
      lower.endsWith(".ac.in") ||
      lower.endsWith(".gov.in") ||
      lower.endsWith(".nic.in") ||
      lower.endsWith(".net")
    );
  };

  // OTP Timer countdown
  useEffect(() => {
    let interval: any;
    if (otpOpen && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpOpen, otpTimer]);

  // Load remembered inputs
  useEffect(() => {
    if (rememberMe) {
      const storedEmail = localStorage.getItem("agriconnect_expert_remembered_email") || "";
      const storedMobile = localStorage.getItem("agriconnect_expert_remembered_mobile") || "";
      if (storedEmail) setLoginEmail(storedEmail);
      if (storedMobile) setLoginMobile(storedMobile);
    }
  }, []);

  // Save rememberMe configuration and session list to localStorage
  useEffect(() => {
    localStorage.setItem("agriconnect_expert_remember_me", rememberMe ? "true" : "false");
  }, [rememberMe]);

  useEffect(() => {
    localStorage.setItem("agriconnect_expert_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const terminateSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    alert("Official secure token invalidated. Device session terminated successfully.");
  };

  const logoutAllOtherDevices = () => {
    setSessions((prev) => prev.filter((s) => s.active));
    alert("Sovereign session gateway: All other devices logged out.");
  };

  const triggerBiometricScan = (type: "finger" | "face") => {
    setBiometricType(type);
    setBiometricScanning(true);
    setBiometricStatus("Initializing high-entropy cryptographic sensor...");
    
    setTimeout(() => {
      setBiometricStatus(type === "finger" ? "Scanning secure fingerprint sensor array..." : "Activating Face ID 3D depth cameras...");
    }, 1200);

    setTimeout(() => {
      setBiometricStatus("Analyzing biometric template hashes...");
    }, 2400);

    setTimeout(() => {
      setBiometricStatus("Profile match verified: Dr. Rachel Carter (Pathology Admin)...");
    }, 3600);

    setTimeout(() => {
      setBiometricStatus("Handshaking secure credentials. Redirecting...");
    }, 4600);

    setTimeout(() => {
      setBiometricScanning(false);
      // Log in
      const stored = localStorage.getItem("agriconnect_expert_profile");
      if (stored) {
        onComplete(JSON.parse(stored));
      } else {
        localStorage.setItem("agriconnect_expert_profile", JSON.stringify(DEFAULT_EXPERT));
        onComplete(DEFAULT_EXPERT);
      }
    }, 5600);
  };

  const triggerOtpDispatch = () => {
    const targetPhone = view === "register" ? regMobile : loginMobile;
    if (!targetPhone) return;
    setIsOtpSending(true);
    setTimeout(() => {
      setIsOtpSending(false);
      setOtpOpen(true);
      setOtpTimer(60);
      alert(`Twilio Simulated Gateway:\nOTP '774129' dispatched securely to ${targetPhone}`);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otpCode !== "774129" && otpCode !== "000000") {
      alert("Invalid OTP code. Please retry with '774129' or '000000'.");
      return;
    }
    setOtpOpen(false);
    alert("Mobile verification complete!");

    // Save Remembered Mobile if checked
    if (rememberMe && loginMethod === "mobile") {
      localStorage.setItem("agriconnect_expert_remembered_mobile", loginMobile);
    } else {
      localStorage.removeItem("agriconnect_expert_remembered_mobile");
    }

    if (view === "register") {
      setRegStep(2);
    } else {
      // Login with mobile success
      const stored = localStorage.getItem("agriconnect_expert_profile");
      if (stored) {
        onComplete(JSON.parse(stored));
      } else {
        localStorage.setItem("agriconnect_expert_profile", JSON.stringify(DEFAULT_EXPERT));
        onComplete(DEFAULT_EXPERT);
      }
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem("agriconnect_expert_profile", JSON.stringify(DEFAULT_EXPERT));
    localStorage.setItem(`agriconnect_expert_password_${DEFAULT_EXPERT.email}`, "expert123");
    onComplete(DEFAULT_EXPERT);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "email") {
      if (!loginEmail || !loginPassword) {
        alert("Please provide both email and security password.");
        return;
      }
      const demoEmail = DEFAULT_EXPERT.email;
      const storedPassword = localStorage.getItem(`agriconnect_expert_password_${loginEmail.trim().toLowerCase()}`);
      const expectedPassword = loginEmail.trim().toLowerCase() === demoEmail ? "expert123" : (storedPassword || "expert123");

      if (loginPassword !== expectedPassword) {
        alert("Invalid credentials. Try using 'expert123' as password or click Quick Demo Login.");
        return;
      }

      // Handle Remember Me email persistence
      if (rememberMe) {
        localStorage.setItem("agriconnect_expert_remembered_email", loginEmail);
      } else {
        localStorage.removeItem("agriconnect_expert_remembered_email");
      }

      // Check if custom register was done
      const stored = localStorage.getItem("agriconnect_expert_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email.toLowerCase() === loginEmail.trim().toLowerCase()) {
          onComplete(parsed);
          return;
        }
      }
      onComplete(DEFAULT_EXPERT);
    } else {
      // Mobile Login
      if (!loginMobile) {
        alert("Please input your registered official mobile number.");
        return;
      }
      triggerOtpDispatch();
    }
  };

  const handleRegisterSubmit = () => {
    if (regPassword !== regConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (regPwdStrength.score < 2) {
      alert("Please choose a stronger password to protect your official diagnostic key.");
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      alert("You must agree to the professional Terms & Conditions and Privacy Policy guidelines.");
      return;
    }

    const createdProfile: ExpertProfile = {
      name: regName || "Dr. Self-Registered Expert",
      designation: regDesignation || "Agricultural Consultant",
      department: regDepartment || "Independent Expert Panel",
      email: regEmail,
      mobile: regMobile,
      dob: regDob,
      gender: regGender,
      feePerCall: Number(feePerCall) || 0,
      feePerQuestion: Number(feePerQuestion) || 0,
      availableDays: availableDays,
      availableHours: `${availableHoursStart} - ${availableHoursEnd}`,
      languages: selectedLanguages,
      bankAccount: bankAccount,
      bankIfsc: bankIfsc,
      bankUpi: bankUpi || undefined,
      degree: `${regDegree} in Agriculture`,
      certifications: regCertifications || "Sovereign Board Certifications",
      experience: regExperience,
      specializations: selectedSpecs.length > 0 ? selectedSpecs : ["Crops", "Soil"],
      aadhaar: regAadhaar || "xxxx-xxxx-xxxx",
      pan: regPan || "XXXXX0000X",
      govtRegNo: govtRegNo || "GOVT-REG-PENDING",
      linkedin: linkedinLink || "https://linkedin.com",
      recommendations: [peerRec1 || "colleague1@univ.edu", peerRec2 || "colleague2@univ.edu"],
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
      rating: 5.0,
      consultations: 0
    };

    localStorage.setItem("agriconnect_expert_profile", JSON.stringify(createdProfile));
    localStorage.setItem(`agriconnect_expert_password_${regEmail.trim().toLowerCase()}`, regPassword);
    alert("Professional Expert Onboarding successfully parsed and verified by administrative registry!");
    onComplete(createdProfile);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOfficialEmail(forgotEmail)) {
      alert("Forgot password verification is restricted to official academic or government domains.");
      return;
    }
    setForgotPasswordStep("otp");
    alert(`Reset token dispatched to ${forgotEmail}`);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode !== "123456" && resetCode !== "000000") {
      alert("Invalid verification code. Please input '123456'.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }
    localStorage.setItem(`agriconnect_expert_password_${forgotEmail.trim().toLowerCase()}`, newPassword);
    setForgotPasswordStep("success");
  };

  const handleCheckboxChange = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xl relative my-6">
      
      {/* Dynamic Background Design Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-indigo-900 px-8 py-7 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-emerald-300" />
            <h1 className="text-lg font-black tracking-wider uppercase font-mono text-emerald-100">
              Agriculture Expert Verification
            </h1>
          </div>
          <p className="text-[11px] text-emerald-200/90 font-medium">
            Strict professional validation for Agronomists, Pathologists, and Researchers.
          </p>
        </div>
        <button
          onClick={handleDemoLogin}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-mono shadow-md transition-all cursor-pointer flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <Sparkles className="h-4 w-4 text-slate-950 animate-bounce" />
          Quick Demo Login
        </button>
      </div>

      <div className="p-6 md:p-8 relative">
        <AnimatePresence mode="wait">
          {/* OTP SMS OVERLAY POPUP */}
          {otpOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/75 flex items-center justify-center z-50 p-4 rounded-3xl"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4"
              >
                <div className="text-center space-y-1.5">
                  <div className="p-3 bg-emerald-50 rounded-full w-fit mx-auto text-emerald-600 border border-emerald-100">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                    Twilio Simulated Secure OTP
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    Verify registration authenticity. We have transmitted an SMS gateway token.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[8px] font-black uppercase text-slate-400">Enter SMS Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="774129"
                    className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                  <p className="text-[9px] text-slate-400 italic text-center mt-1">
                    Bypass code: <span className="font-mono font-bold text-slate-600">774129</span> or <span className="font-mono font-bold text-slate-600">000000</span>
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold">
                  {otpTimer > 0 ? (
                    <span className="text-slate-400">Resend available in {otpTimer}s</span>
                  ) : (
                    <button
                      onClick={triggerOtpDispatch}
                      className="text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Resend Code Now
                    </button>
                  )}
                  <span className="text-slate-300">Carrier Fee Exempted</span>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setOtpOpen(false)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase rounded-xl transition-all"
                  >
                    Verify Code
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* FORGOT PASSWORD DIALOG */}
          {forgotPasswordOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/75 flex items-center justify-center z-50 p-4 rounded-3xl"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 text-left"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Credential Recovery</span>
                  <button
                    onClick={() => {
                      setForgotPasswordOpen(false);
                      setForgotPasswordStep("request");
                    }}
                    className="text-slate-400 hover:text-slate-600 font-extrabold text-sm"
                  >
                    ✕
                  </button>
                </div>

                {forgotPasswordStep === "request" && (
                  <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase">Expert Reset Key</h4>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                        Input your registered institutional email to authorize a security roll key.
                      </p>
                    </div>
                    <div>
                      <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Official Email</label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. expert@agriuniv.edu"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      Dispatch Security Reset Token
                    </button>
                  </form>
                )}

                {forgotPasswordStep === "otp" && (
                  <form onSubmit={handleResetPassword} className="space-y-3.5">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase font-mono">Input Reset Verification Token</h4>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                        Enter the recovery token sent to <span className="text-indigo-600 font-bold">{forgotEmail}</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">6-Digit Code</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="123456"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-center tracking-widest font-mono text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">New Secure Password</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      Authorize Password Rollover
                    </button>
                  </form>
                )}

                {forgotPasswordStep === "success" && (
                  <div className="space-y-4 text-center">
                    <div className="p-3 bg-emerald-50 rounded-full w-fit mx-auto text-emerald-600 border border-emerald-100">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase">Reset Successful!</h4>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                        Credentials updated. You may now return to the expert terminal to authorize pathology audits.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setForgotPasswordOpen(false);
                        setForgotPasswordStep("request");
                        setForgotEmail("");
                        setResetCode("");
                        setNewPassword("");
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                    >
                      Dismiss Dialog
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* BIOMETRIC SCANNING SIMULATION MODAL */}
          {biometricScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-50 p-4 rounded-3xl"
            >
              <motion.div
                initial={{ scale: 0.92, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 10 }}
                className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-5 text-center relative overflow-hidden"
              >
                {/* Glowing laser background effect */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                    Sovereign Bio-Identity Gateway
                  </span>
                  <h3 className="text-sm font-black uppercase tracking-wide text-slate-100 font-mono">
                    System Autonomic Check
                  </h3>
                </div>

                <div className="relative py-4 flex flex-col items-center justify-center">
                  {biometricType === "finger" ? (
                    <div className="relative p-6 bg-slate-800/40 rounded-full border border-slate-700 text-emerald-400 w-24 h-24 flex items-center justify-center">
                      <Fingerprint className="h-12 w-12 animate-pulse" />
                      {/* Scanning sliding laser line */}
                      <div className="absolute inset-x-2 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981] rounded-full animate-[bounce_2s_infinite] top-1/4" />
                    </div>
                  ) : (
                    <div className="relative p-6 bg-slate-800/40 rounded-full border border-slate-700 text-indigo-400 w-24 h-24 flex items-center justify-center">
                      <UserCheck className="h-12 w-12 animate-pulse" />
                      {/* Scanning sliding laser line */}
                      <div className="absolute inset-x-2 h-0.5 bg-indigo-500 shadow-[0_0_10px_#6366f1] rounded-full animate-[bounce_2s_infinite] top-1/4" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono">
                  <div className="flex items-center gap-2 justify-center text-[10px] text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {biometricStatus}
                  </div>
                  <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">
                    AES-256 Biometric Encrypted Handshake
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setBiometricScanning(false)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border border-slate-700/60"
                >
                  Cancel Hardware Scan
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* VIEW: LOGIN PORTAL */}
          {view === "login" ? (
            <motion.div
              key="login-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              <div className="md:col-span-5 space-y-4.5 text-left">
                <div className="space-y-2">
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Sovereign Gate
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-800 leading-tight">
                    Secure Workspace Authentication
                  </h2>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Authenticate to review autonomous computer vision diagnostics, verify regional pesticide schedules, and release signed certifications for crops.
                  </p>
                </div>

                <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl space-y-2.5">
                  <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Verify Standards</h4>
                  <ul className="text-[10px] text-slate-500 font-semibold space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>Required expert credential logs on file.</li>
                    <li>Sovereign IP audits tracked via encrypted ledger.</li>
                    <li>Automatic timeout in 15 minutes of inactivity.</li>
                  </ul>
                </div>
              </div>

              {/* Login Form Wrapper */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
                  <button
                    type="button"
                    onClick={() => setLoginMethod("email")}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg tracking-wider transition-all cursor-pointer ${
                      loginMethod === "email" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Official Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod("mobile")}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg tracking-wider transition-all cursor-pointer ${
                      loginMethod === "mobile" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Mobile Number
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  {loginMethod === "email" ? (
                    <>
                      <div className="space-y-0.5">
                        <label className="block text-[8px] font-black uppercase text-slate-400">Official Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="rachel.carter@agriuni.edu"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center">
                          <label className="block text-[8px] font-black uppercase text-slate-400">Security Password</label>
                          <button
                            type="button"
                            onClick={() => setForgotPasswordOpen(true)}
                            className="text-[9px] text-indigo-600 font-extrabold hover:underline"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                          <input
                            type={showLoginPassword ? "text" : "password"}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                          >
                            {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-0.5">
                      <label className="block text-[8px] font-black uppercase text-slate-400">Mobile Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={loginMobile}
                          onChange={(e) => setLoginMobile(e.target.value)}
                          placeholder="+91 98765 43213"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* REMEMBER ME TOGGLE */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold py-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Remember my verification terminal</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <UserCheck className="h-4 w-4 text-emerald-400" />
                    {loginMethod === "mobile" ? "Secure Dispatch OTP" : "Enter Expert Terminal"}
                  </button>

                  {/* SECURED BIOMETRICS OPTIONS */}
                  <div className="border-t border-slate-100 pt-4 space-y-2.5">
                    <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">
                      Or Access with Secured Biometrics
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => triggerBiometricScan("finger")}
                        className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-emerald-500/50 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-700 hover:text-emerald-800 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Fingerprint className="h-4 w-4 text-emerald-600 shrink-0 animate-pulse" />
                        Touch ID Scan
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerBiometricScan("face")}
                        className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-500/50 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-700 hover:text-indigo-800 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <UserCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                        Face ID Match
                      </button>
                    </div>
                  </div>

                  {/* SOVEREIGN DEVICE SESSION REGISTRY */}
                  <div className="border-t border-slate-100 pt-4 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setSessionsPanelOpen(!sessionsPanelOpen)}
                      className="w-full flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Key className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        Sovereign Device Registry ({sessions.length} Active Sessions)
                      </span>
                      <span className="text-[9px] text-indigo-600 hover:underline">
                        {sessionsPanelOpen ? "Hide Registry" : "View Registry"}
                      </span>
                    </button>
                    
                    {sessionsPanelOpen && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 space-y-2 text-left overflow-hidden">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Device / Location / IP</span>
                          <button
                            type="button"
                            onClick={logoutAllOtherDevices}
                            className="text-[8px] bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 px-2 py-1 rounded-md font-black uppercase tracking-wider cursor-pointer"
                          >
                            Logout Other Devices
                          </button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {sessions.map((sess) => (
                            <div key={sess.id} className="flex justify-between items-center text-[10px] leading-tight">
                              <div className="flex items-center gap-2">
                                {sess.icon === "Laptop" ? (
                                  <Laptop className="h-4 w-4 text-slate-500 shrink-0" />
                                ) : (
                                  <Smartphone className="h-4 w-4 text-slate-500 shrink-0" />
                                )}
                                <div>
                                  <div className="font-bold text-slate-700">{sess.device}</div>
                                  <div className="text-[8px] text-slate-400">{sess.location} • {sess.ip}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {sess.active ? (
                                  <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm font-black uppercase">Current</span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => terminateSession(sess.id)}
                                    className="text-[8px] text-red-600 hover:underline font-extrabold cursor-pointer"
                                  >
                                    Terminate
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] gap-2">
                    <span className="text-slate-400 font-bold">New official candidate registry?</span>
                    <button
                      type="button"
                      onClick={() => setView("register")}
                      className="text-emerald-700 font-black uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Request Onboarding Access <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            /* VIEW: REGISTRATION MULTI-STEP WIZARD */
            <motion.div
              key="register-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left"
            >
              {/* Profile Setup Progress Bar with 25%, 50%, 75%, 100% labels */}
              <div className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider font-mono">
                      Onboarding Status
                    </span>
                    <h4 className="text-[11px] text-slate-500 font-bold mt-0.5">
                      {regStep === 1 && "Step 1: Personal Details"}
                      {regStep === 2 && "Step 2: Professional Details"}
                      {regStep === 3 && "Step 3: Consultation Preferences"}
                      {regStep === 4 && "Step 4: Payment & Bank Details"}
                      {regStep === 5 && "Step 5: Document Uploads & Verification"}
                    </h4>
                  </div>
                  <span className="text-xs font-black text-white px-3 py-1 bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-full shadow-sm font-mono">
                    {regStep === 1 && "0% Started"}
                    {regStep === 2 && "25% Complete"}
                    {regStep === 3 && "50% Complete"}
                    {regStep === 4 && "75% Complete"}
                    {regStep === 5 && "100% Configured"}
                  </span>
                </div>

                <div className="relative pt-1">
                  <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-200 relative">
                    <div
                      style={{
                        width: `${
                          regStep === 1 ? 5 :
                          regStep === 2 ? 25 :
                          regStep === 3 ? 50 :
                          regStep === 4 ? 75 : 100
                        }%`
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-500 to-indigo-600 transition-all duration-500 rounded-full"
                    />
                  </div>
                  {/* Milestones markers */}
                  <div className="flex justify-between text-[10px] text-slate-400 font-extrabold mt-1.5 px-1 font-mono">
                    <span className={regStep >= 2 ? "text-emerald-600 font-black" : "text-slate-400"}>25% Done</span>
                    <span className={regStep >= 3 ? "text-emerald-600 font-black" : "text-slate-400"}>50% Done</span>
                    <span className={regStep >= 4 ? "text-emerald-600 font-black" : "text-slate-400"}>75% Done</span>
                    <span className={regStep >= 5 ? "text-emerald-600 font-black" : "text-slate-400"}>100% Ready</span>
                  </div>
                </div>
              </div>

              {/* Step Title Header */}
              <div className="border-b border-slate-150 pb-2">
                <span className="text-[8px] bg-indigo-150 text-indigo-800 px-2 py-0.5 rounded font-black font-mono uppercase tracking-wide">
                  STEP {regStep} OF 5
                </span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide mt-1 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  {regStep === 1 && "Personal & Account Details"}
                  {regStep === 2 && "Professional Qualifications & Specializations"}
                  {regStep === 3 && "Consultation Preferences & Rates"}
                  {regStep === 4 && "Payment & Payout Bank Details"}
                  {regStep === 5 && "Compliance ID & Document Verification"}
                </h3>
              </div>

              {/* STEP 1: PERSONAL DETAILS */}
              {regStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Dr. Ramesh Kumar"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Date of Birth</label>
                        <input
                          type="date"
                          required
                          value={regDob}
                          onChange={(e) => setRegDob(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Gender</label>
                        <select
                          required
                          value={regGender}
                          onChange={(e) => setRegGender(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-Binary">Non-Binary</option>
                          <option value="Prefer Not to Say">Prefer Not to Say</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Official Academic / Gov Email</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. ramesh.kumar@icar.org.in"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                      />
                      {regEmail && !isOfficialEmail(regEmail) && (
                        <p className="text-[9px] text-amber-600 font-bold flex items-center gap-1 mt-1 bg-amber-50 p-1.5 rounded border border-amber-100">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          Official institutional domain is highly recommended (.edu, .gov, .org, etc.)
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="+91 98765 43213"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Password</label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Confirm Password</label>
                        <input
                          type="password"
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    {/* LIVE PASSWORD STRENGTH METER */}
                    {regPassword && (
                      <div className="bg-white p-2.5 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="flex justify-between items-center text-[8.5px] font-black uppercase">
                          <span className="text-slate-400">Security Strength</span>
                          <span className={`${regPwdStrength.score < 2 ? "text-red-500" : "text-emerald-600"}`}>
                            {regPwdStrength.label}
                          </span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              regPwdStrength.score === 1
                                ? "bg-red-500 w-1/4"
                                : regPwdStrength.score === 2
                                ? "bg-amber-500 w-1/2"
                                : regPwdStrength.score === 3
                                ? "bg-indigo-500 w-3/4"
                                : "bg-emerald-600 w-full"
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 pt-2">
                      <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="h-3.5 w-3.5 text-emerald-600"
                        />
                        <span className="text-[9px] text-slate-500 font-semibold leading-tight">Agree to Expert Terms & Rules</span>
                      </label>
                      <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                          className="h-3.5 w-3.5 text-emerald-600"
                        />
                        <span className="text-[9px] text-slate-500 font-semibold leading-tight">Agree to Data Protection Policy</span>
                      </label>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl text-[10px] text-emerald-800 leading-normal font-medium">
                      <span className="font-bold text-emerald-900 block mb-0.5">OTP Authentication Safeguard</span>
                      On proceeding, a cryptographically signed mobile validation passcode will be dispatched to your phone number.
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PROFESSIONAL DETAILS */}
              {regStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Designation</label>
                      <input
                        type="text"
                        required
                        value={regDesignation}
                        onChange={(e) => setRegDesignation(e.target.value)}
                        placeholder="e.g. Senior Pathologist / Agronomy Specialist"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Institution / Affiliation</label>
                      <input
                        type="text"
                        required
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        placeholder="e.g. Agri University / ICAR Research Centre"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Academic Degree</label>
                        <select
                          value={regDegree}
                          onChange={(e) => setRegDegree(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="B.Sc in Agriculture">B.Sc in Agriculture</option>
                          <option value="M.Sc in Agronomy">M.Sc in Agronomy</option>
                          <option value="PhD in Plant Pathology">PhD in Plant Pathology</option>
                          <option value="Post-Doc Research Fellow">Post-Doc Fellow</option>
                        </select>
                      </div>

                      <div>
                        <label className="block flex justify-between text-[8px] font-black uppercase text-slate-400 mb-1">
                          <span>Experience</span>
                          <span className="text-emerald-700 font-mono font-black">{regExperience} Years</span>
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={30}
                          value={regExperience}
                          onChange={(e) => setRegExperience(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Professional Certifications</label>
                      <input
                        type="text"
                        required
                        value={regCertifications}
                        onChange={(e) => setRegCertifications(e.target.value)}
                        placeholder="e.g. ICAR Agronomist, Certified Crop Advisor"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* SPECIALIZATION CHECKLIST */}
                  <div className="space-y-3">
                    <span className="text-[8px] font-black uppercase text-slate-400">Core Specializations (Select all that apply)</span>
                    <div className="grid grid-cols-2 gap-2">
                      {["Crops", "Soil", "Pests", "Water", "Livestock", "Agri-Engineering", "Agri-Economics", "Food Science"].map((spec) => {
                        const isChecked = selectedSpecs.includes(spec);
                        return (
                          <label
                            key={spec}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isChecked
                                ? "bg-indigo-50 border-indigo-200 text-indigo-900"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(spec)}
                              className="h-3.5 w-3.5 text-indigo-600 rounded"
                            />
                            <span className="text-[10px] font-extrabold">{spec}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CONSULTATION PREFERENCES */}
              {regStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">Fee Structure (₹)</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Fee per Call (₹)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-400 text-xs font-black">₹</span>
                            <input
                              type="number"
                              required
                              min={0}
                              value={feePerCall}
                              onChange={(e) => setFeePerCall(e.target.value)}
                              placeholder="500"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Fee per Query (Text-Based) (₹)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-slate-400 text-xs font-black">₹</span>
                            <input
                              type="number"
                              required
                              min={0}
                              value={feePerQuestion}
                              onChange={(e) => setFeePerQuestion(e.target.value)}
                              placeholder="150"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                      <h4 className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">Availability Calendar</h4>
                      
                      <div className="space-y-2">
                        <span className="block text-[8px] font-black uppercase text-slate-400">Available Days</span>
                        <div className="flex flex-wrap gap-1.5">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                            const isSelected = availableDays.includes(day);
                            return (
                              <button
                                type="button"
                                key={day}
                                onClick={() => {
                                  setAvailableDays(prev => 
                                    prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                                  );
                                }}
                                className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${
                                  isSelected
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {day.substring(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Hours From</label>
                          <input
                            type="time"
                            value={availableHoursStart}
                            onChange={(e) => setAvailableHoursStart(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Hours To</label>
                          <input
                            type="time"
                            value={availableHoursEnd}
                            onChange={(e) => setAvailableHoursEnd(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LANGUAGES (10 Options) */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider block">Languages Spoken (Select multiple)</span>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        "English", "Hindi", "Telugu", "Tamil", "Marathi",
                        "Bengali", "Kannada", "Malayalam", "Gujarati", "Punjabi"
                      ].map((lang) => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <label
                            key={lang}
                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-indigo-50 border-indigo-200 text-indigo-900"
                                : "bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedLanguages(prev => 
                                  prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
                                );
                              }}
                              className="h-3.5 w-3.5 text-indigo-600 rounded"
                            />
                            <span className="text-[10px] font-extrabold">{lang}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT & BANK DETAILS */}
              {regStep === 4 && (
                <div className="max-w-xl mx-auto space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase border-b border-slate-100 pb-2">
                      Secure Payout Settings
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Bank Account Number</label>
                        <input
                          type="text"
                          required
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ""))}
                          placeholder="e.g. 918273645019"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">IFSC Code</label>
                        <input
                          type="text"
                          required
                          maxLength={11}
                          value={bankIfsc.toUpperCase()}
                          onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                          placeholder="e.g. SBIN0001234"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">UPI ID (Optional)</label>
                        <input
                          type="text"
                          value={bankUpi}
                          onChange={(e) => setBankUpi(e.target.value)}
                          placeholder="e.g. name@upi"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex gap-2.5 text-slate-500 text-[10px] leading-relaxed font-semibold">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                      <p>
                        Payouts are triggered automatically to this audited bank account every Friday. Bank account information is encrypted under AES-256 and never transmitted in cleartext.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: VERIFICATION UPLOADS */}
              {regStep === 5 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* National IDs + Metadata */}
                  <div className="space-y-4">
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 space-y-4 text-left">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Compliance National IDs</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Aadhaar Number</label>
                          <input
                            type="text"
                            required
                            maxLength={14}
                            value={regAadhaar}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              const formatted = val.match(/.{1,4}/g)?.join("-") || val;
                              setRegAadhaar(formatted);
                            }}
                            placeholder="1234-5678-9012"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">PAN Card Number</label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            value={regPan.toUpperCase()}
                            onChange={(e) => setRegPan(e.target.value.toUpperCase())}
                            placeholder="ABCDE1234F"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 pt-1">
                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">ICAR / FSSAI Registration ID</label>
                          <input
                            type="text"
                            required
                            value={govtRegNo}
                            onChange={(e) => setGovtRegNo(e.target.value)}
                            placeholder="e.g. ICAR-PATH-2026-XXXX"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">LinkedIn Profile or Faculty Directory URL</label>
                          <input
                            type="url"
                            required
                            value={linkedinLink}
                            onChange={(e) => setLinkedinLink(e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase">Colleague Review Alerts</h4>
                      <div className="space-y-2">
                        <input
                          type="email"
                          required
                          value={peerRec1}
                          onChange={(e) => setPeerRec1(e.target.value)}
                          placeholder="Fellow Expert #1 Email"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                        />
                        <input
                          type="email"
                          required
                          value={peerRec2}
                          onChange={(e) => setPeerRec2(e.target.value)}
                          placeholder="Fellow Expert #2 Email"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENT UPLOADS */}
                  <div className="space-y-3.5 bg-white p-4.5 rounded-2xl border border-slate-200/80">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">Mandatory Verification Scans</h4>
                    
                    {/* Aadhaar Upload Box */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase text-slate-400">Aadhaar Card copy (PDF/Image)</span>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setAadhaarDragOver(true); }}
                        onDragLeave={() => setAadhaarDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setAadhaarDragOver(false);
                          if (e.dataTransfer.files?.[0]) setUploadedAadhaar(e.dataTransfer.files[0]);
                        }}
                        className={`border border-dashed rounded-xl p-2.5 text-center transition-all cursor-pointer ${
                          uploadedAadhaar ? "bg-emerald-50 border-emerald-300" : "bg-slate-50/50 border-slate-200"
                        } ${aadhaarDragOver ? "scale-98 bg-slate-100 border-indigo-400" : ""}`}
                      >
                        <input
                          type="file"
                          id="aadhaar-upload-file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setUploadedAadhaar(e.target.files[0]);
                          }}
                        />
                        <label htmlFor="aadhaar-upload-file" className="cursor-pointer space-y-0.5 block">
                          <Upload className={`h-4 w-4 mx-auto ${uploadedAadhaar ? "text-emerald-600" : "text-slate-400"}`} />
                          <p className="text-[9px] text-slate-600 font-bold">
                            {uploadedAadhaar ? uploadedAadhaar.name : "Drag Front & Back copy or click to upload"}
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* PAN Upload Box */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase text-slate-400">PAN Card Scanned copy</span>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setPanDragOver(true); }}
                        onDragLeave={() => setPanDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setPanDragOver(false);
                          if (e.dataTransfer.files?.[0]) setUploadedPan(e.dataTransfer.files[0]);
                        }}
                        className={`border border-dashed rounded-xl p-2.5 text-center transition-all cursor-pointer ${
                          uploadedPan ? "bg-emerald-50 border-emerald-300" : "bg-slate-50/50 border-slate-200"
                        } ${panDragOver ? "scale-98 bg-slate-100 border-indigo-400" : ""}`}
                      >
                        <input
                          type="file"
                          id="pan-upload-file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setUploadedPan(e.target.files[0]);
                          }}
                        />
                        <label htmlFor="pan-upload-file" className="cursor-pointer space-y-0.5 block">
                          <Upload className={`h-4 w-4 mx-auto ${uploadedPan ? "text-emerald-600" : "text-slate-400"}`} />
                          <p className="text-[9px] text-slate-600 font-bold">
                            {uploadedPan ? uploadedPan.name : "Drag scanned copy or click to browse"}
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* Official ID Upload Box */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase text-slate-400">Official ID (University ID Card)</span>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIdDragOver(true); }}
                        onDragLeave={() => setIdDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIdDragOver(false);
                          if (e.dataTransfer.files?.[0]) setUploadedIdCard(e.dataTransfer.files[0]);
                        }}
                        className={`border border-dashed rounded-xl p-2.5 text-center transition-all cursor-pointer ${
                          uploadedIdCard ? "bg-emerald-50 border-emerald-300" : "bg-slate-50/50 border-slate-200"
                        } ${idDragOver ? "scale-98 bg-slate-100 border-indigo-400" : ""}`}
                      >
                        <input
                          type="file"
                          id="id-upload-file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setUploadedIdCard(e.target.files[0]);
                          }}
                        />
                        <label htmlFor="id-upload-file" className="cursor-pointer space-y-0.5 block">
                          <Upload className={`h-4 w-4 mx-auto ${uploadedIdCard ? "text-emerald-600" : "text-slate-400"}`} />
                          <p className="text-[9px] text-slate-600 font-bold">
                            {uploadedIdCard ? uploadedIdCard.name : "Drag official ID or click to upload"}
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* Degree Certificate Upload Box */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase text-slate-400">Degree Certificates (B.Sc / M.Sc / PhD)</span>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDegreeCertDragOver(true); }}
                        onDragLeave={() => setDegreeCertDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDegreeCertDragOver(false);
                          if (e.dataTransfer.files?.[0]) setUploadedDegreeCert(e.dataTransfer.files[0]);
                        }}
                        className={`border border-dashed rounded-xl p-2.5 text-center transition-all cursor-pointer ${
                          uploadedDegreeCert ? "bg-emerald-50 border-emerald-300" : "bg-slate-50/50 border-slate-200"
                        } ${degreeCertDragOver ? "scale-98 bg-slate-100 border-indigo-400" : ""}`}
                      >
                        <input
                          type="file"
                          id="degree-cert-upload-file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setUploadedDegreeCert(e.target.files[0]);
                          }}
                        />
                        <label htmlFor="degree-cert-upload-file" className="cursor-pointer space-y-0.5 block">
                          <Upload className={`h-4 w-4 mx-auto ${uploadedDegreeCert ? "text-emerald-600" : "text-slate-400"}`} />
                          <p className="text-[9px] text-slate-600 font-bold">
                            {uploadedDegreeCert ? uploadedDegreeCert.name : "Drag certificates or click to browse"}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Nav Buttons */}
              <div className="flex justify-between items-center border-t border-slate-150 pt-5">
                {regStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setRegStep((prev) => prev - 1)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Return to Login
                  </button>
                )}

                {regStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (regStep === 1) {
                        if (!regName || !regEmail || !regMobile || !regPassword || !regDob || !regGender) {
                          alert("All personal and identity fields are mandatory.");
                          return;
                        }
                        if (regPassword !== regConfirmPassword) {
                          alert("Confirm password mismatch.");
                          return;
                        }
                        triggerOtpDispatch(); // Requires SMS OTP validation before proceeding to Step 2
                      } else if (regStep === 2) {
                        if (!regDesignation || !regDepartment || !regCertifications) {
                          alert("Designation, Institution, and Professional Certifications are mandatory.");
                          return;
                        }
                        if (selectedSpecs.length === 0) {
                          alert("Please select at least one core area of specialization.");
                          return;
                        }
                        setRegStep(3);
                      } else if (regStep === 3) {
                        if (!feePerCall || !feePerQuestion) {
                          alert("Consultation fee details are mandatory.");
                          return;
                        }
                        if (selectedLanguages.length === 0) {
                          alert("Please select at least one language.");
                          return;
                        }
                        if (availableDays.length === 0) {
                          alert("Please select at least one available day of the week.");
                          return;
                        }
                        setRegStep(4);
                      } else if (regStep === 4) {
                        if (!bankAccount || !bankIfsc) {
                          alert("Bank account number and IFSC code are mandatory for payments.");
                          return;
                        }
                        setRegStep(5);
                      }
                    }}
                    className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!regAadhaar || !regPan || !govtRegNo) {
                        alert("Aadhaar, PAN, and Government registration numbers are mandatory.");
                        return;
                      }
                      if (!uploadedAadhaar || !uploadedPan || !uploadedIdCard || !uploadedDegreeCert) {
                        alert("Please upload Aadhaar, PAN, Faculty ID, and Degree certificate scans.");
                        return;
                      }
                      handleRegisterSubmit();
                    }}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-300" /> Complete Onboarding Verification
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
