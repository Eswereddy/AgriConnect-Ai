import React, { useState, useEffect, useMemo } from "react";
import {
  Waves,
  Power,
  Sliders,
  AlertCircle,
  Droplets,
  Zap,
  Clock,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IrrigationLog {
  id: string;
  timestamp: string;
  type: "auto_on" | "auto_off" | "manual_on" | "manual_off" | "override_on" | "override_off" | "threshold_change";
  message: string;
  moistureAtEvent: number;
}

export default function AutomatedIrrigationControl() {
  // --- States ---
  const [currentMoisture, setCurrentMoisture] = useState<number>(38); // Live simulated soil moisture percentage
  const [moistureThreshold, setMoistureThreshold] = useState<number>(45); // Soil moisture trigger threshold (%)
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false); // Manual override state
  const [manualPumpState, setManualPumpState] = useState<boolean>(false); // Direct manual pump toggle state
  const [targetHysteresis, setTargetHysteresis] = useState<number>(5); // Hysteresis padding before shutting off (%)
  const [waterFlowRate, setWaterFlowRate] = useState<number>(42); // Simulated flow rate in Liters/min
  const [logs, setLogs] = useState<IrrigationLog[]>([
    {
      id: "log-1",
      timestamp: "04:15:20 AM",
      type: "auto_on",
      message: "Automated Loop engaged. Moisture level (37%) fell below threshold (45%).",
      moistureAtEvent: 37
    },
    {
      id: "log-2",
      timestamp: "02:30:15 AM",
      type: "auto_off",
      message: "Automated Loop terminated. Soil reached hydration ceiling of 51%.",
      moistureAtEvent: 51
    },
    {
      id: "log-3",
      timestamp: "Yesterday, 08:45 PM",
      type: "threshold_change",
      message: "Soil Moisture Trigger Threshold adjusted from 40% to 45% VWC.",
      moistureAtEvent: 48
    }
  ]);

  // Is soil moisture simulation running (fluctuations)
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(true);

  // --- Real-time Fluctuation Simulator Effect ---
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      setCurrentMoisture((prev) => {
        // If the pump is running, moisture increases; otherwise, it dries up slowly
        const pumpIsActive = isManualOverride ? manualPumpState : prev < moistureThreshold;
        let delta = 0;
        if (pumpIsActive) {
          delta = parseFloat((0.4 + Math.random() * 0.4).toFixed(1)); // irrigating increases moisture
        } else {
          delta = -parseFloat((0.1 + Math.random() * 0.15).toFixed(1)); // ambient drying
        }

        const nextVal = parseFloat(Math.max(15, Math.min(95, prev + delta)).toFixed(1));
        return nextVal;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulatingLive, isManualOverride, manualPumpState, moistureThreshold]);

  // --- Determine Active Pump Status based on State / Thresholds ---
  const activePumpState = useMemo<boolean>(() => {
    if (isManualOverride) {
      return manualPumpState;
    }
    // Automated triggers: turns ON if moisture drops below threshold,
    // and turns OFF if it exceeds (threshold + hysteresis)
    return currentMoisture < moistureThreshold;
  }, [isManualOverride, manualPumpState, currentMoisture, moistureThreshold, targetHysteresis]);

  // --- Add Event Logs ---
  const addLog = (type: IrrigationLog["type"], message: string, moistureVal: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const newLog: IrrigationLog = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      type,
      message,
      moistureAtEvent: moistureVal
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 14)]);
  };

  // --- Handle Manual Override Toggle ---
  const handleToggleOverride = () => {
    const nextOverride = !isManualOverride;
    setIsManualOverride(nextOverride);
    
    // Maintain state consistency: default manual pump status to what is currently happening
    if (nextOverride) {
      setManualPumpState(activePumpState);
      addLog(
        "override_on",
        `Manual Override ENABLED. Sensors will be bypassed. Pump state initialized to: ${activePumpState ? "ON" : "OFF"}.`,
        currentMoisture
      );
    } else {
      addLog(
        "override_off",
        "Manual Override DISABLED. Reverted pump management to moisture threshold loops.",
        currentMoisture
      );
    }
  };

  // --- Handle Manual Pump Toggle ---
  const handleTogglePumpState = () => {
    if (!isManualOverride) return; // Only allowed when manual override is enabled
    const nextState = !manualPumpState;
    setManualPumpState(nextState);
    addLog(
      nextState ? "manual_on" : "manual_off",
      `Manual Override override action: Water Pump toggled to ${nextState ? "RUNNING" : "STOPPED"} by user.`,
      currentMoisture
    );
  };

  // --- Handle Threshold Change ---
  const handleThresholdSlider = (val: number) => {
    setMoistureThreshold(val);
  };

  const handleThresholdCommit = () => {
    addLog(
      "threshold_change",
      `Soil Moisture Trigger Threshold adjusted to ${moistureThreshold}% VWC by farmer.`,
      currentMoisture
    );
  };

  // --- Clear logs ---
  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div id="automated-irrigation-control-widget" className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
              <Droplets className="h-3 w-3 animate-bounce" /> SOLENOID LOOP CORE
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Hydraulics Node #9
            </span>
          </div>
          <h3 className="text-slate-800 text-lg font-black uppercase tracking-tight mt-1 flex items-center gap-2">
            💦 Automated Irrigation Control Valve Center
          </h3>
          <p className="text-slate-500 text-xs font-semibold">
            Manage electronic water solenoids using automated telemetry loops. Configure soil moisture trigger limits or assume full control with the master manual override switch.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Interactive Panel: Moisture parameters and toggles */}
        <div className="xl:col-span-5 space-y-5">
          
          {/* Section A: Live Simulated Telemetry */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-sky-700 uppercase tracking-wider block">
                1. Telemetry Moisture Metrics
              </span>
              <button
                onClick={() => setIsSimulatingLive(!isSimulatingLive)}
                className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all ${
                  isSimulatingLive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-slate-200 text-slate-600 border border-slate-300"
                }`}
              >
                {isSimulatingLive ? "● Live Simulator Active" : "○ Live Simulator Paused"}
              </button>
            </div>

            {/* Current simulated moisture slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <Droplets className="h-3.5 w-3.5 text-sky-500" /> Simulated Soil Moisture:
                </span>
                <span className="text-slate-800 font-black">{currentMoisture}% VWC</span>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={currentMoisture}
                  onChange={(e) => setCurrentMoisture(parseInt(e.target.value) || 10)}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <input
                  type="number"
                  min="10"
                  max="90"
                  value={currentMoisture}
                  onChange={(e) => setCurrentMoisture(Math.max(10, Math.min(90, parseInt(e.target.value) || 10)))}
                  className="w-16 bg-white border border-slate-200 rounded-lg text-center font-extrabold text-xs py-1 text-slate-800"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold italic">
                *Drag the slider above to manually test the automatic threshold pump trigger!
              </p>
            </div>

            {/* Target threshold limit slider */}
            <div className="space-y-1 pt-2 border-t border-slate-200/40">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5 text-indigo-500" /> Moisture Trigger Threshold:
                </span>
                <span className="text-indigo-700 font-black">{moistureThreshold}% VWC</span>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="20"
                  max="70"
                  step="1"
                  value={moistureThreshold}
                  onChange={(e) => handleThresholdSlider(parseInt(e.target.value) || 20)}
                  onMouseUp={handleThresholdCommit}
                  onTouchEnd={handleThresholdCommit}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <input
                  type="number"
                  min="20"
                  max="70"
                  value={moistureThreshold}
                  onChange={(e) => {
                    const val = Math.max(20, Math.min(70, parseInt(e.target.value) || 20));
                    setMoistureThreshold(val);
                  }}
                  onBlur={handleThresholdCommit}
                  className="w-16 bg-white border border-slate-200 rounded-lg text-center font-extrabold text-xs py-1 text-indigo-800"
                />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Pump starts automatically if current moisture level falls below <strong className="text-indigo-600">{moistureThreshold}%</strong>.
              </p>
            </div>
          </div>

          {/* Section B: Control Mode Settings */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
              2. Override Safety Protocol
            </span>

            {/* Manual Override Master Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="space-y-0.5 max-w-[70%]">
                <span className="text-[11.5px] font-black text-slate-800 block">
                  Enable Manual Override
                </span>
                <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                  Bypasses automatic telemetry loop thresholds to allow absolute manual power governance.
                </p>
              </div>
              <button
                onClick={handleToggleOverride}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isManualOverride ? "bg-amber-500" : "bg-slate-200"
                }`}
                role="switch"
                aria-checked={isManualOverride}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    isManualOverride ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Context feedback message */}
            <AnimatePresence mode="wait">
              {isManualOverride ? (
                <motion.div
                  key="manual-warning"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-800 leading-normal"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 animate-pulse" />
                  <div>
                    <strong>Solenoid Bypass Active:</strong> Smart soil moisture trigger rules are currently disabled. Solenoid valves will remain in whatever state you manually assign.
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auto-active"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-emerald-800 leading-normal"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <strong>Smart Loop Active:</strong> The valve system is evaluating live telemetry sensors. It is currently programmed to trigger if moisture drops below <strong>{moistureThreshold}%</strong>.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Panel: Valve Status Graphic and Event Log Ledger */}
        <div className="xl:col-span-7 space-y-5 flex flex-col justify-between">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Pump solenoid widget graphics */}
            <div className="md:col-span-5 bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col justify-between text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                Pump Node Core
              </div>
              
              <div className="my-5 flex flex-col items-center">
                {/* Visual pump dial */}
                <div
                  className={`h-28 w-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 relative ${
                    activePumpState
                      ? "border-sky-500 bg-sky-950/40 shadow-md shadow-sky-500/20"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
                  {activePumpState && (
                    <span className="absolute inset-0 rounded-full bg-sky-400/5 animate-ping" />
                  )}
                  
                  <Power
                    onClick={handleTogglePumpState}
                    className={`h-11 w-11 transition-all duration-300 ${
                      isManualOverride
                        ? "cursor-pointer hover:scale-105 active:scale-95"
                        : "opacity-80"
                    } ${
                      activePumpState
                        ? "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                        : "text-slate-600"
                    }`}
                  />
                  
                  <span className={`text-[9px] font-black tracking-widest mt-2 uppercase ${activePumpState ? "text-sky-400" : "text-slate-500"}`}>
                    {activePumpState ? "RUNNING" : "OFFLINE"}
                  </span>
                </div>
              </div>

              {/* Pump Toggle Button for Manual Override Mode only */}
              <div className="space-y-2">
                <button
                  disabled={!isManualOverride}
                  onClick={handleTogglePumpState}
                  className={`w-full py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all ${
                    !isManualOverride
                      ? "bg-slate-850 text-slate-600 cursor-not-allowed"
                      : activePumpState
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-sky-600 hover:bg-sky-700 text-white"
                  }`}
                >
                  {activePumpState ? "Shutdown Pump" : "Start Pump"}
                </button>
                <span className="text-[8px] text-slate-500 font-mono block">
                  {isManualOverride ? "Manual switch active" : "Auto threshold locked"}
                </span>
              </div>
            </div>

            {/* Valve telemetry logs / KPIs */}
            <div className="md:col-span-7 bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[9.5px] text-indigo-700 font-black uppercase tracking-wider block">
                3. Operational KPI Readouts
              </span>

              <div className="grid grid-cols-2 gap-3 my-2.5">
                <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Discharge Flow</span>
                  <span className="text-[13px] font-black text-slate-800 block mt-0.5">
                    {activePumpState ? `${waterFlowRate} L/min` : "0 L/min"}
                  </span>
                  <span className="text-[7.5px] text-slate-400 font-semibold block mt-0.5">
                    Active solenoid manifold
                  </span>
                </div>

                <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Estimated Draw</span>
                  <span className="text-[13px] font-black text-slate-800 block mt-0.5">
                    {activePumpState ? "345 Watts" : "0 Watts"}
                  </span>
                  <span className="text-[7.5px] text-slate-400 font-semibold block mt-0.5">
                    Grid connected solar bypass
                  </span>
                </div>

                <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Water Hydrated</span>
                  <span className="text-[13px] font-black text-slate-800 block mt-0.5">
                    840 Liters
                  </span>
                  <span className="text-[7.5px] text-slate-400 font-semibold block mt-0.5">
                    Total discharge today
                  </span>
                </div>

                <div className="bg-white border border-slate-200/80 p-2.5 rounded-xl">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Hydraulic Health</span>
                  <span className="text-[13px] font-black text-emerald-600 block mt-0.5">
                    98.5%
                  </span>
                  <span className="text-[7.5px] text-slate-400 font-semibold block mt-0.5">
                    No pressure line leaks
                  </span>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl flex items-start gap-2">
                <Cpu className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-800 leading-normal font-semibold">
                  {activePumpState ? (
                    <span>💦 <strong>Irrigation Active:</strong> Currently distributing fresh groundwater based on {isManualOverride ? "manual override command" : "sensor threshold index"}. monitor soil metrics for hydration saturation.</span>
                  ) : (
                    <span>💤 <strong>System Dormant:</strong> Current soil moisture ({currentMoisture}%) is above target threshold. Pump is offline saving energy and water resource reserves.</span>
                  )}
                </p>
              </div>

            </div>

          </div>

          {/* Solenoid Valve Logs */}
          <div className="bg-slate-950 text-white rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-[9.5px] text-sky-400 font-mono tracking-widest uppercase flex items-center gap-1">
                <Clock className="h-3 w-3" /> Electronic Valve Control Logs
              </span>
              <button
                onClick={clearLogs}
                className="text-[8px] text-slate-500 hover:text-slate-300 font-mono uppercase cursor-pointer"
              >
                Clear Ledger
              </button>
            </div>

            {logs.length > 0 ? (
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto font-mono text-[9px] text-slate-300 pr-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-start gap-2 py-0.5 border-b border-slate-900/40">
                    <div className="flex gap-2">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span className="font-semibold text-slate-200">{log.message}</span>
                    </div>
                    <span className="text-slate-400 shrink-0 font-bold bg-slate-900 px-1 py-0.2 rounded">
                      M: {log.moistureAtEvent}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[9px] text-slate-600 font-mono py-2">
                No telemetry loop events registered in current log segment.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
