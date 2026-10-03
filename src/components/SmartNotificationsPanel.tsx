import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Info,
  Calendar,
  Volume2,
  Smartphone,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  Award,
  ChevronDown,
  X,
  VolumeX,
  Sparkles,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";

interface SmartNotificationsPanelProps {
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  priority: "Emergency" | "Important" | "Info";
  category: "Weather" | "Market" | "Scheme" | "Pest" | "Health" | "System" | "Social";
  title: string;
  message: string;
  time: string;
  read: boolean;
  smsFallbackTriggered: boolean;
}

export default function SmartNotificationsPanel({ onClose }: SmartNotificationsPanelProps) {
  const [activeTab, setActiveTab] = useState<"active" | "preferences" | "summaries">("active");
  const [filterPriority, setFilterPriority] = useState<"All" | "Emergency" | "Important" | "Info">("All");
  
  // Custom states for preferences
  const [prefPreferredTime, setPrefPreferredTime] = useState<string>("12:00");
  const [prefSMSFallback, setPrefSMSFallback] = useState<boolean>(true);
  const [prefVoiceAloud, setPrefVoiceAloud] = useState<boolean>(false);
  const [prefPestAlerts, setPrefPestAlerts] = useState<boolean>(true);
  const [prefPriceAlerts, setPrefPriceAlerts] = useState<boolean>(true);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "not-1",
      priority: "Emergency",
      category: "Weather",
      title: "🔥 Severe Microclimate Heatwave Alert",
      message: "Sensed temp exceeds 42.5°C in Sector 4B. Biometeorological index hits CRITICAL. Implement standard heavy work limits. Take rest intervals and drink ORS immediately.",
      time: "10 mins ago",
      read: false,
      smsFallbackTriggered: true
    },
    {
      id: "not-2",
      priority: "Emergency",
      category: "Pest",
      title: "🐛 Locust Migration / Early Blight Warning",
      message: "Locust swarm warning issued within a 15km radius of Vijayawada Plains block. Expert pathologists verification completed. Spray organic neem mixture immediately.",
      time: "45 mins ago",
      read: false,
      smsFallbackTriggered: true
    },
    {
      id: "not-3",
      priority: "Important",
      category: "Market",
      title: "📈 Premium Basmati Price Shift",
      message: "Basmati rice spot rate rose to ₹4,850/q (+4.2%). Optimal auction period verified. Active contract buying available.",
      time: "2 hours ago",
      read: false,
      smsFallbackTriggered: false
    },
    {
      id: "not-4",
      priority: "Important",
      category: "Scheme",
      title: "🏛️ Solar Drip Subsidy Closing Soon",
      message: "Government registration deadline closes in 3 days. Complete Aadhaar audit validation in sub-tab immediately to claim 80% funding.",
      time: "4 hours ago",
      read: true,
      smsFallbackTriggered: false
    },
    {
      id: "not-5",
      priority: "Info",
      category: "Health",
      title: "🩺 Wellness Tip: Heat Stress Hydration",
      message: "Keep water bottles out of direct sunlight. Add 1 packet of WHO-approved hydration salts per 500ml water during noon shifts.",
      time: "1 day ago",
      read: true,
      smsFallbackTriggered: false
    },
    {
      id: "not-6",
      priority: "Info",
      category: "System",
      title: "🏆 Achievement Celebration: Water Vanguard",
      message: "Congratulations Eswar! You achieved 88% solar drip dependency, earning the Green Verified verified badge and 150 coop reward tokens.",
      time: "2 days ago",
      read: true,
      smsFallbackTriggered: false
    }
  ]);

  // Handle Mark as Read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Filtered list
  const filteredNotifications = notifications.filter(n => {
    if (filterPriority === "All") return true;
    return n.priority === filterPriority;
  });

  // Text to speech for selected alert
  const speakAlert = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN"; // standard Indian English vocalisation
    window.speechSynthesis.speak(utterance);
    alert("🗣️ Playing Audio Voice Notification aloud via synthesiser.");
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white border-l border-slate-200 z-50 shadow-2xl flex flex-col justify-between animate-slide-in">
      
      {/* Header section */}
      <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30">
            <Bell className="h-5 w-5 text-indigo-400 animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Smart Notifications Hub</h3>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Priority-Based Alerts Queue</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold font-sans">
        {[
          { id: "active", label: "🔔 Alerts List" },
          { id: "preferences", label: "⚙️ Preferences" },
          { id: "summaries", label: "📊 Performance" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 text-center py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === t.id
                ? "border-indigo-600 text-indigo-700 font-extrabold bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* ACTIVE ALERTS TAB */}
        {activeTab === "active" && (
          <div className="space-y-4">
            
            {/* Filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {(["All", "Emergency", "Important", "Info"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer border ${
                    filterPriority === p
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Notifications items */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <span className="text-2xl">🎉</span>
                  <p className="text-xs font-bold text-slate-400">All caught up! No active alerts matching selection.</p>
                </div>
              ) : (
                filteredNotifications.map((not) => (
                  <div
                    key={not.id}
                    className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-2.5 ${
                      not.read ? "bg-white border-slate-150 text-slate-600" : "bg-indigo-50/20 border-indigo-150 text-slate-900"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider ${
                            not.priority === "Emergency"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : not.priority === "Important"
                                ? "bg-orange-100 text-orange-800 border border-orange-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}>
                            {not.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold font-mono">{not.time}</span>
                        </div>
                        <h4 className="font-extrabold text-[11.5px] text-slate-800 mt-1 leading-tight">{not.title}</h4>
                      </div>

                      {/* Text-To-Speech Button */}
                      <button
                        onClick={() => speakAlert(`${not.title}. ${not.message}`)}
                        className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                        title="Read alert aloud"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-[10.5px] leading-relaxed font-semibold text-slate-600">
                      {not.message}
                    </p>

                    {/* Footer indicators */}
                    <div className="flex justify-between items-center border-t pt-2 border-slate-100 text-[9px] font-extrabold uppercase">
                      <div className="flex items-center gap-1 text-slate-400">
                        {not.smsFallbackTriggered ? (
                          <span className="text-rose-600 flex items-center gap-0.5">
                            <Smartphone className="h-3 w-3" /> SMS Sent
                          </span>
                        ) : (
                          <span>In-App Only</span>
                        )}
                      </div>

                      {!not.read ? (
                        <button
                          onClick={() => handleMarkAsRead(not.id)}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                        >
                          ✓ Dismiss
                        </button>
                      ) : (
                        <span className="text-emerald-600">Archived</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* NOTIFICATIONS PREFERENCES TAB */}
        {activeTab === "preferences" && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b pb-1.5">
              Personalized Alert Configurations
            </h4>

            <div className="space-y-4 text-xs font-semibold">
              
              {/* Preferred Time Scheduler (Time-Aware notifications) */}
              <div className="space-y-1 bg-slate-50 border rounded-xl p-3.5">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase block flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-600" /> Optimal Delivery Scheduler
                </span>
                <p className="text-[10px] text-slate-500 leading-normal mb-2">
                  Select a preferred daily window when you are free from active field labor to receive non-critical summaries and agricultural tips.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={prefPreferredTime}
                    onChange={(e) => setPrefPreferredTime(e.target.value)}
                    className="bg-white border text-slate-700 px-2 py-1 rounded text-xs outline-none"
                  />
                  <span className="text-[10px] text-indigo-700 font-bold">
                    (Optimal: 12 PM or 7 PM verified rest times)
                  </span>
                </div>
              </div>

              {/* SMS Fallback Switch */}
              <div className="flex items-center justify-between p-3.5 border rounded-xl bg-slate-50">
                <div className="space-y-0.5 pr-2">
                  <span className="font-extrabold text-slate-700 block text-[11px]">Emergency SMS Fallback</span>
                  <span className="text-[9.5px] text-slate-400 block leading-normal font-normal">
                    When offline, automatically route critical frost or pest outbreak warnings via immediate cellular SMS.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={prefSMSFallback}
                  onChange={(e) => setPrefSMSFallback(e.target.checked)}
                  className="h-4.5 w-4.5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Speech Synthesis Aloud switch */}
              <div className="flex items-center justify-between p-3.5 border rounded-xl bg-slate-50">
                <div className="space-y-0.5 pr-2">
                  <span className="font-extrabold text-slate-700 block text-[11px]">Voice TTS Auto-Broadcast</span>
                  <span className="text-[9.5px] text-slate-400 block leading-normal font-normal">
                    Speak critical alerts aloud in local languages immediately upon receipt (hands-free).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={prefVoiceAloud}
                  onChange={(e) => setPrefVoiceAloud(e.target.checked)}
                  className="h-4.5 w-4.5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Specific Categories toggles */}
              <div className="p-3.5 border rounded-xl space-y-3">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Subscription Categories</span>
                
                <div className="flex justify-between items-center text-[10.5px]">
                  <span>Pest & Disease Alerts</span>
                  <input
                    type="checkbox"
                    checked={prefPestAlerts}
                    onChange={(e) => setPrefPestAlerts(e.target.checked)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center text-[10.5px] border-t pt-2 border-slate-100">
                  <span>Market Spot Price Volatility Alerts</span>
                  <input
                    type="checkbox"
                    checked={prefPriceAlerts}
                    onChange={(e) => setPrefPriceAlerts(e.target.checked)}
                    className="h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SUMMARIES & REPORTS TAB */}
        {activeTab === "summaries" && (
          <div className="space-y-4">
            
            {/* Daily AI tip */}
            <div className="p-3.5 bg-indigo-50 border border-indigo-150 rounded-xl space-y-1 text-indigo-950 font-bold">
              <span className="text-[9px] bg-indigo-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                💡 AI Daily Farming Tip
              </span>
              <p className="text-[11px] font-black text-indigo-900 leading-normal mt-1.5">
                Rotating deep-rooting Basmati Rice with nitrogen-fixing mustard greens in next season's seed planning will naturally reduce urea input costs by 22% while conserving clay moisture.
              </p>
            </div>

            {/* Weekly performance scorecard */}
            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-3 shadow-md">
              <span className="text-[8.5px] text-indigo-400 uppercase font-black block tracking-widest flex items-center gap-1">
                <Award className="h-4 w-4 text-amber-500 animate-spin-slow" /> Weekly performance summary card
              </span>

              <div className="space-y-2 font-mono text-[10.5px]">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Drip Irrigation uptime:</span>
                  <span className="font-bold text-white">98.5% (OPTIMAL)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Total Water Conserved:</span>
                  <span className="font-bold text-emerald-400">12,400 Liters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Carbon Offset Credits:</span>
                  <span className="font-bold text-emerald-400">0.85 tCO2 Verified</span>
                </div>
              </div>

              <div className="p-2 bg-slate-950 text-slate-300 text-[10px] rounded-lg font-semibold italic text-center">
                ✓ "Your farm ranked #4 out of 42 district co-op plots this week."
              </div>
            </div>

            {/* Monthly Report Card */}
            <div className="bg-white border rounded-xl p-4 space-y-3 shadow-xs">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> June Monthly report card
              </span>

              <div className="p-3 bg-slate-50 border rounded-lg text-xs leading-relaxed text-slate-600 font-semibold space-y-1.5">
                <div className="text-slate-800 font-bold flex justify-between">
                  <span>🏆 Grade Assessment:</span>
                  <span className="text-emerald-700 font-extrabold">A+ EXCELLENT</span>
                </div>
                <p>
                  You achieved a <strong>45% chemical substitution rate</strong> and maintained perfect soil nitrogen balance, triggering a co-op ESG credit score upgrade.
                </p>
                <button
                  onClick={() => alert("Downloading June monthly performance scorecard...")}
                  className="text-indigo-600 hover:text-indigo-800 underline text-[10px] font-bold block pt-1"
                >
                  📥 Download June Monthly Report
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Footer message panel */}
      <div className="bg-slate-50 p-4 border-t text-[10.5px] leading-relaxed text-slate-400 font-semibold text-center">
        *All emergency warnings are synced on-chain to provide immutable public records.
      </div>

    </div>
  );
}
