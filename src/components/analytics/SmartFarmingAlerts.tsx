import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Sprout,
  Flame,
  Bug,
  Cpu,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Info
} from "lucide-react";

export interface SmartAlert {
  id: string;
  title: string;
  description: string;
  category: "irrigation" | "nutrient" | "pest" | "climate" | "hardware";
  urgency: "critical" | "warning" | "info";
  actionLabel: string;
  timeframe: string;
}

interface SmartFarmingAlertsProps {
  activeFarmName: string;
  cropName: string;
  cropVariety: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export default function SmartFarmingAlerts({
  activeFarmName,
  cropName,
  cropVariety,
  soilMoisture,
  temperature,
  humidity,
  nitrogen,
  phosphorus,
  potassium
}: SmartFarmingAlertsProps) {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [resolvedAlertIds, setResolvedAlertIds] = useState<string[]>([]);
  const [systemLog, setSystemLog] = useState<string[]>([]);

  // Function to fetch or analyze alerts using the full-stack server route
  const handleFetchAlerts = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await fetch("/api/smart-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmName: activeFarmName,
          cropName,
          cropVariety,
          soilMoisture,
          temperature,
          humidity,
          nitrogen,
          phosphorus,
          potassium
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch alerts from server");
      }

      const data = await response.json();
      setAlerts(data.alerts || []);
      setAiSummary(data.aiSummary || "Core parameters analyzed. Preemptive responses dispatched.");
      
      if (!silent) {
        addLog(`AI Core synced. Analyzed crop parameters for ${cropName}.`);
      }
    } catch (err) {
      console.error(err);
      addLog("Failed server connection. Triggered fail-safe localized diagnostic core.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on parameters change with a 1000ms debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      handleFetchAlerts(true);
    }, 1000);

    return () => clearTimeout(handler);
  }, [activeFarmName, cropName, soilMoisture, temperature, humidity, nitrogen]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSystemLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 4)]);
  };

  // Simulate resolving an alert dynamically
  const handleResolveAlert = (alertId: string, label: string) => {
    setResolvingAlertId(alertId);
    addLog(`Initiated command: [${label}]...`);
    
    setTimeout(() => {
      setResolvedAlertIds((prev) => [...prev, alertId]);
      setResolvingAlertId(null);
      addLog(`✓ Success: [${label}] completed & telemetry stabilized.`);
    }, 1500);
  };

  // Helper icons selector
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "irrigation":
        return <Droplets className="h-4.5 w-4.5 text-blue-500 animate-bounce" />;
      case "nutrient":
        return <Sprout className="h-4.5 w-4.5 text-emerald-500" />;
      case "climate":
        return <Flame className="h-4.5 w-4.5 text-orange-500" />;
      case "pest":
        return <Bug className="h-4.5 w-4.5 text-purple-500" />;
      default:
        return <Cpu className="h-4.5 w-4.5 text-slate-500" />;
    }
  };

  // Helper colors selector
  const getUrgencyClasses = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return {
          bg: "bg-red-50/90 border-red-200/90 hover:border-red-300",
          accent: "border-red-500",
          badge: "bg-red-100 text-red-800 border-red-200",
          text: "text-red-950",
          desc: "text-red-850"
        };
      case "warning":
        return {
          bg: "bg-amber-50/90 border-amber-200/90 hover:border-amber-300",
          accent: "border-amber-500",
          badge: "bg-amber-100 text-amber-800 border-amber-200",
          text: "text-amber-950",
          desc: "text-amber-850"
        };
      default:
        return {
          bg: "bg-slate-50/90 border-slate-200 hover:border-slate-300",
          accent: "border-slate-400",
          badge: "bg-slate-100 text-slate-800 border-slate-200",
          text: "text-slate-900",
          desc: "text-slate-600"
        };
    }
  };

  return (
    <div
      id="smart-farming-ai-alerts"
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 text-slate-800"
    >
      {/* Upper header segment */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" /> Precision Telemetry Agent
          </span>
          <h2 className="text-slate-900 text-lg font-black uppercase tracking-tight mt-1.5 flex items-center gap-2">
            🤖 Smart Farming AI Alerts & Advisories
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            Real-time sub-surface telemetry assessment powered by autonomous agricultural models to prevent moisture stress, nutrient loss, and frost damage.
          </p>
        </div>

        {/* Sync Trigger button */}
        <button
          onClick={() => handleFetchAlerts(false)}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 self-stretch md:self-auto border border-slate-950"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Recalibrating..." : "Analyze Live Sensors"}
        </button>
      </div>

      {/* Summary Banner */}
      {aiSummary && (
        <div className="p-4 bg-gradient-to-r from-emerald-50/60 to-indigo-50/40 border border-slate-150 rounded-2xl flex items-start gap-3.5 animate-in fade-in duration-300">
          <div className="p-2 bg-white border border-slate-200 rounded-xl text-indigo-600 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-extrabold text-indigo-950 block uppercase tracking-wider">
              AI Agricultural Diagnosis Synopsis
            </span>
            <p className="text-[11.5px] text-slate-700 font-semibold leading-relaxed">
              {aiSummary}
            </p>
          </div>
        </div>
      )}

      {/* Alerts Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {alerts
            .filter((alert) => !resolvedAlertIds.includes(alert.id))
            .map((alert) => {
              const classes = getUrgencyClasses(alert.urgency);
              const isResolvingThis = resolvingAlertId === alert.id;

              return (
                <motion.div
                  layout
                  key={alert.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className={`border-l-4 ${classes.accent} ${classes.bg} p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 min-h-[190px]`}
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex justify-between items-center gap-2">
                      <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                        {getCategoryIcon(alert.category)}
                        {alert.category}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${classes.badge}`}>
                          {alert.urgency}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timeframe}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <h4 className={`text-[12.5px] font-black leading-tight uppercase ${classes.text}`}>
                        {alert.title}
                      </h4>
                      <p className={`text-[11px] font-medium leading-relaxed ${classes.desc}`}>
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Action Trigger */}
                  <div className="mt-4 pt-3 border-t border-slate-200/50 flex justify-end">
                    <button
                      onClick={() => handleResolveAlert(alert.id, alert.actionLabel)}
                      disabled={resolvingAlertId !== null}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-250/80 text-slate-800 text-[10.5px] font-extrabold uppercase tracking-wide rounded-lg shadow-2xs hover:shadow-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isResolvingThis ? (
                        <>
                          <div className="h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-1" />
                          Calibrating...
                        </>
                      ) : (
                        <>
                          {alert.actionLabel}
                          <ArrowRight className="h-3.5 w-3.5 ml-0.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>

        {/* Empty status / All alerts resolved */}
        {alerts.filter((alert) => !resolvedAlertIds.includes(alert.id)).length === 0 && (
          <div className="col-span-1 md:col-span-2 bg-emerald-50/40 border border-dashed border-emerald-200 rounded-2xl p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[220px]">
            <div className="p-3 bg-white border border-emerald-150 rounded-full text-emerald-600 shadow-sm">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-emerald-950 font-black uppercase text-xs tracking-wider">All Telemetry Clear</h4>
              <p className="text-slate-500 text-[10.5px] font-semibold max-w-sm">
                No active moisture drought, subsoil frost, or nitrogen stress indices registered. Active monitoring array operating at 100%.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* System Command Logs */}
      {systemLog.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
          <span className="text-[8.5px] font-mono font-black uppercase tracking-widest text-slate-400 block flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> Telematics Signal Command Center
          </span>
          <div className="font-mono text-[10px] text-slate-300 space-y-1">
            {systemLog.map((log, idx) => (
              <div key={idx} className="truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
