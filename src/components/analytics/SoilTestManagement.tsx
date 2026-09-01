import React, { useState } from "react";
import { 
  FlaskConical, 
  ClipboardList, 
  Layers, 
  Activity, 
  RefreshCw, 
  Sparkles, 
  Droplets, 
  Info, 
  Check, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Calendar 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

interface SoilTestEntry {
  id: string;
  testDate: string;
  labName: string;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  zinc: number;
  iron: number;
  manganese: number;
  copper: number;
  boron: number;
  recommendations: string;
}

export function SoilTestManagement() {
  const [soilSubTab, setSoilSubTab] = useState<"analyze" | "history">("analyze");
  
  // Gemini Soil Lab states
  const [soilReportBase64, setSoilReportBase64] = useState<string | null>(null);
  const [soilReportMime, setSoilReportMime] = useState<string | null>(null);
  const [soilReportName, setSoilReportName] = useState<string>("");
  const [soilImageBase64, setSoilImageBase64] = useState<string | null>(null);
  const [soilImageMime, setSoilImageMime] = useState<string | null>(null);
  const [soilImageName, setSoilImageName] = useState<string>("");
  
  const [manualSoilType, setManualSoilType] = useState<string>("Clay Loam");
  const [manualPh, setManualPh] = useState<number>(6.2);
  const [manualLocation, setManualLocation] = useState<string>("Southern Delta Zone");
  const [isAnalyzingSoil, setIsAnalyzingSoil] = useState<boolean>(false);
  const [activeHorizon, setActiveHorizon] = useState<string>("O");
  const [soilAnalysisResult, setSoilAnalysisResult] = useState<any | null>(null);

  // 2.6 Soil Test Management State Definitions
  const [soilTestsHistory, setSoilTestsHistory] = useState<SoilTestEntry[]>([
    {
      id: "st-1",
      testDate: "2025-10-12",
      labName: "National Soil Science Lab",
      pH: 5.6,
      nitrogen: 110,
      phosphorus: 15,
      potassium: 180,
      organicMatter: 1.8,
      zinc: 0.52,
      iron: 4.5,
      manganese: 3.2,
      copper: 0.61,
      boron: 0.20,
      recommendations: "Soil is moderately acidic with significant Nitrogen and Zinc deficiencies. Apply agricultural lime at 1.5 tons/acre and Urea split doses. Supplement Zinc Sulfate at 10kg/acre."
    },
    {
      id: "st-2",
      testDate: "2025-12-18",
      labName: "National Soil Science Lab",
      pH: 5.9,
      nitrogen: 120,
      phosphorus: 18,
      potassium: 195,
      organicMatter: 2.0,
      zinc: 0.60,
      iron: 5.1,
      manganese: 3.8,
      copper: 0.70,
      boron: 0.25,
      recommendations: "pH showing steady correction. Nitrogen and Organic Carbon index is improving due to green manure. Maintain organic compost and add ammonium phosphate."
    },
    {
      id: "st-3",
      testDate: "2026-03-22",
      labName: "State Agri-Technology Agency",
      pH: 6.2,
      nitrogen: 130,
      phosphorus: 22,
      potassium: 205,
      organicMatter: 2.2,
      zinc: 0.68,
      iron: 5.9,
      manganese: 4.4,
      copper: 0.80,
      boron: 0.31,
      recommendations: "Soil buffer capacity is healthy. Excellent micro-nutrient stabilization. Limit heavy calcium nitrates to protect potassium equilibrium."
    },
    {
      id: "st-4",
      testDate: "2026-06-15",
      labName: "State Agri-Technology Agency",
      pH: 6.5,
      nitrogen: 135,
      phosphorus: 24,
      potassium: 210,
      organicMatter: 2.3,
      zinc: 0.72,
      iron: 6.2,
      manganese: 4.8,
      copper: 0.85,
      boron: 0.35,
      recommendations: "Excellent neutral pH balance. Zinc and iron micronutrient profiles are in optimal zones. Apply standard balanced NPK maintenance dosage."
    }
  ]);

  // Form states for manual entry & auto-fill
  const [soilFormDate, setSoilFormDate] = useState<string>("2026-07-01");
  const [soilFormLabName, setSoilFormLabName] = useState<string>("State Agri-Technology Agency");
  const [soilFormPh, setSoilFormPh] = useState<number>(6.5);
  const [soilFormNitrogen, setSoilFormNitrogen] = useState<number>(135);
  const [soilFormPhosphorus, setSoilFormPhosphorus] = useState<number>(24);
  const [soilFormPotassium, setSoilFormPotassium] = useState<number>(210);
  const [soilFormOrganicMatter, setSoilFormOrganicMatter] = useState<number>(2.3);
  const [soilFormZinc, setSoilFormZinc] = useState<number>(0.72);
  const [soilFormIron, setSoilFormIron] = useState<number>(6.2);
  const [soilFormManganese, setSoilFormManganese] = useState<number>(4.8);
  const [soilFormCopper, setSoilFormCopper] = useState<number>(0.85);
  const [soilFormBoron, setSoilFormBoron] = useState<number>(0.35);
  const [chartMetricType, setChartMetricType] = useState<"npk" | "ph" | "organic_micro">("npk");
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>("st-4");
  const [simulationMsg, setSimulationMsg] = useState<string>("");

  // Run AI soil analysis
  const handleSoilReportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSoilReportName(file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const commaIdx = base64String.indexOf(",");
      if (commaIdx !== -1) {
        setSoilReportBase64(base64String.substring(commaIdx + 1));
        setSoilReportMime(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSoilImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSoilImageName(file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const commaIdx = base64String.indexOf(",");
      if (commaIdx !== -1) {
        setSoilImageBase64(base64String.substring(commaIdx + 1));
        setSoilImageMime(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeSoil = async () => {
    setIsAnalyzingSoil(true);
    try {
      const response = await fetch("/api/analyze-soil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soilReportBase64,
          soilReportMime,
          soilImageBase64,
          soilImageMime,
          soilTypeManual: manualSoilType,
          phManual: manualPh,
          location: manualLocation
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSoilAnalysisResult(data);
        setActiveHorizon("O");
        
        // Auto-fill our 10 manual entry parameters from the AI OCR result!
        if (data.soilPh !== undefined) setSoilFormPh(data.soilPh);
        if (data.organicMatter !== undefined) setSoilFormOrganicMatter(data.organicMatter);
        if (data.nutrients) {
          if (data.nutrients.nitrogenVal !== undefined) setSoilFormNitrogen(data.nutrients.nitrogenVal);
          if (data.nutrients.phosphorusVal !== undefined) setSoilFormPhosphorus(data.nutrients.phosphorusVal);
          if (data.nutrients.potassiumVal !== undefined) setSoilFormPotassium(data.nutrients.potassiumVal);
          if (data.nutrients.zincVal !== undefined) setSoilFormZinc(data.nutrients.zincVal);
          if (data.nutrients.ironVal !== undefined) setSoilFormIron(data.nutrients.ironVal);
          if (data.nutrients.manganeseVal !== undefined) setSoilFormManganese(data.nutrients.manganeseVal);
          if (data.nutrients.copperVal !== undefined) setSoilFormCopper(data.nutrients.copperVal);
          if (data.nutrients.boronVal !== undefined) setSoilFormBoron(data.nutrients.boronVal);
        }
        setSoilFormLabName(soilReportName ? `AI OCR: ${soilReportName}` : "AI Estimated Lab");
        setSoilFormDate(new Date().toISOString().split("T")[0]);
        
        setSimulationMsg("Success! AI parsed report (OCR) & auto-filled manual entry fields below.");
        setTimeout(() => setSimulationMsg(""), 5000);
      } else {
        alert(data.error || "Soil diagnostic systems busy. Re-routing analysis stream.");
      }
    } catch (err) {
      console.error(err);
      alert("Soil analysis server offline or timed out.");
    } finally {
      setIsAnalyzingSoil(false);
    }
  };

  const handleAddSoilTestHistory = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple rules-based precision recommendation engine for soil profiles
    let advice = "";
    if (soilFormPh < 6.0) {
      advice += `Your soil is acidic (pH ${soilFormPh}). Apply agricultural limestone (Calcium Carbonate) at 1.5 - 2.0 tons/acre to neutralize acidity. `;
    } else if (soilFormPh > 7.5) {
      advice += `Your soil is alkaline (pH ${soilFormPh}). Apply elemental sulfur (200-300kg/acre) or Gypsum to reduce alkalinity. `;
    } else {
      advice += `Your soil pH of ${soilFormPh} is in the highly desirable neutral range. Maintain organic mulching. `;
    }

    if (soilFormNitrogen < 125) {
      advice += `Subsoil is severely deficient in Nitrogen (${soilFormNitrogen} mg/kg). Apply Urea at 50kg/acre in split doses or sow Sesbania green manure. `;
    } else if (soilFormNitrogen < 140) {
      advice += `Nitrogen index is moderate (${soilFormNitrogen} mg/kg). Supplement organic vermicompost at 5 tons/acre. `;
    } else {
      advice += `Nitrogen level (${soilFormNitrogen} mg/kg) is optimal. `;
    }

    if (soilFormPhosphorus < 20) {
      advice += `Phosphorus stands deficient (${soilFormPhosphorus} mg/kg). Supplement with Single Super Phosphate (SSP) at 40kg/acre. `;
    } else {
      advice += `Phosphorus (${soilFormPhosphorus} mg/kg) is well-stabilized. `;
    }

    if (soilFormPotassium < 200) {
      advice += `Potassium level (${soilFormPotassium} mg/kg) is low. Dispense Muriate of Potash (MOP) at 25kg/acre. `;
    } else {
      advice += `Potassium (${soilFormPotassium} mg/kg) is optimal. `;
    }

    if (soilFormOrganicMatter < 2.0) {
      advice += `Organic Matter (${soilFormOrganicMatter}%) is low. Incorporate crop stubble, compost, or biochar. `;
    } else {
      advice += `Organic Matter (${soilFormOrganicMatter}%) is healthy. `;
    }

    if (soilFormZinc < 0.6) advice += `Zinc is low (${soilFormZinc} ppm); spray Zinc Sulfate heptahydrate. `;
    if (soilFormIron < 5.0) advice += `Iron deficiency detected (${soilFormIron} ppm); apply Ferrous Sulfate. `;
    if (soilFormBoron < 0.3) advice += `Boron is deficient (${soilFormBoron} ppm); apply Borax at 5kg/acre during land preparation. `;

    const newEntry: SoilTestEntry = {
      id: `st-${Date.now()}`,
      testDate: soilFormDate,
      labName: soilFormLabName,
      pH: soilFormPh,
      nitrogen: soilFormNitrogen,
      phosphorus: soilFormPhosphorus,
      potassium: soilFormPotassium,
      organicMatter: soilFormOrganicMatter,
      zinc: soilFormZinc,
      iron: soilFormIron,
      manganese: soilFormManganese,
      copper: soilFormCopper,
      boron: soilFormBoron,
      recommendations: advice
    };

    setSoilTestsHistory((prev) => [...prev, newEntry]);
    setSelectedHistoryId(newEntry.id);
    setSimulationMsg(`Logged Soil Test from ${soilFormDate} successfully!`);
    setTimeout(() => setSimulationMsg(""), 3500);
  };

  const handleLoadSampleSoil = () => {
    setManualSoilType("Clay Loam");
    setManualPh(5.9);
    setManualLocation("Indo-Gangetic Alluvial Plain");
    setSoilReportName("sample_lab_report_alluvial.pdf");
    setSoilImageName("topsoil_sample_loam.jpeg");
    setSoilReportBase64("JVBERi0xLjQKJbXtrvM="); 
    setSoilReportMime("application/pdf");
    setSoilImageBase64("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="); 
    setSoilImageMime("image/jpeg");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Sub-tabs header */}
      <div className="flex border-b border-slate-200 gap-2 pb-px bg-white p-4 rounded-xl shadow-xs border border-slate-200/60">
        <button
          onClick={() => setSoilSubTab("analyze")}
          className={`pb-2.5 px-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            soilSubTab === "analyze"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          id="btn-subtab-analyze"
        >
          <FlaskConical className="h-4 w-4" />
          1. Run AI Diagnostics & OCR Parser
        </button>
        <button
          onClick={() => setSoilSubTab("history")}
          className={`pb-2.5 px-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            soilSubTab === "history"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
          id="btn-subtab-history"
        >
          <TrendingUp className="h-4 w-4" />
          2. Soil History & Trends ({soilTestsHistory.length})
        </button>
      </div>

      {simulationMsg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300" id="msg-simulation-alert">
          <Sparkles className="h-4 w-4 animate-bounce text-emerald-600" />
          <span>{simulationMsg}</span>
        </div>
      )}

      {soilSubTab === "analyze" ? (
        <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-sm" id="card-analyze-tab">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3.5 mb-4 gap-2">
            <div>
              <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="h-4.5 w-4.5 text-emerald-600" />
                Gemini Precision Soil Lab
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Combine physical soil images, lab reports, and contextual parameters using ensemble models to assess biochemistry.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadSampleSoil}
              className="shrink-0 text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg border border-emerald-200/60 transition-all cursor-pointer flex items-center gap-1"
              id="btn-preload-punjab-report"
            >
              <Sparkles className="h-3 w-3" />
              Preload Punjab Clay-Loam Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs Matrix (Left - lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* File Upload Box 1: Soil Test Report */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-3" id="box-report-upload">
                <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 border-b border-emerald-100/50 pb-1.5">
                  <ClipboardList className="h-3.5 w-3.5" />
                  1. Upload Chemistry Report (PDF / Image)
                </h4>
                <div className="relative border border-dashed border-slate-300 rounded-lg p-4 bg-white text-center hover:bg-slate-50/30 transition-all">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleSoilReportChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="input-report-file"
                  />
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-700">
                      {soilReportName ? `Selected: ${soilReportName}` : "Drag & drop or browse chemistry PDF/image"}
                    </p>
                    <p className="text-[9px] text-slate-400">Supports laboratory reports, PDF files, and scan captures</p>
                  </div>
                </div>
                {soilReportName && (
                  <div className="text-[10px] bg-emerald-50/70 text-emerald-800 p-2 rounded-lg flex items-center justify-between border border-emerald-100/40">
                    <span className="font-semibold truncate max-w-[80%]">✓ {soilReportName}</span>
                    <button
                      onClick={() => {
                        setSoilReportName("");
                        setSoilReportBase64(null);
                      }}
                      className="text-red-500 font-bold hover:text-red-700 text-[9px]"
                      id="btn-remove-report"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* File Upload Box 2: Soil Close-up Image */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-3" id="box-image-upload">
                <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 border-b border-emerald-100/50 pb-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  2. Upload Soil Image (Physical Structure)
                </h4>
                <div className="relative border border-dashed border-slate-300 rounded-lg p-4 bg-white text-center hover:bg-slate-50/30 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSoilImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="input-image-file"
                  />
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-700">
                      {soilImageName ? `Selected: ${soilImageName}` : "Drag & drop or browse physical soil photograph"}
                    </p>
                    <p className="text-[9px] text-slate-400">Enables physical soil texture and color analysis via AI models</p>
                  </div>
                </div>
                {soilImageName && (
                  <div className="text-[10px] bg-emerald-50/70 text-emerald-800 p-2 rounded-lg flex items-center justify-between border border-emerald-100/40">
                    <span className="font-semibold truncate max-w-[80%]">✓ {soilImageName}</span>
                    <button
                      onClick={() => {
                        setSoilImageName("");
                        setSoilImageBase64(null);
                      }}
                      className="text-red-500 font-bold hover:text-red-700 text-[9px]"
                      id="btn-remove-image"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Manual Calibration Overrides */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-3.5" id="box-calibration-overrides">
                <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 border-b border-emerald-100/50 pb-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  3. Contextual Overrides & Location
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold text-[10px] mb-1">Soil Texture Class</label>
                    <select
                      value={manualSoilType}
                      onChange={(e) => setManualSoilType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 outline-none"
                    >
                      <option value="Loamy">Loamy Soil</option>
                      <option value="Clay Loam">Clay Loam</option>
                      <option value="Sandy Loam">Sandy Loam</option>
                      <option value="Silty Clay">Silty Clay</option>
                      <option value="Peaty">Peaty Soil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold text-[10px] mb-1">Target pH ({manualPh})</label>
                    <input
                      type="range"
                      min="4"
                      max="10"
                      step="0.1"
                      value={manualPh}
                      onChange={(e) => setManualPh(parseFloat(e.target.value))}
                      className="w-full accent-emerald-600 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold text-[10px] mb-1">Farm Location / Region</label>
                  <input
                    type="text"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="e.g. Punjab North Basin, India"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>

              {/* Action Trigger button */}
              <button
                type="button"
                onClick={handleAnalyzeSoil}
                disabled={isAnalyzingSoil}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
                id="btn-run-soil-analysis"
              >
                {isAnalyzingSoil ? (
                  <div className="space-y-1 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Running Multi-Ensemble Estimators...</span>
                    </div>
                    <p className="text-[8px] text-emerald-200 font-medium tracking-wide">AI OCR & chemical analysis active...</p>
                  </div>
                ) : (
                  <>
                    <FlaskConical className="h-4.5 w-4.5" />
                    Run AI Soil Diagnostic Sequence
                  </>
                )}
              </button>

              {/* Manual Log & History Override Form */}
              <form onSubmit={handleAddSoilTestHistory} className="bg-emerald-950/5 p-4 rounded-xl border border-emerald-900/10 space-y-4" id="form-manual-soil-log">
                <div>
                  <h4 className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1 border-b border-emerald-900/10 pb-1.5">
                    <ClipboardList className="h-4 w-4 text-emerald-700" />
                    4. Save Soil Test to History Ledger
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">Input manually or adjust AI OCR auto-filled values below to commit to the long-term trends ledger.</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold text-[9px] uppercase mb-1">Test Date</label>
                    <input
                      type="date"
                      required
                      value={soilFormDate}
                      onChange={(e) => setSoilFormDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-semibold text-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold text-[9px] uppercase mb-1">Testing Laboratory</label>
                    <input
                      type="text"
                      required
                      value={soilFormLabName}
                      onChange={(e) => setSoilFormLabName(e.target.value)}
                      placeholder="e.g. Punjab Soil Lab"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-semibold text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-emerald-900/5 pt-2.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">Nutrient Concentration & Biochemistry Metrics</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Soil pH</label>
                      <input
                        type="number"
                        step="0.1"
                        min="4"
                        max="10"
                        required
                        value={soilFormPh}
                        onChange={(e) => setSoilFormPh(parseFloat(e.target.value) || 7.0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Nitrogen (N) mg/kg</label>
                      <input
                        type="number"
                        required
                        value={soilFormNitrogen}
                        onChange={(e) => setSoilFormNitrogen(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Phosphorus (P) mg/kg</label>
                      <input
                        type="number"
                        required
                        value={soilFormPhosphorus}
                        onChange={(e) => setSoilFormPhosphorus(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Potassium (K) mg/kg</label>
                      <input
                        type="number"
                        required
                        value={soilFormPotassium}
                        onChange={(e) => setSoilFormPotassium(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Organic Matter (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={soilFormOrganicMatter}
                        onChange={(e) => setSoilFormOrganicMatter(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Zinc (Zn) ppm</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={soilFormZinc}
                        onChange={(e) => setSoilFormZinc(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Iron (Fe) ppm</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={soilFormIron}
                        onChange={(e) => setSoilFormIron(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Manganese (Mn) ppm</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={soilFormManganese}
                        onChange={(e) => setSoilFormManganese(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Copper (Cu) ppm</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={soilFormCopper}
                        onChange={(e) => setSoilFormCopper(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold text-[8px] uppercase mb-0.5">Boron (B) ppm</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={soilFormBoron}
                        onChange={(e) => setSoilFormBoron(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  id="btn-submit-history-log"
                >
                  <Plus className="h-4 w-4" />
                  Commit Report to History Ledger
                </button>
              </form>
            </div>

            {/* Outputs Matrix (Right - lg:col-span-7) */}
            <div className="lg:col-span-7">
              {soilAnalysisResult ? (
                <div className="space-y-5 animate-in fade-in duration-300" id="box-diagnostic-results">
                  
                  {/* Overall Score Badge Row */}
                  <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-xl p-4 shadow-md flex items-center justify-between border border-emerald-700/50">
                    <div>
                      <span className="text-[9px] uppercase font-black text-emerald-200 tracking-wider">AI Soil Fertility Index</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-3xl font-black">{soilAnalysisResult.fertilityIndex}</span>
                        <span className="text-xs text-emerald-200">/ 100</span>
                      </div>
                      <p className="text-[10px] text-emerald-100 font-medium mt-1">
                        Estimated Soil Texture: <span className="font-extrabold text-white">{soilAnalysisResult.soilTexture}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-700 text-white font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider block border border-emerald-600/40">
                        {soilAnalysisResult.fertilityIndex >= 80 ? "Optimal Fertility" : soilAnalysisResult.fertilityIndex >= 60 ? "Moderate Fertility" : "Deficient Soil"}
                      </span>
                      <span className="text-[9px] text-emerald-200 mt-1.5 block font-semibold">Location: {manualLocation}</span>
                    </div>
                  </div>

                  {/* Interactive 3D Soil Horizon Column & Status readout */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs">
                    <div>
                      <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-emerald-600" />
                        3D Interactive Soil Horizon Profile
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Click each structural horizon below to analyze physical biology and root penetration potential.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* 3D Stack (md:col-span-4) */}
                      <div className="md:col-span-4 flex flex-col gap-1 pr-2">
                        {/* Horizon O */}
                        <button
                          type="button"
                          onClick={() => setActiveHorizon("O")}
                          className={`w-full text-left p-3 rounded-lg border transition-all text-[10px] font-extrabold shadow-sm ${
                            activeHorizon === "O"
                              ? "bg-amber-950 text-white border-amber-800 ring-2 ring-emerald-500 ring-offset-2 scale-102"
                              : "bg-amber-950/80 hover:bg-amber-950 text-amber-200 border-amber-900"
                          }`}
                        >
                          <span className="block text-[8px] uppercase font-black text-amber-400 tracking-wider">O - Organic (0-2")</span>
                          Rich Humus Layer
                        </button>

                        {/* Horizon A */}
                        <button
                          type="button"
                          onClick={() => setActiveHorizon("A")}
                          className={`w-full text-left p-3 rounded-lg border transition-all text-[10px] font-extrabold shadow-sm ${
                            activeHorizon === "A"
                              ? "bg-yellow-950 text-white border-yellow-800 ring-2 ring-emerald-500 ring-offset-2 scale-102"
                              : "bg-yellow-950/80 hover:bg-yellow-950 text-yellow-200 border-yellow-900"
                          }`}
                        >
                          <span className="block text-[8px] uppercase font-black text-yellow-400 tracking-wider">A - Topsoil (2-10")</span>
                          Active Root Zone
                        </button>

                        {/* Horizon B */}
                        <button
                          type="button"
                          onClick={() => setActiveHorizon("B")}
                          className={`w-full text-left p-3 rounded-lg border transition-all text-[10px] font-extrabold shadow-sm ${
                            activeHorizon === "B"
                              ? "bg-amber-800 text-white border-amber-700 ring-2 ring-emerald-500 ring-offset-2 scale-102"
                              : "bg-amber-800/80 hover:bg-amber-800 text-amber-100 border-amber-900"
                          }`}
                        >
                          <span className="block text-[8px] uppercase font-black text-amber-300 tracking-wider">B - Subsoil (10-30")</span>
                          Leached Clay Matrix
                        </button>

                        {/* Horizon C */}
                        <button
                          type="button"
                          onClick={() => setActiveHorizon("C")}
                          className={`w-full text-left p-3 rounded-lg border transition-all text-[10px] font-extrabold shadow-sm ${
                            activeHorizon === "C"
                              ? "bg-slate-600 text-white border-slate-500 ring-2 ring-emerald-500 ring-offset-2 scale-102"
                              : "bg-slate-600/80 hover:bg-slate-600 text-slate-100 border-slate-700"
                          }`}
                        >
                          <span className="block text-[8px] uppercase font-black text-slate-300 tracking-wider">C - Substratum (30"+)</span>
                          Weathered Rock Bed
                        </button>
                      </div>

                      {/* Status Readout (md:col-span-8) */}
                      <div className="md:col-span-8 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400">Selected Horizon Assessment</span>
                          <h5 className="font-extrabold text-slate-800 text-xs mt-0.5 uppercase tracking-wider">
                            {activeHorizon === "O" ? "O-Horizon: Humus & Leaf Litter" : activeHorizon === "A" ? "A-Horizon: Active Biome Topsoil" : activeHorizon === "B" ? "B-Horizon: Clay Accumulation Subsoil" : "C-Horizon: Weathered Bedrock Substratum"}
                          </h5>
                          <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-2 p-3 bg-white border border-slate-100 rounded-lg">
                            {activeHorizon === "O" ? soilAnalysisResult.horizons?.horizonO : activeHorizon === "A" ? soilAnalysisResult.horizons?.horizonA : activeHorizon === "B" ? soilAnalysisResult.horizons?.horizonB : soilAnalysisResult.horizons?.horizonC}
                          </p>
                        </div>
                        <div className="text-[9px] text-slate-400 font-bold border-t border-slate-200/50 pt-2 flex items-center gap-1.5 mt-2.5">
                          <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          Structure is determined based on physical soil imagery color hues and density analysis.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Biochemical NPK & Micro-nutrient deficiency table */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs">
                    <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-emerald-600" />
                      Biochemical Nutrient Deficiencies & Stats
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {/* Nitrogen */}
                      <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Nitrogen (N)</span>
                        <span className="block text-xs font-black text-slate-800">{soilAnalysisResult.nutrients?.nitrogenVal} mg/kg</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                          soilAnalysisResult.nutrients?.nitrogenStatus === "Optimal" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : soilAnalysisResult.nutrients?.nitrogenStatus === "Deficient"
                              ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {soilAnalysisResult.nutrients?.nitrogenStatus}
                        </span>
                      </div>

                      {/* Phosphorus */}
                      <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Phosphorus (P)</span>
                        <span className="block text-xs font-black text-slate-800">{soilAnalysisResult.nutrients?.phosphorusVal} mg/kg</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                          soilAnalysisResult.nutrients?.phosphorusStatus === "Optimal" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : soilAnalysisResult.nutrients?.phosphorusStatus === "Deficient"
                              ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {soilAnalysisResult.nutrients?.phosphorusStatus}
                        </span>
                      </div>

                      {/* Potassium */}
                      <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Potassium (K)</span>
                        <span className="block text-xs font-black text-slate-800">{soilAnalysisResult.nutrients?.potassiumVal} mg/kg</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                          soilAnalysisResult.nutrients?.potassiumStatus === "Optimal" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : soilAnalysisResult.nutrients?.potassiumStatus === "Deficient"
                              ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {soilAnalysisResult.nutrients?.potassiumStatus}
                        </span>
                      </div>

                      {/* Zinc */}
                      <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Zinc (Zn)</span>
                        <span className="block text-xs font-black text-slate-800">{soilAnalysisResult.nutrients?.zincVal} ppm</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                          soilAnalysisResult.nutrients?.zincStatus === "Optimal" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : soilAnalysisResult.nutrients?.zincStatus === "Deficient"
                              ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {soilAnalysisResult.nutrients?.zincStatus}
                        </span>
                      </div>

                      {/* Iron */}
                      <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Iron (Fe)</span>
                        <span className="block text-xs font-black text-slate-800">{soilAnalysisResult.nutrients?.ironVal} ppm</span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full inline-block ${
                          soilAnalysisResult.nutrients?.ironStatus === "Optimal" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : soilAnalysisResult.nutrients?.ironStatus === "Deficient"
                              ? "bg-red-50 text-red-700 border border-red-100 animate-pulse"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {soilAnalysisResult.nutrients?.ironStatus}
                        </span>
                      </div>
                    </div>

                    {/* Extra Micro-nutrients row parsed via expanded schema */}
                    {soilAnalysisResult.nutrients?.manganeseVal !== undefined && (
                      <div className="border-t border-slate-100 pt-3" id="extended-micronutrients-panel">
                        <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Extended Trace Mineral Profile</span>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Manganese */}
                          <div className="bg-emerald-50/20 border border-emerald-600/10 p-2.5 rounded-lg text-center">
                            <span className="text-[8px] font-bold text-slate-400 block uppercase">Manganese (Mn)</span>
                            <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{soilAnalysisResult.nutrients.manganeseVal} ppm</span>
                            <span className="text-[7px] text-slate-500 font-bold uppercase">{soilAnalysisResult.nutrients.manganeseStatus}</span>
                          </div>
                          {/* Copper */}
                          <div className="bg-emerald-50/20 border border-emerald-600/10 p-2.5 rounded-lg text-center">
                            <span className="text-[8px] font-bold text-slate-400 block uppercase">Copper (Cu)</span>
                            <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{soilAnalysisResult.nutrients.copperVal} ppm</span>
                            <span className="text-[7px] text-slate-500 font-bold uppercase">{soilAnalysisResult.nutrients.copperStatus}</span>
                          </div>
                          {/* Boron */}
                          <div className="bg-emerald-50/20 border border-emerald-600/10 p-2.5 rounded-lg text-center">
                            <span className="text-[8px] font-bold text-slate-400 block uppercase">Boron (B)</span>
                            <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{soilAnalysisResult.nutrients.boronVal} ppm</span>
                            <span className="text-[7px] text-slate-500 font-bold uppercase">{soilAnalysisResult.nutrients.boronStatus}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* pH scale and Adjustment Panel */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        pH Level & biochemical Amendments
                      </h4>
                      <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                        pH {soilAnalysisResult.soilPh}
                      </span>
                    </div>

                    {/* pH graphical bar */}
                    <div className="space-y-1">
                      <div className="h-2.5 rounded-full w-full bg-gradient-to-r from-red-500 via-green-500 to-purple-600 relative overflow-visible">
                        <div 
                          style={{ left: `${Math.min(Math.max((soilAnalysisResult.soilPh - 4) * 16.6, 0), 100)}%` }} 
                          className="absolute -top-1 w-4.5 h-4.5 bg-white border-2 border-slate-800 rounded-full shadow-md -translate-x-1/2 flex items-center justify-center font-bold text-[8px] text-slate-800"
                        >
                          •
                        </div>
                      </div>
                      <div className="flex justify-between text-[8px] text-slate-400 font-extrabold uppercase px-1">
                        <span>4.0 Acidic</span>
                        <span>7.0 Neutral</span>
                        <span>10.0 Alkaline</span>
                      </div>
                    </div>

                    <div className="bg-blue-50/55 rounded-lg p-3 border border-blue-100/50 text-[10px] text-slate-700 leading-relaxed font-semibold">
                      <span className="text-[9px] uppercase font-black text-blue-800 tracking-wider block mb-1">Adjustment Action Plan:</span>
                      {soilAnalysisResult.phRecommendations}
                    </div>
                  </div>

                  {/* Organic Matter & Water capacity stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Organic Matter Percentage</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-800">{soilAnalysisResult.organicMatter}%</span>
                        <span className="text-[10px] text-slate-400 font-semibold">(Benchmark: 3.0%+)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Critical indicator for biological moisture retaining carbon.</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Water Holding Capacity</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-800">{soilAnalysisResult.waterHoldingCapacity}%</span>
                        <span className="text-[10px] text-slate-400 font-semibold">(Soil Retention Index)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Indicates moisture capacity held against gravitational runoff.</p>
                    </div>
                  </div>

                  {/* Suitable Crops Section */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      Physically & Biochemically Viable Cultivars
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {soilAnalysisResult.suitableCrops?.map((c: any, cIdx: number) => (
                        <div key={cIdx} className="bg-emerald-50/10 border border-emerald-600/10 p-3 rounded-lg text-center space-y-1">
                          <span className="font-extrabold text-[11px] text-slate-800 block truncate">{c.cropName}</span>
                          <div className="flex items-center justify-center gap-1">
                            <div className="h-1.5 w-12 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${c.successProbability}%` }} 
                                className="h-full bg-emerald-600" 
                              />
                            </div>
                            <span className="text-[9px] text-emerald-800 font-black">{c.successProbability}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remediation Action Plan */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs">
                    <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-600" />
                      Prescription Remediation Action Plan
                    </h4>

                    <div className="relative border-l border-emerald-200 ml-2.5 pl-4 space-y-4 text-xs">
                      {soilAnalysisResult.remediationPlan?.map((p: any, pIdx: number) => (
                        <div key={pIdx} className="relative">
                          <div className="absolute -left-6.5 top-0.5 h-4.5 w-4.5 rounded-full bg-emerald-100 border border-emerald-600 flex items-center justify-center text-[9px] font-extrabold text-emerald-800">
                            {pIdx + 1}
                          </div>
                          <span className="font-extrabold text-slate-800 uppercase tracking-wide text-[9px] block mb-1">{p.phase}</span>
                          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg space-y-1 font-semibold text-slate-600 text-[10px]">
                            {p.actions?.map((act: string, actIdx: number) => (
                              <p key={actIdx} className="flex items-start gap-1">
                                <span className="text-emerald-500 shrink-0">•</span>
                                <span>{act}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-full min-h-[450px] bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                  <FlaskConical className="h-12 w-12 text-slate-300 mb-2.5" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Soil Diagnostic Lab Idle</h4>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-sm font-medium leading-relaxed">
                    Upload chemical reports and structure photographs or click the **"Preload Punjab Clay-Loam Report"** button at the top to generate a precision dashboard.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Sub-tab 2: Soil Test History & Trends */
        <div className="space-y-6" id="panel-history-tab">
          
          {/* Trends line chart card at the top */}
          <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
                  Historical Soil Chemistry Trend Analytics (Last 5 Tests)
                </h3>
                <p className="text-slate-400 text-[10px] mt-0.5">
                  Visualize the trajectory of critical major nutrients, acidity profiles, and micro-nutrients across tests.
                </p>
              </div>

              {/* Toggle controls */}
              <div className="flex bg-slate-100 p-1 rounded-lg self-start sm:self-center gap-1 border border-slate-200/40">
                <button
                  onClick={() => setChartMetricType("npk")}
                  className={`px-3 py-1 text-[9px] font-extrabold uppercase rounded-md transition-all cursor-pointer ${
                    chartMetricType === "npk" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-600"
                  }`}
                  id="btn-chart-npk"
                >
                  N, P, K Trends
                </button>
                <button
                  onClick={() => setChartMetricType("ph")}
                  className={`px-3 py-1 text-[9px] font-extrabold uppercase rounded-md transition-all cursor-pointer ${
                    chartMetricType === "ph" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-600"
                  }`}
                  id="btn-chart-ph"
                >
                  pH Acidity Profile
                </button>
                <button
                  onClick={() => setChartMetricType("organic_micro")}
                  className={`px-3 py-1 text-[9px] font-extrabold uppercase rounded-md transition-all cursor-pointer ${
                    chartMetricType === "organic_micro" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-600"
                  }`}
                  id="btn-chart-micro"
                >
                  OM & Micronutrients
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={soilTestsHistory.map((h) => ({
                    name: h.testDate,
                    pH: h.pH,
                    Nitrogen: h.nitrogen,
                    Phosphorus: h.phosphorus,
                    Potassium: h.potassium,
                    OM: h.organicMatter,
                    Zinc: h.zinc,
                    Iron: h.iron,
                    Manganese: h.manganese,
                    Copper: h.copper,
                    Boron: h.boron
                  }))}
                  margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <YAxis stroke="#94a3b8" fontSize={9} fontWeight="bold" />
                  <Tooltip contentStyle={{ fontSize: "10px", fontWeight: "bold", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                  <Legend wrapperStyle={{ fontSize: "9px", fontWeight: "bold", textTransform: "uppercase" }} />
                  
                  {chartMetricType === "npk" && (
                    <>
                      <Line type="monotone" dataKey="Nitrogen" stroke="#059669" strokeWidth={2.5} activeDot={{ r: 6 }} name="Nitrogen (mg/kg)" />
                      <Line type="monotone" dataKey="Phosphorus" stroke="#2563eb" strokeWidth={2.5} name="Phosphorus (mg/kg)" />
                      <Line type="monotone" dataKey="Potassium" stroke="#ea580c" strokeWidth={2.5} name="Potassium (mg/kg)" />
                    </>
                  )}

                  {chartMetricType === "ph" && (
                    <Line type="monotone" dataKey="pH" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} name="Acidity Level (pH)" />
                  )}

                  {chartMetricType === "organic_micro" && (
                    <>
                      <Line type="monotone" dataKey="OM" stroke="#78350f" strokeWidth={2} name="Organic Matter (%)" />
                      <Line type="monotone" dataKey="Zinc" stroke="#0891b2" strokeWidth={2} name="Zinc (ppm)" />
                      <Line type="monotone" dataKey="Iron" stroke="#db2777" strokeWidth={2} name="Iron (ppm)" />
                      <Line type="monotone" dataKey="Manganese" stroke="#7c3aed" strokeWidth={1.5} name="Manganese (ppm)" />
                      <Line type="monotone" dataKey="Copper" stroke="#ea580c" strokeWidth={1.5} name="Copper (ppm)" />
                      <Line type="monotone" dataKey="Boron" stroke="#059669" strokeWidth={1.5} name="Boron (ppm)" />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bento Grid: Left column contains the Tests List, Right column contains the selected test's detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* List of Previous Tests */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <div>
                <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList className="h-4 w-4 text-emerald-600" />
                  Soil Lab Reports Directory
                </h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Click any report to display chemical values and customized AI recommendations.</p>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {soilTestsHistory.slice().reverse().map((test) => {
                  const isSelected = selectedHistoryId === test.id;
                  return (
                    <div
                      key={test.id}
                      onClick={() => setSelectedHistoryId(test.id)}
                      className={`p-3 border rounded-xl transition-all cursor-pointer text-left ${
                        isSelected 
                          ? "bg-emerald-50/70 border-emerald-500 shadow-xs scale-101" 
                          : "bg-white hover:bg-slate-50/80 border-slate-200/80"
                      }`}
                      id={`test-item-${test.id}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-800">{test.testDate}</span>
                        <span className="text-[8px] bg-slate-100 text-slate-600 font-extrabold px-1.5 py-0.5 rounded font-mono">
                          pH {test.pH}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 block font-semibold truncate mt-1">Lab: {test.labName}</span>
                      <div className="flex gap-3 mt-1.5 text-[8px] font-extrabold text-slate-500 font-mono border-t border-slate-100 pt-1.5">
                        <span>N: {test.nitrogen}</span>
                        <span>P: {test.phosphorus}</span>
                        <span>K: {test.potassium}</span>
                        <span>OM: {test.organicMatter}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Test Detail Viewer */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              {(() => {
                const selectedTest = soilTestsHistory.find((t) => t.id === selectedHistoryId) || soilTestsHistory[soilTestsHistory.length - 1];
                if (!selectedTest) {
                  return (
                    <div className="text-center p-8 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      Please select a soil test to view details
                    </div>
                  );
                }
                return (
                  <div className="space-y-4" id={`report-detail-viewer-${selectedTest.id}`}>
                    {/* Header metadata row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3.5 gap-2">
                      <div>
                        <span className="text-[8px] uppercase font-black text-emerald-600 tracking-wider">Report Detailed Inspection View</span>
                        <h4 className="text-slate-800 font-extrabold text-xs uppercase tracking-wider mt-0.5">
                          Lab Analysis on {selectedTest.testDate}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Laboratory of Origin: <span className="text-slate-600">{selectedTest.labName}</span></p>
                      </div>
                      
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to remove this report from the historical ledger?")) {
                            setSoilTestsHistory((prev) => prev.filter((t) => t.id !== selectedTest.id));
                            setSelectedHistoryId(null);
                          }
                        }}
                        className="text-[9px] text-red-500 font-bold hover:text-red-700 px-2.5 py-1 rounded-md border border-red-200/50 hover:bg-red-50 transition-all"
                        id="btn-delete-report"
                      >
                        Delete Report
                      </button>
                    </div>

                    {/* Bento Grid: 10 Soil Metrics Readout */}
                    <div className="space-y-3.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">10-Parameter Soil Composition Diagnostics</span>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Soil pH</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.pH}</span>
                          <span className={`text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 ${
                            selectedTest.pH >= 6.0 && selectedTest.pH <= 7.2 
                              ? "bg-emerald-50 text-emerald-700" 
                              : "bg-red-50 text-red-700"
                          }`}>
                            {selectedTest.pH >= 6.0 && selectedTest.pH <= 7.2 ? "Optimal" : "Off-scale"}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Nitrogen (N)</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.nitrogen} <span className="text-[9px] font-normal text-slate-500">mg/kg</span></span>
                          <span className={`text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 ${
                            selectedTest.nitrogen >= 130 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {selectedTest.nitrogen >= 130 ? "Optimal" : "Deficient"}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Phosphorus (P)</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.phosphorus} <span className="text-[9px] font-normal text-slate-500">mg/kg</span></span>
                          <span className={`text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 ${
                            selectedTest.phosphorus >= 20 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {selectedTest.phosphorus >= 20 ? "Optimal" : "Deficient"}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Potassium (K)</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.potassium} <span className="text-[9px] font-normal text-slate-500">mg/kg</span></span>
                          <span className={`text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 ${
                            selectedTest.potassium >= 200 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {selectedTest.potassium >= 200 ? "Optimal" : "Deficient"}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Organic Matter</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.organicMatter}%</span>
                          <span className={`text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 ${
                            selectedTest.organicMatter >= 2.0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {selectedTest.organicMatter >= 2.0 ? "Healthy" : "Low"}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Zinc (Zn)</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.zinc} <span className="text-[9px] font-normal text-slate-500">ppm</span></span>
                          <span className={`text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 ${
                            selectedTest.zinc >= 0.65 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {selectedTest.zinc >= 0.65 ? "Optimal" : "Deficient"}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Iron (Fe)</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.iron} <span className="text-[9px] font-normal text-slate-500">ppm</span></span>
                          <span className={`text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 ${
                            selectedTest.iron >= 5.5 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {selectedTest.iron >= 5.5 ? "Optimal" : "Deficient"}
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Manganese (Mn)</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.manganese} <span className="text-[9px] font-normal text-slate-500">ppm</span></span>
                          <span className="text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 bg-emerald-50 text-emerald-700">
                            Optimal
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Copper (Cu)</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.copper} <span className="text-[9px] font-normal text-slate-500">ppm</span></span>
                          <span className="text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 bg-emerald-50 text-emerald-700">
                            Optimal
                          </span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-center">
                          <span className="text-[8px] font-bold text-slate-400 block uppercase font-sans">Boron (B)</span>
                          <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">{selectedTest.boron} <span className="text-[9px] font-normal text-slate-500">ppm</span></span>
                          <span className={`text-[7px] font-black px-1 rounded-full uppercase inline-block mt-1 ${
                            selectedTest.boron >= 0.30 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {selectedTest.boron >= 0.30 ? "Optimal" : "Deficient"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI recommendations prescriptions card */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2">
                      <h5 className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-emerald-600 animate-pulse" />
                        Precision AI Recommendations & Agronomics Advice
                      </h5>
                      <p className="text-[11px] text-slate-700 font-semibold leading-relaxed p-3 bg-white border border-emerald-50 rounded-lg shadow-2xs">
                        {selectedTest.recommendations}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
