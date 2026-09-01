import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  X, 
  Loader2, 
  AlertTriangle, 
  Layers, 
  HelpCircle,
  PlusCircle,
  FileCheck
} from "lucide-react";

interface AIProductGeneratorProps {
  onClose: () => void;
  onApplyGeneratedData?: (data: { seoTitle: string; description: string; keywords: string[] }) => void;
}

interface GeneratedCopy {
  seoTitle: string;
  engagingDescription: string;
  sellingPoints: string[];
  keywords: string[];
}

export default function AIProductGenerator({ onClose, onApplyGeneratedData }: AIProductGeneratorProps) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Seeds");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyData, setCopyData] = useState<GeneratedCopy | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const categories = ["Seeds", "Fertilizers", "Machinery", "IoT Sensors"];

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productName.trim()) {
      setError("Please enter a starting product name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/supplier/product-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          keyFeatures
        }),
      });

      if (!response.ok) {
        throw new Error("Could not contact copywriter engine. Check connection.");
      }

      const data = await response.json();
      setCopyData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while writing product copy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] shadow-2xl relative flex flex-col space-y-4 overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100/50">
              <FileText className="h-6 w-6 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">AI Product Copy & SEO Generator</h3>
                <span className="bg-emerald-100/80 text-emerald-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-200">Copywriter AI Active</span>
              </div>
              <p className="text-slate-400 text-[10px] font-semibold">Craft optimized storefront titles, high-converting descriptions, bullet features, and tag keywords</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          
          {/* Main Copywriting form */}
          <form onSubmit={handleGenerate} className="bg-slate-50 border border-slate-100/50 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            {/* Product Draft Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <PlusCircle className="h-3 w-3 text-emerald-500" /> Start Product Name / Term
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Bio-NPK Soil Activator"
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Layers className="h-3 w-3 text-indigo-500" /> Catalog Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Key Features/Differentiators */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-500" /> Key Features & Core Differentiators (Optional)
              </label>
              <input
                type="text"
                value={keyFeatures}
                onChange={(e) => setKeyFeatures(e.target.value)}
                placeholder="e.g. certified organic, increases nitrogen fixation, moisture sealing, 24-month parts warranty"
                className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden transition-all shadow-2xs"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-600/10 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Copywriting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Craft Copy Elements
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">Copywriting System Interrupted</h4>
                <p className="text-[11px] text-rose-600 font-semibold mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="mt-2 text-[10px] font-black text-rose-700 hover:text-rose-900 underline"
                >
                  Retry Copy Generation
                </button>
              </div>
            </div>
          )}

          {/* Initial State / Help Guide */}
          {!copyData && !loading && !error && (
            <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
              <div className="p-4 bg-emerald-50 rounded-full w-fit mx-auto">
                <FileCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight">Generate Professional E-Commerce Copy</h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  Enter a basic name, specify its agronomic category, and add any specific performance variables. The copywriter system will formulate professional headings, descriptions, technical lists, and indexing tags.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setProductName("Neem-Coated Slow Urea");
                    setCategory("Fertilizers");
                    setKeyFeatures("reduced nitrogen leaching, standard granular 50kg bags, water soluble");
                  }}
                  className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  🧪 Urea Fertilizer Demo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProductName("Wireless Volumetric NPK Telemetry");
                    setCategory("IoT Sensors");
                    setKeyFeatures("sub-GHz range, weatherproof IP68, multi-horizon depth calibration");
                  }}
                  className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  📡 Smart Sensor Demo
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="bg-slate-50 h-16 rounded-2xl border border-slate-100"></div>
              <div className="bg-slate-50 h-44 rounded-2xl border border-slate-100"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 h-32 rounded-2xl border border-slate-100"></div>
                <div className="bg-slate-50 h-32 rounded-2xl border border-slate-100"></div>
              </div>
            </div>
          )}

          {/* Result Layout */}
          {copyData && !loading && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Output 1: SEO Optimized Title */}
              <div className="border border-slate-100 p-4 rounded-2xl shadow-2xs space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">SEO Optimized Catalog Title</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(copyData.seoTitle, "title")}
                    className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                  >
                    {copiedField === "title" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Title
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <h4 className="text-sm font-black text-slate-800 leading-tight">
                    {copyData.seoTitle}
                  </h4>
                </div>
              </div>

              {/* Output 2: Description */}
              <div className="border border-slate-100 p-4 rounded-2xl shadow-2xs space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Storefront Product Description (Rich Text)</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(copyData.engagingDescription, "description")}
                    className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                  >
                    {copiedField === "description" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Description
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl text-xs font-semibold text-slate-600 leading-relaxed max-h-60 overflow-y-auto space-y-2 font-sans">
                  {copyData.engagingDescription.split("\n").map((line, idx) => {
                    if (line.startsWith("###")) {
                      return <h4 key={idx} className="text-sm font-black text-slate-800 mt-3 first:mt-0">{line.replace("###", "").trim()}</h4>;
                    }
                    if (line.startsWith("####")) {
                      return <h5 key={idx} className="text-xs font-black text-indigo-700 mt-2">{line.replace("####", "").trim()}</h5>;
                    }
                    if (line.startsWith("-")) {
                      return <li key={idx} className="list-disc ml-4 font-medium text-slate-600">{line.replace("-", "").trim()}</li>;
                    }
                    if (line.trim() === "") {
                      return <div key={idx} className="h-2" />;
                    }
                    return <p key={idx}>{line}</p>;
                  })}
                </div>
              </div>

              {/* Bullet Key Selling Points & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Bullet Points */}
                <div className="border border-slate-100 p-4 rounded-2xl shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Key Selling Points</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(copyData.sellingPoints.join("\n"), "points")}
                      className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 cursor-pointer"
                    >
                      {copiedField === "points" ? "Copied!" : "Copy Bullets"}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {copyData.sellingPoints.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2 bg-slate-50/60 rounded-xl border border-slate-100">
                        <span className="h-2 w-2 bg-emerald-500 rounded-full shrink-0 mt-2" />
                        <span className="text-[11px] font-bold text-slate-700 leading-relaxed">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div className="border border-slate-100 p-4 rounded-2xl shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Indexed Search Keywords</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(copyData.keywords.join(", "), "keywords")}
                        className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 cursor-pointer"
                      >
                        {copiedField === "keywords" ? "Copied!" : "Copy Tags"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {copyData.keywords.map((kw, idx) => (
                        <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-extrabold px-2.5 py-1 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Apply To Catalog button if passed as props */}
                  {onApplyGeneratedData && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyGeneratedData({
                          seoTitle: copyData.seoTitle,
                          description: copyData.engagingDescription,
                          keywords: copyData.keywords
                        });
                        onClose();
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="h-4 w-4" /> Apply to Active Product Entry
                    </button>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer info line */}
        <div className="shrink-0 pt-3 border-t border-slate-100 text-[9px] text-slate-400 font-medium flex items-center justify-between">
          <span>AI-generated copy should be reviewed to guarantee local safety and regulatory compliance.</span>
          <span>Copywriter Version: 3.1</span>
        </div>

      </div>
    </div>
  );
}
