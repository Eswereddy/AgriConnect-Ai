import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BrainCircuit,
  Sparkles,
  Upload,
  AlertTriangle,
  CheckCircle,
  X,
  Sliders,
  TrendingUp,
  FileText,
  Search,
  BookOpen,
  ArrowRight,
  Database,
  BarChart4,
  Flame,
  Check
} from "lucide-react";

export default function ExpertAIResearchLabs() {
  const [labTab, setLabTab] = useState<"pathology" | "soil" | "prediction" | "summarizer">("pathology");

  // --- 5.1 AI Disease Detection States ---
  const [diseaseImage, setDiseaseImage] = useState<string | null>(null);
  const [isAnalyzingDisease, setIsAnalyzingDisease] = useState(false);
  const [diseaseAnalysisResult, setDiseaseAnalysisResult] = useState<any>(null);
  const [expertAdjustmentNotes, setExpertAdjustmentNotes] = useState("");

  const sampleDiseases = [
    {
      name: "Wheat Rust (Puccinia graminis)",
      confidence: "94%",
      severity: "Moderate",
      organicCure: "Neem oil emulsion (1500ppm) paired with copper-based botanical fungicides.",
      chemicalCure: "Triazole-class fungicides (e.g., Tebuconazole @ 1ml/L).",
      prevention: "Avoid nitrogen over-fertilization, use rust-resistant cultivars, and space crop rows.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Grape Downy Mildew (Plasmopara viticola)",
      confidence: "98%",
      severity: "Severe",
      organicCure: "Foliar application of Trichoderma viride biological strain.",
      chemicalCure: "Bordeaux mixture (1%) or Copper Oxychloride spray.",
      prevention: "Canopy pruning to increase airflow, drip irrigation, remove infected leaf debris.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const triggerDiseaseUpload = (index: number) => {
    setIsAnalyzingDisease(true);
    setDiseaseImage(sampleDiseases[index].image);
    setTimeout(() => {
      setDiseaseAnalysisResult(sampleDiseases[index]);
      setIsAnalyzingDisease(false);
    }, 1500);
  };

  const handleFeedbackLoop = (status: "Accepted" | "Rejected" | "Modified") => {
    alert(`Feedback Recorded: Expert Vikram Singh marked diagnosis as "${status}". Training pipeline queued.`);
    setDiseaseAnalysisResult(null);
    setDiseaseImage(null);
    setExpertAdjustmentNotes("");
  };

  // --- 5.2 AI Soil Analysis States ---
  const [soilForm, setSoilForm] = useState({
    pH: "7.8",
    N: "210", // Nitrogen (kg/hectare)
    P: "18",  // Phosphorus
    K: "140", // Potassium
    OM: "1.2", // Organic Matter (%)
    Zn: "0.8", // Zinc (ppm)
    Fe: "4.5", // Iron
    Mn: "3.2", // Manganese
    Cu: "0.4", // Copper
    B: "0.3"   // Boron
  });
  const [soilReportResult, setSoilReportResult] = useState<any>(null);

  const calculateSoilAnalysis = () => {
    const phVal = parseFloat(soilForm.pH);
    const nVal = parseFloat(soilForm.N);
    const pVal = parseFloat(soilForm.P);
    const kVal = parseFloat(soilForm.K);
    const omVal = parseFloat(soilForm.OM);

    // Dynamic Fertility rating
    let score = 50;
    if (phVal >= 6.5 && phVal <= 7.2) score += 15;
    if (nVal > 250) score += 10;
    if (pVal > 22) score += 10;
    if (kVal > 150) score += 10;
    if (omVal > 1.5) score += 5;

    score = Math.min(100, score);

    setSoilReportResult({
      fertilityScore: score,
      status: score > 80 ? "Highly Fertile" : score > 60 ? "Moderately Fertile" : "Requires Enrichment",
      deficiencies: [
        nVal < 250 ? "Low Nitrogen (Pre-monsoon urea required)" : "",
        kVal < 150 ? "Marginal Potassium (Apply Potash)" : "",
        phVal > 7.5 ? "Mild Alkaline pH (Sulphur amendment suggested)" : ""
      ].filter(Boolean),
      optimalCrops: score > 75 ? "Wheat, Soybean, Gram" : "Pearl Millet, Sorghum, Cowpea",
      threeYearPlan: [
        "Year 1: Apply Gypsum/Sulphur (50kg/acre) to reduce pH; grow cover crops to trap soil moisture.",
        "Year 2: Incorporate vermicompost & Trichoderma bio-fertilizers. Transition to micro-irrigation.",
        "Year 3: Practice strict crop rotation (legume crop intercropping) to rebuild native nitrogen nodules."
      ]
    });
  };

  // --- 5.3 AI Price & Yield Prediction ---
  const [predictionForm, setPredictionForm] = useState({
    crop: "Wheat",
    location: "Punjab Central Tracts",
    season: "Rabi",
    pastYield: "1.8" // tons/acre
  });
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const calculatePredictions = () => {
    const pastVal = parseFloat(predictionForm.pastYield);
    setPredictionResult({
      predictedYield: (pastVal * 1.08).toFixed(2), // 8% climate optimization
      expectedPrice: "2,275", // ₹ per quintal
      bestSellingWindow: "April 15 - May 10, 2026",
      riskFactors: "Unseasonable western disturbance showers, brown rust outbreak risk, localized grain market congestion.",
      strategyText: "Agronomist recommendation: Expecting localized market price spike of 5% in late April due to supply tightening. Store grains in dry warehouses for 2 weeks for optimal pricing."
    });
  };

  // --- 5.4 AI Research Summarizer ---
  const [paperUrl, setPaperUrl] = useState("");
  const [paperContent, setPaperContent] = useState("");
  const [summarizerResult, setSummarizerResult] = useState<any>(null);

  const triggerSummarize = () => {
    if (!paperUrl && !paperContent) {
      alert("Please provide a research paper PDF URL or copy abstract text.");
      return;
    }
    setSummarizerResult({
      title: paperUrl.includes("nature") ? "Nanotech Nano-Urea Foliar Delivery Efficiency" : "Bio-Remediation of Blight Pathogens using Bacterial Antagonists",
      summary: "This peer-reviewed analysis evaluates the biological efficacy of Bacillus velezensis strains in directly suppressing bacterial leaf blight lesions. Results indicate 84% reduction in spore germination under humid conditions.",
      keyFindings: [
        "Bacillus velezensis produces robust cyclic lipopeptides that break fungal cell walls.",
        "Optimum spraying is done at dusk to prevent UV degradation of vegetative endospores.",
        "Reduces necessity of synthetic chemical sprays like carbendazim by up to 60%."
      ],
      methodology: "Double-blind block designs with 150 grape vine segments across two sub-tropical humidity chambers.",
      recommendations: "Recommend 5ml/L concentration of native Bacillus liquid formulate at first sign of humidity trigger."
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Sub Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setLabTab("pathology")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            labTab === "pathology"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <BrainCircuit className="h-4 w-4" />
          AI Leaf Disease Analyst
        </button>
        <button
          onClick={() => setLabTab("soil")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            labTab === "soil"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Database className="h-4 w-4" />
          AI Soil Diagnostics
        </button>
        <button
          onClick={() => setLabTab("prediction")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            labTab === "prediction"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          AI Price & Yield Forecast
        </button>
        <button
          onClick={() => setLabTab("summarizer")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            labTab === "summarizer"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="h-4 w-4" />
          AI Research Summarizer
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* 5.1 AI DISEASE SCANNER */}
        {labTab === "pathology" && (
          <motion.div
            key="pathology"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <BrainCircuit className="h-4.5 w-4.5 text-emerald-600" />
                  Pathology computer Vision Sandbox
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Upload high-definition crop leaf photographs or trigger standard sample datasets to audit biological symptoms.</p>
              </div>

              {/* Sample Selector */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Analyze Standard Pathology Samples:</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => triggerDiseaseUpload(0)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-left transition-all cursor-pointer space-y-1"
                  >
                    <p className="text-xs font-black text-slate-800">Wheat Rust Scan</p>
                    <p className="text-[9px] text-slate-400 font-bold">Puccinia spores identification</p>
                  </button>
                  <button
                    onClick={() => triggerDiseaseUpload(1)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-left transition-all cursor-pointer space-y-1"
                  >
                    <p className="text-xs font-black text-slate-800">Grape Downy Mildew</p>
                    <p className="text-[9px] text-slate-400 font-bold">Plasmopara viticola foliage lesion</p>
                  </button>
                </div>
              </div>

              {/* Manual Upload simulation box */}
              <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all flex flex-col items-center justify-center space-y-2">
                <Upload className="h-8 w-8 text-slate-400" />
                <div>
                  <p className="text-xs font-black text-slate-700">Drag & Drop Crop leaf scan here</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1">Supports PNG, JPG (maximum 12MB)</p>
                </div>
              </div>

              {isAnalyzingDisease && (
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-center font-mono text-[10px] animate-pulse">
                  Initializing Convolutional Neural Network (DenseNet-201)... Scanning leaf margins...
                </div>
              )}
            </div>

            {/* Diagnostic Output Panel */}
            <div className="lg:col-span-6">
              {diseaseAnalysisResult ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[8px] bg-indigo-100 text-indigo-800 font-black px-1.5 py-0.5 rounded uppercase">
                        AI MODEL INTERPRETATION
                      </span>
                      <h4 className="font-black text-slate-800 text-sm mt-1">{diseaseAnalysisResult.name}</h4>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-black font-mono">
                      CONFIDENCE: {diseaseAnalysisResult.confidence}
                    </span>
                  </div>

                  {diseaseImage && (
                    <img src={diseaseImage} alt="Crop Scan" referrerPolicy="no-referrer" className="h-32 w-full object-cover rounded-xl border border-slate-200" />
                  )}

                  <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                    <div>
                      <span className="text-slate-400 text-[8px] block uppercase">Clinical Severity:</span>
                      <span className="text-rose-600 font-black">{diseaseAnalysisResult.severity}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[8px] block uppercase">Pathogen class:</span>
                      <span className="text-slate-700">Fungal Sporangiophore</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px]">
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                      <span className="font-black text-emerald-800 text-[8px] block uppercase">Prescribed Organic Cure:</span>
                      <p className="text-slate-700 mt-0.5 font-bold">{diseaseAnalysisResult.organicCure}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                      <span className="font-black text-slate-500 text-[8px] block uppercase">Recommended Chemical Cure (Failsafe):</span>
                      <p className="text-slate-700 mt-0.5 font-bold">{diseaseAnalysisResult.chemicalCure}</p>
                    </div>

                    <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg">
                      <span className="font-black text-indigo-800 text-[8px] block uppercase">Preemptive Prevention Plan:</span>
                      <p className="text-slate-700 mt-0.5 font-bold">{diseaseAnalysisResult.prevention}</p>
                    </div>
                  </div>

                  {/* Feedback Loop Actions */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Agronomist Override Feedback Loop:</span>
                    <input
                      type="text"
                      placeholder="Optional adjustment notes (e.g., dosage tweaks or alternative pathogens)..."
                      value={expertAdjustmentNotes}
                      onChange={(e) => setExpertAdjustmentNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleFeedbackLoop("Accepted")}
                        className="py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg"
                      >
                        Accept AI Call
                      </button>
                      <button
                        onClick={() => handleFeedbackLoop("Modified")}
                        className="py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg"
                      >
                        Modify & Save
                      </button>
                      <button
                        onClick={() => handleFeedbackLoop("Rejected")}
                        className="py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/50 font-bold text-[9px] uppercase tracking-wider rounded-lg"
                      >
                        Reject Diagnosis
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[350px]">
                  <BrainCircuit className="h-10 w-10 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-700 mt-2">Laboratory Screen Offline</p>
                  <p className="text-[10px] font-bold max-w-xs mt-1">Select a standard pathology sample leaf photograph or drag custom crop scans to run deep learning classification.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 5.2 AI SOIL ANALYSIS */}
        {labTab === "soil" && (
          <motion.div
            key="soil"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Input Form */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                Laboratory Soil Test Entry Panel
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Soil pH balance:</label>
                  <input
                    type="text"
                    value={soilForm.pH}
                    onChange={(e) => setSoilForm({ ...soilForm, pH: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Organic Matter (%):</label>
                  <input
                    type="text"
                    value={soilForm.OM}
                    onChange={(e) => setSoilForm({ ...soilForm, OM: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Nitrogen (N, kg/ha):</label>
                  <input
                    type="text"
                    value={soilForm.N}
                    onChange={(e) => setSoilForm({ ...soilForm, N: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Phosphorus (P, kg/ha):</label>
                  <input
                    type="text"
                    value={soilForm.P}
                    onChange={(e) => setSoilForm({ ...soilForm, P: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Potassium (K, kg/ha):</label>
                  <input
                    type="text"
                    value={soilForm.K}
                    onChange={(e) => setSoilForm({ ...soilForm, K: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Zinc (Zn, ppm):</label>
                  <input
                    type="text"
                    value={soilForm.Zn}
                    onChange={(e) => setSoilForm({ ...soilForm, Zn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>
              </div>

              <button
                onClick={calculateSoilAnalysis}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Run AI Soil Diagnostic
              </button>
            </div>

            {/* Output Analysis */}
            <div className="lg:col-span-7">
              {soilReportResult ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded uppercase">
                        AI REPORT payload
                      </span>
                      <h4 className="font-black text-slate-800 text-sm mt-1">Chemical Soil Diagnostics Summary</h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[8px] text-slate-400 font-black uppercase block">Fertility Score:</span>
                      <span className="text-xl font-black text-emerald-700 font-mono">{soilReportResult.fertilityScore} / 100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                      <span className="text-slate-400 text-[8px] block uppercase">Fertility Status:</span>
                      <span className="text-slate-800">{soilReportResult.status}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                      <span className="text-slate-400 text-[8px] block uppercase">Optimal Crop Fit:</span>
                      <span className="text-emerald-700 font-black">{soilReportResult.optimalCrops}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px]">
                    {soilReportResult.deficiencies.length > 0 && (
                      <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg space-y-1">
                        <span className="font-black text-rose-800 text-[8px] block uppercase">Critical Soil Deficits:</span>
                        {soilReportResult.deficiencies.map((def: string, i: number) => (
                          <p key={i} className="text-slate-700 font-bold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            {def}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg space-y-1.5">
                      <span className="font-black text-indigo-800 text-[8px] block uppercase">Long-Term 3-Year Soil Health Restoration Plan:</span>
                      {soilReportResult.threeYearPlan.map((plan: string, i: number) => (
                        <p key={i} className="text-slate-700 font-semibold italic leading-relaxed">
                          {plan}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                  <Database className="h-10 w-10 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-700 mt-2">Diagnostic Engine Stale</p>
                  <p className="text-[10px] font-bold max-w-xs mt-1">Enter soil chemistry readings (pH, Nitrogen, micronutrients) to compile optimal crop recommendations.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 5.3 AI PRICE & YIELD PREDICTION */}
        {labTab === "prediction" && (
          <motion.div
            key="prediction"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Input form */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Crop Yield & Market Pricing Predictor</h3>
              <div className="space-y-3.5 text-xs font-bold">
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Select Crop variety:</label>
                  <select
                    value={predictionForm.crop}
                    onChange={(e) => setPredictionForm({ ...predictionForm, crop: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1 focus:outline-none"
                  >
                    <option value="Wheat">Wheat (Kalyansona)</option>
                    <option value="Rice">Rice (Basmati-370)</option>
                    <option value="Cotton">Cotton (BT Hybrid)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Agro-Ecological Region:</label>
                  <input
                    type="text"
                    value={predictionForm.location}
                    onChange={(e) => setPredictionForm({ ...predictionForm, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Season Period:</label>
                  <input
                    type="text"
                    value={predictionForm.season}
                    onChange={(e) => setPredictionForm({ ...predictionForm, season: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Baseline Yield (tons per acre):</label>
                  <input
                    type="text"
                    value={predictionForm.pastYield}
                    onChange={(e) => setPredictionForm({ ...predictionForm, pastYield: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>
              </div>

              <button
                onClick={calculatePredictions}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Model Expected Returns
              </button>
            </div>

            {/* Predictions result */}
            <div className="lg:col-span-7">
              {predictionResult ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded uppercase">
                        REGRESSION CLOUD payload
                      </span>
                      <h4 className="font-black text-slate-800 text-sm mt-1">Expected Pricing & Harvesting Window</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px] font-bold">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="text-slate-400 text-[8px] block uppercase">Predicted Yield:</span>
                      <span className="text-slate-800 text-sm font-black font-mono">{predictionResult.predictedYield} tons / acre</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="text-slate-400 text-[8px] block uppercase">Minimum Support Price (MSP/FOB):</span>
                      <span className="text-emerald-700 text-sm font-black font-mono">₹{predictionResult.expectedPrice} / quintal</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-[10px]">
                    <div>
                      <span className="text-slate-400 text-[8px] block uppercase font-black">Best Selling Date Window:</span>
                      <p className="text-slate-800 font-black">{predictionResult.bestSellingWindow}</p>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg">
                      <span className="font-black text-rose-800 text-[8px] block uppercase">Climate & Market Risk Factors:</span>
                      <p className="text-slate-700 font-bold mt-1 leading-relaxed">"{predictionResult.riskFactors}"</p>
                    </div>

                    <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg">
                      <span className="font-black text-indigo-800 text-[8px] block uppercase">Strategic Farmer Advisory:</span>
                      <p className="text-indigo-900 font-bold mt-1 leading-relaxed italic">"{predictionResult.strategyText}"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                  <TrendingUp className="h-10 w-10 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-700 mt-2">Prediction Engine Inactive</p>
                  <p className="text-[10px] font-bold max-w-xs mt-1">Configure harvest parameters to compute expected yields and project optimized selling times.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 5.4 AI RESEARCH SUMMARIZER */}
        {labTab === "summarizer" && (
          <motion.div
            key="summarizer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Input form */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">AI Agronomy Paper Summarizer</h3>
              <p className="text-[10px] text-slate-400 font-bold">Paste URLs of peer-reviewed journals (ICAR, Nature Ag, Springer) or copy abstract sections to extract clinical guidelines.</p>

              <div className="space-y-3.5 text-xs font-bold">
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Research Paper URL / DOI:</label>
                  <input
                    type="text"
                    placeholder="e.g., https://nature.com/articles/s43016-026-wheat..."
                    value={paperUrl}
                    onChange={(e) => setPaperUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Abstract Copy-Paste:</label>
                  <textarea
                    rows={4}
                    placeholder="Paste paper abstract or clinical conclusion text directly..."
                    value={paperContent}
                    onChange={(e) => setPaperContent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700 font-extrabold mt-1"
                  />
                </div>
              </div>

              <button
                onClick={triggerSummarize}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Summarize & Extract Findings
              </button>
            </div>

            {/* Summary results */}
            <div className="lg:col-span-7">
              {summarizerResult ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[8px] bg-indigo-100 text-indigo-800 font-black px-1.5 py-0.5 rounded uppercase">
                        AI COGNITIVE EXTRACT payload
                      </span>
                      <h4 className="font-black text-slate-800 text-sm mt-1">{summarizerResult.title}</h4>
                    </div>
                    <button
                      onClick={() => alert("Summary successfully bookmarked in your sovereign pathobiology library.")}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-black uppercase tracking-wider rounded-lg border border-slate-200"
                    >
                      Save to Library
                    </button>
                  </div>

                  <div className="space-y-3.5 text-[10px] font-bold">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                      <span className="text-slate-400 text-[8px] block uppercase">Clinical Executive Summary:</span>
                      <p className="text-slate-600 font-semibold italic leading-relaxed mt-1">"{summarizerResult.summary}"</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[8px] block uppercase">Key Scientific Findings:</span>
                      {summarizerResult.keyFindings.map((finding: string, i: number) => (
                        <p key={i} className="text-slate-700 font-semibold flex items-center gap-1.5 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                          {finding}
                        </p>
                      ))}
                    </div>

                    <div>
                      <span className="text-slate-400 text-[8px] block uppercase">Methodology Evaluated:</span>
                      <p className="text-slate-700 font-semibold leading-relaxed mt-0.5">{summarizerResult.methodology}</p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                      <span className="font-black text-emerald-800 text-[8px] block uppercase">Practical Smallholder Farmer Recommendations:</span>
                      <p className="text-slate-700 mt-1 leading-relaxed">{summarizerResult.recommendations}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                  <BookOpen className="h-10 w-10 text-slate-300" />
                  <p className="text-xs font-black uppercase text-slate-700 mt-2">Abstract Summarizer Idle</p>
                  <p className="text-[10px] font-bold max-w-xs mt-1">Paste a URL or abstract snippet from agronomy papers to extract clinical research findings instantly.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
