import React, { useState } from "react";
import {
  Camera,
  Sparkles,
  CheckCircle,
  Upload,
  FileText,
  Layers,
  Activity,
  Leaf,
  Loader2,
  Globe,
  Plus
} from "lucide-react";

// Preseeded high-quality pathology samples
const DISEASES = [
  {
    id: "tomato-eb",
    crop: "Tomato",
    name: "Early Blight (Alternaria solani)",
    confidence: 96.4,
    bbox: { top: "30%", left: "40%", width: "120px", height: "120px" },
    leafClass: "bg-radial from-amber-600 via-emerald-800 to-emerald-950",
    symptomSpot: "w-24 h-24 bg-amber-800/80 border-4 border-amber-500 rounded-full blur-[2px]",
    treatments: {
      English: "Apply organic copper fungicide, prune lower leaves, and establish sub-surface drip irrigation to dry canopy.",
      Hindi: "जैविक तांबा कवकनाशी लगाएं, निचली पत्तियों की छंटाई करें, और उप-सतह ड्रिप सिंचाई स्थापित करें।",
      Punjabi: "ਜੈਵਿਕ ਤਾਂਬਾ ਉੱਲੀਨਾਸ਼ਕ ਲਗਾਓ, ਹੇਠਲੇ ਪੱਤੇ ਛਾਂਟੋ, ਅਤੇ ਸਿੰਚਾਈ ਪ੍ਰਣਾਲੀ ਸਹੀ ਕਰੋ।",
      Tamil: "கரிம தாமிர பூஞ்சைக் கொல்லியைப் பயன்படுத்தவும், கீழ் இலைகளை கத்தரிக்கவும்.",
      Telugu: "సేంద్రీయ రాగి శిలీంద్ర సంహారిణిని వర్తింపజేయండి, తక్కువ ఆకులను కత్తిరించండి.",
      Marathi: "सेंद्रिय तांबे बुरशीनाशक वापरा, खालची पाने छाटा.",
      Bengali: "জৈব তামা ছত্রাকনাশক প্রয়োগ করুন, নীচের পাতাগুলি ছাঁটাই করুন।",
      Kannada: "ಸಾವಯವ ತಾಮ್ರದ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಅನ್ವಯಿಸಿ, ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ಸಮರುವಿಕೆಯನ್ನು ಮಾಡಿ.",
      Malayalam: "ജൈവ ചെമ്പ് കുമിൾനാശിനി പ്രയോഗിക്കുക, താഴത്തെ ഇലകൾ മുറിക്കുക.",
      Gujarati: "ઓર્ગેનિક કોપર ફૂગનાશક લાગુ કરો, નીચલા પાંદડા કાપો."
    }
  },
  {
    id: "rice-bls",
    crop: "Rice Paddy",
    name: "Bacterial Leaf Streak (Xanthomonas)",
    confidence: 89.2,
    bbox: { top: "15%", left: "20%", width: "180px", height: "80px" },
    leafClass: "bg-gradient-to-r from-emerald-800 via-amber-700 to-emerald-900",
    symptomSpot: "w-32 h-10 bg-amber-900/90 border-4 border-yellow-600 rounded-lg rotate-12 blur-[1px]",
    treatments: {
      English: "Use certified disease-free seeds, avoid excessive nitrogen, and apply copper hydroxide sprays.",
      Hindi: "प्रमाणित रोगमुक्त बीजों का प्रयोग करें, अत्यधिक नाइट्रोजन से बचें और कॉपर हाइड्रोक्साइड स्प्रे का प्रयोग करें।",
      Punjabi: "ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਵਰਤੋ, ਜ਼ਿਆਦਾ ਨਾਈਟ੍ਰੋਜਨ ਤੋਂ ਬਚੋ ਅਤੇ ਤਾਂਬੇ ਦੇ ਘੋਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
      Tamil: "சான்றளிக்கப்பட்ட நோய் இல்லாத விதைகளைப் பயன்படுத்தவும், அதிகப்படியான நைட்ரஜனைத் தவிர்க்கவும்.",
      Telugu: "ధృవీకరించబడిన వ్యాధి లేని విత్తనాలను ఉపయోగించండి, అధిక నైట్రోజన్‌ను నివారించండి.",
      Marathi: "प्रमाणित रोगमुक्त बियाणे वापरा, जास्त नायट्रोजन टाळा.",
      Bengali: "প্রত্যয়িত রোগমুক্ত বীজ ব্যবহার করুন, অতিরিক্ত নাইট্রোজেন এড়িয়ে চলুন।",
      Kannada: "ಪ್ರಮಾಣೀಕೃತ ರೋಗ ಮುಕ್ತ ಬೀಜಗಳನ್ನು ಬಳಸಿ, ಅತಿಯಾದ ಸಾರಜನಕವನ್ನು ತಪ್ಪಿಸಿ.",
      Malayalam: "സാക്ഷ്യപ്പെടുത്തിയ രോഗരഹിത വിത്തുകൾ ഉപയോഗിക്കുക, അമിതമായ നൈട്രജൻ ഒഴിവാക്കുക.",
      Gujarati: "પ્રમાણિત રોગમુક્ત બીજનો ઉપયોગ કરો, વધુ પડતા નાઇટ્રોજન ટાળો."
    }
  },
  {
    id: "wheat-rust",
    crop: "Wheat",
    name: "Stem Rust (Puccinia graminis)",
    confidence: 94.8,
    bbox: { top: "45%", left: "55%", width: "90px", height: "140px" },
    leafClass: "bg-radial from-amber-700 via-yellow-900 to-emerald-950",
    symptomSpot: "w-14 h-32 bg-orange-800/90 border-4 border-orange-500 rounded-full rotate-45 blur-[2px]",
    treatments: {
      English: "Sow rust-resistant varieties early, restrict excessive moisture, and apply propiconazole triazole sprays.",
      Hindi: "जंग-प्रतिरोधी किस्में जल्दी बोएं, अतिरिक्त नमी को सीमित करें, और प्रोपिकोनाज़ोल का छिड़काव करें।",
      Punjabi: "ਜੰਗਾਲ-ਰੋਧਕ ਕਿਸਮਾਂ ਦੀ ਜਲਦੀ ਬਿਜਾਈ ਕਰੋ, ਜ਼ਿਆਦਾ ਸਿੱਲ੍ਹ ਨੂੰ ਰੋਕੋ ਅਤੇ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ ਛਿੜਕੋ।",
      Tamil: "துருவை எதிர்க்கும் ரகங்களை முன்கூட்டியே விதைக்கவும், அதிகப்படியான ஈரப்பதத்தை கட்டுப்படுத்தவும்.",
      Telugu: "తుప్పు నిరోధక రకాలను త్వరగా ಬಿತ್ತನೆ చేయండి, అదనపు తేమను పరిమितం చేయండి.",
      Marathi: "तांबेरा-प्रतिरोधक वाणांची लवकर पेरणी करा, जास्त ओलावा मर्यादित करा.",
      Bengali: "মরচে-প্রতিরোধী জাতের আগাম বপন করুন, অতিরিক্ত আর্দ্রতা সীমিত করুন।",
      Kannada: "ತುಕ್ಕು ನಿರೋಧಕ ತಳಿಗಳನ್ನು ಬೇಗನೆ ಬಿತ್ತನೆ ಮಾಡಿ, ಹೆಚ್ಚುವರಿ ತೇವಾಂಶವನ್ನು ನಿರ್ಬಂಧಿಸಿ.",
      Malayalam: "തുരുമ്പ് പ്രതിരോധശേഷിയുള്ള ഇനങ്ങൾ നേരത്തെ വിതയ്ക്കുക, ഈർപ്പം പരിമിതപ്പെടുത്തുക.",
      Gujarati: "ગેરુ-પ્રતિરોધક જાતો વહેલી વાવો, વધારાના ભેજને મર્યાदित કરો."
    }
  }
];

