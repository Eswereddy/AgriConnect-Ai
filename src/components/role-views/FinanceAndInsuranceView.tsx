import React, { useState } from "react";
import {
  Banknote,
  DollarSign,
  ShieldCheck,
  Scale,
  Activity,
  Plus,
  HelpCircle,
  FileCheck,
  Percent,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  TrendingUp,
  Coins
} from "lucide-react";
import { MicroLoan, InsurancePolicy, UserRole } from "../../types";
import MLPredictionHub from "../analytics/MLPredictionHub";
import RevenueDashboard from "../finance/RevenueDashboard";

interface FinanceAndInsuranceViewProps {
  activeRole: UserRole;
  loans: MicroLoan[];
  policies: InsurancePolicy[];
  onAddLoan: (newLoan: MicroLoan) => void;
  onUpdateLoan: (id: string, updated: Partial<MicroLoan>) => void;
  onAddPolicy: (newPolicy: InsurancePolicy) => void;
  onUpdatePolicy: (id: string, updated: Partial<InsurancePolicy>) => void;
}

export default function FinanceAndInsuranceView({
  activeRole,
  loans,
  policies,
  onAddLoan,
  onUpdateLoan,
  onAddPolicy,
  onUpdatePolicy
}: FinanceAndInsuranceViewProps) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"desk" | "prediction" | "revenue">("desk");

  // Loan Form State
  const [farmerName, setFarmerName] = useState("Amir Patel");
  const [requestedAmount, setRequestedAmount] = useState(8500);
  const [purpose, setPurpose] = useState("High-Tech Solar Micro-Irrigation Pump");
  const [creditScore, setCreditScore] = useState(720);

  // Policy Form State
  const [insFarmerName, setInsFarmerName] = useState("Siddharth Roy");
  const [premiumAmount, setPremiumAmount] = useState(350);
  const [coverageAmount, setCoverageAmount] = useState(12000);
  const [cropInsured, setCropInsured] = useState("Basmati Rice Paddy");
  const [riskScore, setRiskScore] = useState(38);

  const handleApplyLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim()) return;

    const newLoan: MicroLoan = {
      id: `loan-${Date.now()}`,
      farmerName,
      requestedAmount,
      purpose,
      creditScore,
      status: "Applied",
      date: new Date().toLocaleDateString()
    };
    onAddLoan(newLoan);
    setFarmerName("");
  };

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insFarmerName.trim()) return;

    const newPolicy: InsurancePolicy = {
      id: `pol-${Date.now()}`,
      farmerName: insFarmerName,
      premiumAmount,
      coverageAmount,
      cropInsured,
      riskScore,
      status: "Active"
    };
    onAddPolicy(newPolicy);
    setInsFarmerName("");
  };

  // RENDER BANK OFFICER WORKSPACE
  if (activeRole === UserRole.BANK) {
    return (
      <div id="bank-workspace" className="space-y-6 animate-in fade-in">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-950 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-700/60 rounded-xl">
                <Banknote className="h-6 w-6 text-emerald-200" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Agricultural Micro-Finance Desk</h2>
            </div>
            <p className="text-emerald-100/90 text-xs max-w-xl">
              Underwrite micro-loans, analyze alternative soil-telemetry based credit ratings for smallholders, and manage interest-rate relief funds.
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
              <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Active Credit</p>
              <p className="text-lg font-bold">$230K Issued</p>
            </div>
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
              <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-semibold">Repayment Rate</p>
              <p className="text-lg font-bold">98.4%</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-100 bg-white p-1 rounded-2xl shadow-xs gap-1">
          <button
            onClick={() => setActiveTab("desk")}
            className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === "desk"
                ? "bg-emerald-50 text-emerald-700 shadow-xs"
                : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
            }`}
          >
            <Banknote className="h-4 w-4" />
            Micro-Credit Underwriting Desk
          </button>
          <button
            onClick={() => setActiveTab("prediction")}
            className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === "prediction"
                ? "bg-emerald-50 text-emerald-700 shadow-xs"
                : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
            }`}
          >
            <Activity className="h-4 w-4" />
            Alternative soil-telemetry Credit Score
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
              activeTab === "revenue"
                ? "bg-emerald-50 text-emerald-700 shadow-xs"
                : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Revenue & Financials Dashboard
          </button>
        </div>

        {activeTab === "desk" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Apply Loan */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <Plus className="h-4.5 w-4.5 text-emerald-600" />
                Underwrite Micro-Loan Ticket
              </h3>

              <form onSubmit={handleApplyLoan} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Farmer Full Name</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Requested Fund</label>
                    <input
                      type="number"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Telemetry Credit Score</label>
                    <input
                      type="number"
                      value={creditScore}
                      onChange={(e) => setCreditScore(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-emerald-700 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Loan Capital Purpose</label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>

                <button
                  id="bank-apply-btn"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
                >
                  Create Micro-Credit Ledger
                </button>
              </form>
            </div>

            {/* Loan Ledger */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-3">
                Precision Crop-Telemetry Micro-Credit Ledger
              </h3>

              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {loans.map((loan) => (
                  <div key={loan.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-200 transition-colors">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">{loan.purpose}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">
                        Applicant: {loan.farmerName} • Soil-Score: <span className="text-emerald-600 font-bold">{loan.creditScore}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Underwritten Capital</p>
                        <p className="text-sm font-extrabold text-slate-800">${loan.requestedAmount.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {loan.status === "Applied" ? (
                          <>
                            <button
                              onClick={() => onUpdateLoan(loan.id, { status: "Approved" })}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer transition-all border-0"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onUpdateLoan(loan.id, { status: "Rejected" })}
                              className="px-2.5 py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded text-[10px] font-bold cursor-pointer transition-all border-0"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className={`px-2 py-1 text-[10px] font-bold rounded ${
                            loan.status === "Approved" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                          }`}>
                            {loan.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "prediction" && (
          <div className="animate-in fade-in duration-200">
            <MLPredictionHub currentPhase="Bank" />
          </div>
        )}

        {activeTab === "revenue" && (
          <div className="animate-in fade-in duration-200">
            <RevenueDashboard />
          </div>
        )}
      </div>
    );
  }

  // RENDER INSURANCE AGENT WORKSPACE
  return (
    <div id="insurance-workspace" className="space-y-6 animate-in fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-700/60 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-teal-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Weather-Indexed Crop Insurance Desk</h2>
          </div>
          <p className="text-teal-100/90 text-xs max-w-xl">
            Evaluate high-altitude weather risk indexes, issue climate disaster policy agreements, and approve satellite-verified payouts.
          </p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
            <p className="text-[10px] text-teal-200 uppercase tracking-widest font-semibold">Active Liability</p>
            <p className="text-lg font-bold">$1.8M Covered</p>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
            <p className="text-[10px] text-teal-200 uppercase tracking-widest font-semibold">Loss Ratio</p>
            <p className="text-lg font-bold">4.2% Index</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-100 bg-white p-1 rounded-2xl shadow-xs gap-1">
        <button
          onClick={() => setActiveTab("desk")}
          className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === "desk"
              ? "bg-teal-50 text-teal-800 shadow-xs"
              : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Agronomic Policy & Claims Desk
        </button>
        <button
          onClick={() => setActiveTab("prediction")}
          className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === "prediction"
              ? "bg-teal-50 text-teal-800 shadow-xs"
              : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
          }`}
        >
          <Activity className="h-4 w-4" />
          Satellite Weather Risk Audit
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === "revenue"
              ? "bg-teal-50 text-teal-800 shadow-xs"
              : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Revenue & Financials Dashboard
        </button>
      </div>

      {activeTab === "desk" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Issue Policy */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Plus className="h-4.5 w-4.5 text-teal-600" />
              Issue Agronomic Policy
            </h3>

            <form onSubmit={handleCreatePolicy} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Insured Farm Owner</label>
                <input
                  type="text"
                  value={insFarmerName}
                  onChange={(e) => setInsFarmerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Premium Rate</label>
                  <input
                    type="number"
                    value={premiumAmount}
                    onChange={(e) => setPremiumAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Max Liability Cap</label>
                  <input
                    type="number"
                    value={coverageAmount}
                    onChange={(e) => setCoverageAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Crop Variety</label>
                  <input
                    type="text"
                    value={cropInsured}
                    onChange={(e) => setCropInsured(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Satellite Risk Score</label>
                  <input
                    type="number"
                    value={riskScore}
                    onChange={(e) => setRiskScore(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-teal-700"
                  />
                </div>
              </div>

              <button
                id="ins-create-policy-btn"
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-850 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-0"
              >
                Issue Policy Certificate
              </button>
            </form>
          </div>

          {/* Policies List */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-3">
              Satellite Weather Risk Audited Policies
            </h3>

            <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
              {policies.map((pol) => (
                <div key={pol.id} className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-teal-200 transition-colors">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">{pol.cropInsured} Insurance</h4>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      Policyholder: {pol.farmerName} • Drought Risk: <span className="text-teal-700 font-bold">{pol.riskScore}%</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Total Cover</p>
                      <p className="text-sm font-extrabold text-slate-800">${pol.coverageAmount.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {pol.status === "Active" ? (
                        <button
                          onClick={() => onUpdatePolicy(pol.id, { status: "Claimed" })}
                          className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-[10px] font-bold cursor-pointer transition-all border-0"
                        >
                          Settle Satellite Claim
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-50 text-emerald-800">
                          Claim Dispatched
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "prediction" && (
        <div className="animate-in fade-in duration-200">
          <MLPredictionHub currentPhase="Insurance" />
        </div>
      )}

      {activeTab === "revenue" && (
        <div className="animate-in fade-in duration-200">
          <RevenueDashboard />
        </div>
      )}
    </div>
  );
}
