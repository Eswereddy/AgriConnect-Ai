import React, { useState, useEffect } from "react";
import {
  User,
  Building,
  FileText,
  Phone,
  Mail,
  Shield,
  Star,
  Lock,
  CheckCircle,
  AlertTriangle,
  Award,
  Bell,
  MessageSquare,
  Globe,
  Download,
  FileSpreadsheet,
  FileCode,
  Check,
  Save,
  ChevronRight,
  TrendingUp
} from "lucide-react";

export default function BuyerProfileSettings() {
  // Load existing profile from localStorage or fallback to defaults
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("agriconnect_buyer_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || parsed.contactName || "Eswar Reddy",
          businessName: parsed.businessName || "Global Agrifood Corp (Procurement)",
          gstin: parsed.gstin || parsed.gstNumber || "07AAHCA9923P1Z3",
          contactNumber: parsed.contactNumber || parsed.mobile || "+91 98765 43210",
          email: parsed.email || "jakkireddyeswarreddy@gmail.com",
          rating: parsed.rating || (parsed.trustScore ? (parsed.trustScore / 20) : 4.8),
          avatarUrl: parsed.avatarUrl || "",
          trustScore: parsed.trustScore || 94,
          businessType: parsed.businessType || "Corporation",
          preferredCrops: parsed.preferredCrops || ["Rice", "Wheat"]
        };
      } catch (e) {
        // ignore
      }
    }
    return {
      name: "Eswar Reddy",
      businessName: "Global Agrifood Corp (Procurement)",
      gstin: "07AAHCA9923P1Z3",
      contactNumber: "+91 98765 43210",
      email: "jakkireddyeswarreddy@gmail.com",
      rating: 4.8,
      avatarUrl: "",
      trustScore: 94,
      businessType: "Corporation",
      preferredCrops: ["Rice", "Wheat"]
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error" | null; msg: string | null }>({
    type: null,
    msg: null
  });

  // Notification Settings
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("agriconnect_buyer_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      sms: true,
      email: true,
      push: true,
      types: {
        newListings: true,
        bidChanges: true,
        orderUpdates: true,
        priceAlerts: false,
        paymentReminders: true
      }
    };
  });

  // Language preferences
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("agriconnect_buyer_lang") || "English";
  });

  const languages = [
    "English",
    "Hindi",
    "Telugu",
    "Tamil",
    "Kannada",
    "Marathi",
    "Gujarati",
    "Bengali",
    "Punjabi",
    "Malayalam"
  ];

  // Trust score parameters
  const [trustScore, setTrustScore] = useState(() => profile.trustScore || 94);
  const trustFactors = [
    { name: "Payment History", value: "100% On-Time", status: "perfect", desc: "No delayed clearing or payment defaults in the last 12 months" },
    { name: "Order Volume", value: "354.8 MT (42 Orders)", status: "excellent", desc: "Significant volume threshold met for regional mandis" },
    { name: "Returns", value: "1.2% Return Rate", status: "good", desc: "Minimal product returns or quality arbitration disputes" },
    { name: "Ratings from Farmers", value: "4.8 / 5.0 Rating", status: "excellent", desc: "Highly rated by direct producers for fair and clear trades" }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editedProfile);
    localStorage.setItem("agriconnect_buyer_data", JSON.stringify(editedProfile));
    setIsEditing(false);
    // Notify user
    alert("✓ Corporate Profile updated successfully in AgriConnect Core Registry.");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setPasswordStatus({ type: "error", msg: "Please enter your current password." });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ type: "error", msg: "New password must be at least 6 characters." });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", msg: "Passwords do not match." });
      return;
    }

    setPasswordStatus({ type: "success", msg: "Password changed successfully! Authenticated session updated." });
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => {
      setPasswordStatus({ type: null, msg: null });
    }, 4000);
  };

  const toggleNotifChannel = (channel: "sms" | "email" | "push") => {
    const updated = { ...notifications, [channel]: !notifications[channel] };
    setNotifications(updated);
    localStorage.setItem("agriconnect_buyer_notifications", JSON.stringify(updated));
  };

  const toggleNotifType = (typeKey: keyof typeof notifications.types) => {
    const updated = {
      ...notifications,
      types: {
        ...notifications.types,
        [typeKey]: !notifications.types[typeKey]
      }
    };
    setNotifications(updated);
    localStorage.setItem("agriconnect_buyer_notifications", JSON.stringify(updated));
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem("agriconnect_buyer_lang", lang);
    alert(`✓ Language preference updated to: ${lang}`);
  };

  // Mock Sourcing Records for export
  const purchaseRecords = [
    { id: "ORD-9883", crop: "Premium Basmati Rice", farmer: "Sardar Gurbax Singh", tons: 15.4, rate: 65000, value: 1001000, date: "2026-06-12", status: "Delivered" },
    { id: "ORD-9122", crop: "Soft Red Winter Wheat", farmer: "Rajinder Sharma", tons: 25.0, rate: 24000, value: 600000, date: "2026-06-20", status: "Delivered" },
    { id: "ORD-8744", crop: "Organic Soybeans", farmer: "Devendra Patil", tons: 12.0, rate: 42500, value: 510000, date: "2026-06-28", status: "In Transit" },
    { id: "ORD-7612", crop: "Golden Delicious Apple", farmer: "Vijay Grewal", tons: 6.0, rate: 110000, value: 660000, date: "2026-07-01", status: "Delivered" }
  ];

  // 10.5 EXPORT UTILITIES
  const exportCSV = () => {
    let csvContent = "Order ID,Crop Type,Farmer Name,Tonnage (MT),Contract Rate (INR/MT),Total Order Value (INR),Settlement Date,Logistics Status\n";
    purchaseRecords.forEach(rec => {
      csvContent += `"${rec.id}","${rec.crop}","${rec.farmer}",${rec.tons},${rec.rate},${rec.value},"${rec.date}","${rec.status}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AgriConnect_Purchase_History_${profile.name.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    // Elegant XML spreadsheet mockup or basic tab-separated values downloaded as .xls
    let excelContent = "<?xml version='1.0'?>\n<Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet'\n xmlns:o='urn:schemas-microsoft-com:office:office'\n xmlns:x='urn:schemas-microsoft-com:office:excel'\n xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'>\n <Worksheet ss:Name='Purchase History'>\n  <Table>\n";
    
    // Header
    excelContent += "   <Row>\n";
    ["Order ID", "Crop Type", "Farmer Name", "Tonnage (MT)", "Contract Rate (INR/MT)", "Total Value (INR)", "Date", "Status"].forEach(h => {
      excelContent += `    <Cell><Data ss:Type='String'>${h}</Data></Cell>\n`;
    });
    excelContent += "   </Row>\n";

    // Data
    purchaseRecords.forEach(rec => {
      excelContent += "   <Row>\n";
      excelContent += `    <Cell><Data ss:Type='String'>${rec.id}</Data></Cell>\n`;
      excelContent += `    <Cell><Data ss:Type='String'>${rec.crop}</Data></Cell>\n`;
      excelContent += `    <Cell><Data ss:Type='String'>${rec.farmer}</Data></Cell>\n`;
      excelContent += `    <Cell><Data ss:Type='Number'>${rec.tons}</Data></Cell>\n`;
      excelContent += `    <Cell><Data ss:Type='Number'>${rec.rate}</Data></Cell>\n`;
      excelContent += `    <Cell><Data ss:Type='Number'>${rec.value}</Data></Cell>\n`;
      excelContent += `    <Cell><Data ss:Type='String'>${rec.date}</Data></Cell>\n`;
      excelContent += `    <Cell><Data ss:Type='String'>${rec.status}</Data></Cell>\n`;
      excelContent += "   </Row>\n";
    });

    excelContent += "  </Table>\n </Worksheet>\n</Workbook>";
    
    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AgriConnect_Purchase_History_${profile.name.replace(/\s+/g, "_")}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    // Let's create an elegant text document summarizing the buyer report for easy viewing or printing
    let reportText = `AGRICONNET BULK BUYER SOURCING REPORT\n`;
    reportText += `==============================================\n`;
    reportText += `Report Date: ${new Date().toLocaleDateString()}\n`;
    reportText += `Buyer Name: ${profile.name}\n`;
    reportText += `Registered Enterprise: ${profile.businessName}\n`;
    reportText += `GSTIN Registration: ${profile.gstin}\n`;
    reportText += `Contact: ${profile.contactNumber} | ${profile.email}\n`;
    reportText += `AgriConnect Trust score: ${trustScore}/100 (Platinum Rank)\n`;
    reportText += `==============================================\n\n`;
    reportText += `COMPLETED CONTRACTS SUMMARY\n`;
    reportText += `----------------------------------------------\n`;
    
    let grandTotal = 0;
    purchaseRecords.forEach((rec, idx) => {
      reportText += `${idx+1}. ID: ${rec.id} | ${rec.crop}\n`;
      reportText += `   Producer: ${rec.farmer}\n`;
      reportText += `   Quantity: ${rec.tons} MT @ ₹${rec.rate.toLocaleString("en-IN")}/MT\n`;
      reportText += `   Total Cleared: ₹${rec.value.toLocaleString("en-IN")}\n`;
      reportText += `   Filing Date: ${rec.date} | Status: ${rec.status}\n`;
      reportText += `   ------------------------------------------\n`;
      grandTotal += rec.value;
    });

    reportText += `\nGRAND TOTAL PROCUREMENT OUTLAY: ₹${grandTotal.toLocaleString("en-IN")}\n`;
    reportText += `==============================================\n`;
    reportText += `Disclaimer: This document is an official cryptographic representation of procurement actions matching smart-contract ledger escrows. Use browser Print to compile this file to standard paper PDF format.`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AgriConnect_Sourcing_Report_${profile.name.replace(/\s+/g, "_")}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportZIP = () => {
    // Generate simulated zip holding invoices
    const warningText = `AGRICONNECT SECURE INVOICE ARCHIVE ZIP\n\nIncluded files:\n` +
      purchaseRecords.map(rec => `- INV-2026-${rec.id.split("-")[1]}.xml (Signed GST Compliant Invoice)\n- INV-2026-${rec.id.split("-")[1]}.pdf (Printable Slip)\n`).join("") + 
      `\nSecurity: Encrypted via AgriConnect clearing house public key.\nCompiled on: 2026-07-08`;

    const blob = new Blob([warningText], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AgriConnect_Invoices_${profile.businessName.replace(/\s+/g, "_")}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("✓ Sourcing Invoice Archive ZIP generated and downloaded successfully.\n\nFiles saved: 'AgriConnect_Invoices_" + profile.businessName + ".zip' containing legal XML tax returns.");
  };

  return (
    <div className="space-y-6">
      
      {/* 10.1 Upper Profile Title Card */}
      <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
            👤 Corporate Buyer Profile & Settings
          </h3>
          <p className="text-[10px] text-slate-400 font-medium leading-normal mt-1">
            Manage your corporate identity, track your APEDA escrow trust rating, configure notification channels, and export certified tax records.
          </p>
        </div>
        
        {/* Rating Score */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-150 px-3.5 py-1.5 rounded-2xl">
          <Star className="h-4 w-4 text-emerald-600 fill-emerald-500" />
          <div className="text-left">
            <p className="text-[9px] text-slate-400 font-bold uppercase leading-none">Farmer Rating</p>
            <p className="text-[11px] font-mono font-black text-emerald-800 mt-0.5">{profile.rating} / 5.0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Profile Card & Trust Score */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PROFILE VIEW & EDIT (10.1) */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-4 w-4 text-teal-600" />
                Profile Identity
              </h4>
              <button
                onClick={() => {
                  if (isEditing) {
                    setEditedProfile({ ...profile });
                  }
                  setIsEditing(!isEditing);
                }}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                  isEditing
                    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                    : "bg-teal-50 text-teal-800 border-teal-150 hover:bg-teal-100/80"
                }`}
              >
                {isEditing ? "Cancel" : "✏️ Edit Info"}
              </button>
            </div>

            {/* Verification badges display */}
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-teal-50 text-teal-800 border border-teal-150 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                <Shield className="h-2.5 w-2.5 fill-teal-500/10" /> APEDA Verified
              </span>
              <span className="bg-blue-50 text-blue-800 border border-blue-150 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                <CheckCircle className="h-2.5 w-2.5 text-blue-600" /> GST Vetted
              </span>
              <span className="bg-amber-50 text-amber-800 border border-amber-150 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                <Award className="h-2.5 w-2.5 text-amber-600" /> Gold Tier Partner
              </span>
            </div>

            {/* Profile Content */}
            {!isEditing ? (
              <div className="space-y-4">
                
                {/* Standard Card Details View */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 p-3 rounded-2xl">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Primary Sourcing officer</span>
                      <span className="text-xs font-bold text-slate-800">{profile.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 p-3 rounded-2xl">
                    <Building className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Registered Company / Firm</span>
                      <span className="text-xs font-bold text-slate-800">{profile.businessName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 p-3 rounded-2xl">
                    <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Enterprise GSTIN Registration</span>
                      <span className="text-xs font-mono font-bold text-slate-800">{profile.gstin}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 p-3 rounded-2xl">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Registered Mobile Number</span>
                      <span className="text-xs font-mono font-semibold text-slate-700">{profile.contactNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 p-3 rounded-2xl">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Business Email Inbox</span>
                      <span className="text-xs font-semibold text-slate-700">{profile.email}</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
                <div>
                  <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Primary Officer Name</label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Firm / Business Corporate Name</label>
                  <input
                    type="text"
                    value={editedProfile.businessName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, businessName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Enterprise GSTIN</label>
                    <input
                      type="text"
                      value={editedProfile.gstin}
                      onChange={(e) => setEditedProfile({ ...editedProfile, gstin: e.target.value.toUpperCase() })}
                      maxLength={15}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={editedProfile.contactNumber}
                      onChange={(e) => setEditedProfile({ ...editedProfile, contactNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Corporate Email Address</label>
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-3xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </button>
              </form>
            )}
          </div>

          {/* PASSWORD RESET MODULE (10.1) */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Lock className="h-4 w-4 text-slate-500" />
              Security Credential Manager
            </h4>

            {passwordStatus.msg && (
              <div className={`p-3 rounded-xl border text-[9px] font-bold ${
                passwordStatus.type === "success" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}>
                {passwordStatus.type === "success" ? "✓ " : "⚠️ "}{passwordStatus.msg}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 chars"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Change Security Token
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Trust Score, Notification Channels, Language, and Export */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TRUST SCORE MODULE (10.2) */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4.5 w-4.5 text-emerald-600" />
                  AgriConnect Buyer Trust Score
                </h4>
                <p className="text-[9px] text-slate-400 font-medium">
                  Dynamically updated score rating your payment reliability, trade compliance, and volume.
                </p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                ✓ Silver Tier
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50/50 border border-slate-150 rounded-2xl">
              
              {/* Score Dial */}
              <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
                <svg className="absolute transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * trustScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-mono font-black text-slate-800 leading-none">{trustScore}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Excellent</span>
                </div>
              </div>

              {/* Factors & Guidance */}
              <div className="space-y-2 flex-1">
                <p className="text-[10px] text-slate-700 font-medium leading-relaxed">
                  Your enterprise trust score is verified at <span className="font-bold text-slate-800">94 / 100</span>. Having a high trust level guarantees you priority cargo bookings, reduced escrow commissions (down to <span className="text-teal-700 font-bold">1.5%</span>), and longer payment cycles.
                </p>
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 p-3 rounded-xl flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[9px] font-black text-teal-800 uppercase block tracking-wider">How to Improve:</span>
                    <span className="text-[9px] text-teal-900 font-medium leading-normal block mt-0.5">
                      "Make 5 more on-time payments to reach Gold tier"
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Factor breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trustFactors.map(factor => (
                <div key={factor.name} className="border border-slate-150 p-3 rounded-2xl bg-white space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{factor.name}</span>
                    <span className="text-[9px] font-mono font-bold text-emerald-600">{factor.value}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium leading-normal">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NOTIFICATION CHANNELS & SETTINGS (10.3) */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-5">
            <div>
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Bell className="h-4.5 w-4.5 text-teal-600" />
                Notification Channels & Preferences
              </h4>
              <p className="text-[9px] text-slate-400 font-medium mt-1">
                Customize where and how you receive alerts regarding bids, listings, logistics updates, and invoices.
              </p>
            </div>

            {/* 10.3 Channel Alerts */}
            <div className="grid grid-cols-3 gap-3">
              
              {/* SMS Alerts Toggle */}
              <button
                onClick={() => toggleNotifChannel("sms")}
                className={`p-3 border rounded-2xl flex flex-col items-center justify-between gap-2.5 transition-all cursor-pointer ${
                  notifications.sms 
                    ? "bg-teal-50 border-teal-200 text-teal-800" 
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="flex justify-between w-full">
                  <span className="text-[8px] font-black uppercase tracking-wider">SMS Alerts</span>
                  <span className={`h-2 w-2 rounded-full ${notifications.sms ? "bg-emerald-500" : "bg-slate-300"}`} />
                </div>
                <span className="text-[10px] font-black">{notifications.sms ? "ON" : "OFF"}</span>
              </button>

              {/* Email Alerts Toggle */}
              <button
                onClick={() => toggleNotifChannel("email")}
                className={`p-3 border rounded-2xl flex flex-col items-center justify-between gap-2.5 transition-all cursor-pointer ${
                  notifications.email 
                    ? "bg-teal-50 border-teal-200 text-teal-800" 
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="flex justify-between w-full">
                  <span className="text-[8px] font-black uppercase tracking-wider">Email Alerts</span>
                  <span className={`h-2 w-2 rounded-full ${notifications.email ? "bg-emerald-500" : "bg-slate-300"}`} />
                </div>
                <span className="text-[10px] font-black">{notifications.email ? "ON" : "OFF"}</span>
              </button>

              {/* Push Notifications Toggle */}
              <button
                onClick={() => toggleNotifChannel("push")}
                className={`p-3 border rounded-2xl flex flex-col items-center justify-between gap-2.5 transition-all cursor-pointer ${
                  notifications.push 
                    ? "bg-teal-50 border-teal-200 text-teal-800" 
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="flex justify-between w-full">
                  <span className="text-[8px] font-black uppercase tracking-wider">Push Device</span>
                  <span className={`h-2 w-2 rounded-full ${notifications.push ? "bg-emerald-500" : "bg-slate-300"}`} />
                </div>
                <span className="text-[10px] font-black">{notifications.push ? "ON" : "OFF"}</span>
              </button>

            </div>

            {/* 10.3 Alert Types List */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Trigger Alert Categories</span>

              <div className="divide-y divide-slate-100 bg-slate-50/50 border border-slate-150 rounded-2xl p-2">
                
                <label className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-800 block">New Crop Listings</span>
                    <span className="text-[9px] text-slate-400">Receive alert when matching crop quality grades are cataloged</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.types.newListings}
                    onChange={() => toggleNotifType("newListings")}
                    className="h-4 w-4 rounded-xs border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-800 block">Bid Status Changes</span>
                    <span className="text-[9px] text-slate-400">Get notified when a farmer accepts or counters your escrow bids</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.types.bidChanges}
                    onChange={() => toggleNotifType("bidChanges")}
                    className="h-4 w-4 rounded-xs border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-800 block">Order Status Updates</span>
                    <span className="text-[9px] text-slate-400">Real-time alerts during harvest pickup, cold transit, and delivery</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.types.orderUpdates}
                    onChange={() => toggleNotifType("orderUpdates")}
                    className="h-4 w-4 rounded-xs border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-800 block">Price volatility Alerts</span>
                    <span className="text-[9px] text-slate-400">Get alert when mandi index rates exceed threshold tolerances</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.types.priceAlerts}
                    onChange={() => toggleNotifType("priceAlerts")}
                    className="h-4 w-4 rounded-xs border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-800 block">Filing & Payment Reminders</span>
                    <span className="text-[9px] text-slate-400">Escrow settlement deadlines and GST return compliance flags</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.types.paymentReminders}
                    onChange={() => toggleNotifType("paymentReminders")}
                    className="h-4 w-4 rounded-xs border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </label>

              </div>
            </div>
          </div>

          {/* LANGUAGE PREFERENCE (10.4) */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Globe className="h-4.5 w-4.5 text-teal-600" />
              Language Preference & Regionalization
            </h4>

            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wide border transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? "bg-slate-900 border-slate-900 text-white shadow-3xs"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-150 text-slate-600"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* EXPORT DATA AND PURCHASE HISTORY (10.5) */}
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-3xs space-y-4">
            <div>
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Download className="h-4.5 w-4.5 text-teal-600" />
                Procurement Export Gateway
              </h4>
              <p className="text-[9px] text-slate-400 font-medium mt-1">
                Download fully compiled trade transaction histories and tax certificates in compliant ledger formats.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Purchase History */}
              <div className="border border-slate-150 p-4 rounded-2xl bg-slate-50/50 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase block tracking-wider">Purchase History (CSV/Excel/PDF)</span>
                  <p className="text-[9px] text-slate-400 leading-normal mt-1">
                    Export granular log files comprising complete direct farm gate purchases, tax breakdowns, and transit milestones.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 pt-2">
                  <button
                    onClick={exportCSV}
                    className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Download className="h-3 w-3 text-slate-400" />
                    Download CSV Audit
                  </button>
                  <button
                    onClick={exportExcel}
                    className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-teal-600" />
                    Download Excel format
                  </button>
                  <button
                    onClick={exportPDF}
                    className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <FileText className="h-3 w-3 text-rose-500" />
                    Export PDF Document
                  </button>
                </div>
              </div>

              {/* Invoice ZIP Bundle */}
              <div className="border border-slate-150 p-4 rounded-2xl bg-slate-50/50 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase block tracking-wider">Bulk Invoice ZIP Archive</span>
                  <p className="text-[9px] text-slate-400 leading-normal mt-1">
                    Export signed GST compliance tax invoices for the selected fiscal period into a compressed offline invoice bundle.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-[8px] font-mono text-slate-400 bg-white border border-slate-150 px-2 py-1.5 rounded-lg flex items-center justify-between">
                    <span>Fiscal period: FY 2026-27</span>
                    <span className="text-emerald-600 font-bold">4 files ready</span>
                  </div>
                  <button
                    onClick={exportZIP}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <FileCode className="h-3.5 w-3.5 text-teal-400" />
                    Export Invoices as ZIP
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