// Preseeded soil reports
const SOIL_REPORTS = [
  {
    name: "Sandy Loam - Acidic Plot B",
    pH: 5.4,
    N: 110, // low
    P: 22,  // optimal
    K: 140, // optimal
    limeRequired: 150, // kg
    adjustmentN: "+12kg/Acre",
    adjustmentP: "None",
    adjustmentK: "None"
  },
  {
    name: "Deep Black Clay - Alkaline Block C",
    pH: 7.9,
    N: 180, // optimal
    P: 12,  // low
    K: 95,  // low
    limeRequired: 0, // none, needs sulfur
    adjustmentN: "None",
    adjustmentP: "+8kg/Acre",
    adjustmentK: "+15kg/Acre"
  }
];

export const CropPathologyAI: React.FC = () => {
  const [activeLang, setActiveLang] = useState<string>("English");
  const [selectedDisease, setSelectedDisease] = useState<string>("tomato-eb");
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosisFinished, setDiagnosisFinished] = useState<boolean>(true);

  const [selectedSoil, setSelectedSoil] = useState<number>(0);
  const [isAnalyzingSoil, setIsAnalyzingSoil] = useState<boolean>(false);
  const [soilSuccess, setSoilSuccess] = useState<boolean>(true);

  const handleDiseaseChange = (id: string) => {
    setSelectedDisease(id);
    setIsDiagnosing(true);
    setDiagnosisFinished(false);
    setTimeout(() => {
      setIsDiagnosing(false);
      setDiagnosisFinished(true);
    }, 1200);
  };

  const triggerSoilAnalysis = () => {
    setIsAnalyzingSoil(true);
    setSoilSuccess(false);
    setTimeout(() => {
      setIsAnalyzingSoil(false);
      setSoilSuccess(true);
    }, 1500);
  };

  const diseaseObj = DISEASES.find(d => d.id === selectedDisease) || DISEASES[0];
  const soilObj = SOIL_REPORTS[selectedSoil];

  return (
    <div id="ai-pathology-soil" className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-emerald-400" /> Agronomic Computer Vision & Soil Diagnostics AI
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            Deploy YOLOv8 leaf diagnosis and PDF chemical soil health analyzers instantly across 10 regional Indian languages.
          </p>
        </div>

        {/* Language Selection */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
          <Globe className="h-4 w-4 text-emerald-500 shrink-0" />
          <select
            value={activeLang}
            onChange={(e) => setActiveLang(e.target.value)}
            className="bg-transparent border-none text-white font-extrabold focus:outline-none cursor-pointer text-[10.5px] uppercase"
          >
            {["English", "Hindi", "Punjabi", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada", "Malayalam", "Gujarati"].map((lang) => (
              <option key={lang} value={lang} className="text-slate-900">
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Grid: Crop Pathology YOLOv8 Simulator */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">
            Module A: Leaf Pathology Computer Vision
          </span>

          <div className="flex gap-2">
            {DISEASES.map(d => (
              <button
                key={d.id}
                onClick={() => handleDiseaseChange(d.id)}
                className={`flex-1 py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedDisease === d.id 
                    ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-black text-xs shadow-sm" 
                    : "border-slate-850 bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                }`}
              >
                {d.crop}
              </button>
            ))}
          </div>

          {/* Interactive Bounding Box Leaf Canvas */}
          <div className="relative h-[240px] rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center bg-slate-950 shadow-inner">
            <div className={`absolute inset-0 ${diseaseObj.leafClass} opacity-90 transition-all flex items-center justify-center`}>
              <div className={`${diseaseObj.symptomSpot} transition-all`} />
            </div>

            {/* Simulated Bounding Box Overlay */}
            {diagnosisFinished && !isDiagnosing && (
              <div
                className="absolute border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-xl flex flex-col justify-between p-1.5 animate-in zoom-in-90 duration-300 select-none"
                style={{
                  top: diseaseObj.bbox.top,
                  left: diseaseObj.bbox.left,
                  width: diseaseObj.bbox.width,
                  height: diseaseObj.bbox.height
                }}
              >
                <span className="bg-rose-600 text-white font-mono text-[7px] font-black px-1 py-0.2 rounded self-start leading-none uppercase">
                  {diseaseObj.crop} Rust Conf: {diseaseObj.confidence}%
                </span>
                <span className="text-rose-400 font-mono text-[7px] font-bold self-end bg-slate-950/80 px-1 py-0.2 rounded">
                  Inference: YOLOv8-M
                </span>
              </div>
            )}

            {isDiagnosing && (
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                <span className="text-xs font-mono text-emerald-400 font-bold tracking-widest animate-pulse">
                  CNN CONVOLUTING LEAF MATRICES...
                </span>
              </div>
            )}

            {/* Bottom Camera Trigger HUD */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-slate-950/80 backdrop-blur-xs border border-slate-800 px-3.5 py-2 rounded-xl text-[9px] font-bold text-slate-400 select-none">
              <span className="flex items-center gap-1">
                <Camera className="h-3.5 w-3.5 text-emerald-500" /> CAMERA SCAN ACTIVE
              </span>
              <span className="font-mono text-emerald-400">FPS: 32.4 • LATENCY: 14ms</span>
            </div>
          </div>

          {/* Diagnosis details panel */}
          {diagnosisFinished && !isDiagnosing && (
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-2.5 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-black text-white">{diseaseObj.name}</h5>
                <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-black uppercase">
                  CONFIDENCE {diseaseObj.confidence}%
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-black text-emerald-500 uppercase block tracking-wider">
                  Recommended Treatment Recipe ({activeLang})
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {diseaseObj.treatments[activeLang as keyof typeof diseaseObj.treatments] || diseaseObj.treatments.English}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Grid: Soil health card PDF report generator */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">
            Module B: PDF Soil Health Card Analyzer
          </span>

          <div className="grid grid-cols-2 gap-2">
            {SOIL_REPORTS.map((r, rIdx) => (
              <button
                key={rIdx}
                onClick={() => { setSelectedSoil(rIdx); triggerSoilAnalysis(); }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  selectedSoil === rIdx 
                    ? "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-bold" 
                    : "border-slate-850 bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-black block truncate">{r.name}</span>
                <span className="text-[8.5px] text-slate-500 font-bold block mt-1">pH {r.pH} • NPK Balanced</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            {/* Soil health parameters dashboard */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 select-none">
              <span className="text-[9px] font-black text-slate-400 uppercase">
                Nutrient Deficiency Extractor
              </span>
              <button
                onClick={triggerSoilAnalysis}
                className="text-[9px] text-emerald-400 hover:text-emerald-300 font-black uppercase flex items-center gap-1 cursor-pointer"
              >
                <Upload className="h-3 w-3" /> Upload PDF Report
              </button>
            </div>

            {isAnalyzingSoil ? (
              <div className="h-[140px] flex flex-col items-center justify-center space-y-2">
                <Loader2 className="h-7 w-7 text-emerald-500 animate-spin" />
                <span className="text-[10px] font-mono text-emerald-400 font-extrabold tracking-widest animate-pulse uppercase">
                  Parsing Soil health card PDF structure...
                </span>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 4 Nutrient Gauges */}
                <div className="grid grid-cols-4 gap-2.5">
                  <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg text-center">
                    <span className="text-[8px] font-black text-slate-500 uppercase block">pH Index</span>
                    <span className="text-sm font-black font-mono text-white mt-1 block">{soilObj.pH}</span>
                    <span className={`text-[7px] font-black uppercase mt-0.5 inline-block ${
                      soilObj.pH < 6.0 ? "text-rose-400" : soilObj.pH > 7.5 ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {soilObj.pH < 6.0 ? "Acidic" : soilObj.pH > 7.5 ? "Alkaline" : "Optimal"}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg text-center">
                    <span className="text-[8px] font-black text-slate-500 uppercase block">Nitrogen</span>
                    <span className="text-sm font-black font-mono text-white mt-1 block">{soilObj.N}</span>
                    <span className={`text-[7px] font-black uppercase mt-0.5 inline-block ${
                      soilObj.N < 140 ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      {soilObj.N < 140 ? "Deficient" : "Adequate"}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg text-center">
                    <span className="text-[8px] font-black text-slate-500 uppercase block">Phosphorus</span>
                    <span className="text-sm font-black font-mono text-white mt-1 block">{soilObj.P}</span>
                    <span className={`text-[7px] font-black uppercase mt-0.5 inline-block ${
                      soilObj.P < 15 ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      {soilObj.P < 15 ? "Deficient" : "Adequate"}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg text-center">
                    <span className="text-[8px] font-black text-slate-500 uppercase block">Potassium</span>
                    <span className="text-sm font-black font-mono text-white mt-1 block">{soilObj.K}</span>
                    <span className={`text-[7px] font-black uppercase mt-0.5 inline-block ${
                      soilObj.K < 120 ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      {soilObj.K < 120 ? "Deficient" : "Adequate"}
                    </span>
                  </div>
                </div>

                {/* AI recommendation outputs */}
                <div className="bg-slate-950 p-3 border border-slate-850 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-400">
                    <span>N-P-K Chemical Fertilizer Compensations</span>
                    <span className="text-emerald-400">100% Calculated</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[9.5px]">
                    <div className="border border-slate-850 p-1.5 rounded-md">
                      <span className="text-[7.5px] block text-slate-500">Nitrogen adjustment</span>
                      <span className="font-mono text-white font-bold block mt-0.5">{soilObj.adjustmentN}</span>
                    </div>
                    <div className="border border-slate-850 p-1.5 rounded-md">
                      <span className="text-[7.5px] block text-slate-500">Phosphorus adjustment</span>
                      <span className="font-mono text-white font-bold block mt-0.5">{soilObj.adjustmentP}</span>
                    </div>
                    <div className="border border-slate-850 p-1.5 rounded-md">
                      <span className="text-[7.5px] block text-slate-500">Potassium adjustment</span>
                      <span className="font-mono text-white font-bold block mt-0.5">{soilObj.adjustmentK}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2.5">
                  <Leaf className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wide block">
                      AI Soil Amendment & pH Correction Advisor
                    </span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {soilObj.limeRequired > 0 ? (
                        <>
                          Apply <strong>{soilObj.limeRequired}kg Agricultural Limestone</strong> (Calcium Carbonate) per acre to balance soil pH from {soilObj.pH} back to neutral 6.5. This unlocks locked phosphorus binds.
                        </>
                      ) : (
                        <>
                          Soil pH is {soilObj.pH} (Alkaline). Add <strong>45kg elemental agricultural sulfur</strong> per acre to lower pH and enhance iron/micronutrient uptake curves.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPathologyAI;
