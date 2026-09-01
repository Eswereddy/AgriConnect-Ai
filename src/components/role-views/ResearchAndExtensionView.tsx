import React, { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Plus,
  Users,
  Compass,
  FileCheck,
  Award,
  Globe,
  Sparkles,
  ClipboardList,
  Calendar,
  Layers,
  MapPin,
  TrendingUp
} from "lucide-react";
import { ResearchPaper, FieldWorkshop, UserRole } from "../../types";
import AIResearchAssistant from "../AIResearchAssistant";
import MLPredictionHub from "../analytics/MLPredictionHub";
import ResearchAnalyticsModule from "../analytics/ResearchAnalyticsModule";

interface ResearchAndExtensionViewProps {
  activeRole: UserRole;
  papers: ResearchPaper[];
  workshops: FieldWorkshop[];
  onAddPaper: (newPaper: ResearchPaper) => void;
  onAddWorkshop: (newWorkshop: FieldWorkshop) => void;
  onUpdateWorkshop: (id: string, updated: Partial<FieldWorkshop>) => void;
}

export default function ResearchAndExtensionView({
  activeRole,
  papers,
  workshops,
  onAddPaper,
  onAddWorkshop,
  onUpdateWorkshop
}: ResearchAndExtensionViewProps) {
  // Paper Form State
  const [researcherTab, setResearcherTab] = useState<"catalog" | "copilot" | "analytics">("copilot");
  const [paperTitle, setPaperTitle] = useState("Yield Optimization of Millet Crops under Sub-Surface Drip Irrigation");
  const [author, setAuthor] = useState("Dr. Edward Reynolds");
  const [domain, setDomain] = useState("Precision Irrigation");
  const [summary, setSummary] = useState("A 24-month field study demonstrating a 32% increase in finger millet yield while reducing ground water consumption by 40% using sub-surface porous clay tubes.");

  // Workshop Form State
  const [wsTitle, setWsTitle] = useState("Sustainable Vermicomposting and Nitrogen Preservation");
  const [location, setLocation] = useState("Punjab Sector 4 Cooperative Hall");
  const [objective, setObjective] = useState("Hands-on setup of red-wiggler organic waste recycling pits for cooperative smallholders.");

  const handlePublishPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paperTitle.trim()) return;

    const newPaper: ResearchPaper = {
      id: `paper-${Date.now()}`,
      title: paperTitle,
      author,
      domain,
      summary,
      views: 0,
      date: new Date().toLocaleDateString()
    };
    onAddPaper(newPaper);
    setPaperTitle("");
    setSummary("");
  };

  const handleScheduleWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsTitle.trim()) return;

    const newWorkshop: FieldWorkshop = {
      id: `ws-${Date.now()}`,
      title: wsTitle,
      location,
      objective,
      date: new Date().toLocaleDateString(),
      attendeesCount: 0,
      status: "Scheduled"
    };
    onAddWorkshop(newWorkshop);
    setWsTitle("");
    setObjective("");
  };

  // RENDER RESEARCHER WORKSPACE
  if (activeRole === UserRole.RESEARCHER) {
    return (
      <div id="researcher-workspace" className="space-y-6 animate-in fade-in">
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-700/60 rounded-xl">
                <BookOpen className="h-6 w-6 text-teal-200" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Agricultural Science & Genomic Logs</h2>
            </div>
            <p className="text-teal-100/90 text-xs max-w-xl">
              Publish soil carbon sequestration datasets, agronomic experiment papers, and high-altitude weather resilience indices for peer review.
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
              <p className="text-[10px] text-teal-200 uppercase tracking-widest font-semibold">Scientific Catalog</p>
              <p className="text-lg font-bold">{papers.length} Papers</p>
            </div>
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
              <p className="text-[10px] text-teal-200 uppercase tracking-widest font-semibold">Total Reads</p>
              <p className="text-lg font-bold">18.4K Reads</p>
            </div>
          </div>
        </div>

        {/* Workspace Tab bar */}
        <div className="flex border-b border-slate-200 pb-px gap-6">
          <button
            id="research-tab-copilot"
            onClick={() => setResearcherTab("copilot")}
            className={`pb-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              researcherTab === "copilot"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Sparkles className="h-4 w-4 text-teal-600 animate-pulse" />
            AI Scientific Assistant
          </button>
          <button
            id="research-tab-catalog"
            onClick={() => setResearcherTab("catalog")}
            className={`pb-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              researcherTab === "catalog"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <BookOpen className="h-4 w-4 text-slate-500" />
            Publications Catalog ({papers.length})
          </button>
          <button
            id="research-tab-analytics"
            onClick={() => setResearcherTab("analytics")}
            className={`pb-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              researcherTab === "analytics"
                ? "border-teal-700 text-teal-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <TrendingUp className="h-4 w-4 text-teal-700" />
            Agronomic Trial Analyzer
          </button>
        </div>

        {researcherTab === "copilot" ? (
          <AIResearchAssistant
            onAddPaper={(newPaper) => {
              onAddPaper(newPaper);
              setResearcherTab("catalog");
            }}
          />
        ) : researcherTab === "analytics" ? (
          <ResearchAnalyticsModule papers={papers} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* Publish Paper Form */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <Plus className="h-4.5 w-4.5 text-teal-600" />
                Publish Research Paper
              </h3>

              <form onSubmit={handlePublishPaper} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Paper Title</label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Lead Investigator</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Scientific Domain</label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Abstract Abstract Summary</label>
                  <textarea
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed"
                  />
                </div>

                <button
                  id="research-publish-btn"
                  type="submit"
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Publish peer-reviewed Findings
                </button>
              </form>
            </div>

            {/* Papers Index */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-3">
                Open-Access Agricultural Genomics & Agronomy Catalog
              </h3>

              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {papers.map((paper) => (
                  <div key={paper.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2 hover:border-teal-200 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-normal">{paper.title}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                          Author: {paper.author} • Field: {paper.domain}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-white border border-slate-150 px-2 py-0.5 rounded font-bold">
                        {paper.views || 45} Views
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{paper.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER EXTENSION OFFICER WORKSPACE
  return (
    <div id="extension-workspace" className="space-y-6 animate-in fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-700/60 rounded-xl">
              <GraduationCap className="h-6 w-6 text-emerald-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Agricultural Extension & Field Schools</h2>
          </div>
          <p className="text-emerald-100/90 text-xs max-w-xl">
            Coordinate mobile workshops, verify training attendance registers, and distribute local climate-smart farming manuals to community leaders.
          </p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Active Classrooms</p>
            <p className="text-lg font-bold">{workshops.length} Schools</p>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Trained Farmers</p>
            <p className="text-lg font-bold">840 Certified</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schedule Workshop */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
            <Plus className="h-4.5 w-4.5 text-emerald-600" />
            Schedule Field School Lesson
          </h3>

          <form onSubmit={handleScheduleWorkshop} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Lesson Topic</label>
              <input
                type="text"
                value={wsTitle}
                onChange={(e) => setWsTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Cooperative Hub Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Welfare and Syllabus Objectives</label>
              <textarea
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs leading-relaxed"
              />
            </div>

            <button
              id="ext-schedule-btn"
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Dispatch Extension Classroom
            </button>
          </form>
        </div>

        {/* Classes List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-3">
            Local Village Training Calendars
          </h3>

          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
            {workshops.map((ws) => (
              <div key={ws.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-200 transition-colors">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">{ws.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                    <span>Location: {ws.location}</span>
                    <span>•</span>
                    <span>Syllabus: {ws.objective}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Classroom Date</p>
                    <p className="text-xs font-extrabold text-slate-800">{ws.date}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {ws.status === "Scheduled" ? (
                      <button
                        onClick={() => onUpdateWorkshop(ws.id, { status: "Completed", attendeesCount: Math.round(Math.random() * 25 + 10) })}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                      >
                        Sign Attendance Log
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-50 text-emerald-800 flex items-center gap-1">
                        Completed ({ws.attendeesCount} Farmers Certify)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic ML Co-Pilot Suite */}
      <MLPredictionHub currentPhase="Researcher" />
    </div>
  );
}
