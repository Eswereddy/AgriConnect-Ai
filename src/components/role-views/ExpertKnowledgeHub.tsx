import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  FileText,
  Upload,
  Sparkles,
  Download,
  Share2,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  X,
  MessageSquare,
  ThumbsUp,
  Award,
  BookMarked
} from "lucide-react";

interface ExpertKnowledgeHubProps {
  expertProfile: any;
  articles: any[];
  setArticles: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ExpertKnowledgeHub({
  expertProfile,
  articles,
  setArticles
}: ExpertKnowledgeHubProps) {
  const [hubTab, setHubTab] = useState<"articles" | "papers" | "cheatsheets" | "analytics">("articles");

  // --- 7.1 ARTICLE WRITER STATES ---
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAbstract, setNewAbstract] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCrop, setNewCrop] = useState("Wheat");
  const [newLang, setNewLang] = useState("Hindi");
  const [newTags, setNewTags] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Filters for Articles
  const [articleSearch, setArticleSearch] = useState("");
  const [articleCrop, setArticleCrop] = useState("All");
  const [articleLang, setArticleLang] = useState("All");

  const languagesList = [
    "Hindi", "Telugu", "English", "Tamil", "Kannada", "Marathi", "Gujarati", "Bengali", "Punjabi", "Malayalam"
  ];

  const handlePublishArticle = (status: "Published" | "Draft") => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Please provide both an engaging Title and rich guide Content.");
      return;
    }

    const newArt = {
      id: `art-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      crop: newCrop,
      content: newContent,
      abstract: newAbstract,
      language: newLang,
      tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
      date: "2026-07-18",
      reads: status === "Published" ? 1 : 0,
      likes: 0,
      status: status,
      comments: []
    };

    setArticles([newArt, ...articles]);
    alert(`Article "${newTitle}" saved successfully as ${status}!`);
    
    // Reset form
    setNewTitle("");
    setNewAbstract("");
    setNewContent("");
    setNewTags("");
    setIsCreatingArticle(false);
    setIsPreviewing(false);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm("Are you sure you want to delete this educational guide?")) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  // --- 7.2 RESEARCH PAPERS STATES ---
  const [papers, setPapers] = useState([
    { id: "p-1", title: "Organic Suppression of Plasmopara viticola with Pseudomonas strains", authors: "V. Singh, R. Nair", journal: "Indian Journal of Agronomy", crop: "Grapes", date: "2026-06-15", findings: "90% mycelial clearance recorded in vitro." },
    { id: "p-2", title: "Micronutrient balance ratios in sub-tropical red soils", authors: "Prof. S. R. Chander", journal: "ICAR Crop Science Quarterly", crop: "General Soil", date: "2026-05-10", findings: "Potassium levels correlate with disease resilience index." }
  ]);
  const [isUploadingPaper, setIsUploadingPaper] = useState(false);
  const [paperTitle, setPaperTitle] = useState("");
  const [paperAuthors, setPaperAuthors] = useState("");
  const [paperJournal, setPaperJournal] = useState("");
  const [paperCrop, setPaperCrop] = useState("Wheat");
  const [extractedFindings, setExtractedFindings] = useState("");

  const handleUploadPaper = () => {
    if (!paperTitle.trim()) return;
    const newPaper = {
      id: `p-${Math.floor(10 + Math.random() * 90)}`,
      title: paperTitle,
      authors: paperAuthors || "Unknown Author",
      journal: paperJournal || "International Ag Science Journal",
      crop: paperCrop,
      date: "2026-07-18",
      findings: extractedFindings || "High correlation with potassium ratios."
    };
    setPapers([newPaper, ...papers]);
    alert("Scientific paper PDF registered and synced to library.");
    setPaperTitle("");
    setPaperAuthors("");
    setPaperJournal("");
    setExtractedFindings("");
    setIsUploadingPaper(false);
  };

  // --- 7.3 CHEATSHEETS ---
  const quickGuides = [
    {
      title: "Common Crop Disease Identification Manual",
      topic: "Pathology Diagnostic pictures",
      size: "2.4 MB",
      type: "PDF Guide"
    },
    {
      title: "Fertilizer Timing & NPK Ratio Calendar",
      topic: "Precise agronomy schedules",
      size: "1.8 MB",
      type: "Infographic Sheet"
    },
    {
      title: "Micro-Irrigation schedules per Crop Season",
      topic: "Hydrology water savings",
      size: "950 KB",
      type: "Interactive Table"
    },
    {
      title: "Monsoon Pest Forecast Calendar",
      topic: "Insect infestation timings",
      size: "3.1 MB",
      type: "Pest Calendar Chart"
    }
  ];

  // Filters Article computation
  const activeArticles = articles.filter(a => {
    if (articleSearch) {
      const s = articleSearch.toLowerCase();
      const matchTitle = a.title?.toLowerCase().includes(s);
      const matchContent = a.content?.toLowerCase().includes(s);
      if (!matchTitle && !matchContent) return false;
    }
    if (articleCrop !== "All" && a.crop !== articleCrop) return false;
    if (articleLang !== "All" && a.language !== articleLang) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Sub Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setHubTab("articles")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            hubTab === "articles"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Guides & Articles ({articles.length})
        </button>
        <button
          onClick={() => setHubTab("papers")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            hubTab === "papers"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookMarked className="h-4 w-4" />
          Scientific Papers Library ({papers.length})
        </button>
        <button
          onClick={() => setHubTab("cheatsheets")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            hubTab === "cheatsheets"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="h-4 w-4" />
          Quick Cheatsheets ({quickGuides.length})
        </button>
        <button
          onClick={() => setHubTab("analytics")}
          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            hubTab === "analytics"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Hub Engagement Analytics
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* 7.1 ARTICLE WRITER */}
        {hubTab === "articles" && (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="h-4.5 w-4.5 text-emerald-600" />
                  Smallholder Education & Advisory Hub
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Publish pathology guides and preventative treatment regimens translated automatically across ten languages.</p>
              </div>
              {!isCreatingArticle && (
                <button
                  onClick={() => setIsCreatingArticle(true)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" /> Write New Article
                </button>
              )}
            </div>

            {/* Creating article form overlay */}
            {isCreatingArticle && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">
                    {isPreviewing ? "Sovereign Guide Preview" : "Formulate Botanical Extension Guide"}
                  </h4>
                  <button onClick={() => setIsCreatingArticle(false)} className="p-1 hover:bg-slate-100 rounded-full">
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>

                {!isPreviewing ? (
                  <div className="space-y-3.5 text-xs font-bold">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-400 text-[9px] block uppercase">Select Crop focus:</label>
                        <select
                          value={newCrop}
                          onChange={(e) => setNewCrop(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1"
                        >
                          <option value="Wheat">Wheat</option>
                          <option value="Rice">Rice</option>
                          <option value="Grapes">Grapes</option>
                          <option value="Cotton">Cotton</option>
                          <option value="Tomato">Tomato</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 text-[9px] block uppercase">Publishing Language:</label>
                        <select
                          value={newLang}
                          onChange={(e) => setNewLang(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1"
                        >
                          {languagesList.map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 text-[9px] block uppercase">Keywords / Tags (comma-separated):</label>
                        <input
                          type="text"
                          placeholder="e.g., rust, biological, trichoderma"
                          value={newTags}
                          onChange={(e) => setNewTags(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-[9px] block uppercase">Engaging Article Title:</label>
                      <input
                        type="text"
                        placeholder="e.g., Identification and Remediation of wheat Blasts"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-slate-700 font-extrabold"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-[9px] block uppercase">Abstract Summary (appears on dashboard feed):</label>
                      <input
                        type="text"
                        placeholder="Provide a quick 1-sentence diagnostic hook for the farmer..."
                        value={newAbstract}
                        onChange={(e) => setNewAbstract(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1 text-slate-700 font-semibold italic"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-[9px] block uppercase font-black">Advisory Guide Content (Rich Text):</label>
                      <textarea
                        rows={6}
                        placeholder="Formulate extensive agronomist instructions..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg mt-1 text-slate-700 font-semibold"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsPreviewing(true)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                      >
                        Preview Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePublishArticle("Draft")}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePublishArticle("Published")}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-lg"
                      >
                        Publish & Transmit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-150 text-left">
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded uppercase">
                        Crop: {newCrop} • Language: {newLang}
                      </span>
                      <h4 className="font-black text-slate-800 text-base mt-2">{newTitle || "Untitled Draft"}</h4>
                      <p className="text-xs text-slate-500 italic mt-1">"{newAbstract || "No summary abstracts compiled."}"</p>
                      <p className="text-xs text-slate-700 mt-4 leading-relaxed font-semibold">{newContent || "No body text entered."}</p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsPreviewing(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                      >
                        Back to Editor
                      </button>
                      <button
                        onClick={() => handlePublishArticle("Published")}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-lg text-xs"
                      >
                        Confirm & Publish Public
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Article filters & lists */}
            {!isCreatingArticle && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-3xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search published articles..."
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <select
                    value={articleCrop}
                    onChange={(e) => setArticleCrop(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold"
                  >
                    <option value="All">All Crops</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Grapes">Grapes</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                  <select
                    value={articleLang}
                    onChange={(e) => setArticleLang(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-bold"
                  >
                    <option value="All">All Languages</option>
                    {languagesList.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Article Grid cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeArticles.map((art) => (
                    <div key={art.id} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs text-left space-y-3.5 flex flex-col justify-between hover:shadow-xs transition-all">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-black uppercase">
                              {art.crop}
                            </span>
                            <span className="text-[8px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-1.5 py-0.2 rounded font-black uppercase">
                              {art.language || "English"}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold font-mono">{art.date}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{art.title}</h4>
                        <p className="text-[10px] text-slate-500 font-semibold italic line-clamp-2">
                          "{art.abstract || art.content}"
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-3 text-slate-400 text-[10px]">
                          <span className="flex items-center gap-1 font-bold">
                            <Eye className="h-3.5 w-3.5" /> {art.reads} reads
                          </span>
                          <span className="flex items-center gap-1 font-bold">
                            <ThumbsUp className="h-3.5 w-3.5" /> {art.likes || 0} likes
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => alert("Redirecting to rich text document editor... Draft locked.")}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                            title="Edit guide"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                            title="Delete guide"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 7.2 RESEARCH PAPERS */}
        {hubTab === "papers" && (
          <motion.div
            key="papers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Upload PDF Form */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                Upload Scientific Agronomy Paper
              </h3>

              <div className="space-y-3 text-xs font-bold">
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Paper Title:</label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[9px] block uppercase">Authors:</label>
                  <input
                    type="text"
                    value={paperAuthors}
                    onChange={(e) => setPaperAuthors(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 text-[9px] block uppercase">Journal / Source:</label>
                    <input
                      type="text"
                      value={paperJournal}
                      onChange={(e) => setPaperJournal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[9px] block uppercase">Crop Focus:</label>
                    <select
                      value={paperCrop}
                      onChange={(e) => setPaperCrop(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg mt-1"
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Grapes">Grapes</option>
                      <option value="Rice">Rice</option>
                      <option value="General Soil">General Soil</option>
                    </select>
                  </div>
                </div>

                <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                  <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                  <p className="text-[10px] font-black text-slate-600 mt-1">Upload Journal PDF</p>
                </div>
              </div>

              <button
                onClick={handleUploadPaper}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-wider"
              >
                Register & Extract Key Findings
              </button>
            </div>

            {/* Research Library */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs space-y-4 text-left">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Sovereign Pathology Research Library
              </h3>

              <div className="space-y-3">
                {papers.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-black uppercase">
                          Crop: {p.crop}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-[11px] mt-1">{p.title}</h4>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Authors: {p.authors} • Journal: {p.journal}</p>
                      </div>
                      <button
                        onClick={() => alert("Downloading PDF document to local drive...")}
                        className="p-1 hover:bg-white rounded border border-slate-200 text-slate-500"
                        title="Download PDF"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="bg-white border border-slate-200 p-2 rounded text-[10px]">
                      <span className="font-black text-emerald-800 text-[8px] block uppercase">AI-Extracted Key Findings:</span>
                      <p className="text-slate-600 font-semibold mt-0.5">"{p.findings}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 7.3 CHEATSHEETS */}
        {hubTab === "cheatsheets" && (
          <motion.div
            key="cheatsheets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {quickGuides.map((guide, i) => (
              <div key={i} className="bg-white border border-slate-150 rounded-2xl p-5 shadow-3xs flex flex-col justify-between text-left hover:shadow-xs transition-all space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-black px-1.5 py-0.2 rounded uppercase">
                      {guide.type}
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 font-black">{guide.size}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-xs">{guide.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Category: {guide.topic}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => alert("Initiating PDF document download...")}
                    className="py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-black text-[9px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-3xs"
                  >
                    <Download className="h-3 w-3" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => alert("Copied private shareable link to clipboard.")}
                    className="py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[9px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1"
                  >
                    <Share2 className="h-3 w-3" />
                    Share link
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* 7.4 ENGAGEMENT ANALYTICS */}
        {hubTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs text-left">
              <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Top Published Article</span>
              <p className="text-xs font-black text-slate-800 mt-2">"Managing Downy Mildew of Grapes with Trichoderma Sprays"</p>
              <p className="text-[9px] text-emerald-600 font-bold mt-2">1,245 total reader views this month</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs text-left">
              <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Top Search Keywords (Farmers)</span>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[9px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.2 font-bold font-mono">rust spray</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.2 font-bold font-mono">potash ratio</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.2 font-bold font-mono">downy cure</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3xs text-left flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase block tracking-wider">Farmer Hub Feedback</span>
                <p className="text-2xl font-black text-slate-800 mt-1">340 reactions</p>
              </div>
              <p className="text-[9px] text-emerald-600 font-bold">96% helpful vote index recorded by cooperatives</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
