import React, { useState, useEffect } from "react";
import {
  Sprout,
  Smartphone,
  Mail,
  Lock,
  ShieldCheck,
  Fingerprint,
  MapPin,
  User,
  Award,
  Globe,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Heart,
  Droplets,
  CloudSun
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OnboardingData {
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  farmName: string;
  landSize: string;
  soilType: string;
  waterSource: string;
  irrigationType: string;
  lat: number;
  lng: number;
  cropsGrown: string[];
  farmingExperience: string;
  language: string;
  enableSms: boolean;
  enableEmail: boolean;
  enablePush: boolean;
}

interface FarmerAuthOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export default function FarmerAuthOnboarding({ onComplete }: FarmerAuthOnboardingProps) {
  // Auth view switcher: "login" | "register" | "onboarding"
  const [view, setView] = useState<"login" | "register" | "onboarding">("login");
  const [authMethod, setAuthMethod] = useState<"email" | "mobile">("email");

  // Registration form states
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAadhaar, setRegAadhaar] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // OTP Verification states (Twilio mockup)
  const [otpVerificationOpen, setOtpVerificationOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [isOtpSending, setIsOtpSending] = useState(false);

  // DigiLocker KYC States
  const [digiLockerOpen, setDigiLockerOpen] = useState(false);
  const [digiLockerStatus, setDigiLockerStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [kycAadhaarName, setKycAadhaarName] = useState("");

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);

  // Session management mock details
  const [sessions, setSessions] = useState([
    { id: "s1", device: "Chrome / Windows 11", location: "Koramangala, Bengaluru", time: "Active Now", current: true },
    { id: "s2", device: "AgriConnect Mobile App (Android 14)", location: "Kurnool, Andhra Pradesh", time: "2 hours ago", current: false }
  ]);

  // Forgot password flow
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<"request" | "otp" | "reset" | "success">("request");
  const [resetPassword, setResetPassword] = useState("");

  // Onboarding Wizard steps (1 to 4)
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    fullName: "",
    dob: "1988-06-15",
    gender: "Male",
    mobile: "",
    email: "",
    farmName: "Green Harvest Valley",
    landSize: "12",
    soilType: "Loamy",
    waterSource: "Borewell",
    irrigationType: "Drip Irrigation",
    lat: 14.4426,
    lng: 79.9865,
    cropsGrown: ["Wheat", "Rice"],
    farmingExperience: "8",
    language: "English",
    enableSms: true,
    enableEmail: true,
    enablePush: true
  });

  // Simulated GPS Locations for the Farmer's selector (Andhra Pradesh, Haryana, AP, etc.)
  const simulatedMapCoordinates = [
    { name: "Nellore Block, Andhra Pradesh", lat: 14.4426, lng: 79.9865, description: "Highly fertile alluvial plain, suitable for basmati wheat and sugarcane." },
    { name: "Kurnool Sub-District, Andhra Pradesh", lat: 15.8281, lng: 78.0373, description: "Sandy clay region, highly successful with premium cotton varieties." },
    { name: "Karnal Agriculture Zone, Haryana", lat: 29.686, lng: 76.990, description: "Optimal loamy soil with excellent canal irrigation access." },
    { name: "Anantapur Arid Farm Circle, AP", lat: 14.681, lng: 77.600, description: "Red gravelly soil, best suited for dryland crops like groundnut and millet." }
  ];
  const [activeMapIndex, setActiveMapIndex] = useState(0);

  // Countdown timer for Twilio simulated OTP
  useEffect(() => {
    let interval: any;
    if (otpVerificationOpen && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpVerificationOpen, otpTimer]);

  // Password strength meter calculation helper
  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "No Password", color: "bg-slate-200", percent: 0 };
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
    if (/\d/.test(password)) score += 25;
    if (/[@$!%*?&]/.test(password)) score += 25;

    if (score <= 25) {
      return { label: "Fragile (Weak)", color: "bg-rose-500", percent: score };
    } else if (score <= 50) {
      return { label: "Moderate Protection", color: "bg-amber-500", percent: score };
    } else if (score <= 75) {
      return { label: "Highly Secure", color: "bg-emerald-500", percent: score };
    } else {
      return { label: "Unbreakable Aegis Shield", color: "bg-emerald-600", percent: score };
    }
  };

  const strength = getPasswordStrength(regPassword);

  const triggerMobileOtpSend = () => {
    if (!regMobile || regMobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsOtpSending(true);
    setTimeout(() => {
      setIsOtpSending(false);
      setOtpVerificationOpen(true);
      setOtpTimer(60);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length !== 6) {
      alert("Please enter the 6-digit verification code.");
      return;
    }
    // Simulate verification
    alert("OTP verified successfully via Twilio Secure Gateway!");
    setOtpVerificationOpen(false);
    setOnboardingData(prev => ({ ...prev, mobile: regMobile }));
    setView("onboarding");
  };

  const triggerDigiLockerKyc = () => {
    if (!regAadhaar || regAadhaar.length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar Number.");
      return;
    }
    setDigiLockerOpen(true);
    setDigiLockerStatus("verifying");
    setTimeout(() => {
      // Success match
      setDigiLockerStatus("success");
      setKycAadhaarName("Amir Patel");
    }, 2000);
  };

  const handleApplyDigiLockerKyc = () => {
    setOnboardingData(prev => ({
      ...prev,
      fullName: kycAadhaarName || "Amir Patel",
      dob: "1988-06-15"
    }));
    setDigiLockerOpen(false);
    alert("DigiLocker KYC details matched and successfully imported!");
  };

  const handleBiometricLogin = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      setTimeout(() => {
        // Logged in!
        setView("onboarding");
      }, 1000);
    }, 2000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms || !agreePrivacy) {
      alert("You must agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }
    if (authMethod === "mobile") {
      triggerMobileOtpSend();
    } else {
      // Email signup
      if (!regEmail || !regPassword) {
        alert("Please enter both Email and Password.");
        return;
      }
      setOnboardingData(prev => ({ ...prev, email: regEmail }));
      setView("onboarding");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isRajeshMobile = authMethod === "mobile" && loginMobile === "9876543210";
    const isRajeshEmail = authMethod === "email" && (loginEmail === "rajesh.patel@agriconnect.org" || loginEmail === "farmer@agriconnect.org") && loginPassword === "farmer123";

    if (isRajeshMobile || isRajeshEmail) {
      const demoFarmerData = {
        fullName: "Rajesh Patel",
        name: "Rajesh Patel",
        dob: "1988-06-15",
        gender: "Male",
        mobile: "9876543210",
        aadhaar: "123456789012",
        email: "rajesh.patel@agriconnect.org",
        farmName: "Green Valley Farm",
        landSize: "5.2",
        soilType: "Clay Loam",
        waterSource: "Borewell",
        irrigationType: "Drip",
        lat: 14.6811,
        lng: 77.6002,
        cropsGrown: ["Wheat", "Rice"],
        farmingExperience: "12",
        language: "English",
        enableSms: true,
        enableEmail: true,
        enablePush: true,
        isSeedRajesh: true
      };

      const demoFarms = [
        {
          id: "farm-rajesh",
          name: "Green Valley Farm",
          role: "Landowner / Operator",
          location: "14.6811°N, 77.6002°E", // Andhra Pradesh
          totalAcreage: 5.2,
          soilType: "Clay Loam",
          organicMatter: 3.2,
          waterSource: "Borewell",
          irrigationType: "Drip",
          healthScore: 92,
          baselineTelemetry: {
            soilMoisture: 54,
            soilPh: 6.8,
            temperature: 27.5,
            humidity: 58,
            nitrogen: 65,
            phosphorus: 48,
            potassium: 72
          },
          sectors: [
            {
              id: "sec-rajesh-1",
              name: "Plot Alpha (Wheat)",
              cropName: "Wheat",
              cropVariety: "PBW 343 Premium",
              moisture: 52,
              temp: 27.2,
              valveStatus: "Closed",
              healthStatus: "Optimal",
              area: 3.2
            },
            {
              id: "sec-rajesh-2",
              name: "Plot Beta (Rice)",
              cropName: "Rice",
              cropVariety: "IR 64 Premium",
              moisture: 56,
              temp: 27.8,
              valveStatus: "Closed",
              healthStatus: "Optimal",
              area: 2.0
            }
          ]
        }
      ];

      const demoCrops = [
        {
          id: "crop-rajesh-1",
          farmId: "farm-rajesh",
          name: "Wheat",
          variety: "PBW 343",
          acreage: 3.2,
          sowingDate: "2025-11-15",
          harvestDate: "2026-07-25",
          stage: "Active",
          projectedYield: 15.0
        },
        {
          id: "crop-rajesh-2",
          farmId: "farm-rajesh",
          name: "Rice",
          variety: "IR 64",
          acreage: 2.0,
          sowingDate: "2025-06-20",
          harvestDate: "2026-08-10",
          stage: "Active",
          projectedYield: 18.5
        }
      ];

      const demoExpenses = [
        { id: "exp-1", farmId: "farm-rajesh", category: "Seeds", amount: 3840, date: "2025-11-15", description: "Wheat seeds purchase PBW 343" },
        { id: "exp-2", farmId: "farm-rajesh", category: "Fertilizer", amount: 1600, date: "2025-11-20", description: "Premium Urea Fertilizer" }
      ];

      const demoTasks = [
        { id: "task-1", farmId: "farm-rajesh", title: "Monitor Soil Moisture levels", status: "Completed", dueDate: "2026-07-10", priority: "High" },
        { id: "task-2", farmId: "farm-rajesh", title: "Schedule Drip Irrigation cycle", status: "Pending", dueDate: "2026-07-15", priority: "Medium" }
      ];

      const demoActivities = [
        { id: "act-rajesh-1", type: "Sensor", description: "NPK sensor arrays verified in Plot Alpha. Soil pH is optimal at 6.8.", date: "2026-07-12" },
        { id: "act-rajesh-2", type: "Irrigation", description: "Drip irrigation system active in Plot Beta. High efficiency flow.", date: "2026-07-11" }
      ];

      localStorage.setItem("agriconnect_farmer_data", JSON.stringify(demoFarmerData));
      localStorage.setItem("farmer_farms", JSON.stringify(demoFarms));
      localStorage.setItem("farmer_crops", JSON.stringify(demoCrops));
      localStorage.setItem("farmer_expenses", JSON.stringify(demoExpenses));
      localStorage.setItem("farmer_tasks", JSON.stringify(demoTasks));
      localStorage.setItem("farmer_activities", JSON.stringify(demoActivities));
      localStorage.setItem("farmer_is_onboarded", "true");

      alert("Instant authentication initialized! Enjoy your Rajesh Patel workspace...");
      setTimeout(() => {
        onComplete(demoFarmerData);
      }, 500);
      return;
    }

    if (authMethod === "mobile") {
      if (!loginMobile) {
        alert("Please enter your registered mobile number.");
        return;
      }
    } else {
      if (!loginEmail || !loginPassword) {
        alert("Please enter email and password.");
        return;
      }
    }
    // Proceed to onboarding
    setView("onboarding");
  };

  const handleOnboardingSubmit = () => {
    onComplete(onboardingData);
  };

  const handleSocialSignup = (provider: string) => {
    alert(`Initiating secure social authentication handshakes with ${provider}...`);
    // Mock login and skip to wizard
    setView("onboarding");
  };

  return (
    <div id="auth-onboarding-wrapper" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Absolute Decorative Glow elements */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-slate-950/85 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row">
        
        {/* Left Interactive Info Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-cyan-950 via-emerald-950 to-slate-950 p-8 flex flex-col justify-between border-r border-slate-800 relative">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white font-display">AgriConnect AI</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Farmer Gateway v4.5</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-slate-100 font-display leading-tight">
                Securely managing India's agricultural prosperity.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your farm holdings with real-time Soil NPK sensors, drone surveillance telemetry, and secure direct-to-buyer crop escrow pipelines.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2.5 text-xs">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 font-medium">PCI-DSS Compliant bank-grade authentication escrow pipelines.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <Globe className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 font-medium">Multilingual localization across 10 official Indian regional languages.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <Award className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 font-medium">Direct linkage with government subsidy and PM-KISAN schemes.</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/60 mt-8 md:mt-0">
            <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between gap-2.5">
              <div>
                <p className="text-[9px] uppercase font-black text-slate-400">Bypass Portal Gateway</p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">Jump directly to Sandbox Sandbox Suite</p>
              </div>
              <button
                onClick={() => {
                  setView("onboarding");
                  setOnboardingStep(1);
                  alert("Gate system bypassed. Entering direct interactive sandbox configuration wizard.");
                }}
                className="p-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-xl transition-all cursor-pointer border border-emerald-500/20"
                title="Bypass gateway"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Active State Form Panel */}
        <div className="md:w-7/12 p-8 flex flex-col justify-center min-h-[500px]">
          
          <AnimatePresence mode="wait">
            
            {/* LOGIN STATE */}
            {view === "login" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
                key="login-pane"
              >
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Farmer Portal Login</h3>
                  <p className="text-xs text-slate-400 mt-1">Provide your credentials or biometrics to load your active farm twin.</p>
                </div>

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
                        setLoginMobile("9876543210");
                        setLoginEmail("rajesh.patel@agriconnect.org");
                        setLoginPassword("farmer123");
                        
                        const demoFarmerData = {
                          fullName: "Rajesh Patel",
                          name: "Rajesh Patel",
                          dob: "1988-06-15",
                          gender: "Male",
                          mobile: "9876543210",
                          aadhaar: "123456789012",
                          email: "rajesh.patel@agriconnect.org",
                          farmName: "Green Valley Farm",
                          landSize: "5.2",
                          soilType: "Clay Loam",
                          waterSource: "Borewell",
                          irrigationType: "Drip",
                          lat: 14.6811,
                          lng: 77.6002,
                          cropsGrown: ["Wheat", "Rice"],
                          farmingExperience: "12",
                          language: "English",
                          enableSms: true,
                          enableEmail: true,
                          enablePush: true,
                          isSeedRajesh: true
                        };

                        const demoFarms = [
                          {
                            id: "farm-rajesh",
                            name: "Green Valley Farm",
                            role: "Landowner / Operator",
                            location: "14.6811°N, 77.6002°E", // Andhra Pradesh
                            totalAcreage: 5.2,
                            soilType: "Clay Loam",
                            organicMatter: 3.2,
                            waterSource: "Borewell",
                            irrigationType: "Drip",
                            healthScore: 92,
                            baselineTelemetry: {
                              soilMoisture: 54,
                              soilPh: 6.8,
                              temperature: 27.5,
                              humidity: 58,
                              nitrogen: 65,
                              phosphorus: 48,
                              potassium: 72
                            },
                            sectors: [
                              {
                                id: "sec-rajesh-1",
                                name: "Plot Alpha (Wheat)",
                                cropName: "Wheat",
                                cropVariety: "PBW 343 Premium",
                                moisture: 52,
                                temp: 27.2,
                                valveStatus: "Closed",
                                healthStatus: "Optimal",
                                area: 3.2
                              },
                              {
                                id: "sec-rajesh-2",
                                name: "Plot Beta (Rice)",
                                cropName: "Rice",
                                cropVariety: "IR 64 Premium",
                                moisture: 56,
                                temp: 27.8,
                                valveStatus: "Closed",
                                healthStatus: "Optimal",
                                area: 2.0
                              }
                            ]
                          }
                        ];

                        const demoCrops = [
                          {
                            id: "crop-rajesh-1",
                            farmId: "farm-rajesh",
                            name: "Wheat",
                            variety: "PBW 343",
                            acreage: 3.2,
                            sowingDate: "2025-11-15",
                            harvestDate: "2026-07-25",
                            stage: "Active",
                            projectedYield: 15.0
                          },
                          {
                            id: "crop-rajesh-2",
                            farmId: "farm-rajesh",
                            name: "Rice",
                            variety: "IR 64",
                            acreage: 2.0,
                            sowingDate: "2025-06-20",
                            harvestDate: "2026-08-10",
                            stage: "Active",
                            projectedYield: 18.5
                          }
                        ];

                        const demoExpenses = [
                          { id: "exp-1", farmId: "farm-rajesh", category: "Seeds", amount: 3840, date: "2025-11-15", description: "Wheat seeds purchase PBW 343" },
                          { id: "exp-2", farmId: "farm-rajesh", category: "Fertilizer", amount: 1600, date: "2025-11-20", description: "Premium Urea Fertilizer" }
                        ];

                        const demoTasks = [
                          { id: "task-1", farmId: "farm-rajesh", title: "Monitor Soil Moisture levels", status: "Completed", dueDate: "2026-07-10", priority: "High" },
                          { id: "task-2", farmId: "farm-rajesh", title: "Schedule Drip Irrigation cycle", status: "Pending", dueDate: "2026-07-15", priority: "Medium" }
                        ];

                        const demoActivities = [
                          { id: "act-rajesh-1", type: "Sensor", description: "NPK sensor arrays verified in Plot Alpha. Soil pH is optimal at 6.8.", date: "2026-07-12" },
                          { id: "act-rajesh-2", type: "Irrigation", description: "Drip irrigation system active in Plot Beta. High efficiency flow.", date: "2026-07-11" }
                        ];

                        localStorage.setItem("agriconnect_farmer_data", JSON.stringify(demoFarmerData));
                        localStorage.setItem("farmer_farms", JSON.stringify(demoFarms));
                        localStorage.setItem("farmer_crops", JSON.stringify(demoCrops));
                        localStorage.setItem("farmer_expenses", JSON.stringify(demoExpenses));
                        localStorage.setItem("farmer_tasks", JSON.stringify(demoTasks));
                        localStorage.setItem("farmer_activities", JSON.stringify(demoActivities));
                        localStorage.setItem("farmer_is_onboarded", "true");

                        alert("Instant authentication initialized! Enjoy your Rajesh Patel workspace...");
                        setTimeout(() => {
                          onComplete(demoFarmerData);
                        }, 500);
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      Instant Login
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-300">
                    <div><span className="font-bold text-slate-400">Farmer:</span> Rajesh Patel</div>
                    <div><span className="font-bold text-slate-400">Mobile:</span> 9876543210</div>
                    <div><span className="font-bold text-slate-400">Land:</span> 5.2 Acres (Andhra Pradesh)</div>
                    <div><span className="font-bold text-slate-400">Password:</span> farmer123</div>
                  </div>
                </div>

                {/* Method selector tab */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                  <button
                    onClick={() => setAuthMethod("email")}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${authMethod === "email" ? "bg-slate-800 text-emerald-400 shadow" : "text-slate-400"}`}
                  >
                    Email Access
                  </button>
                  <button
                    onClick={() => setAuthMethod("mobile")}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${authMethod === "mobile" ? "bg-slate-800 text-emerald-400 shadow" : "text-slate-400"}`}
                  >
                    Mobile Access + OTP
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {authMethod === "email" ? (
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            placeholder="farmer@agriconnect.org"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full bg-slate-900/85 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block">Password</label>
                          <button
                            type="button"
                            onClick={() => {
                              setForgotPasswordOpen(true);
                              setForgotStep("request");
                            }}
                            className="text-[10px] text-emerald-400 hover:underline font-bold"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <input
                            type="password"
                            required
                            placeholder="••••••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full bg-slate-900/85 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">10-Digit Mobile Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={loginMobile}
                          onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-slate-900/85 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                      />
                      Remember Session
                    </label>

                    {/* Biometric Trigger Button */}
                    <button
                      type="button"
                      onClick={handleBiometricLogin}
                      className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                    >
                      <Fingerprint className="h-4.5 w-4.5" />
                      Biometric Login
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 mt-4"
                  >
                    Authenticate Account
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </form>

                {/* Social Login Integrations */}
                <div className="pt-3 border-t border-slate-850 space-y-3">
                  <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Or Connect via Social Identity Handshake</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSocialSignup("Google Secure Auth")}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="h-4 w-4 fill-current text-slate-300" viewBox="0 0 24 24">
                        <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.78 0 3.42.68 4.67 1.795l2.42-2.42C17.51 1.63 15.01 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.82 0 11-4.14 11-11 0-.675-.075-1.3-.235-1.715H12.24z"/>
                      </svg>
                      Google
                    </button>
                    <button
                      onClick={() => handleSocialSignup("Facebook Secure Auth")}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="h-4 w-4 fill-current text-slate-300" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-center pb-2">
                  <p className="text-xs text-slate-400">
                    Are you a new Farmer client?{" "}
                    <button
                      type="button"
                      onClick={() => setView("register")}
                      className="text-emerald-400 hover:underline font-bold cursor-pointer"
                    >
                      Register Now
                    </button>
                  </p>
                </div>

                {/* Active Sessions Management Panel */}
                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Device Sessions ({sessions.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSessions([{ id: "s1", device: "Chrome / Windows 11", location: "Koramangala, Bengaluru", time: "Active Now", current: true }]);
                        alert("Secured login! Successfully logged out from all other active device terminals.");
                      }}
                      className="text-[9px] text-rose-400 hover:text-rose-300 font-black uppercase tracking-wider cursor-pointer"
                    >
                      Logout All Other Devices
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {sessions.map((s) => (
                      <div key={s.id} className="bg-slate-900/60 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between text-[11px]">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-200 flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${s.current ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                            {s.device}
                          </p>
                          <p className="text-slate-500 text-[9.5px]">{s.location}</p>
                        </div>
                        <span className="text-[9.5px] font-bold text-slate-400">{s.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* REGISTRATION STATE */}
            {view === "register" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
                key="register-pane"
              >
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Create Farmer Account</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Secure registration linking directly to agricultural identity grids.</p>
                </div>

                {/* Method selector tab */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                  <button
                    onClick={() => setAuthMethod("email")}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${authMethod === "email" ? "bg-slate-800 text-emerald-400 shadow" : "text-slate-400"}`}
                  >
                    Signup via Email
                  </button>
                  <button
                    onClick={() => setAuthMethod("mobile")}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${authMethod === "mobile" ? "bg-slate-800 text-emerald-400 shadow" : "text-slate-400"}`}
                  >
                    Signup via Mobile + OTP
                  </button>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {authMethod === "email" ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <input
                            type="email"
                            required
                            placeholder="farmer@agriconnect.org"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full bg-slate-900/85 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Create Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <input
                            type={showRegPassword ? "text" : "password"}
                            required
                            placeholder="Min 8 characters"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full bg-slate-900/85 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-white"
                          >
                            {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        {/* Password strength visual meter */}
                        <div className="space-y-1 pt-1.5">
                          <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                            <span>Complexity Standard:</span>
                            <span className={regPassword ? (strength.percent > 50 ? "text-emerald-400" : "text-amber-400") : "text-slate-500"}>
                              {strength.label}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-850 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${strength.color} transition-all duration-300`}
                              style={{ width: `${strength.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 block">10-Digit Mobile Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-slate-900/85 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* Secure DigiLocker Aadhaar Integration Section */}
                  <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-300 block flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-emerald-400" />
                        Aadhaar DigiLocker Verification
                      </label>
                      <span className="text-[9px] bg-cyan-950 text-cyan-400 font-bold px-1.5 py-0.2 rounded border border-cyan-800">
                        E-KYC Verified
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400">Automatically sync land records and bank details with official UIDAI registries.</p>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="12-digit Aadhaar (e.g. 123456789012)"
                        value={regAadhaar}
                        onChange={(e) => setRegAadhaar(e.target.value.replace(/\D/g, ""))}
                        className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono tracking-widest font-bold"
                      />
                      <button
                        type="button"
                        onClick={triggerDigiLockerKyc}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Fetch KYC
                      </button>
                    </div>
                  </div>

                  {/* Terms and conditions agreements */}
                  <div className="space-y-2 pt-1.5">
                    <label className="flex items-start gap-2.5 text-[11px] text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                      />
                      <span>I authorize the validation of my metadata and agree to the <a href="#" className="text-emerald-400 hover:underline font-bold">Terms &amp; Conditions</a>.</span>
                    </label>

                    <label className="flex items-start gap-2.5 text-[11px] text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreePrivacy}
                        onChange={(e) => setAgreePrivacy(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-emerald-600 focus:ring-emerald-500 mt-0.5"
                      />
                      <span>I declare myself as owner/leaseholder of specified farm holdings and consent to the <a href="#" className="text-emerald-400 hover:underline font-bold">Privacy Policy</a>.</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20"
                  >
                    {isOtpSending ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        Generating Twilio SMS Request...
                      </>
                    ) : (
                      <>
                        Register Secure Profile
                        <ArrowRight className="h-4.5 w-4.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 text-center">
                  <p className="text-xs text-slate-400">
                    Already registered with AgriConnect?{" "}
                    <button
                      onClick={() => setView("login")}
                      className="text-emerald-400 hover:underline font-bold cursor-pointer"
                    >
                      Login Profile
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ONBOARDING STATE */}
            {view === "onboarding" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
                key="onboarding-wizard"
              >
                {/* Onboarding Wizard Header */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white font-display flex items-center gap-1.5">
                      <Sparkles className="h-5 w-5 text-emerald-400" />
                      Onboarding Wizard
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Define your farm boundaries and soil properties.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 font-extrabold px-2.5 py-1 rounded-xl">
                      {onboardingStep === 1 ? "25%" : onboardingStep === 2 ? "50%" : onboardingStep === 3 ? "75%" : "100%"} Done
                    </span>
                  </div>
                </div>

                {/* Progress bar steps */}
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="space-y-1">
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${onboardingStep >= step ? "bg-emerald-500" : "bg-slate-800"}`} />
                      <p className="text-[8.5px] uppercase font-black text-center text-slate-500">Step {step}</p>
                    </div>
                  ))}
                </div>

                {/* Step 1: Personal Details */}
                {onboardingStep === 1 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-300">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1 mb-3">
                        <User className="h-4.5 w-4.5" />
                        Step 1: Personal Profile
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Full Name (KYC Audited)</label>
                          <input
                            type="text"
                            required
                            placeholder="Amir Patel"
                            value={onboardingData.fullName}
                            onChange={(e) => setOnboardingData({ ...onboardingData, fullName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Date of Birth</label>
                          <input
                            type="date"
                            required
                            value={onboardingData.dob}
                            onChange={(e) => setOnboardingData({ ...onboardingData, dob: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Gender Identity</label>
                          <select
                            value={onboardingData.gender}
                            onChange={(e) => setOnboardingData({ ...onboardingData, gender: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other / Prefer not to specify</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Primary Mobile Line</label>
                          <input
                            type="tel"
                            required
                            placeholder="Enter 10-digit primary contact"
                            value={onboardingData.mobile}
                            onChange={(e) => setOnboardingData({ ...onboardingData, mobile: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          if (!onboardingData.fullName || !onboardingData.mobile) {
                            alert("Please provide your name and contact mobile number to proceed.");
                            return;
                          }
                          setOnboardingStep(2);
                        }}
                        className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Next Step
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Farm Characteristics */}
                {onboardingStep === 2 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Inputs */}
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                          <MapPin className="h-4.5 w-4.5" />
                          Step 2: Farm Boundaries
                        </h4>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Registered Farm Name</label>
                          <input
                            type="text"
                            placeholder="Green Harvest Valley"
                            value={onboardingData.farmName}
                            onChange={(e) => setOnboardingData({ ...onboardingData, farmName: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Total Land Area (Acres)</label>
                          <input
                            type="number"
                            placeholder="12"
                            value={onboardingData.landSize}
                            onChange={(e) => setOnboardingData({ ...onboardingData, landSize: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Soil Classification</label>
                          <select
                            value={onboardingData.soilType}
                            onChange={(e) => setOnboardingData({ ...onboardingData, soilType: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                          >
                            <option value="Loamy">Loamy Alluvial Soil</option>
                            <option value="Clay">Black Cotton Clay Soil</option>
                            <option value="Sandy">Sandy Desert Arid Soil</option>
                            <option value="Silty">Silty Wetland soil</option>
                            <option value="Peat">Acidic Organic Peat Soil</option>
                            <option value="Chalky">Chalky Alkaline Limestone Soil</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Primary Water Source</label>
                          <select
                            value={onboardingData.waterSource}
                            onChange={(e) => setOnboardingData({ ...onboardingData, waterSource: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none"
                          >
                            <option value="Borewell">Borewell Submersible Pump</option>
                            <option value="River">River Canal Inflow</option>
                            <option value="Rainfed">Rain-fed Natural Catchment</option>
                            <option value="Pond">Local Farm Irrigation Pond</option>
                          </select>
                        </div>
                      </div>

                      {/* Interactive simulated Geolocation/GPS Map Picker */}
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">GPS Geolocation Coordinates</span>
                            <span className="text-[9px] text-emerald-400 font-mono font-bold">🛰️ Connected</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Select simulated region below to capture precise coordinates & agricultural soil profile: </p>
                        </div>

                        {/* Mini Map simulation widget */}
                        <div className="my-3 bg-slate-950 border border-slate-850 rounded-xl p-3 relative h-36 flex flex-col justify-between overflow-hidden">
                          {/* Radial overlay radar effect */}
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950/10 to-transparent pointer-events-none" />

                          <div className="space-y-1 z-10">
                            <p className="text-xs text-white font-extrabold flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                              {simulatedMapCoordinates[activeMapIndex].name}
                            </p>
                            <p className="text-[9.5px] text-slate-400 leading-tight">
                              {simulatedMapCoordinates[activeMapIndex].description}
                            </p>
                          </div>

                          <div className="flex justify-between items-end z-10 pt-2">
                            <div className="font-mono text-[10px] text-emerald-400 space-y-0.5">
                              <p>LAT: {simulatedMapCoordinates[activeMapIndex].lat.toFixed(4)}° N</p>
                              <p>LNG: {simulatedMapCoordinates[activeMapIndex].lng.toFixed(4)}° E</p>
                            </div>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                              ALT: 214m
                            </span>
                          </div>
                        </div>

                        {/* selector tabs for simulated areas */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {simulatedMapCoordinates.map((coord, idx) => (
                            <button
                              key={coord.name}
                              onClick={() => {
                                setActiveMapIndex(idx);
                                setOnboardingData({
                                  ...onboardingData,
                                  lat: coord.lat,
                                  lng: coord.lng
                                });
                              }}
                              className={`py-1 px-2 border text-[9px] font-black rounded-lg transition-all text-center truncate ${
                                activeMapIndex === idx
                                  ? "bg-emerald-600/10 text-emerald-400 border-emerald-500/40"
                                  : "bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-700"
                              }`}
                            >
                              {coord.name.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setOnboardingStep(1)}
                        className="py-2.5 px-5 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          if (!onboardingData.farmName || !onboardingData.landSize) {
                            alert("Please provide the Farm Name and Land Acreage to proceed.");
                            return;
                          }
                          setOnboardingStep(3);
                        }}
                        className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Next Step
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Cropping Heritage */}
                {onboardingStep === 3 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-300">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        <Award className="h-4.5 w-4.5" />
                        Step 3: Cropping Heritage
                      </h4>

                      <p className="text-xs text-slate-400">
                        Select all crops you previously cultivated or intend to raise during this season. This configures the Gemini yield recommendation pipelines.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                        {["Wheat", "Rice Paddy", "Sugarcane", "Cotton", "Maize / Corn", "Chickpeas", "Soybean", "Mustard"].map((crop) => {
                          const isSelected = onboardingData.cropsGrown.includes(crop);
                          return (
                            <button
                              key={crop}
                              onClick={() => {
                                const activeCrops = [...onboardingData.cropsGrown];
                                if (activeCrops.includes(crop)) {
                                  setOnboardingData({
                                    ...onboardingData,
                                    cropsGrown: activeCrops.filter(c => c !== crop)
                                  });
                                } else {
                                  setOnboardingData({
                                    ...onboardingData,
                                    cropsGrown: [...activeCrops, crop]
                                  });
                                }
                              }}
                              className={`py-2.5 px-3 border text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? "bg-emerald-600/10 text-emerald-400 border-emerald-500/40 shadow-xs"
                                  : "bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800"
                              }`}
                            >
                              <span>{crop}</span>
                              {isSelected ? (
                                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 block">Years of Active Farming Experience</label>
                          <input
                            type="number"
                            placeholder="e.g. 10"
                            value={onboardingData.farmingExperience}
                            onChange={(e) => setOnboardingData({ ...onboardingData, farmingExperience: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-[10px] text-slate-400 flex items-start gap-2.5 leading-snug">
                          <Info className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
                          <span>We use farming experience and geographic history to calibrate disease model alerts and fertilizer dosage suggestions for high-yield harvests.</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="py-2.5 px-5 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          if (onboardingData.cropsGrown.length === 0) {
                            alert("Please select at least one crop grown in your history to calibrate recommendations.");
                            return;
                          }
                          setOnboardingStep(4);
                        }}
                        className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Next Step
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: System Preferences */}
                {onboardingStep === 4 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-300">
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        <Globe className="h-4.5 w-4.5" />
                        Step 4: System Customization
                      </h4>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400">Primary Language System</label>
                          <select
                            value={onboardingData.language}
                            onChange={(e) => setOnboardingData({ ...onboardingData, language: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                          >
                            <option value="English">English (Global Technical)</option>
                            <option value="Hindi">हिन्दी (Hindi)</option>
                            <option value="Telugu">తెలుగు (Telugu)</option>
                            <option value="Tamil">தமிழ் (Tamil)</option>
                            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                            <option value="Marathi">मराठी (Marathi)</option>
                            <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                            <option value="Bengali">বাংলা (Bengali)</option>
                            <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                            <option value="Malayalam">മലയാളം (Malayalam)</option>
                          </select>
                        </div>

                        {/* Notification configurations */}
                        <div className="pt-2 space-y-3">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Critical Real-time Alerts Channels</span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <label className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer select-none">
                              <span className="text-xs text-slate-300 font-bold">SMS Weather Alerts</span>
                              <input
                                type="checkbox"
                                checked={onboardingData.enableSms}
                                onChange={(e) => setOnboardingData({ ...onboardingData, enableSms: e.target.checked })}
                                className="rounded border-slate-800 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                              />
                            </label>

                            <label className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer select-none">
                              <span className="text-xs text-slate-300 font-bold">Email Weekly Reports</span>
                              <input
                                type="checkbox"
                                checked={onboardingData.enableEmail}
                                onChange={(e) => setOnboardingData({ ...onboardingData, enableEmail: e.target.checked })}
                                className="rounded border-slate-800 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                              />
                            </label>

                            <label className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer select-none">
                              <span className="text-xs text-slate-300 font-bold">In-App Push Signals</span>
                              <input
                                type="checkbox"
                                checked={onboardingData.enablePush}
                                onChange={(e) => setOnboardingData({ ...onboardingData, enablePush: e.target.checked })}
                                className="rounded border-slate-800 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setOnboardingStep(3)}
                        className="py-2.5 px-5 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleOnboardingSubmit}
                        className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/20"
                      >
                        Launch Interactive Twin Workspace
                        <ArrowRight className="h-4.5 w-4.5 animate-pulse" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* TWILIO OTP SIMULATION DIALOG */}
      {otpVerificationOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Smartphone className="h-5 w-5" />
              <h4 className="text-sm font-black uppercase tracking-wider text-white">Twilio OTP Auth Gate</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              We dispatched a secure 6-digit verification pin to <span className="font-bold text-white">{regMobile}</span>. Please enter below:
            </p>

            <div className="space-y-3">
              <input
                type="text"
                required
                maxLength={6}
                placeholder="e.g. 482015"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 text-center text-xl font-mono tracking-widest font-black text-emerald-400 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-500">Gateway Status: <span className="text-emerald-500">ONLINE</span></span>
                <button
                  type="button"
                  disabled={otpTimer > 0}
                  onClick={() => {
                    setOtpTimer(60);
                    alert("OTP re-dispatched via Twilio backup pipeline SMS.");
                  }}
                  className={`font-black uppercase tracking-wider ${otpTimer > 0 ? "text-slate-600" : "text-emerald-400 hover:underline cursor-pointer"}`}
                >
                  {otpTimer > 0 ? `Resend Code in ${otpTimer}s` : "Resend OTP Code"}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setOtpVerificationOpen(false)}
                className="w-1/3 py-2 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="w-2/3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Validate Token
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* DIGILOCKER POPUP/IFRAME SIMULATOR */}
      {digiLockerOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white text-slate-900 p-6 rounded-2xl space-y-4 shadow-2xl border border-slate-300 overflow-hidden"
          >
            {/* National DigiLocker branding header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-amber-500 text-white rounded-lg font-black flex items-center justify-center text-sm shadow">
                  DL
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-tight text-slate-800">DIGILOCKER SERVICES</h4>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Govt of India Secure E-Gateway</p>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200 uppercase">
                UIDAI Sandbox
              </span>
            </div>

            {digiLockerStatus === "verifying" ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
                <p className="text-xs font-bold text-slate-600">Retrieving official citizen registry records...</p>
                <p className="text-[10px] text-slate-400">Authenticating UIDAI certificate and decryption keys</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-extrabold text-emerald-900 uppercase">KYC Signature Verified</h5>
                    <p className="text-[11px] text-emerald-700 mt-1">Successfully linked with secure DigiLocker registry wallet.</p>
                    <div className="bg-white border border-emerald-100 p-2.5 rounded-lg mt-2 font-mono text-[10px] space-y-1 text-slate-700">
                      <p><span className="font-bold text-slate-900">Name:</span> AMIR PATEL</p>
                      <p><span className="font-bold text-slate-900">DOB:</span> 15-JUN-1988 (Verified)</p>
                      <p><span className="font-bold text-slate-900">Gender:</span> M (Verified)</p>
                      <p><span className="font-bold text-slate-900">Aadhaar Hash:</span> ******382901-SHA256</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDigiLockerOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleApplyDigiLockerKyc}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase rounded-xl cursor-pointer"
                  >
                    Apply Verified KYC
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* FORGOT PASSWORD DIALOG */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-900 pb-2.5">
              <Lock className="h-5 w-5" />
              <h4 className="text-sm font-black uppercase tracking-wider text-white">Reset Account Key</h4>
            </div>

            {forgotStep === "request" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your registered email address or mobile below to receive a secure recovery OTP password reset link:
                </p>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Registered Email</label>
                  <input
                    type="email"
                    placeholder="farmer@agriconnect.org"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!forgotEmail) {
                      alert("Please provide your email address.");
                      return;
                    }
                    setForgotStep("otp");
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Send Recovery OTP
                </button>
              </div>
            )}

            {forgotStep === "otp" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  We've dispathed an authentication key. Enter verification code:
                </p>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 592810"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 text-center text-lg font-mono text-emerald-400 focus:outline-none font-bold"
                />
                <button
                  onClick={() => setForgotStep("reset")}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Validate Verification Token
                </button>
              </div>
            )}

            {forgotStep === "reset" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Provide a new, strong password:
                </p>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 8 secure chars"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setForgotStep("success")}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Update Account Password
                </button>
              </div>
            )}

            {forgotStep === "success" && (
              <div className="space-y-3.5 text-center py-2">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
                <div>
                  <h5 className="text-xs font-black text-white uppercase tracking-wider">Account Password Restored</h5>
                  <p className="text-[11px] text-slate-400 mt-1">Your credentials are now updated across all cloud clusters.</p>
                </div>
                <button
                  onClick={() => setForgotPasswordOpen(false)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                >
                  Return to login
                </button>
              </div>
            )}

            {forgotStep !== "success" && (
              <button
                onClick={() => setForgotPasswordOpen(false)}
                className="w-full text-center text-[10px] font-black uppercase text-slate-500 hover:text-slate-300 block"
              >
                Go Back
              </button>
            )}
          </motion.div>
        </div>
      )}

      {/* BIOMETRIC SCANNING DIALOG */}
      {biometricScanning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xs bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-2xl"
          >
            <div className="relative">
              {/* Pulsing Scan Circles */}
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping scale-125" />
              <div className="h-20 w-20 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950 relative z-10">
                <Fingerprint className="h-10 w-10 animate-pulse" />
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-xs font-black uppercase text-white tracking-widest">Biometric Face/Touch ID</h4>
              <p className="text-[10px] text-cyan-400 font-mono mt-1 animate-pulse">SCANNING BIOMETRICS...</p>
              <p className="text-[10px] text-slate-500 mt-2">Rest your finger on device scanner or face camera to synchronize profile credentials.</p>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
