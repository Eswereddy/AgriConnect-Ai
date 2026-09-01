import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  QrCode,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ShieldAlert,
  Sparkles,
  Cpu,
  History,
  FileSearch,
  Check,
  Send,
  Trash2,
  Info,
  Layers,
  ArrowRight
} from "lucide-react";

// Pre-seeded Equipment with physical hardware IDs
interface EquipmentHardware {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: "Healthy" | "Warning" | "Critical";
  iotAlert: string;
  commonIssues: string[];
  suggestedFix: string;
}

const PRE_SEEDED_HARDWARE: EquipmentHardware[] = [
  {
    id: "equip-1",
    name: "John Deere 5050D Utility Tractor",
    type: "Tractor",
    serialNumber: "HW-JD-5050D-98124",
    status: "Warning",
    iotAlert: "Drive belt slippage detected (14% wear index). Hydraulic valve micro-friction warning.",
    commonIssues: [
      "Drive belt slipping at >1500 RPM",
      "Hydraulic pressure dropping under heavy load",
      "Slight steering lag on left turns"
    ],
    suggestedFix: "Re-tension the primary alternator belt. Replace hydraulic return filter and top off fluid to 85% capacity."
  },
  {
    id: "equip-2",
    name: "Claast Tiger Multi-Crop Combine Harvester",
    type: "Harvester",
    serialNumber: "HW-CT-S8-55219",
    status: "Critical",
    iotAlert: "Acoustic thrashing drum vibration anomaly. Cylindrical speed sensor discrepancy.",
    commonIssues: [
      "Heavy vibration in thrashing drum",
      "RPM speed sensor reporting inconsistent values (+/- 200 RPM)",
      "Straw walker motor operating at elevated temperature"
    ],
    suggestedFix: "Inspect drum cylinder bearings for wear or debris. Calibrate speed sensor gap and clear chaff accumulation from walker bearings."
  },
  {
    id: "equip-3",
    name: "Mahindra Arjun Novo 605 DI Tractor",
    type: "Tractor",
    serialNumber: "HW-MA-605-77312",
    status: "Healthy",
    iotAlert: "All engine and electrical components report healthy telemetry.",
    commonIssues: [
      "Fuel injector clog after low-grade diesel usage",
      "Differential oil level low",
      "Radiator fin dust clogging during dry season tilling"
    ],
    suggestedFix: "Run a high-grade diesel detergent cycle. Clean the radiator fins with medium-pressure compressed air."
  },
  {
    id: "equip-4",
    name: "Solar-Powered Drip Irrigation Pump",
    type: "Pump System",
    serialNumber: "HW-SIP-X3-10294",
    status: "Warning",
    iotAlert: "Solar charge controller thermal throttling. Impeller pressure fluctuation.",
    commonIssues: [
      "Thermal throttling of solar converter at >42°C ambient temperature",
      "Impeller blockage from silt buildup",
      "Solenoid valve 4 failing to open on electronic signal"
    ],
    suggestedFix: "Ensure solar heat sinks are shaded. Clean the primary mesh silt trap. Verify the 12V coil continuity on solenoid valve 4."
  },
  {
    id: "equip-5",
    name: "DJI Agras T40 Drone Intelligence V2",
    type: "Drone",
    serialNumber: "HW-DJI-T40-44910",
    status: "Warning",
    iotAlert: "Nozzle pressure variance on starboard atomizing nozzle. Obstacle avoidance radar signal noise.",
    commonIssues: [
      "Starboard atomizing nozzle clog resulting in uneven liquid dispersal",
      "Rear binocular vision sensor blocked by dust",
      "Slight yaw drift in high crosswinds"
    ],
    suggestedFix: "Disassemble and flush the starboard ultrasonic spray nozzle with clean water. Wipe the binocular sensor lenses with optical microfiber."
  }
];

export interface DiagnosticRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  serialNumber: string;
  reportedIssue: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Awaiting Technician" | "AI Diagnostics Screened" | "Technician Dispatched" | "Resolved";
  scannedAt: string;
  aiTroubleshooting: string;
  notes: string;
}

