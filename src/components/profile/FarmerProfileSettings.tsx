import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Shield,
  Smartphone,
  Globe,
  Bell,
  Eye,
  EyeOff,
  Download,
  Database,
  Lock,
  History,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Fingerprint
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  location: string;
  photoUrl: string | null;
  aadhaar: string;
  dob: string;
  gender: string;
}

export default function FarmerProfileSettings() {
  // Profile State
  const [profile, setProfile] = useState<ProfileData>({
    name: "Jasbir Singh Dhillon",
    email: "jasbir.dhillon@punjabcoop.org",
    phone: "+91 98765-43210",
    experience: "18 Years",
    location: "Jalandhar Outskirts, Punjab",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    aadhaar: "5421-8902-3112",
    dob: "1983-08-14",
    gender: "Male"
  });

  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempProfile, setTempProfile] = useState<ProfileData>({ ...profile });
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile.photoUrl);

  // Security (2FA) State
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(true);

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false
  });

  const [alertTypes, setAlertTypes] = useState({
    marketPrices: true,
    weatherWarnings: true,
    schemeDeadlines: true,
    orderUpdates: true,
    aiRecommendations: true
  });

  // Language Preferences
  const [language, setLanguage] = useState<string>("Punjabi");

  // Farm Privacy State
  const [privacy, setPrivacy] = useState<"Public" | "Co-op Only" | "Private">("Co-op Only");
  const [isFarmPublic, setIsFarmPublic] = useState<boolean>(true);
  const [shareDataWithAI, setShareDataWithAI] = useState<boolean>(true);
  const [shareLocation, setShareLocation] = useState<boolean>(true);

  // Export & Download Alerts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active Sessions Mock Data
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: "Samsung Galaxy F23 5G", ip: "192.168.1.105", location: "Jalandhar, India", status: "Active Now", icon: Smartphone },
    { id: 2, device: "Chrome 125 (Windows PC)", ip: "103.45.201.88", location: "Ludhiana, India", status: "Active 4 hours ago", icon: Globe }
  ]);

  // Login History Mock Data with device
  const loginHistory = [
    { timestamp: "2026-07-04 08:30:12", action: "Authorized Login", ip: "192.168.1.105", location: "Jalandhar, India", device: "Samsung Galaxy F23 5G" },
    { timestamp: "2026-07-03 14:15:45", action: "Profile Updated", ip: "192.168.1.105", location: "Jalandhar, India", device: "Chrome 125 (Windows PC)" },
    { timestamp: "2026-07-02 09:05:11", action: "Authorized Login", ip: "103.45.201.88", location: "Ludhiana, India", device: "Samsung Galaxy F23 5G" },
    { timestamp: "2026-07-01 18:22:30", action: "2FA Code Verified", ip: "192.168.1.105", location: "Jalandhar, India", device: "Chrome 125 (Windows PC)" }
  ];

  // Photo Upload Handler (simulated)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setTempProfile(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Save
  const handleSaveProfile = () => {
    setProfile({ ...tempProfile });
    setEditMode(false);
    triggerSuccess("✓ Profile updated successfully.");
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  // Simulating exports
  const handleExport = (type: "CSV" | "Excel" | "JSON") => {
    triggerSuccess(`✓ Enqueued export task for your farm Ledger in ${type} format. Check your email shortly.`);
  };

  const handleDownloadReport = (reportName: string) => {
    triggerSuccess(`✓ Downloaded ${reportName} (Simulated PDF download initiated)`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" id="farmer-profile-settings-root">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 border border-slate-200/80 rounded-2xl shadow-3xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <User className="h-6 w-6 text-emerald-600" />
            Farmer Profile & Security Settings
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Manage your personal verification credentials, secure your account via 2FA, and export audit sheets.
          </p>
        </div>
        
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 animate-bounce">
            <CheckCircle className="h-4 w-4 shrink-0" />
            {successMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: EDIT PROFILE CARD & PRIVACY */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PROFILE CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-4.5 w-4.5 text-emerald-600" />
                Personal Cultivator Details
              </span>
              <button
                type="button"
                onClick={() => {
                  if (editMode) {
                    setTempProfile({ ...profile });
                    setPhotoPreview(profile.photoUrl);
                  }
                  setEditMode(!editMode);
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 cursor-pointer transition-all"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Photo Upload Thumbnail */}
              <div className="relative flex flex-col items-center shrink-0">
                <div className="h-24 w-24 rounded-full border-2 border-emerald-500 bg-slate-100 overflow-hidden shadow-xs">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Farmer Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {editMode && (
                  <label className="mt-2 text-[10px] font-black text-emerald-700 hover:text-emerald-800 cursor-pointer uppercase tracking-wider">
                    Change Photo
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Profile Details Inputs/Static View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full text-xs">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Cultivator Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="block font-bold text-slate-800 mt-1">{profile.name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Registered Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="block font-bold text-slate-800 mt-1 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-400" />
                      {profile.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Verified Mobile Phone</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="block font-bold text-slate-800 mt-1 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {profile.phone}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Farming Experience</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempProfile.experience}
                      onChange={(e) => setTempProfile({ ...tempProfile, experience: e.target.value })}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="block font-bold text-slate-800 mt-1 flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-slate-400" />
                      {profile.experience}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Primary Office & Farm Location</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempProfile.location}
                      onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="block font-bold text-slate-800 mt-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {profile.location}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Aadhaar National UID</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempProfile.aadhaar}
                      onChange={(e) => setTempProfile({ ...tempProfile, aadhaar: e.target.value })}
                      placeholder="XXXX-XXXX-XXXX"
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="block font-bold text-slate-800 mt-1 flex items-center gap-1 font-mono">
                      <Fingerprint className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      {profile.aadhaar}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Date of Birth (DOB)</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={tempProfile.dob}
                      onChange={(e) => setTempProfile({ ...tempProfile, dob: e.target.value })}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <span className="block font-bold text-slate-800 mt-1 flex items-center gap-1 font-mono">
                      <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      {profile.dob}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Gender Identity</label>
                  {editMode ? (
                    <select
                      value={tempProfile.gender}
                      onChange={(e) => setTempProfile({ ...tempProfile, gender: e.target.value })}
                      className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Non-binary</option>
                    </select>
                  ) : (
                    <span className="block font-bold text-slate-800 mt-1 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                      {profile.gender}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {editMode && (
              <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempProfile({ ...profile });
                    setPhotoPreview(profile.photoUrl);
                    setEditMode(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-lg cursor-pointer transition-all"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg cursor-pointer transition-all shadow-3xs"
                >
                  Save Profile Changes
                </button>
              </div>
            )}
          </div>

          {/* NOTIFICATION SETTINGS & LANGUAGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* NOTIFICATIONS */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="h-4.5 w-4.5 text-indigo-500 animate-bounce" />
                  Notification Channels
                </span>
                <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                  Toggle alert routing mechanisms for your farmer account.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/30">
                  <div>
                    <span className="text-xs font-black text-slate-700 block">Email Alerts</span>
                    <span className="text-[9px] text-slate-400 block font-semibold">Ledger invoices & weekly summaries</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                      notifications.email ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                      notifications.email ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/30">
                  <div>
                    <span className="text-xs font-black text-slate-700 block">SMS Alerts</span>
                    <span className="text-[9px] text-slate-400 block font-semibold">Direct text messages to registered phone</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                      notifications.sms ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                      notifications.sms ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/30">
                  <div>
                    <span className="text-xs font-black text-slate-700 block">Push Notifications</span>
                    <span className="text-[9px] text-slate-400 block font-semibold">Real-time browser notifications</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                      notifications.push ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                      notifications.push ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 my-4" />

              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    Alert Type Preferences
                  </span>
                  <p className="text-[9px] text-slate-400 font-semibold leading-normal">
                    Select which types of alerts you want to receive across active channels.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* Market price changes */}
                  <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">Market Price Changes</span>
                      <span className="text-[8.5px] text-slate-400 block font-medium">Daily MSP updates and local Mandi fluctuation alerts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertTypes(prev => ({ ...prev, marketPrices: !prev.marketPrices }))}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                        alertTypes.marketPrices ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                        alertTypes.marketPrices ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Weather warnings */}
                  <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">Weather Warnings</span>
                      <span className="text-[8.5px] text-slate-400 block font-medium">Extreme heat, monsoon downpours, frost, and duststorms</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertTypes(prev => ({ ...prev, weatherWarnings: !prev.weatherWarnings }))}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                        alertTypes.weatherWarnings ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                        alertTypes.weatherWarnings ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Scheme deadlines */}
                  <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">Scheme Deadlines</span>
                      <span className="text-[8.5px] text-slate-400 block font-medium">Subsidies, PM-KISAN verification, and insurance enrollments</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertTypes(prev => ({ ...prev, schemeDeadlines: !prev.schemeDeadlines }))}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                        alertTypes.schemeDeadlines ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                        alertTypes.schemeDeadlines ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Order updates */}
                  <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">Order Updates</span>
                      <span className="text-[8.5px] text-slate-400 block font-medium">Seed delivery trackers, equipment rentals, and lease contracts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertTypes(prev => ({ ...prev, orderUpdates: !prev.orderUpdates }))}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                        alertTypes.orderUpdates ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                        alertTypes.orderUpdates ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* AI recommendations */}
                  <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">AI Recommendations</span>
                      <span className="text-[8.5px] text-slate-400 block font-medium">Agronomic diagnostics, soil-moisture warnings, and fertigation loops</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlertTypes(prev => ({ ...prev, aiRecommendations: !prev.aiRecommendations }))}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                        alertTypes.aiRecommendations ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                        alertTypes.aiRecommendations ? "translate-x-4" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PREFERENCES & PRIVACY */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-4">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-4.5 w-4.5 text-blue-500" />
                Localization & Privacy
              </span>
              
              <div className="space-y-4 text-xs">
                {/* Language Select */}
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Preferred Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="English">English</option>
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

                  <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-700 block">Voice Assistant Language</span>
                      <span className="text-[8.5px] text-slate-400 font-medium block">Intelligent speech recognition audio feed</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 font-black text-[9px] uppercase tracking-wider rounded-md font-mono">
                      Same as UI ({language})
                    </span>
                  </div>
                </div>

                {/* Farm Privacy Settings */}
                <div className="space-y-3.5 pt-2 border-t border-slate-200/50">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Farm Privacy Settings</label>
                    <p className="text-[9px] text-slate-400 font-semibold leading-normal">
                      Configure telemetry exposure, data sharing policies, and visibility.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Make Farm Public */}
                    <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 block">Make Farm Public</span>
                        <span className="text-[8.5px] text-slate-400 block font-medium">If enabled, your farm profile, catalog, and status are visible to buyers</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFarmPublic(!isFarmPublic)}
                        className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                          isFarmPublic ? "bg-indigo-600" : "bg-slate-200"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                          isFarmPublic ? "translate-x-4" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Share Farm Data with AI */}
                    <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 block">Share Farm Data with AI</span>
                        <span className="text-[8.5px] text-slate-400 block font-medium">Allows ML agriscience engines to process soil telemetry for better recommendations</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShareDataWithAI(!shareDataWithAI)}
                        className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                          shareDataWithAI ? "bg-indigo-600" : "bg-slate-200"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                          shareDataWithAI ? "translate-x-4" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Share Location */}
                    <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 block">Share Location</span>
                        <span className="text-[8.5px] text-slate-400 block font-medium">Use precise coordinates to deliver localized, severe crop weather alerts</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShareLocation(!shareLocation)}
                        className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                          shareLocation ? "bg-indigo-600" : "bg-slate-200"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                          shareLocation ? "translate-x-4" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* EXPORTS & REPORT GENERATOR */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-4">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-4.5 w-4.5 text-emerald-600" />
              Export All Farm Data & Dynamic Reports
            </span>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              Export high-fidelity structured data schemas or download compiled, verified PDF audits for bank loans and agricultural subsidies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dynamic Ledger Exports */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3.5 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">Export All Farm Data</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleExport("CSV")}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 font-bold text-[10px] rounded-lg text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    CSV Format
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("Excel")}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 font-bold text-[10px] rounded-lg text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    Excel (XLS)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("JSON")}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-200 font-bold text-[10px] rounded-lg text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    JSON Format
                  </button>
                </div>
              </div>

              {/* Dynamic Reports Downloads */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">Download Reports</span>
                
                <div className="space-y-1.5 text-[10px] font-bold text-slate-700">
                  <div className="flex justify-between items-center hover:bg-white p-1 rounded transition-all">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-red-500" />
                      Farm Summary Report
                    </span>
                    <button type="button" onClick={() => handleDownloadReport("Farm Summary Report")} className="text-emerald-600 hover:text-emerald-800 p-1">
                      <Download className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center hover:bg-white p-1 rounded transition-all">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-indigo-500" />
                      Crop History Report
                    </span>
                    <button type="button" onClick={() => handleDownloadReport("Crop History Report")} className="text-emerald-600 hover:text-emerald-800 p-1">
                      <Download className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center hover:bg-white p-1 rounded transition-all">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-amber-500" />
                      Financial Report
                    </span>
                    <button type="button" onClick={() => handleDownloadReport("Financial Report")} className="text-emerald-600 hover:text-emerald-800 p-1">
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SECURITY (2FA), SESSIONS, LOGIN HISTORY */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* TWO-FACTOR AUTH (2FA) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-4">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="h-4.5 w-4.5 text-red-500 animate-pulse" />
              Sovereign Security Protocols
            </span>
            
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Lock className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800">Two-Factor Authentication (2FA)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIs2FAEnabled(!is2FAEnabled);
                      triggerSuccess(is2FAEnabled ? "✓ Two-Factor authentication deactivated." : "✓ Two-Factor authentication activated successfully via registered mobile.");
                    }}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-none ${
                      is2FAEnabled ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                      is2FAEnabled ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                  Secure transactions by receiving a dynamic One-Time PIN (OTP) over your authenticated SMS line for order returns, rental leasing, and data exports.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 my-4" />

            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider">
                <Lock className="h-4 w-4 text-indigo-600" />
                Change Password
              </div>
              
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-slate-400 uppercase">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {passwordError && (
                  <p className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    {passwordError}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
                      setPasswordError("All password fields are required.");
                      return;
                    }
                    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                      setPasswordError("New passwords do not match.");
                      return;
                    }
                    if (passwordForm.newPassword.length < 6) {
                      setPasswordError("Password must be at least 6 characters long.");
                      return;
                    }
                    setPasswordError(null);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    triggerSuccess("✓ Password changed successfully.");
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-3xs"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE SESSIONS LIST */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-4">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="h-4.5 w-4.5 text-emerald-600" />
              Active Access Sessions
            </span>
            <p className="text-[10px] text-slate-500 font-semibold leading-normal">
              These devices are currently logged into your cultivator ledger account. Terminate sessions if unrecognized.
            </p>

            <div className="space-y-3">
              {activeSessions.map((session) => {
                const IconComp = session.icon;
                return (
                  <div key={session.id} className="bg-slate-50/50 border border-slate-150 p-3 rounded-xl flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                        <IconComp className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-800 block">{session.device}</span>
                        <span className="text-[9.5px] font-semibold text-slate-400 block">{session.location} • {session.ip}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md inline-block ${
                        session.status === "Active Now" ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80" : "bg-slate-100 text-slate-500"
                      }`}>
                        {session.status}
                      </span>
                      {session.status !== "Active Now" && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSessions(prev => prev.filter(s => s.id !== session.id));
                            triggerSuccess("✓ Remote access session terminated successfully.");
                          }}
                          className="block text-[8px] font-black text-red-600 hover:text-red-700 uppercase tracking-wider mt-1 ml-auto cursor-pointer"
                        >
                          Revoke Token
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LOGIN HISTORY */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-3xs space-y-4">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <History className="h-4.5 w-4.5 text-slate-600" />
              Sovereign Audit Log
            </span>
            <p className="text-[10px] text-slate-500 font-semibold leading-normal">
              Most recent critical actions logged to your local browser sandbox ledger.
            </p>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
              {loginHistory.map((hist, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-[10px] font-semibold">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-700 block">{hist.action}</span>
                    <span className="text-[9px] text-slate-400 block">{hist.timestamp}</span>
                    <span className="text-[8.5px] text-indigo-600 block font-bold">{hist.device}</span>
                  </div>
                  <div className="text-right text-slate-500">
                    <span className="block font-mono text-[9px]">{hist.ip}</span>
                    <span className="text-[8.5px] block">{hist.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
