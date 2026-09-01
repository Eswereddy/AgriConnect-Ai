import React, { useState } from "react";
import {
  MessageSquare,
  Smartphone,
  Send,
  Mail,
  Coins,
  Bell,
  CheckCircle,
  AlertTriangle,
  Flame,
  CloudLightning,
  TrendingUp,
  Loader2,
  Calendar,
  Sparkles
} from "lucide-react";

interface AlertOrchestrationProps {
  onTogglePremiumSms?: (isActive: boolean) => void;
}

export const AlertOrchestration: React.FC<AlertOrchestrationProps> = ({ onTogglePremiumSms }) => {
  const [channel, setChannel] = useState<"sms" | "whatsapp" | "email">("sms");
  const [targetContact, setTargetContact] = useState<string>("+91 98765 43210");
  const [isSmsSubscribed, setIsSmsSubscribed] = useState<boolean>(false);
  
  // Custom templates
  const [alertType, setAlertType] = useState<"weather" | "price" | "scheme" | "order">("weather");
  
  // Simulation states
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentAlerts, setSentAlerts] = useState<Array<any>>([]);
  const [activeMockup, setActiveMockup] = useState<any>(null);

  // Dynamic message template generator
  const getTemplateContent = (type: string) => {
    switch (type) {
      case "weather":
        return {
          title: "🚨 SEVERE WEATHER HAZARD WARNING",
          body: "IMD Alert: Radiative frost and heavy precipitation expected in Punjab Block 4 in the next 24 hrs. Cover high-yield seedlings and suspend nitrogen spraying.",
          meta: "Twilio Broadcast Route • Priority 1"
        };
      case "price":
        return {
          title: "🌾 DAILY MANDI PRICE RECONCILIATION",
          body: "AgriConnect APMC Update: Basmati Rice Grade-A has peaked at ₹68,500/ton in Khanna Mandi (Up 4%). Recommended selling window is OPEN for the next 48 hours.",
          meta: "WhatsApp Business API • Automated NCDEX Sync"
        };
      case "scheme":
        return {
          title: "📅 GOVERNMENT SUBSIDY DEADLINE INCOMING",
          body: "Reminder: Only 7 days remaining to apply for the Solar-Powered Deep Well Submersible Pump subsidy (80% funding). Submit DigiLocker KYC now.",
          meta: "SendGrid Campaign • Transactional Email Engine"
        };
      case "order":
        return {
          title: "📦 ORDER LOGISTICS DISPATCH",
          body: "Shipment update for Lot-982: 4,200kg Basmati Rice has departed Punjab Hub. Driver: Aarav Sharma. Live cold-chain temperature: 4.2°C. Traceability QR: active.",
          meta: "Webhook Notification • Multi-Channel Delivery"
        };
      default:
        return { title: "", body: "", meta: "" };
    }
  };

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const template = getTemplateContent(alertType);
    
    setTimeout(() => {
      setIsSending(false);
      const newAlert = {
        id: "alert-" + Date.now(),
        channel,
        contact: targetContact,
        type: alertType,
        title: template.title,
        body: template.body,
        meta: template.meta,
        timestamp: new Date().toLocaleTimeString()
      };
      setSentAlerts(prev => [newAlert, ...prev]);
      setActiveMockup(newAlert);
    }, 1500);
  };

  const toggleSmsSub = () => {
    const nextState = !isSmsSubscribed;
    setIsSmsSubscribed(nextState);
    if (onTogglePremiumSms) {
      onTogglePremiumSms(nextState);
    }
  };

  return (
    <div id="alert-orchestrator" className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-emerald-400" /> Multi-Channel Broadcast & Alerts (Twilio)
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            Simulated Twilio SMS, WhatsApp Business API, and SendGrid email notifications delivering critical farm intelligence.
          </p>
        </div>

        {/* Premium SMS Subscription Toggle */}
        <button
          onClick={toggleSmsSub}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
            isSmsSubscribed
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md animate-pulse"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
          }`}
        >
          <Coins className="h-3.5 w-3.5" />
          {isSmsSubscribed ? "Premium SMS (₹50/Mo Active)" : "Enable Premium SMS Subscription"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Broadcast Form */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSendAlert} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-black text-slate-400">1. Select Target Channel</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setChannel("sms"); setTargetContact("+91 98765 43210"); }}
                  className={`py-2 rounded-lg text-[10.5px] font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    channel === "sms" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" /> SMS
                </button>
                <button
                  type="button"
                  onClick={() => { setChannel("whatsapp"); setTargetContact("+91 98765 43210"); }}
                  className={`py-2 rounded-lg text-[10.5px] font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    channel === "whatsapp" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => { setChannel("email"); setTargetContact("farmer.amir@agrifarm.org"); }}
                  className={`py-2 rounded-lg text-[10.5px] font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    channel === "email" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-black text-slate-400">2. Select Notification Template</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "weather", label: "Weather Warning", icon: CloudLightning, color: "text-rose-400 border-rose-950 bg-rose-950/20" },
                  { id: "price", label: "APMC Price Change", icon: TrendingUp, color: "text-emerald-400 border-emerald-950 bg-emerald-950/20" },
                  { id: "scheme", label: "Scheme Deadline", icon: Calendar, color: "text-indigo-400 border-indigo-950 bg-indigo-950/20" },
                  { id: "order", label: "Logistics Dispatch", icon: Smartphone, color: "text-cyan-400 border-cyan-950 bg-cyan-950/20" }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = alertType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAlertType(item.id as any)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        isSelected 
                          ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-md ring-1 ring-emerald-500/20" 
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-black block">{item.label}</span>
                        <span className="text-[9px] text-slate-500 font-semibold block mt-0.5 leading-tight">Click to auto-populate layout payload.</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-black text-slate-400">3. Target Destination (Mobile/Email)</label>
              <input
                type="text"
                value={targetContact}
                onChange={(e) => setTargetContact(e.target.value)}
                placeholder={channel === "email" ? "Enter email address" : "Enter mobile number"}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                required
                disabled={isSending}
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`w-full py-3 rounded-xl font-black uppercase text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                isSending 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  Broadcasting via Twilio Gateway...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-emerald-300" />
                  Transmit Alert Broadcast
                </>
              )}
            </button>
          </form>

          {/* Logs panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
              Live Gateway Telemetry logs
            </span>
            <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 font-mono text-[9px] text-slate-400">
              {sentAlerts.length === 0 ? (
                <p className="text-slate-600 italic">No alerts dispatched this session. Logs idle.</p>
              ) : (
                sentAlerts.map(log => (
                  <div key={log.id} className="flex justify-between items-start gap-2 border-b border-slate-850 pb-1.5">
                    <div>
                      <span className="text-emerald-400 font-bold mr-1.5">[{log.timestamp}]</span>
                      <span className="text-white font-semibold">Sent to {log.contact}</span>
                      <p className="text-slate-500 truncate max-w-[200px] mt-0.5">{log.body}</p>
                    </div>
                    <span className="text-[8px] bg-slate-950 border border-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider shrink-0 mt-0.5">
                      OK: Twilio Standard
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Immersive Mobile Screen Mockups */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center">
          {activeMockup ? (
            <div className="w-[280px] h-[520px] bg-slate-900 rounded-[36px] border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col font-sans">
              {/* Speaker & camera bar */}
              <div className="w-24 h-4.5 bg-slate-800 rounded-b-xl mx-auto flex items-center justify-center relative z-20">
                <span className="h-1 w-8 bg-slate-900 rounded-full" />
                <span className="h-1.5 w-1.5 bg-slate-900 rounded-full ml-1" />
              </div>

              {/* Status bar */}
              <div className="flex justify-between items-center px-5 py-1.5 text-[8px] font-bold text-slate-400 select-none bg-slate-900 border-b border-slate-850">
                <span>08:16 AM</span>
                <span className="flex items-center gap-1">
                  <span>5G LTE</span>
                  <span className="bg-slate-700 h-2 w-3.5 rounded-xs" />
                </span>
              </div>

              {/* Dynamic Header based on channel */}
              {activeMockup.channel === "sms" && (
                <div className="bg-slate-850 p-3 border-b border-slate-800 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                  <div>
                    <h5 className="text-[10px] font-black text-white">Twilio Priority Service</h5>
                    <p className="text-[7.5px] text-slate-400 font-semibold leading-none">Sender ID: AD-AGRCON</p>
                  </div>
                </div>
              )}

              {activeMockup.channel === "whatsapp" && (
                <div className="bg-emerald-950 p-3 border-b border-emerald-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-400 animate-pulse" />
                  <div>
                    <h5 className="text-[10px] font-black text-white">AgriConnect AI Verified</h5>
                    <p className="text-[7.5px] text-emerald-400 font-semibold leading-none">WhatsApp Business Account</p>
                  </div>
                </div>
              )}

              {activeMockup.channel === "email" && (
                <div className="bg-indigo-950 p-3 border-b border-indigo-900 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-400" />
                  <div>
                    <h5 className="text-[10px] font-black text-white">Resend Transact API</h5>
                    <p className="text-[7.5px] text-indigo-400 font-semibold leading-none">sender@alerts.agriconnect.ai</p>
                  </div>
                </div>
              )}

              {/* Message Body Frame */}
              <div className="flex-1 bg-slate-950 p-3.5 overflow-y-auto space-y-3 flex flex-col justify-start">
                <span className="text-[7px] text-slate-600 uppercase font-black text-center tracking-widest block py-1 select-none">
                  Encrypted Payload Delivery Receipt
                </span>

                <div className={`p-3.5 rounded-2xl border text-xs max-w-[90%] space-y-1.5 animate-in slide-in-from-bottom duration-300 ${
                  activeMockup.channel === "whatsapp" 
                    ? "bg-emerald-950/40 border-emerald-900/60 text-slate-100 self-start"
                    : activeMockup.channel === "email"
                      ? "bg-indigo-950/40 border-indigo-900/60 text-slate-100 self-start"
                      : "bg-slate-900 border-slate-800 text-slate-100 self-start"
                }`}>
                  <div className="flex items-center gap-1 border-b border-white/5 pb-1 select-none">
                    {activeMockup.type === "weather" && <AlertTriangle className="h-3 w-3 text-rose-400" />}
                    {activeMockup.type === "price" && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                    {activeMockup.type === "scheme" && <Calendar className="h-3 w-3 text-indigo-400" />}
                    {activeMockup.type === "order" && <Smartphone className="h-3 w-3 text-cyan-400" />}
                    <span className={`text-[8px] font-black uppercase ${
                      activeMockup.type === "weather" ? "text-rose-400" : "text-emerald-400"
                    }`}>{activeMockup.title}</span>
                  </div>
                  <p className="leading-relaxed text-[10px] font-medium text-slate-200">{activeMockup.body}</p>
                  
                  <div className="flex justify-between text-[7px] text-slate-500 font-bold pt-1 select-none">
                    <span>{activeMockup.timestamp}</span>
                    <span className="text-emerald-400 font-black flex items-center gap-0.5">
                      <CheckCircle className="h-2 w-2" /> DELIVERED
                    </span>
                  </div>
                </div>

                {activeMockup.channel === "whatsapp" && (
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-850 text-[9.5px] text-slate-400 self-start max-w-[85%] font-medium">
                    Reply <strong>1</strong> for customized NPK analysis, <strong>2</strong> to talk to AI Doctor.
                  </div>
                )}
              </div>

              {/* Bottom Nav Bar mock */}
              <div className="p-3 bg-slate-900 border-t border-slate-850 text-center select-none">
                <span className="h-1 w-20 bg-slate-700 rounded-full inline-block" />
              </div>
            </div>
          ) : (
            <div className="w-[280px] h-[520px] bg-slate-900 rounded-[36px] border-[6px] border-slate-800 shadow-2xl flex flex-col justify-center items-center p-6 text-center text-slate-500 border-dashed border-slate-700">
              <Smartphone className="h-14 w-14 text-slate-700 animate-bounce" />
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 mt-3">Idle Mobile Screen</p>
              <p className="text-[10px] max-w-[180px] leading-relaxed mt-1">
                Construct and trigger an alert configuration to view its dynamic mobile delivery container rendered on a virtual device.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertOrchestration;