export default function HardwareQRScanner() {
  // Navigation inside QR Dashboard
  const [activeTab, setActiveTab] = useState<"scan" | "history">("scan");

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Form states
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentHardware | null>(null);
  const [reportedIssue, setReportedIssue] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  // Lists of logged diagnostic requests
  const [requestsList, setRequestsList] = useState<DiagnosticRequest[]>(() => {
    const saved = localStorage.getItem("agri_equipment_diagnostics");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "REQ-1002",
        equipmentId: "equip-1",
        equipmentName: "John Deere 5050D Utility Tractor",
        serialNumber: "HW-JD-5050D-98124",
        reportedIssue: "Drive belt slipping at >1500 RPM",
        priority: "High",
        status: "AI Diagnostics Screened",
        scannedAt: new Date(Date.now() - 3 * 3600000).toLocaleString(),
        aiTroubleshooting: "Re-tension the primary alternator belt. Replace hydraulic return filter and top off fluid.",
        notes: "Slipping occurs mostly during heavy disc tilling. Heard squealing noise."
      }
    ];
  });

  // Save requests to localStorage on change
  useEffect(() => {
    localStorage.setItem("agri_equipment_diagnostics", JSON.stringify(requestsList));
  }, [requestsList]);

  // Start Real Camera Feed
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    setIsScanning(true);
    setScannedCode(null);

    try {
      // Direct access to environment camera if possible, else standard video
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simulate automatic reading success after 2.5 seconds
      setTimeout(() => {
        // Only trigger if camera is still active and scanning
        if (streamRef.current && streamRef.current.active) {
          // Select a random hardware target to populate
          const randomIndex = Math.floor(Math.random() * PRE_SEEDED_HARDWARE.length);
          handleScanSuccess(PRE_SEEDED_HARDWARE[randomIndex]);
        }
      }, 3000);

    } catch (err: any) {
      console.warn("Camera capture failed (expected in sandboxed frames):", err);
      setCameraError(
        "Camera stream blocked or unavailable in frame. Utilizing high-fidelity AI simulation scanner below."
      );
      setIsScanning(false);
    }
  };

  // Stop Camera Feed
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsScanning(false);
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle successful QR detection
  const handleScanSuccess = (hardware: EquipmentHardware) => {
    setScannedCode(hardware.serialNumber);
    setSelectedEquipment(hardware);
    setReportedIssue(hardware.commonIssues[0] || "");
    setPriority(hardware.status === "Critical" ? "Critical" : hardware.status === "Warning" ? "High" : "Medium");
    
    // Stop camera and animate
    stopCamera();
    
    // Alert system log
    console.log(`[QR-Code-Scanner] Read Hardware ID: ${hardware.serialNumber}`);
  };

  // Manual fallback file select / image upload scanning
  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    // Simulate analyzing upload
    setTimeout(() => {
      // Pick based on file name or default to 1st
      const index = file.name.toLowerCase().includes("harvester") ? 1 : 
                    file.name.toLowerCase().includes("pump") ? 3 : 
                    file.name.toLowerCase().includes("drone") ? 4 : 0;
      handleScanSuccess(PRE_SEEDED_HARDWARE[index]);
      setIsScanning(false);
    }, 1200);
  };

  // Submit the Request Form
  const handleSubmitDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    const newRequest: DiagnosticRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      serialNumber: selectedEquipment.serialNumber,
      reportedIssue: reportedIssue,
      priority: priority,
      status: "AI Diagnostics Screened",
      scannedAt: new Date().toLocaleString(),
      aiTroubleshooting: selectedEquipment.suggestedFix,
      notes: additionalNotes
    };

    setRequestsList((prev) => [newRequest, ...prev]);
    
    // Reset form states
    setSelectedEquipment(null);
    setScannedCode(null);
    setReportedIssue("");
    setAdditionalNotes("");
    
    // Switch to history tab to show progress
    setActiveTab("history");
  };

  // Delete logged request
  const handleDeleteRequest = (id: string) => {
    setRequestsList((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div
      id="hardware-qr-diagnostics-scanner"
      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-slate-800"
    >
      {/* Tab Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <QrCode className="h-3.5 w-3.5 text-emerald-600 animate-pulse" /> IoT & Telematics Core
          </span>
          <h2 className="text-slate-900 text-xl font-black uppercase tracking-tight mt-1.5 flex items-center gap-2">
            🚜 Hardware QR Diagnostic System
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            Scan hardware QR plates or serial barcodes to pull instant digital twin diagnostics, compile telematics, and submit certified service logs.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex bg-slate-50 border border-slate-200 rounded-2xl p-1 gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "scan"
                ? "bg-white text-emerald-700 shadow-xs border border-slate-150"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Camera className="h-4 w-4" /> Scanner Console
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
              activeTab === "history"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-150"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="h-4 w-4" /> Service Logs
            {requestsList.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-bounce">
                {requestsList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "scan" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: SCANNER FRAME & MOCK TARGETS (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Scanner Frame Container */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 relative overflow-hidden flex flex-col justify-center items-center min-h-[340px] shadow-lg">
              
              {/* Grid backdrop pattern */}
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Laser beam animation */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-emerald-500/80 shadow-[0_0_15px_#10b981] animate-[bounce_2.5s_infinite] z-10" />
              )}

              {/* Status Indicator */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/75 border border-slate-800 rounded-full px-2.5 py-1 text-[9px] text-slate-300 font-extrabold uppercase tracking-widest">
                <span className={`w-2 h-2 rounded-full ${isScanning ? "bg-emerald-500 animate-ping" : "bg-red-500"}`} />
                {isScanning ? "Active Live Capture" : "Idle Module"}
              </div>

              {/* Real Camera Video Output */}
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-xl border border-slate-800 max-h-[280px]"
                />
              ) : (
                <div className="text-center py-8 px-4 flex flex-col items-center space-y-4 z-10">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl text-emerald-400">
                    <QrCode className="h-10 w-10 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white text-xs font-black uppercase tracking-wider">Device Camera Standby</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs font-semibold">
                      Enable real-time lens scan to read QR hardware identifiers directly printed on heavy tractor cowls & solar pump terminals.
                    </p>
                  </div>
                </div>
              )}

              {/* Lens Bounding Box lines */}
              {isCameraActive && (
                <div className="absolute inset-x-12 inset-y-12 border-2 border-dashed border-emerald-400/50 rounded-xl flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 absolute top-0 left-0 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1" />
                  <div className="w-8 h-8 absolute top-0 right-0 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1" />
                  <div className="w-8 h-8 absolute bottom-0 left-0 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1" />
                  <div className="w-8 h-8 absolute bottom-0 right-0 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1" />
                  
                  {isScanning && (
                    <span className="text-[10px] text-emerald-400 font-black tracking-widest bg-black/80 border border-emerald-500/30 px-3 py-1 rounded-full animate-pulse">
                      ALIGN BARCODE QR
                    </span>
                  )}
                </div>
              )}

              {/* Bottom Control buttons */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex justify-center gap-2">
                {!isCameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="h-4 w-4" /> Open Camera Scanner
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-[10.5px] font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4" /> Terminate Camera Feed
                  </button>
                )}
              </div>
            </div>

            {/* Error fallback / Upload fallback info */}
            {cameraError && (
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[10.5px] text-indigo-800 font-semibold leading-relaxed flex items-start gap-2">
                <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block mb-0.5">Iframe Camera Ingress Restriction</span>
                  {cameraError}
                </div>
              </div>
            )}

            {/* HIGH FIDELITY SIMULATED SCANS (100% testable buttons) */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-center gap-1.5 border-b border-slate-150 pb-2">
                <Cpu className="h-4 w-4 text-slate-500" />
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                  Simulate QR Scanner Plate Signals
                </h3>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                No physical hardware nearby? Tap any machinery below to simulate scanning the QR metal label on the equipment engine casing:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                {PRE_SEEDED_HARDWARE.map((hw) => (
                  <button
                    key={hw.id}
                    type="button"
                    onClick={() => {
                      setIsScanning(true);
                      setTimeout(() => {
                        handleScanSuccess(hw);
                        setIsScanning(false);
                      }, 800);
                    }}
                    className="p-2.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-xl text-left transition-all hover:shadow-xs group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-700 truncate group-hover:text-emerald-700">
                        {hw.name.split(" ")[0]} {hw.name.split(" ")[1] || ""}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        hw.status === "Critical" ? "bg-red-500" :
                        hw.status === "Warning" ? "bg-amber-500" : "bg-emerald-500"
                      }`} />
                    </div>
                    <span className="text-[8.5px] font-mono text-slate-400 block mt-0.5">
                      Barcode: {hw.serialNumber}
                    </span>
                  </button>
                ))}
              </div>

              {/* Upload QR Image file simulator */}
              <div className="border-t border-slate-150 pt-3 mt-1">
                <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1.5">
                  Alternatively, upload hardware snapshot
                </label>
                <div className="relative border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-2 bg-white text-center transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUploadMock}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1.5">
                    <FileSearch className="h-3.5 w-3.5 text-slate-400" />
                    Upload photo of QR code label
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: AUTO-POPULATED DIAGNOSTIC REQUEST FORM (col-span-7) */}
          <div className="lg:col-span-7 bg-slate-50/40 border border-slate-150 rounded-2xl p-5.5 space-y-5">
            <div className="border-b border-slate-200/60 pb-3">
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-indigo-600" />
                Equipment Service & Diagnostic Form
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                This form auto-populates instantly once a valid machinery serial QR plate is scanned or selected.
              </p>
            </div>

            {selectedEquipment ? (
              <form onSubmit={handleSubmitDiagnostic} className="space-y-4 text-xs font-medium">
                
                {/* Confirmation Alert Box */}
                <div className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="p-1 bg-white border border-emerald-200 rounded-lg text-emerald-600">
                    <CheckCircle2 className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black text-emerald-950 block uppercase tracking-wider">
                      Hardware Connection Synchronized!
                    </span>
                    <p className="text-[10px] text-emerald-800 font-semibold leading-normal">
                      ID: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-150">{scannedCode}</span> is linked to digital twin registry. Telematics readouts pulled.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Machinery Name */}
                  <div>
                    <label className="block text-slate-400 uppercase text-[9px] font-black mb-1.5">Equipment Name</label>
                    <div className="bg-white border border-slate-200/80 rounded-lg px-3 py-2 font-bold text-slate-800 flex items-center gap-2">
                      <Wrench className="h-3.5 w-3.5 text-slate-400" />
                      {selectedEquipment.name}
                    </div>
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label className="block text-slate-400 uppercase text-[9px] font-black mb-1.5">Hardware Serial</label>
                    <div className="bg-white border border-slate-200/80 rounded-lg px-3 py-2 font-mono font-bold text-slate-600">
                      {selectedEquipment.serialNumber}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Equipment Type */}
                  <div>
                    <label className="block text-slate-400 uppercase text-[9px] font-black mb-1.5">Category Class</label>
                    <div className="bg-white border border-slate-200/80 rounded-lg px-3 py-2 font-semibold text-slate-700">
                      {selectedEquipment.type}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-slate-400 uppercase text-[9px] font-black mb-1.5">Urgency/Priority</label>
                    <select
                      value={priority}
                      onChange={(e: any) => setPriority(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none font-bold"
                    >
                      <option value="Low">Low - Maintenance</option>
                      <option value="Medium">Medium - Standard Calibration</option>
                      <option value="High">High - Impending Failure</option>
                      <option value="Critical">Critical - Down / Out of Order</option>
                    </select>
                  </div>
                </div>

                {/* IoT Live Diagnostics Telematics */}
                <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-xl space-y-1.5">
                  <span className="text-[9px] font-black text-indigo-900 uppercase tracking-wide flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5 text-indigo-600" />
                    Machine Live IoT Telematics Alert Readout
                  </span>
                  <p className="text-[10px] text-indigo-950 font-bold leading-normal italic bg-white p-2.5 rounded-lg border border-indigo-100">
                    "{selectedEquipment.iotAlert}"
                  </p>
                </div>

                {/* Select Symptoms Issue */}
                <div>
                  <label className="block text-slate-400 uppercase text-[9px] font-black mb-1.5">
                    Select Detected Issue / Malfunction
                  </label>
                  <select
                    value={reportedIssue}
                    onChange={(e) => setReportedIssue(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none font-semibold text-slate-800"
                  >
                    {selectedEquipment.commonIssues.map((issue, idx) => (
                      <option key={idx} value={issue}>
                        {issue}
                      </option>
                    ))}
                    <option value="Other/Unlisted sensor telemetry mismatch">Other/Unlisted structural symptoms</option>
                  </select>
                </div>

                {/* Suggested AI Repair Steps */}
                <div className="bg-amber-50/50 border border-amber-100/80 p-3.5 rounded-xl space-y-1.5">
                  <span className="text-[9px] font-black text-amber-950 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                    AI Diagnostics Recommended Immediate Troubleshooting
                  </span>
                  <p className="text-[10px] text-amber-900 font-semibold leading-relaxed">
                    {selectedEquipment.suggestedFix}
                  </p>
                </div>

                {/* Extra Comments */}
                <div>
                  <label className="block text-slate-400 uppercase text-[9px] font-black mb-1.5">
                    Detailed Notes / Physical Sound Logs (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="e.g. rattling heard from the rear exhaust housing, happening on warm boot..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer text-xs"
                >
                  <Send className="h-4 w-4" />
                  Submit Official Maintenance Diagnostic Request
                </button>
              </form>
            ) : (
              <div className="text-center py-16 px-4 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-150 rounded-2xl">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-full text-slate-300">
                  <Wrench className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-slate-800 text-xs font-black uppercase tracking-wider">Awaiting QR Code Capture</h4>
                  <p className="text-slate-400 text-[10px] max-w-xs mx-auto font-semibold leading-normal">
                    Please use the scanner on the left or click any simulation target to load real machinery telemetry and unlock the service requests.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* HISTORY LOGS TAB */
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-50 border border-slate-200/60 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-slate-800 font-black text-xs uppercase tracking-wider">Historical Diagnostics Registry</h3>
                <span className="text-[10px] text-slate-400 font-semibold block">Track active repair status and calibration dispatches</span>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-800 font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {requestsList.length} Active Records
            </span>
          </div>

          {requestsList.length > 0 ? (
            <div className="space-y-4">
              {requestsList.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                >
                  {/* Request Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-2 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-400 font-extrabold bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded">
                          {req.id}
                        </span>
                        <h4 className="font-black text-slate-900">{req.equipmentName}</h4>
                      </div>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-1">
                        Scanned: {req.scannedAt} • Serial: <span className="font-mono text-slate-600 font-bold">{req.serialNumber}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Priority Tag */}
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        req.priority === "Critical" ? "bg-red-50 text-red-700 border border-red-150" :
                        req.priority === "High" ? "bg-amber-50 text-amber-700 border border-amber-150" :
                        req.priority === "Medium" ? "bg-indigo-50 text-indigo-700 border border-indigo-150" :
                        "bg-slate-50 text-slate-700 border border-slate-150"
                      }`}>
                        Priority: {req.priority}
                      </span>

                      {/* Status Badge */}
                      <span className="text-[9px] bg-emerald-50 border border-emerald-150 text-emerald-800 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {req.status}
                      </span>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteRequest(req.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Reported Diagnostic Issue</span>
                      <p className="text-slate-800 leading-relaxed font-bold bg-slate-50 p-3 rounded-xl border border-slate-150">
                        "{req.reportedIssue}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-amber-600 uppercase tracking-wide block flex items-center gap-1 font-black">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> AI Suggested Troubleshooting Steps
                      </span>
                      <p className="text-amber-900 leading-relaxed font-medium bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                        {req.aiTroubleshooting}
                      </p>
                    </div>
                  </div>

                  {req.notes && (
                    <div className="text-xs font-semibold space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Additional Physical Audio/Visual Notes</span>
                      <p className="text-slate-600 text-[10.5px] italic leading-relaxed">
                        "{req.notes}"
                      </p>
                    </div>
                  )}

                  {/* Micro Actions */}
                  <div className="flex justify-end gap-2 text-[10px] font-black uppercase">
                    <button
                      type="button"
                      onClick={() => alert(`Remote signal dispatched to ${req.serialNumber}. Executing engine self-calibration matrix. Status: OK.`)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Run Remote Calibration
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Push notification sent to designated service technician with complete QR diagnostic packet and telemetry report.`)}
                      className="px-3 py-1.5 bg-indigo-50 border border-indigo-150 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Send className="h-3 w-3" /> Remind Technician
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-white border border-slate-150 rounded-full text-slate-300">
                <History className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-slate-800 text-xs font-black uppercase tracking-wider">No Active Service Logs</h4>
                <p className="text-slate-400 text-[10px] font-semibold mt-0.5">
                  Scan machinery hardware tags to log diagnostics and request technicians.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
