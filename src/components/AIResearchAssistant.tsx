import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Copy,
  LineChart as LineIcon,
  TrendingUp,
  Award,
  DollarSign,
  FileCheck,
  Lightbulb,
  GraduationCap,
  Layers,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  Mail,
  Loader2,
  ChevronRight,
  Database
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { ResearchPaper } from "../types";

interface AIResearchAssistantProps {
  onAddPaper: (newPaper: ResearchPaper) => void;
}

type TabType =
  | "paper"
  | "summary"
  | "experiment"
  | "visualizer"
  | "universities"
  | "citation"
  | "review"
  | "grant"
  | "patent";

export default function AIResearchAssistant({ onAddPaper }: AIResearchAssistantProps) {
  const [activeTab, setActiveTab] = useState<TabType>("paper");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);

  // Form States
  // 1. Paper Generator
  const [cropType, setCropType] = useState("Millet");
  const [soilMoisture, setSoilMoisture] = useState("42%");
  const [npk, setNpk] = useState("120:60:40");
  const [findings, setFindings] = useState("32% increase in grain yield under subsurface drip irrigation with 40% lower water footprint.");

  // 2. Summary
  const [articleText, setArticleText] = useState("");

  // 3. Experiment
  const [expGoal, setExpGoal] = useState("Compare tomato crop response and nitrate leaching under vermicompost vs synthetic nitrogen.");

  // 4. Visualizer
  const [selectedChartDataset, setSelectedChartDataset] = useState<"yield" | "npk" | "water">("yield");
  const [chartData, setChartData] = useState({
    yield: [
      { treatment: "Control", yield: 1.8, protein: 9.1 },
      { treatment: "Drip (Low N)", yield: 2.3, protein: 9.8 },
      { treatment: "Drip (Med N)", yield: 2.9, protein: 10.5 },
      { treatment: "Drip (High N)", yield: 3.5, protein: 11.2 },
      { treatment: "Subsurface", yield: 3.8, protein: 11.6 }
    ],
    npk: [
      { depth: "0-15cm", Nitrogen: 110, Phosphorus: 55, Potassium: 180 },
      { depth: "15-30cm", Nitrogen: 85, Phosphorus: 30, Potassium: 120 },
      { depth: "30-45cm", Nitrogen: 62, Phosphorus: 18, Potassium: 95 },
      { depth: "45-60cm", Nitrogen: 40, Phosphorus: 12, Potassium: 70 },
      { depth: "60-90cm", Nitrogen: 25, Phosphorus: 8, Potassium: 65 }
    ],
    water: [
      { day: "Day 1", MoistenDrip: 45, MoistenFurrow: 40 },
      { day: "Day 3", MoistenDrip: 42, MoistenFurrow: 34 },
      { day: "Day 5", MoistenDrip: 39, MoistenFurrow: 26 },
      { day: "Day 7", MoistenDrip: 44, MoistenFurrow: 42 },
      { day: "Day 9", MoistenDrip: 41, MoistenFurrow: 33 },
      { day: "Day 11", MoistenDrip: 38, MoistenFurrow: 24 }
    ]
  });

  // 5. Universities
  const [researchDomain, setResearchDomain] = useState("Soil Microbiome & Nitrogen Fixation");

  // 6. Citations
  const [citeTitle, setCiteTitle] = useState("Sustainable Carbon Sequestration in Semi-Arid Soil Systems");
  const [citeAuthor, setCiteAuthor] = useState("Sharma, A., Kumar, R., & Patel, M.");
  const [citeYear, setCiteYear] = useState("2025");
  const [citeJournal, setCiteJournal] = useState("Indian Journal of Agricultural Sciences");
  const [citeVolume, setCiteVolume] = useState("95(3)");
  const [citePages, setCitePages] = useState("204-219");

  // 7. Peer Review
  const [reviewTitle, setReviewTitle] = useState("IoT Automated Drip Systems: Response curves of Maize hybrid-X");
  const [reviewAbstract, setReviewAbstract] = useState("This study evaluated hybrid Maize resistance under high temperature using automated sub-surface IoT soil probes. Results show a 15% increase in WUE, but minor nitrogen runoff under heavy rain conditions.");

  // 8. Grant
  const [grantIdea, setGrantIdea] = useState("Low-cost solar telemetry node grids for cooperative smallholder dryland farmers.");
  const [fundingAgency, setFundingAgency] = useState("NABARD (National Bank for Agriculture and Rural Development)");

  // 9. Patent
  const [patentName, setPatentName] = useState("Bio-electrochemical self-regulating soil pH balancing probe");
  const [patentDetails, setPatentDetails] = useState("A copper-zinc electrode soil probe utilizing small microbial fuel cell currents to drive local soil counter-ions, correcting high alkalinity natively without chemical gypsum.");

  // Call server api
  const executeResearchTask = async (task: TabType, payload: any) => {
    setIsLoading(true);
    setResult(null);
    setCopied(false);
    setPublished(false);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, payload })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setResult(data.text);
      } else {
        setResult(`Error: ${data.error || "Failed to process research request."}`);
      }
    } catch (err) {
      setResult("Network error. Please verify that your dev server is active on port 3000.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublishToCatalog = () => {
    if (!result) return;
    
    // Parse out a title from Markdown or invent one
    let paperTitle = "Optimized Crop Yield & Agronomic Metrics Research";
    const lines = result.split("\n");
    for (const line of lines) {
      if (line.toLowerCase().startsWith("# title:") || line.toLowerCase().startsWith("# ")) {
        paperTitle = line.replace(/# title:|#/gi, "").trim();
        break;
      }
    }

    const newPaper: ResearchPaper = {
      id: `paper-${Date.now()}`,
      title: paperTitle,
      author: "AgriConnect AI Research Assistant",
      domain: cropType ? `${cropType} Agronomy` : "General Agronomy",
      summary: result.length > 300 ? result.substring(0, 300) + "..." : result,
      views: 0,
      date: new Date().toLocaleDateString()
    };

    onAddPaper(newPaper);
    setPublished(true);
  };

  // Pre-load article text for easier user testing of Summarizer
  const loadSampleArticle = () => {
    setArticleText(
      "AGRONOMIC PERFORMANCE of Zea mays L. UNDER CONSERVATION TILLAGE.\n\nAbstract:\nField studies were conducted across Punjab over three consecutive seasons to assess soil conservation tillage compared to intensive disc plowing. Conservation tillage left >30% crop residue on the surface. Soil organic matter in the top 10cm increased by 0.15% per annum. Soil moisture content remained 12% higher on average during grain-filling stages. Resultant Maize grain yields under conservation tillage averaged 7.8 tons/hectare, representing a 9% yield advantage over conventional tillage in low-rainfall seasons, and 4% under normal rainfall. Furthermore, tractor diesel consumption was reduced by 62 Litres/hectare, improving the overall net economic benefit for regional smallholders by ₹14,500/hectare."
    );
  };

  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];

    return lines.map((line, idx) => {
      // Code block
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const code = codeContent.join("\n");
          codeContent = [];
          return (
            <div key={idx} className="my-3 bg-slate-900 rounded-xl p-4 overflow-x-auto relative group">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                }}
                className="absolute right-3 top-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded transition-all cursor-pointer font-sans font-bold"
              >
                Copy Code
              </button>
              <pre className="text-teal-400 font-mono text-xs">{code}</pre>
            </div>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return null;
      }

      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      // Headers
      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mt-5 mb-3 tracking-tight">
            {trimmed.substring(2)}
          </h1>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xs font-extrabold text-teal-800 mt-4 mb-2 tracking-tight flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600"></span>
            {trimmed.substring(3)}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-xs font-bold text-slate-800 mt-3 mb-1.5">
            {trimmed.substring(4)}
          </h3>
        );
      }

      // Bullet points
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-4 my-1">
            <span className="text-teal-600 font-bold mt-0.5 text-xs">•</span>
            <span className="text-xs text-slate-600 leading-relaxed font-medium">{trimmed.substring(2)}</span>
          </div>
        );
      }

      // Bold formatter helper
      const parts = line.split("**");
      const renderedLine = parts.map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} className="font-extrabold text-slate-900">{part}</strong>;
        }
        return part;
      });

      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed font-medium my-1.5">
          {renderedLine}
        </p>
      );
    });
  };

  // Live editable visualizer table data handler
  const handleTableChange = (dataset: "yield" | "npk" | "water", index: number, key: string, value: string) => {
    const numVal = parseFloat(value) || 0;
    setChartData((prev) => {
      const updated = { ...prev };
      const arr: any[] = [...updated[dataset]];
      arr[index] = { ...arr[index], [key]: numVal };
      updated[dataset] = arr;
      return updated;
    });
  };

  return (
    <div id="ai-research-assistant-card" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-5">
      {/* Banner */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Sparkles className="h-5 w-5 text-teal-600 animate-pulse" />
        <div>
          <h3 className="font-bold text-slate-800 text-sm">AI Scientific Research Suite</h3>
          <p className="text-[11px] text-slate-400 font-medium">Empower agricultural discovery with institutional-grade AI models</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Sidebar Tools selection */}
        <div className="lg:col-span-3 flex flex-col gap-1.5 border-r border-slate-100 pr-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">Scientific Tools</p>
          {[
            { id: "paper", label: "Paper Generator", desc: "Draft from farm data" },
            { id: "summary", label: "Article Summarizer", desc: "Key metric extraction" },
            { id: "experiment", label: "Experiment Designer", desc: "Statistical layouts" },
            { id: "visualizer", label: "Research Visualizer", desc: "Interactive charts" },
            { id: "universities", label: "University Finder", desc: "Collaborate globally" },
            { id: "citation", label: "Citation Generator", desc: "APA, BibTeX, MLA formats" },
            { id: "review", label: "Peer Review Panel", desc: "Draft critiques & ratings" },
            { id: "grant", label: "Grant Proposal Writer", desc: "Secure agency funding" },
            { id: "patent", label: "Patent claims Draft", desc: "Tech filing suggestion" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as TabType);
                setResult(null);
                setCopied(false);
                setPublished(false);
              }}
              className={`text-left p-2.5 rounded-xl transition-all flex flex-col cursor-pointer ${
                activeTab === item.id
                  ? "bg-teal-50 border-l-4 border-teal-600 text-teal-900 shadow-sm"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-800"
              }`}
            >
              <span className="text-xs font-bold leading-none">{item.label}</span>
              <span className="text-[9.5px] opacity-75 mt-0.5 leading-none font-medium">{item.desc}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Tool details form and Output panel */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Active tool settings form */}
          <div className="bg-slate-50/70 border border-slate-200/50 rounded-xl p-4 space-y-4">
            
            {activeTab === "paper" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800">1. Generate Research Papers from Farm Data</h4>
                  <span className="text-[9.5px] text-teal-700 bg-teal-50 font-bold px-2 py-0.5 rounded">RAG Integrated</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Crop Type</label>
                    <input
                      type="text"
                      value={cropType}
                      onChange={(e) => setCropType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Soil Moisture Avg</label>
                    <input
                      type="text"
                      value={soilMoisture}
                      onChange={(e) => setSoilMoisture(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nutrients (N:P:K)</label>
                    <input
                      type="text"
                      value={npk}
                      onChange={(e) => setNpk(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Key Agronomic Findings</label>
                  <textarea
                    rows={2}
                    value={findings}
                    onChange={(e) => setFindings(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs leading-relaxed font-medium"
                    placeholder="Enter experimental outputs, treatments, yields..."
                  />
                </div>
                <button
                  onClick={() => executeResearchTask("paper", { cropType, soilMoisture, npk, findings })}
                  disabled={isLoading}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BookOpen className="h-3.5 w-3.5" />}
                  Generate Formal Draft Paper
                </button>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800">2. Summarize Agricultural Research Articles</h4>
                  <button
                    onClick={loadSampleArticle}
                    className="text-[10px] text-teal-700 hover:text-teal-800 font-bold underline cursor-pointer"
                  >
                    Load Sample Agronomy Article
                  </button>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Research Paper Text</label>
                  <textarea
                    rows={4}
                    value={articleText}
                    onChange={(e) => setArticleText(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs leading-relaxed font-medium font-sans"
                    placeholder="Paste the full research article text, abstract or methodology details here..."
                  />
                </div>
                <button
                  onClick={() => executeResearchTask("summary", { text: articleText })}
                  disabled={isLoading || !articleText.trim()}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Layers className="h-3.5 w-3.5" />}
                  Generate Key Scientific Summary
                </button>
              </div>
            )}

            {activeTab === "experiment" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">3. Suggest Rigorous Statistical Experiment Designs</h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Primary Objective / Study Goal</label>
                  <input
                    type="text"
                    value={expGoal}
                    onChange={(e) => setExpGoal(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium"
                    placeholder="e.g. Compare three bio-stimulants on high-saline soils"
                  />
                </div>
                <button
                  onClick={() => executeResearchTask("experiment", { goal: expGoal })}
                  disabled={isLoading || !expGoal.trim()}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileCheck className="h-3.5 w-3.5" />}
                  Design Statistical Field Trial
                </button>
              </div>
            )}

            {activeTab === "visualizer" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800">4. Scientific Data Visualization for Research</h4>
                  
                  {/* Select Dataset */}
                  <div className="flex bg-slate-200 p-0.5 rounded-lg text-[10.5px]">
                    <button
                      onClick={() => setSelectedChartDataset("yield")}
                      className={`px-2 py-1 rounded-md font-bold cursor-pointer ${selectedChartDataset === "yield" ? "bg-white text-slate-800" : "text-slate-500"}`}
                    >
                      Yield Curves
                    </button>
                    <button
                      onClick={() => setSelectedChartDataset("npk")}
                      className={`px-2 py-1 rounded-md font-bold cursor-pointer ${selectedChartDataset === "npk" ? "bg-white text-slate-800" : "text-slate-500"}`}
                    >
                      Nutrient Profile
                    </button>
                    <button
                      onClick={() => setSelectedChartDataset("water")}
                      className={`px-2 py-1 rounded-md font-bold cursor-pointer ${selectedChartDataset === "water" ? "bg-white text-slate-800" : "text-slate-500"}`}
                    >
                      Moisture Tracking
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Chart display */}
                  <div className="md:col-span-7 bg-white p-3 rounded-xl border border-slate-100 min-h-[220px] flex flex-col justify-between">
                    <ResponsiveContainer width="100%" height={170}>
                      {selectedChartDataset === "yield" ? (
                        <BarChart data={chartData.yield} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="treatment" tick={{ fontSize: 9, fill: "#64748b" }} />
                          <YAxis tick={{ fontSize: 9, fill: "#64748b" }} label={{ value: "Yield (tons/ha)", angle: -90, position: "insideLeft", offset: 10, fontSize: 9 }} />
                          <Tooltip contentStyle={{ fontSize: 10 }} />
                          <Legend wrapperStyle={{ fontSize: 10 }} />
                          <Bar name="Crop Yield (tons/ha)" dataKey="yield" fill="#0d9488" radius={[4, 4, 0, 0]} />
                          <Bar name="Protein Content (%)" dataKey="protein" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      ) : selectedChartDataset === "npk" ? (
                        <AreaChart data={chartData.npk} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="depth" tick={{ fontSize: 9, fill: "#64748b" }} />
                          <YAxis tick={{ fontSize: 9, fill: "#64748b" }} />
                          <Tooltip contentStyle={{ fontSize: 10 }} />
                          <Legend wrapperStyle={{ fontSize: 10 }} />
                          <Area type="monotone" name="Nitrogen (mg/kg)" dataKey="Nitrogen" stroke="#0ea5e9" fill="#bae6fd" fillOpacity={0.6} />
                          <Area type="monotone" name="Phosphorus (mg/kg)" dataKey="Phosphorus" stroke="#ec4899" fill="#fbcfe8" fillOpacity={0.4} />
                          <Area type="monotone" name="Potassium (mg/kg)" dataKey="Potassium" stroke="#8b5cf6" fill="#ddd6fe" fillOpacity={0.3} />
                        </AreaChart>
                      ) : (
                        <LineChart data={chartData.water} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#64748b" }} />
                          <YAxis tick={{ fontSize: 9, fill: "#64748b" }} />
                          <Tooltip contentStyle={{ fontSize: 10 }} />
                          <Legend wrapperStyle={{ fontSize: 10 }} />
                          <Line type="monotone" name="Drip System Moisture (%)" dataKey="MoistenDrip" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                          <Line type="monotone" name="Furrow System Moisture (%)" dataKey="MoistenFurrow" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                    <p className="text-[9.5px] text-slate-400 font-medium italic mt-2 text-center">
                      Interactive Plot: Updates live if you edit the scientific data points on the right!
                    </p>
                  </div>

                  {/* Data Editor table */}
                  <div className="md:col-span-5 bg-white p-3 rounded-xl border border-slate-100 max-h-[220px] overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-500 uppercase border-b border-slate-100 pb-1 mb-2">Edit Data Points</p>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[9px] text-slate-400 font-bold">
                          <th className="pb-1">X-Axis</th>
                          {selectedChartDataset === "yield" && (
                            <>
                              <th className="pb-1 text-right">Yield</th>
                              <th className="pb-1 text-right">Protein</th>
                            </>
                          )}
                          {selectedChartDataset === "npk" && (
                            <>
                              <th className="pb-1 text-right">N</th>
                              <th className="pb-1 text-right">P</th>
                              <th className="pb-1 text-right">K</th>
                            </>
                          )}
                          {selectedChartDataset === "water" && (
                            <>
                              <th className="pb-1 text-right">Drip %</th>
                              <th className="pb-1 text-right">Furrow %</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {selectedChartDataset === "yield" &&
                          chartData.yield.map((row, rIdx) => (
                            <tr key={rIdx} className="text-[10px]">
                              <td className="py-1.5 font-bold text-slate-700">{row.treatment}</td>
                              <td className="py-1 text-right">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={row.yield}
                                  onChange={(e) => handleTableChange("yield", rIdx, "yield", e.target.value)}
                                  className="w-12 bg-slate-50 text-right text-xs px-1 rounded border border-slate-200"
                                />
                              </td>
                              <td className="py-1 text-right">
                                <input
                                  type="number"
                                  step="0.1"
                                  value={row.protein}
                                  onChange={(e) => handleTableChange("yield", rIdx, "protein", e.target.value)}
                                  className="w-12 bg-slate-50 text-right text-xs px-1 rounded border border-slate-200"
                                />
                              </td>
                            </tr>
                          ))}

                        {selectedChartDataset === "npk" &&
                          chartData.npk.map((row, rIdx) => (
                            <tr key={rIdx} className="text-[10px]">
                              <td className="py-1.5 font-bold text-slate-700">{row.depth}</td>
                              <td className="py-1 text-right">
                                <input
                                  type="number"
                                  value={row.Nitrogen}
                                  onChange={(e) => handleTableChange("npk", rIdx, "Nitrogen", e.target.value)}
                                  className="w-12 bg-slate-50 text-right text-xs px-1 rounded border border-slate-200"
                                />
                              </td>
                              <td className="py-1 text-right">
                                <input
                                  type="number"
                                  value={row.Phosphorus}
                                  onChange={(e) => handleTableChange("npk", rIdx, "Phosphorus", e.target.value)}
                                  className="w-12 bg-slate-50 text-right text-xs px-1 rounded border border-slate-200"
                                />
                              </td>
                              <td className="py-1 text-right">
                                <input
                                  type="number"
                                  value={row.Potassium}
                                  onChange={(e) => handleTableChange("npk", rIdx, "Potassium", e.target.value)}
                                  className="w-12 bg-slate-50 text-right text-xs px-1 rounded border border-slate-200"
                                />
                              </td>
                            </tr>
                          ))}

                        {selectedChartDataset === "water" &&
                          chartData.water.map((row, rIdx) => (
                            <tr key={rIdx} className="text-[10px]">
                              <td className="py-1.5 font-bold text-slate-700">{row.day}</td>
                              <td className="py-1 text-right">
                                <input
                                  type="number"
                                  value={row.MoistenDrip}
                                  onChange={(e) => handleTableChange("water", rIdx, "MoistenDrip", e.target.value)}
                                  className="w-12 bg-slate-50 text-right text-xs px-1 rounded border border-slate-200"
                                />
                              </td>
                              <td className="py-1 text-right">
                                <input
                                  type="number"
                                  value={row.MoistenFurrow}
                                  onChange={(e) => handleTableChange("water", rIdx, "MoistenFurrow", e.target.value)}
                                  className="w-12 bg-slate-50 text-right text-xs px-1 rounded border border-slate-200"
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "universities" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">5. Connect with Leading Agricultural Universities</h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Research Field / Specific Domain</label>
                  <input
                    type="text"
                    value={researchDomain}
                    onChange={(e) => setResearchDomain(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium"
                    placeholder="e.g., Drone spray algorithms, Organic bio-pesticides..."
                  />
                </div>
                <button
                  onClick={() => executeResearchTask("universities", { domain: researchDomain })}
                  disabled={isLoading || !researchDomain.trim()}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <GraduationCap className="h-3.5 w-3.5" />}
                  Search Specialized Universities & Draft Pitch
                </button>
              </div>
            )}

            {activeTab === "citation" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">6. Academic Citation Formatting & Code Generation</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Paper Title</label>
                    <input
                      type="text"
                      value={citeTitle}
                      onChange={(e) => setCiteTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Author(s)</label>
                    <input
                      type="text"
                      value={citeAuthor}
                      onChange={(e) => setCiteAuthor(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Publish Year</label>
                    <input
                      type="text"
                      value={citeYear}
                      onChange={(e) => setCiteYear(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Journal Title</label>
                    <input
                      type="text"
                      value={citeJournal}
                      onChange={(e) => setCiteJournal(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Volume/Issue</label>
                    <input
                      type="text"
                      value={citeVolume}
                      onChange={(e) => setCiteVolume(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Page Range</label>
                    <input
                      type="text"
                      value={citePages}
                      onChange={(e) => setCitePages(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                    />
                  </div>
                </div>
                <button
                  onClick={() => executeResearchTask("citation", { title: citeTitle, author: citeAuthor, year: citeYear, journal: citeJournal, volume: citeVolume, pages: citePages })}
                  disabled={isLoading}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
                  Generate Standard Academic Citations
                </button>
              </div>
            )}

            {activeTab === "review" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">7. Interactive Peer Review Simulator</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Manuscript Title</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Manuscript Abstract Summary</label>
                    <textarea
                      rows={2}
                      value={reviewAbstract}
                      onChange={(e) => setReviewAbstract(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs leading-relaxed font-medium"
                    />
                  </div>
                </div>
                <button
                  onClick={() => executeResearchTask("review", { title: reviewTitle, abstract: reviewAbstract })}
                  disabled={isLoading}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  Simulate Peer Review Committee (3 Reviewers)
                </button>
              </div>
            )}

            {activeTab === "grant" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">8. Grant Writing & Proposal Assistant</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Core Innovation Idea</label>
                    <input
                      type="text"
                      value={grantIdea}
                      onChange={(e) => setGrantIdea(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Funding Agency</label>
                    <input
                      type="text"
                      value={fundingAgency}
                      onChange={(e) => setFundingAgency(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
                <button
                  onClick={() => executeResearchTask("grant", { researchIdea: grantIdea, fundingAgency })}
                  disabled={isLoading}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <DollarSign className="h-3.5 w-3.5" />}
                  Draft ICAR / Agency Grant Proposal
                </button>
              </div>
            )}

            {activeTab === "patent" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">9. Patent Claim & Filing Suggestion Engine</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Patent / Invention Title</label>
                    <input
                      type="text"
                      value={patentName}
                      onChange={(e) => setPatentName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Detailed Technical Mechanism</label>
                    <textarea
                      rows={2}
                      value={patentDetails}
                      onChange={(e) => setPatentDetails(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs leading-relaxed font-medium"
                    />
                  </div>
                </div>
                <button
                  onClick={() => executeResearchTask("patent", { inventionName: patentName, inventionDetails: patentDetails })}
                  disabled={isLoading}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lightbulb className="h-3.5 w-3.5" />}
                  Draft Novelty Claims & Find IPC Codes
                </button>
              </div>
            )}

          </div>

          {/* Results Display Panel */}
          {(result || isLoading) && (
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3 min-h-[160px] relative animate-in fade-in duration-200">
              
              {/* Output Actions bar */}
              {result && !isLoading && (
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-1.5 text-teal-800 font-bold text-[10.5px]">
                    <Database className="h-3.5 w-3.5" />
                    <span>AI Generated Output Reference</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {activeTab === "paper" && (
                      <button
                        onClick={handlePublishToCatalog}
                        disabled={published}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
                          published
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {published ? "Published to Public Catalog!" : "Publish to Public Catalog"}
                      </button>
                    )}

                    <button
                      onClick={handleCopy}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      {copied ? "Copied!" : "Copy Output"}
                    </button>
                  </div>
                </div>
              )}

              {/* Loader */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 flex flex-col justify-center items-center gap-2 rounded-xl z-10">
                  <Loader2 className="h-7 w-7 text-teal-700 animate-spin" />
                  <p className="text-[11px] font-bold text-slate-500">Querying Gemini 3.5 Academic Models...</p>
                </div>
              )}

              {/* Render Structured Text */}
              {result && (
                <div className="max-h-[350px] overflow-y-auto pr-1 text-slate-800 scrollbar-thin">
                  {parseMarkdown(result)}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
