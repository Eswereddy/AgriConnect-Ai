import React, { useState, useMemo } from "react";
import {
  Brain,
  Sparkles,
  ShieldAlert,
  Compass,
  Cpu,
  Bookmark,
  Users,
  Sprout,
  CheckCircle2,
  BookmarkCheck,
  Award,
  BookOpen,
  Volume2,
  Smartphone,
  Check,
  Activity,
  Heart,
  Scale
} from "lucide-react";

export default function PersonalizedAIProfiling() {
  // Wizard states
  const [activeStep, setActiveStep] = useState<number>(1);
  const [q1, setQ1] = useState<string>("sustainable"); // Farming goals
  const [q2, setQ2] = useState<number>(4); // Risk tolerance (1-5)
  const [q3, setQ3] = useState<string>("app"); // Communication choice
  const [q4, setQ4] = useState<string>("visual"); // Learning style
  const [q5, setQ5] = useState<number>(3); // Tech adoption level (1-5)

  // Custom edits states on final profile
  const [editingNotes, setEditingNotes] = useState<boolean>(false);
  const [customProfileNotes, setCustomProfileNotes] = useState<string>(
    "Eswar focuses primarily on water-conscious organic basmati rice cultivation using solar-drip irrigation. He has a high affinity for voice-based co-pilot support."
  );

  // Health and stress states (simulated sliders on the final card)
  const [stressLevel, setStressLevel] = useState<number>(35); // %
  const [timeAvailable, setTimeAvailable] = useState<number>(80); // % hours/week

  // Calculate profiling categories based on wizard responses
  const profilingSummary = useMemo(() => {
    let adopterCategory = "Early Adopter";
    let adopterDesc = "Eager to adopt precision tech, IoT sensors, and satellite maps.";
    let styleCategory = "Eco-Centric Optimizer";
    let goalsText = "Sustainability, climate resilience, and long-term land legacy.";
    let decisionStyle = "Analytic-Driven Precision";

    // Adopter category rules
    if (q5 >= 5) {
      adopterCategory = "Tech Innovator";
      adopterDesc = "Sponsors localized testbeds. Promotes smart contract payments and drone mappings.";
    } else if (q5 <= 2) {
      adopterCategory = "Pragmatic Late-Adopter";
      adopterDesc = "Prefers proven traditional practices; adopts tech slowly upon community validation.";
    }

    // Goal rules
    if (q1 === "profit") {
      styleCategory = "Market-Heavy Arbitrageur";
      goalsText = "Maximizing yield margins, contract farming gains, and crop futures arbitrage.";
      decisionStyle = "Opportunistic Financial Decision-Making";
    } else if (q1 === "legacy") {
      styleCategory = "Traditional Heritage Farmer";
      goalsText = "Conserving family heirloom practices, heirloom seeds, and soil carbon index.";
      decisionStyle = "Intuitive Family-Focused Decision-Making";
    }

    // Compute indices
    const techIndex = q5 * 20;
    const riskIndex = q2 * 20;
    const environmentalScore = q1 === "sustainable" ? 94 : q1 === "legacy" ? 85 : 62;
    const digitalLiteracy = q3 === "app" ? 88 : q3 === "sms" ? 45 : 78;
    const financialLiteracy = q2 >= 4 ? 90 : 75;

    return {
      adopterCategory,
      adopterDesc,
      styleCategory,
      goalsText,
      decisionStyle,
      techIndex,
      riskIndex,
      environmentalScore,
      digitalLiteracy,
      financialLiteracy
    };
  }, [q1, q2, q3, q4, q5]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Visual Header */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <Brain className="h-3.5 w-3.5 text-indigo-500 animate-pulse" /> Personalized AI Profiling Engine
        </span>
        <h2 className="text-slate-800 text-lg font-black uppercase tracking-tight mt-2 flex items-center gap-2">
          🧬 Agronomic Mindset & Psychographic Profile
        </h2>
        <p className="text-slate-500 text-xs font-semibold">
          Maps your farm style, tech adoption curve speed, learning behaviors, and social networks to customize all automated co-pilot advisor alerts.
        </p>
      </div>

      {/* Main Grid: Split wizard from the active profiling scoreboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Psychographic Assessment Wizard (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-250/60 rounded-xl p-5 space-y-5">
          <div className="flex justify-between items-center border-b pb-2.5">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-500" /> Profiling Assessment Wizard
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
              Question {activeStep} of 5
            </span>
          </div>

          {/* Question 1: Goals */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-700 leading-normal">
                1. What is the fundamental goal that guides your seasonal crop choices and cultivation strategy?
              </p>
              <div className="space-y-2">
                {[
                  { id: "sustainable", label: "🌱 Sustainability & Climate Resilience", desc: "Long-term soil health, low chemical footprint, water preservation." },
                  { id: "profit", label: "💰 Yield Profitability & Crop Margins", desc: "High yield, premium market pricing, aggressive contract hedging." },
                  { id: "legacy", label: "🏡 Family Legacy & Local Community", desc: "Traditional values, heirloom grains, crop sharing, community support." }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQ1(opt.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                      q1 === opt.id
                        ? "bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold flex justify-between items-center">
                      <span>{opt.label}</span>
                      {q1 === opt.id && <Check className="h-4 w-4 text-indigo-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 2: Risk Tolerance */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-700 leading-normal">
                2. How would you rate your risk tolerance when dealing with novel seed variants, high credit loans, or advanced contract models?
              </p>
              <div className="space-y-3 bg-white p-4 border rounded-xl">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Conservative (Risk Averse)</span>
                  <span>Moderate</span>
                  <span>Dynamic (Risk Loving)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={q2}
                  onChange={(e) => setQ2(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="text-center font-bold text-indigo-800 text-xs mt-2">
                  Level {q2} / 5 : {q2 === 1 ? "Minimum-risk baseline" : q2 === 3 ? "Balanced risk-sharing co-op models" : "Agile futures trading"}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Risk profiling automatically configures default loan approvals and insurance policy recommendations on the ledger.
              </p>
            </div>
          )}

          {/* Question 3: Communication Channel */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-700 leading-normal">
                3. What is your preferred day-to-day channel for receiving critical pest alerts, market prices, and weather warning updates?
              </p>
              <div className="space-y-2">
                {[
                  { id: "voice", label: "🗣️ Voice Interaction (Phone Call / Voice-to-Voice)", icon: Volume2 },
                  { id: "app", label: "📱 In-App Rich Push Notifications & Widgets", icon: Smartphone },
                  { id: "sms", label: "💬 SMS Fallback / Feature Phone USSD Code", icon: Users }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQ3(opt.id)}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      q3 === opt.id
                        ? "bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <opt.icon className="h-4 w-4 text-indigo-600" />
                        {opt.label}
                      </span>
                      {q3 === opt.id && <Check className="h-4 w-4 text-indigo-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 4: Learning Style */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-700 leading-normal">
                4. Which educational material helps you adopt new organic methods or maintain equipment drip valves most efficiently?
              </p>
              <div className="space-y-2">
                {[
                  { id: "visual", label: "🎥 Visual (Infographics, Video Tutorials, 3D Digital Twin Models)" },
                  { id: "audio", label: "🎧 Audio-Centric (Podcasts, Voice Broadcasts, Live Co-op Calls)" },
                  { id: "text", label: "📄 Text-Centric (Research Papers, Bulletins, PDF Manuals)" }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setQ4(opt.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                      q4 === opt.id
                        ? "bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold shadow-2xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold flex justify-between items-center">
                      <span>{opt.label}</span>
                      {q4 === opt.id && <Check className="h-4 w-4 text-indigo-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question 5: Tech Adoption Readiness */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-700 leading-normal">
                5. How prepared are you to integrate cutting-edge precision IoT sensors, drone flight paths, and blockchain crop-origin verification?
              </p>
              <div className="space-y-3 bg-white p-4 border rounded-xl">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Slow adopter</span>
                  <span>Balanced co-op</span>
                  <span>Cutting-edge innovator</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={q5}
                  onChange={(e) => setQ5(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="text-center font-bold text-indigo-800 text-xs mt-2">
                  Level {q5} / 5 : {q5 >= 4 ? "Early-innovator vanguard" : "Verified safety follower"}
                </div>
              </div>
            </div>
          )}

          {/* Wizard Actions Footer */}
          <div className="flex justify-between items-center border-t pt-4">
            <button
              onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
              disabled={activeStep === 1}
              className="px-3.5 py-1.5 bg-white border rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              &larr; Back
            </button>
            <button
              onClick={() => {
                if (activeStep < 5) {
                  setActiveStep((p) => p + 1);
                } else {
                  alert("Profiling assessment completed! Scorecard metrics successfully updated.");
                  setActiveStep(1); // loop back
                }
              }}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
            >
              {activeStep === 5 ? "Submit & Save Mindset Profile" : "Next Question &rarr;"}
            </button>
          </div>

        </div>

        {/* Right Side: Active Profiling Scorecard (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6 shadow-md">
          
          {/* Header section on card */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <span className="text-[8px] bg-indigo-600/25 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                Active Psychographic Mindset Status
              </span>
              <h3 className="text-white text-base font-black uppercase tracking-wide mt-1.5 flex items-center gap-1.5">
                👨‍🌾 Eswar Reddy's Core Scorecard
              </h3>
            </div>
            <div className="bg-emerald-600/20 text-emerald-400 border border-emerald-900/40 px-3 py-1 rounded-xl text-center text-xs font-bold animate-pulse">
              {profilingSummary.environmentalScore}% Enviro-Score
            </div>
          </div>

          {/* Main Attributes grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold leading-relaxed">
            
            {/* Mindset Category */}
            <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <span className="text-[8.5px] text-slate-400 uppercase font-black block">Farming Mindset Archetype</span>
              <span className="text-emerald-300 font-extrabold text-[12.5px] block">{profilingSummary.styleCategory}</span>
              <span className="text-[10px] text-slate-300 block font-normal">{profilingSummary.goalsText}</span>
            </div>

            {/* Tech Curve positioning */}
            <div className="space-y-1 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <span className="text-[8.5px] text-slate-400 uppercase font-black block">Innovation curve position</span>
              <span className="text-indigo-300 font-extrabold text-[12.5px] block">{profilingSummary.adopterCategory}</span>
              <span className="text-[10px] text-slate-300 block font-normal">{profilingSummary.adopterDesc}</span>
            </div>

            {/* Decision & Learning */}
            <div className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[8px] text-slate-400 uppercase font-extrabold block">Decision-making Style</span>
                <span className="text-slate-100 font-bold block">{profilingSummary.decisionStyle}</span>
              </div>
              <div className="border-t border-slate-800/60 pt-1.5">
                <span className="text-[8px] text-slate-400 uppercase font-extrabold block">Learning Style Modality</span>
                <span className="text-slate-100 font-bold uppercase tracking-wider block">
                  🎨 {q4} Preference ({q4 === "visual" ? "88% Density Graphs" : q4 === "audio" ? "90% TTS Alerts" : "75% PDF Bulletins"})
                </span>
              </div>
            </div>

            {/* Land Ownership & Family */}
            <div className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-slate-400 font-bold">Land ownership type:</span>
                <span className="text-slate-100 font-extrabold">Cooperative Lease</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px] border-t border-slate-800/60 pt-1">
                <span className="text-slate-400 font-bold">Family involvement level:</span>
                <span className="text-slate-100 font-extrabold">Medium-Heavy (Joint household)</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px] border-t border-slate-800/60 pt-1">
                <span className="text-slate-400 font-bold">Climate change awareness:</span>
                <span className="text-emerald-400 font-extrabold">Vanguard (Extreme)</span>
              </div>
            </div>
          </div>

          {/* Indices Progress bars */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider">Mindset Index Measures</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tech Index */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9.5px] font-bold">
                  <span className="text-slate-400">Technology Adoption Index</span>
                  <span className="text-indigo-400">{profilingSummary.techIndex}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full border border-slate-800 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${profilingSummary.techIndex}%` }} />
                </div>
              </div>

              {/* Risk Tolerance */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9.5px] font-bold">
                  <span className="text-slate-400">Risk Appetite Threshold</span>
                  <span className="text-orange-400">{profilingSummary.riskIndex}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full border border-slate-800 overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full transition-all duration-300" style={{ width: `${profilingSummary.riskIndex}%` }} />
                </div>
              </div>

              {/* Digital Literacy */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9.5px] font-bold">
                  <span className="text-slate-400">Digital & Smartphone Literacy</span>
                  <span className="text-blue-400">{profilingSummary.digitalLiteracy}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full border border-slate-800 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${profilingSummary.digitalLiteracy}%` }} />
                </div>
              </div>

              {/* Financial Literacy */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9.5px] font-bold">
                  <span className="text-slate-400">Financial Literacy & Hedging</span>
                  <span className="text-emerald-400">{profilingSummary.financialLiteracy}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full border border-slate-800 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${profilingSummary.financialLiteracy}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Health Status & Stress consideration (Sliders in real-time) */}
          <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl space-y-3">
            <span className="text-[8.5px] text-slate-400 uppercase font-black tracking-wide block flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-rose-500 animate-pulse" /> Health status & capacity considerations
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-300">
                  <span>Logged Stress Level</span>
                  <span className={stressLevel > 60 ? "text-rose-400" : "text-emerald-400"}>{stressLevel}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="w-full accent-rose-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-300">
                  <span>Farm Hours Availability</span>
                  <span>{timeAvailable}% ({Math.round(timeAvailable * 0.6)} hrs/wk)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={timeAvailable}
                  onChange={(e) => setTimeAvailable(parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Custom Psychographic Notes */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-2 text-[10.5px]">
            <div className="flex justify-between items-center text-slate-400 text-[8.5px] font-black uppercase">
              <span>Co-Pilot Mindset Notes</span>
              <button
                onClick={() => setEditingNotes(!editingNotes)}
                className="text-indigo-400 hover:text-indigo-200 underline cursor-pointer"
              >
                {editingNotes ? "✕ Cancel" : "📝 Edit Notes"}
              </button>
            </div>

            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={customProfileNotes}
                  onChange={(e) => setCustomProfileNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-1.5 text-[10.5px] focus:outline-none"
                  rows={2}
                />
                <button
                  onClick={() => setEditingNotes(false)}
                  className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            ) : (
              <p className="text-slate-300 font-semibold italic">
                "{customProfileNotes}"
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
