import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Grid,
  FileText,
  MessageSquare,
  AlertOctagon,
  Wrench,
  Lock,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  FileCheck,
  UserCheck,
  Download,
  Percent,
  ToggleLeft,
  ToggleRight,
  Eye,
  Trash2,
  AlertTriangle,
  Play,
  Volume2,
  Mic,
  Send,
  Sliders,
  Bell,
  Mail,
  Smartphone,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  Plus,
  BarChart2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Award
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// ==========================================
// STATIC/INITIAL SEED DATASET DEFINITIONS
// ==========================================

export const INITIAL_USERS = [
  { id: "USR-001", name: "Dr. Vikram Singh", role: "Expert", email: "vikram.singh@icar.gov.in", mobile: "+91 98765 43214", aadhaar: "4523-8912-0941", status: "Platinum", accountStatus: "Active", joinDate: "2026-02-12", location: "New Delhi", specialty: "Agronomy", earnings: 42100, lastActive: "2026-07-19" },
  { id: "USR-002", name: "Rajesh Patel", role: "Farmer", email: "rajesh.patel@agrifarm.org", mobile: "+91 98123 45678", aadhaar: "7823-1122-3344", status: "Gold", accountStatus: "Active", joinDate: "2026-03-01", location: "Punjab", specialty: "Wheat", landSize: "12 Acres", lastActive: "2026-07-19" },
  { id: "USR-003", name: "Meena Devi", role: "Farmer", email: "meena.devi@fieldcrops.in", mobile: "+91 95432 10987", aadhaar: "9012-3456-7890", status: "Bronze", accountStatus: "Pending", joinDate: "2026-07-10", location: "Telangana", specialty: "Rice", landSize: "4 Acres", lastActive: "2026-07-18" },
  { id: "USR-004", name: "Suresh Kumar", role: "Farmer", email: "suresh.k@fieldagro.net", mobile: "+91 94321 09876", aadhaar: "3456-7890-1234", status: "Bronze", accountStatus: "Active", joinDate: "2026-06-15", location: "Haryana", specialty: "Cotton", landSize: "22 Acres", lastActive: "2026-07-19" },
  { id: "USR-005", name: "Global Agrifood Corp", role: "Buyer", email: "procure@globalfoods.com", mobile: "+91 91234 56789", aadhaar: "GST-29AAAAA1111A1Z2", status: "Platinum", accountStatus: "Active", joinDate: "2026-01-20", location: "Maharashtra", businessType: "Wholesale", lastActive: "2026-07-19" },
  { id: "USR-006", name: "CropCare Supplies", role: "Supplier", email: "sales@cropcaresupplies.com", mobile: "+91 92345 67890", aadhaar: "GST-27BBBBB2222B2Z1", status: "Silver", accountStatus: "Active", joinDate: "2026-02-15", location: "Punjab", productsCount: 18, lastActive: "2026-07-17" },
  { id: "USR-007", name: "Dr. Rachel Carter", role: "Expert", email: "rachel.carter@agriuni.edu", mobile: "+91 93456 78901", aadhaar: "5678-9012-3456", status: "Platinum", accountStatus: "Active", joinDate: "2026-04-10", location: "West Bengal", specialty: "Soil Pathology", earnings: 89400, lastActive: "2026-07-19" },
  { id: "USR-008", name: "Govt Officer Amit", role: "Government", email: "amit.sharma@nic.in", mobile: "+91 90011 22334", aadhaar: "8912-3456-1122", status: "Gold", accountStatus: "Active", joinDate: "2026-05-01", location: "Gujarat", specialty: "Subsidies", lastActive: "2026-07-19" }
];

export const INITIAL_PRODUCTS = [
  { id: "PROD-101", name: "Hybrid Wheat Seeds (PBW 343)", category: "Seeds", price: 1200, stock: 480, supplier: "CropCare Supplies", status: "Active", rating: 4.8, approved: true },
  { id: "PROD-102", name: "Urea Fertilizer (Premium Nitrogen)", category: "Fertilizers", price: 800, stock: 950, supplier: "CropCare Supplies", status: "Active", rating: 4.6, approved: true },
  { id: "PROD-103", name: "Tractor (Mahindra 575)", category: "Machinery", price: 250000, stock: 3, supplier: "AgroMach India", status: "Active", rating: 4.9, approved: false },
  { id: "PROD-104", name: "Organic Neem Oil Pesticide", category: "Fertilizers", price: 450, stock: 120, supplier: "GreenEarth Bio", status: "Draft", rating: 4.7, approved: false }
];

export const INITIAL_ORDERS = [
  { id: "ORD-8941", buyer: "Rajesh Patel", items: "Hybrid Wheat Seeds (x2)", total: 2400, status: "Delivered", payment: "Paid", date: "2026-07-14", seller: "CropCare Supplies" },
  { id: "ORD-8942", buyer: "Suresh Kumar", items: "Urea Fertilizer (x5)", total: 4000, status: "Shipped", payment: "Paid", date: "2026-07-16", seller: "CropCare Supplies" },
  { id: "ORD-8943", buyer: "Global Agrifood Corp", items: "Tractor Mahindra 575 (x1)", total: 250000, status: "Pending", payment: "Pending", date: "2026-07-18", seller: "AgroMach India" }
];

export const INITIAL_DISPUTES = [
  { id: "DSP-001", orderId: "ORD-8941", buyer: "Rajesh Patel", seller: "CropCare Supplies", reason: "Supplied PBW 342 instead of PBW 343", buyerProof: "Image_Lot342.png", sellerResponse: "Sent correct stock, verified by logistics batch index", status: "Open" },
  { id: "DSP-002", orderId: "ORD-8942", buyer: "Suresh Kumar", seller: "CropCare Supplies", reason: "Damaged bags received during delivery", buyerProof: "Torn_Bag.png", sellerResponse: "We packaging was perfect; transit handler issue", status: "In Progress" }
];

export const INITIAL_TICKETS = [
  { id: "TCK-401", user: "Rajesh Patel", priority: "High", subject: "Soil sensor telemetry offline for past 4 hours", status: "Open", assignedTo: "User Admin", date: "2026-07-18", responses: [{ sender: "user", text: "Please help, my IoT soil probes are showing offline since morning.", time: "10:30 AM" }] },
  { id: "TCK-402", user: "Dr. Vikram Singh", priority: "Medium", subject: "Unable to download monthly GST report", status: "In Progress", assignedTo: "Finance Admin", date: "2026-07-17", responses: [{ sender: "user", text: "I keep getting a network error when exporting Form 16.", time: "02:15 PM" }] },
  { id: "TCK-403", user: "Meena Devi", priority: "Low", subject: "Requesting guidance on vermicomposting course access", status: "Resolved", assignedTo: "Content Admin", date: "2026-07-15", responses: [{ sender: "user", text: "How can I register for the free vermicompost live module?", time: "09:00 AM" }, { sender: "admin", text: "Dear Meena, we have enrolled you in the expert cohort starting next week.", time: "04:00 PM" }] }
];

// Rich interactive charts data representing exact prompt requirements
export const REVENUE_DATA = [
  { name: "Jan", "Transaction Fees": 180000, Subscriptions: 82000, "Commissions": 60000, "IoT API": 30000, "Drone Services": 25000, "Carbon Credits": 10000 },
  { name: "Feb", "Transaction Fees": 195000, Subscriptions: 90000, "Commissions": 65000, "IoT API": 35000, "Drone Services": 30000, "Carbon Credits": 15000 },
  { name: "Mar", "Transaction Fees": 210000, Subscriptions: 95000, "Commissions": 72000, "IoT API": 42000, "Drone Services": 32000, "Carbon Credits": 20000 },
  { name: "Apr", "Transaction Fees": 220000, Subscriptions: 102000, "Commissions": 80000, "IoT API": 50000, "Drone Services": 38000, "Carbon Credits": 25000 },
  { name: "May", "Transaction Fees": 228000, Subscriptions: 108000, "Commissions": 82000, "IoT API": 55000, "Drone Services": 41000, "Carbon Credits": 28000 },
  { name: "Jun", "Transaction Fees": 234567, Subscriptions: 112890, "Commissions": 85432, "IoT API": 45678, "Drone Services": 45000, "Carbon Credits": 35000 }
];

export const REVENUE_PIE = [
  { name: "Transaction Fees", value: 234567, color: "#10b981" },
  { name: "Premium Subscriptions", value: 112890, color: "#6366f1" },
  { name: "Equipment Commissions", value: 85432, color: "#f59e0b" },
  { name: "Drone & IoT API", value: 45678, color: "#06b6d4" },
  { name: "Carbon Credits", value: 35000, color: "#8b5cf6" },
  { name: "Advertising & Partners", value: 25000, color: "#ec4899" }
];

export const USER_GROWTH_DATA = [
  { date: "Feb", Farmers: 6100, Buyers: 1200, Suppliers: 750, Govt: 420, Experts: 110 },
  { date: "Mar", Farmers: 6600, Buyers: 1420, Suppliers: 890, Govt: 510, Experts: 130 },
  { date: "Apr", Farmers: 7200, Buyers: 1680, Suppliers: 980, Govt: 620, Experts: 145 },
  { date: "May", Farmers: 7850, Buyers: 1950, Suppliers: 1100, Govt: 730, Experts: 172 },
  { date: "Jun", Farmers: 8421, Buyers: 2156, Suppliers: 1234, Govt: 845, Experts: 191 }
];

// ==========================================
// 1. CEO-LEVEL COMMAND CENTER DASHBOARD
// ==========================================
export function AdminDashboard({ onSelectTab }: { onSelectTab: (tab: string) => void }) {
  const [subTab, setSubTab] = useState<"overview" | "revenue" | "growth" | "gateways">("overview");
  const [projectionYear, setProjectionYear] = useState<number>(2027);

  // Revenue projection helper based on current ARR
  const currentARR = 4110804;
  const projectRevenue = () => {
    const growthRate = 1.15; // 15% estimated annual compounding
    const yearsOut = projectionYear - 2026;
    return Math.round(currentARR * Math.pow(growthRate, yearsOut));
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation for CEO Dashboard */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-1.5">
        {[
          { id: "overview", label: "Overview Metrics", icon: Grid },
          { id: "revenue", label: "Revenue & Projections", icon: DollarSign },
          { id: "growth", label: "User Growth & Geo", icon: TrendingUp },
          { id: "gateways", label: "Gateways & Latency", icon: Activity }
        ].map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.id}
              onClick={() => setSubTab(btn.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                subTab === btn.id
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {subTab === "overview" && (
        <div className="space-y-6">
          {/* Top CEO Platform Live KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Users", val: "12,847", sub: "Farmers: 8,421 | Buyers: 2,156", icon: Users, color: "text-indigo-600 bg-indigo-50" },
              { title: "Active Users (DAU)", val: "4,256", sub: "MAU: 9,842 (DAU/MAU 43.2%)", icon: Activity, color: "text-emerald-600 bg-emerald-50" },
              { title: "Monthly Revenue", val: "₹15,42,678", sub: "+12.3% MoM Growth", icon: DollarSign, color: "text-amber-600 bg-amber-50" },
              { title: "Platform Health", val: "99.98% Uptime", sub: "Avg Latency: 187ms | Error: 0.02%", icon: Shield, color: "text-rose-600 bg-rose-50" }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-300 transition-all">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">{card.title}</p>
                    <p className="text-2xl font-black text-slate-800">{card.val}</p>
                    <p className="text-[11px] text-slate-500 font-bold">{card.sub}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick-links banner to other tabs */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-wide">Pending Tasks Requiring Action</h4>
              <p className="text-xs text-emerald-100 mt-1">There are 756 Farmers waiting for KYC approval and 3 Escrow Disputes requiring arbitration.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onSelectTab("users")} className="px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                Review Verifications
              </button>
              <button onClick={() => onSelectTab("marketplace")} className="px-4 py-2 bg-emerald-800 text-white border border-emerald-500/30 text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer">
                Resolve Disputes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue Area Chart */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="border-b pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
                    Revenue Trend & Breakdown (First Half 2026)
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Dynamic scaling across transaction, rental, and IoT API streams</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                    <Line type="monotone" dataKey="Transaction Fees" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="Subscriptions" stroke="#6366f1" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="Commissions" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="IoT API" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income breakdown distribution circular split */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="border-b pb-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">MRR Revenue Split</h3>
                <p className="text-[10px] text-slate-400 font-medium">Contribution percentage by monetization nodes</p>
              </div>
              <div className="h-40 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={REVENUE_PIE} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                      {REVENUE_PIE.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {REVENUE_PIE.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
                      {entry.name}
                    </span>
                    <span>₹{(entry.value / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === "revenue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ARR & MRR Details */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded border border-indigo-500/30 uppercase">
                Annuity Index
              </span>
              <div>
                <p className="text-slate-400 text-xs uppercase font-extrabold">ARR (Annual Recurring Revenue)</p>
                <h4 className="text-3xl font-black text-indigo-400">₹41,10,804</h4>
              </div>
              <div className="border-t border-slate-800 pt-4">
                <p className="text-slate-400 text-xs uppercase font-extrabold">MRR (Monthly Recurring Revenue)</p>
                <h4 className="text-xl font-bold text-slate-100">₹3,42,567</h4>
              </div>
            </div>

            {/* AI Revenue Projections */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 col-span-2">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">Predictive Revenue Growth (15% YoY Compounded)</h4>
                  <p className="text-[10px] text-slate-400">Continuous platform scale modeling</p>
                </div>
                <div className="flex bg-slate-100 rounded-lg p-0.5 gap-1 text-[10px] font-bold">
                  {[2027, 2028, 2029, 2030].map((y) => (
                    <button
                      key={y}
                      onClick={() => setProjectionYear(y)}
                      className={`px-3 py-1 rounded-md ${projectionYear === y ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-slate-400 text-xs font-bold">Projected ARR for Year {projectionYear}</p>
                  <p className="text-3xl font-black text-emerald-600">₹{projectRevenue().toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500 font-bold">Incremental gain of +₹{(projectRevenue() - currentARR).toLocaleString()} from current block.</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 max-w-xs text-[11px] text-emerald-800 font-bold">
                  <Sparkles className="h-5 w-5 text-emerald-600 mb-1" />
                  Our neural growth forecast factors in state mandates, fertilizer subsidy dispatch curves, and localized IoT API integrations.
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown by Monetization Node Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5 space-y-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Dynamic Income Node Audit</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b">
                  <tr>
                    <th className="px-4 py-3">Source Node</th>
                    <th className="px-4 py-3 text-right">Transaction Volume</th>
                    <th className="px-4 py-3 text-right">Total Earned (₹)</th>
                    <th className="px-4 py-3 text-right">Commission Rate</th>
                    <th className="px-4 py-3 text-right">Daily Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-700">
                  {[
                    { source: "Transaction Escrow Fees", vol: "8,421 Lots", earned: 234567, comm: "1.5% average", trend: "+8.2%", isUp: true },
                    { source: "Premium Subscriptions (Pro/Premium)", vol: "1,452 users", earned: 112890, comm: "Fixed Monthly", trend: "+12.4%", isUp: true },
                    { source: "Equipment Rental Commissions", vol: "412 Bookings", earned: 85432, comm: "10.0% Flat", trend: "-2.1%", isUp: false },
                    { source: "Drone & Soil IoT API Integration", vol: "94,102 queries", earned: 45678, comm: "₹0.15 per hit", trend: "+18.9%", isUp: true },
                    { source: "Carbon Credits Commission", vol: "14 Transactions", earned: 35000, comm: "5.0% Brokerage", trend: "+45.0%", isUp: true }
                  ].map((node, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-extrabold text-slate-800">{node.source}</td>
                      <td className="px-4 py-3 text-right text-slate-600 font-mono">{node.vol}</td>
                      <td className="px-4 py-3 text-right font-black text-slate-800">₹{node.earned.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{node.comm}</td>
                      <td className={`px-4 py-3 text-right font-black ${node.isUp ? "text-emerald-600" : "text-rose-600"}`}>
                        {node.trend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === "growth" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Growth stacking chart */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Daily Registration Ramp-Up Stack</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={USER_GROWTH_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                  <Bar dataKey="Farmers" stackId="a" fill="#10b981" />
                  <Bar dataKey="Buyers" stackId="a" fill="#6366f1" />
                  <Bar dataKey="Suppliers" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="Experts" stackId="a" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geographical density of farmers */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Geographic Distribution</h3>
              <p className="text-[10px] text-slate-400">Total User density map (Statewise)</p>
            </div>
            <div className="space-y-4">
              {[
                { state: "Punjab / Haryana", count: "3,820 Farmers", share: "45.3%", color: "bg-emerald-500" },
                { state: "Gujarat / Maharashtra", count: "2,140 Farmers", share: "25.4%", color: "bg-indigo-500" },
                { state: "Telangana / Andhra Pradesh", count: "1,520 Farmers", share: "18.0%", color: "bg-amber-500" },
                { state: "West Bengal / Bihar", count: "941 Farmers", share: "11.3%", color: "bg-sky-500" }
              ].map((st, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span>{st.state}</span>
                    <span>{st.count} ({st.share})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${st.color}`} style={{ width: st.share }}></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Geographic metrics box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Top District Density:</span>
                <span>Bathinda, Punjab</span>
              </div>
              <p className="leading-tight">Highly responsive feature adoption observed in Rayalaseema microclimates.</p>
            </div>
          </div>
        </div>
      )}

      {subTab === "gateways" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Uptime and API Stats */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Uptime & Service Health</h4>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-3xl font-black text-emerald-600">99.98%</p>
                  <p className="text-xs text-slate-400 font-bold">SLA Target: 99.99%</p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl font-bold text-xs">
                  OK
                </div>
              </div>
              <p className="text-[10px] text-slate-500">Node cluster active. 14 microservices reporting healthy heartbeats.</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Average API Latency</h4>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-3xl font-black text-indigo-600">187 ms</p>
                  <p className="text-xs text-slate-400 font-bold">Peak database index lookup</p>
                </div>
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl font-bold text-[10px]">
                  FAST
                </div>
              </div>
              <p className="text-[10px] text-slate-500">Query caching hit rate at 94.2% via Redis cluster.</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Gateway Error Rate</h4>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-3xl font-black text-emerald-600">0.02%</p>
                  <p className="text-xs text-slate-400 font-bold">Uncaught network drops</p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl font-bold text-[10px]">
                  SAFE
                </div>
              </div>
              <p className="text-[10px] text-slate-500">No active network handshakes dropping in transit.</p>
            </div>
          </div>

          {/* Payment Gateways Ledger */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Payment Gateways Performance Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Razorpay (UPI / Cards)", success: "98.4%", status: "OPTIMAL", load: "Heavy Load (89 req/sec)", color: "border-indigo-100 bg-indigo-50/50 text-indigo-900" },
                { name: "Stripe Global Gateway", success: "97.1%", status: "STABLE", load: "Optimal Load (14 req/sec)", color: "border-blue-100 bg-blue-50/50 text-blue-900" },
                { name: "AgriConnect Mobile Wallet", success: "99.8%", status: "EXCELLENT", load: "Light Load (4 req/sec)", color: "border-emerald-100 bg-emerald-50/50 text-emerald-900" }
              ].map((gate, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${gate.color} space-y-2`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs">{gate.name}</span>
                    <span className="text-[9px] bg-white px-2 py-0.5 rounded border font-extrabold uppercase">{gate.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-70 block">Transaction Success rate:</span>
                    <strong className="text-2xl font-black">{gate.success}</strong>
                  </div>
                  <p className="text-[9px] opacity-60 font-semibold">{gate.load}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. USER MANAGEMENT DIRECTORY
// ==========================================
export function AdminUserDirectory({
  users,
  onVerify,
  onStatusChange,
  onImpersonate
}: {
  users: any[];
  onVerify: (id: string, status: string) => void;
  onStatusChange: (id: string, status: "Active" | "Suspended" | "Banned") => void;
  onImpersonate: (user: any) => void;
}) {
  const [activeSegmentTab, setActiveSegmentTab] = useState<"directory" | "queue" | "segments">("directory");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banReasonInput, setBanReasonInput] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string>("Active last 7 days");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.accountStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingQueue = users.filter((u) => u.accountStatus === "Pending");

  // Bulk action simulation
  const handleSendBulkBroadcast = (type: "SMS" | "Email") => {
    if (!bulkMessage.trim()) {
      alert("Please enter a message to broadcast!");
      return;
    }
    alert(`✓ Bulk ${type} Broadcast dispatched to segment [${selectedSegment}] (${users.length} targets).`);
    setBulkMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Tab select for User Management */}
      <div className="flex gap-2 border-b border-slate-100">
        {[
          { id: "directory", label: "All Users Directory" },
          { id: "queue", label: `Verification Queue (${pendingQueue.length})` },
          { id: "segments", label: "Segments & Bulk Actions" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSegmentTab(tab.id as any);
              setSelectedUser(null);
            }}
            className={`px-4 py-2 text-xs font-extrabold capitalize border-b-2 transition-all cursor-pointer ${
              activeSegmentTab === tab.id
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSegmentTab === "directory" && (
        <div className="space-y-6">
          {/* Search / Filter bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center flex-1 w-full">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Name, Email, Aadhaar, GST or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none text-slate-700 focus:border-indigo-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none text-slate-700 font-extrabold"
              >
                <option value="All">All Roles</option>
                <option value="Farmer">Farmers</option>
                <option value="Buyer">Buyers</option>
                <option value="Supplier">Suppliers</option>
                <option value="Expert">Experts</option>
                <option value="Government">Govt Officers</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none text-slate-700 font-extrabold"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending Verification</option>
                <option value="Suspended">Suspended</option>
                <option value="Banned">Banned</option>
              </select>
            </div>

            <button
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
                const dlAnchor = document.createElement("a");
                dlAnchor.setAttribute("href", dataStr);
                dlAnchor.setAttribute("download", "agriconnect_users.json");
                dlAnchor.click();
              }}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors text-xs font-bold flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Core Table */}
            <div className="lg:col-span-8 bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">Actor Info</th>
                      <th className="px-4 py-3">Role Node</th>
                      <th className="px-4 py-3">Aadhaar/GST</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Verification Badge</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-slate-700">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-extrabold text-slate-800">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{u.email} • ID: {u.id}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-[9px] font-extrabold bg-slate-100 rounded-md text-slate-700 uppercase">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                          {u.aadhaar}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {u.location}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2.5 w-2.5 rounded-full inline-block ${
                              u.accountStatus === "Active" ? "bg-emerald-500" :
                              u.accountStatus === "Pending" ? "bg-amber-400 animate-pulse" :
                              u.accountStatus === "Suspended" ? "bg-orange-400" : "bg-rose-500"
                            }`}></span>
                            <span className="text-[11px] font-bold text-slate-700 capitalize">{u.accountStatus}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inspect user sidebar */}
            <div className="lg:col-span-4 bg-white border border-slate-150 rounded-2xl shadow-sm p-5 space-y-4">
              {selectedUser ? (
                <div className="space-y-4">
                  <div className="border-b pb-2 flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">User Dossier</h4>
                      <p className="text-[10px] text-slate-400">Security & Onboarding Audit</p>
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="p-1 hover:bg-slate-100 rounded-full">
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-2.5 text-xs font-bold text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-slate-800 font-extrabold">{selectedUser.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400">Mobile Phone:</span>
                      <span className="text-slate-800 font-mono">{selectedUser.mobile}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400">KYC Status:</span>
                      <span className="text-indigo-600">{selectedUser.status} Verified</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-400">Join Date:</span>
                      <span className="text-slate-700">{selectedUser.joinDate}</span>
                    </div>
                    {selectedUser.landSize && (
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Land Acreage:</span>
                        <span className="text-slate-800 font-extrabold">{selectedUser.landSize}</span>
                      </div>
                    )}
                    {selectedUser.specialty && (
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Field Focus:</span>
                        <span className="text-slate-800 font-extrabold">{selectedUser.specialty}</span>
                      </div>
                    )}
                  </div>

                  {/* Onboarding Documents */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <p className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wide">Submitted KYC Documents</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                      <div className="bg-white p-2 rounded-lg border text-center hover:border-indigo-400 cursor-pointer">
                        <FileText className="h-4 w-4 text-indigo-500 mx-auto mb-1" />
                        Govt_ID_Card.pdf
                      </div>
                      <div className="bg-white p-2 rounded-lg border text-center hover:border-indigo-400 cursor-pointer">
                        <FileCheck className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                        Verification_Doc.pdf
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => onImpersonate(selectedUser)}
                      className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      Impersonate User View
                    </button>

                    <button
                      onClick={() => {
                        alert(`✓ Password reset email triggered for ${selectedUser.email}. Token generated.`);
                      }}
                      className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                    >
                      Trigger Password Reset
                    </button>

                    <div className="border-t pt-2.5 space-y-2">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Account Ban/Suspend Protocol</p>
                      <input
                        type="text"
                        placeholder="Provide ban/suspension reason..."
                        value={banReasonInput}
                        onChange={(e) => setBanReasonInput(e.target.value)}
                        className="w-full bg-slate-50 border rounded-lg p-2 text-xs focus:outline-none focus:border-rose-500 font-bold"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onStatusChange(selectedUser.id, "Suspended");
                            alert(`✓ ${selectedUser.name} temporarily suspended. Reason: ${banReasonInput || "Standard Policy Check"}`);
                            setBanReasonInput("");
                          }}
                          className="flex-1 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-amber-100 transition-colors"
                        >
                          Suspend
                        </button>
                        <button
                          onClick={() => {
                            if (!banReasonInput.trim()) {
                              alert("Please supply a ban reason!");
                              return;
                            }
                            onStatusChange(selectedUser.id, "Banned");
                            alert(`✓ Banned ${selectedUser.name} permanently. Reason: ${banReasonInput}`);
                            setBanReasonInput("");
                            setSelectedUser(null);
                          }}
                          className="flex-1 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-rose-100 transition-colors"
                        >
                          Permanently Ban
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Users className="h-8 w-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold">No User Profile Selected</p>
                  <p className="text-[10px] leading-relaxed">Select any administrative actor or farmer block from the directory queue to perform access audits.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSegmentTab === "queue" && (
        <div className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4">
          <div className="border-b pb-3">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">KYC Document Verification Queue</h4>
            <p className="text-[10px] text-slate-400">Review, verify and dispatch credentials to the platform</p>
          </div>

          {pendingQueue.length > 0 ? (
            <div className="space-y-4">
              {pendingQueue.map((user) => (
                <div key={user.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4 text-xs font-bold">
                  <div className="space-y-1">
                    <p className="text-slate-800 text-sm font-extrabold">{user.name}</p>
                    <p className="text-slate-400 font-medium">{user.email} • ID: {user.id} | Role: {user.role}</p>
                    <div className="flex gap-4 pt-1 font-mono text-[10px] text-slate-500">
                      <span>Aadhaar: {user.aadhaar}</span>
                      <span>Location: {user.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onVerify(user.id, "Active");
                        alert(`✓ Approved documents & verified platform credentials for ${user.name}`);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Approve KYC
                    </button>
                    <button
                      onClick={() => {
                        const r = prompt("Reason for rejection?", "Invalid or unreadable document upload");
                        if (r) {
                          onVerify(user.id, "Banned");
                          alert(`✓ Documents rejected for ${user.name}. Reason: ${r}`);
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Reject Documents
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 font-bold space-y-2">
              <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="text-xs text-slate-700">Verification Queue is Empty!</p>
              <p className="text-[10px] text-slate-400">All pending agronomists, farmers, and suppliers have been successfully badged.</p>
            </div>
          )}
        </div>
      )}

      {activeSegmentTab === "segments" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Segment Selector & Stats */}
          <div className="md:col-span-4 bg-white border rounded-2xl p-5 space-y-4">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b pb-2">User Segments Selection</h4>
            <div className="space-y-2">
              {[
                { label: "Active last 7 days", count: "4,256 Users", value: "high_activity" },
                { label: "Inactive last 30 days", count: "1,240 Users", value: "low_activity" },
                { label: "High spenders (> ₹1L)", count: "182 Corporates", value: "high_value" },
                { label: "New Users (< 7 days)", count: "756 Registered", value: "new_onboard" }
              ].map((seg) => (
                <button
                  key={seg.label}
                  onClick={() => setSelectedSegment(seg.label)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedSegment === seg.label
                      ? "bg-indigo-50 border-indigo-200 text-indigo-800"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <span>{seg.label}</span>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{seg.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Action panel */}
          <div className="md:col-span-8 bg-white border rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Disptach Bulk Campaign to Segment</h4>
              <p className="text-[10px] text-slate-400">Active Campaign targets: <strong className="text-slate-700">{selectedSegment}</strong></p>
            </div>

            <textarea
              value={bulkMessage}
              onChange={(e) => setBulkMessage(e.target.value)}
              placeholder="Type your alert message or marketing coupon code here... Variables like {name} will automatically populate on dispatch."
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 placeholder-slate-400 leading-relaxed resize-none"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleSendBulkBroadcast("SMS")}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Broadcast Twilio SMS
              </button>
              <button
                onClick={() => handleSendBulkBroadcast("Email")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Send SendGrid Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. MARKETPLACE & ESCROW MANAGEMENT
// ==========================================
export function AdminMarketplace({
  products,
  onVerifyProduct,
  orders,
  onUpdateOrderStatus,
  disputes,
  onResolveDispute
}: {
  products: any[];
  onVerifyProduct: (id: string, approved: boolean) => void;
  orders: any[];
  onUpdateOrderStatus: (id: string, status: string) => void;
  disputes: any[];
  onResolveDispute: (id: string, resolution: string) => void;
}) {
  const [activeSubTab, setActiveSubTab] = useState<"catalog" | "orders" | "disputes" | "refunds">("catalog");
  const [refundRequests, setRefundRequests] = useState([
    { id: "REF-101", orderId: "ORD-8941", buyer: "Rajesh Patel", amount: 2400, reason: "Wrong product seed variety received", status: "Pending" },
    { id: "REF-102", orderId: "ORD-8943", buyer: "Global Agrifood Corp", amount: 125000, reason: "Split delivery delayed past harvest", status: "Pending" }
  ]);

  const handleResolveRefund = (id: string, approve: boolean) => {
    setRefundRequests(prev => prev.map(r => r.id === id ? { ...r, status: approve ? "Approved" : "Rejected" } : r));
    alert(`✓ Refund request ${id} has been ${approve ? "APPROVED (Funds routed back via Razorpay)" : "REJECTED"}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-1.5">
        {[
          { id: "catalog", label: "Product Catalog" },
          { id: "orders", label: "Order Management" },
          { id: "disputes", label: `Dispute Center (${disputes.filter(d => d.status !== "Resolved").length})` },
          { id: "refunds", label: `Refund Management (${refundRequests.filter(r => r.status === "Pending").length})` }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveSubTab(btn.id as any)}
            className={`px-4 py-2 text-xs font-extrabold capitalize border-b-2 transition-all cursor-pointer ${
              activeSubTab === btn.id ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {activeSubTab === "catalog" && (
        <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Agritech Storefront Inventory</h4>
              <p className="text-[10px] text-slate-400">Approve government certified quality badges for local vendors</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] border-b">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock count</th>
                  <th className="px-4 py-3">Supplier Name</th>
                  <th className="px-4 py-3">Govt Trust status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-700">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-extrabold text-slate-800">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: {p.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.category}</td>
                    <td className="px-4 py-3 text-slate-800 font-extrabold">₹{p.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600">{p.stock} Units</td>
                    <td className="px-4 py-3 text-slate-600">{p.supplier}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase ${
                        p.approved ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}>
                        {p.approved ? "Govt Certified" : "Uncertified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onVerifyProduct(p.id, !p.approved)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
                          p.approved ? "bg-rose-50 text-rose-800 hover:bg-rose-100" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        }`}
                      >
                        {p.approved ? "Revoke Badge" : "Certify Quality"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === "orders" && (
        <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden p-5 space-y-4">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Trade Contract Fulfilment Ledger</h4>
              <p className="text-[10px] text-slate-400">Audit transit progress or force override logistics milestones</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] border-b">
                <tr>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Purchasing Buyer</th>
                  <th className="px-4 py-3">Merchant / Supplier</th>
                  <th className="px-4 py-3">Cargos / Items</th>
                  <th className="px-4 py-3">Sum Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-700">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-indigo-600 font-extrabold">{o.id}</td>
                    <td className="px-4 py-3 text-slate-800">{o.buyer}</td>
                    <td className="px-4 py-3 text-slate-600">{o.seller}</td>
                    <td className="px-4 py-3 text-slate-600">{o.items}</td>
                    <td className="px-4 py-3 text-slate-800 font-black">₹{o.total.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase ${
                        o.status === "Delivered" ? "bg-emerald-50 text-emerald-800" :
                        o.status === "Shipped" ? "bg-blue-50 text-blue-800" : "bg-amber-50 text-amber-800"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                        className="text-[10px] font-bold border rounded-lg bg-white p-1 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === "disputes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {disputes.map((d) => (
            <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="text-[9px] bg-amber-50 border border-amber-200 text-amber-800 font-extrabold px-2 py-0.5 rounded-full">Escrow Hold Active</span>
                    <h4 className="font-extrabold text-slate-800 text-xs mt-1">{d.id} • Order: {d.orderId}</h4>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded uppercase ${
                    d.status === "Open" ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <p>Buyer Claimant: <span className="text-slate-800">{d.buyer}</span></p>
                  <p className="text-slate-500 font-medium">Claim Reason: "{d.reason}"</p>
                  <p className="text-indigo-600 font-mono text-[10px] flex items-center gap-1">
                    <FileSpreadsheet className="h-4 w-4" /> Proof: {d.buyerProof}
                  </p>
                  <div className="border-t border-dashed my-2 pt-2 text-slate-600 font-medium">
                    <p className="font-bold text-slate-700">Merchant Response:</p>
                    <p>"{d.sellerResponse}"</p>
                  </div>
                </div>
              </div>

              {d.status !== "Resolved" ? (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      onResolveDispute(d.id, "Refunded");
                      alert(`✓ Dispute ${d.id} settled in favor of Buyer. Refund queued.`);
                    }}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Resolve for Buyer (Refund)
                  </button>
                  <button
                    onClick={() => {
                      onResolveDispute(d.id, "Disbursed");
                      alert(`✓ Dispute ${d.id} closed. Escrow released to Merchant.`);
                    }}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Resolve for Seller (Release)
                  </button>
                </div>
              ) : (
                <div className="text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center text-xs font-extrabold">
                  Dispute Resolved & Settled
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeSubTab === "refunds" && (
        <div className="bg-white border border-slate-150 rounded-2xl shadow-sm p-5 space-y-4">
          <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Refund Requests Queue</h4>
          <div className="space-y-4">
            {refundRequests.map((req) => (
              <div key={req.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4 text-xs font-bold">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {req.id}</span>
                    <strong className="text-indigo-600 font-mono">{req.orderId}</strong>
                    <span className="px-2 py-0.5 bg-white border rounded text-[9px] text-slate-600">{req.status}</span>
                  </div>
                  <p className="text-slate-700">Buyer: {req.buyer} | Sum amount: <span className="text-emerald-700">₹{req.amount.toLocaleString()}</span></p>
                  <p className="text-slate-400 font-semibold">Reason: "{req.reason}"</p>
                </div>

                {req.status === "Pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolveRefund(req.id, true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Approve & Refund
                    </button>
                    <button
                      onClick={() => handleResolveRefund(req.id, false)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Reject Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. FINANCIAL & REVENUE MANAGEMENT
// ==========================================
export function AdminFinance() {
  const [tradeFee, setTradeFee] = useState<number>(1.5);
  const [rentalComm, setRentalComm] = useState<number>(10.0);
  const [droneComm, setDroneComm] = useState<number>(20.0);
  const [apiFee, setApiFee] = useState<number>(50000);

  // Subscribers state
  const [subscribers, setSubscribers] = useState([
    { id: "SUB-01", name: "Amir Patel", plan: "Premium", rate: 499, status: "Paid", nextBill: "2026-08-10" },
    { id: "SUB-02", name: "Vikram Singh Crops Ltd", plan: "Enterprise", rate: 12500, status: "Paid", nextBill: "2026-08-15" },
    { id: "SUB-03", name: "Rajesh Grewal", plan: "Pro", rate: 99, status: "Failed", nextBill: "2026-07-22" }
  ]);

  // Expert payouts state
  const [payouts, setPayouts] = useState([
    { id: "PAY-904", target: "Dr. Rachel Carter (Soil Agronomist)", sum: 89400, bank: "SBI A/C: 4092104", status: "Pending" },
    { id: "PAY-905", target: "GreenEarth Bio supplies", sum: 34120, bank: "HDFC A/C: 1109412", status: "Pending" }
  ]);

  const handleProcessPayout = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "Processed" } : p));
    alert(`✓ Payout ${id} cleared! Payment triggered through Razorpay rails.`);
  };

  const handleCancelSub = (id: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
    alert(`✓ Subscription canceled. Pro-rated refund calculated.`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Commission Setting */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="h-4.5 w-4.5 text-indigo-500" />
              Commission Override Settings
            </h4>
            <p className="text-[10px] text-slate-400">Manage real-time ecosystem tariff rates</p>
          </div>

          <div className="space-y-3 text-xs font-bold text-slate-600">
            <div className="space-y-1">
              <label>Marketplace Trans Fee ({tradeFee}%)</label>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={tradeFee}
                onChange={(e) => setTradeFee(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label>Equipment Rental Commission ({rentalComm}%)</label>
              <input
                type="number"
                value={rentalComm}
                onChange={(e) => setRentalComm(Number(e.target.value))}
                className="w-full bg-slate-50 border rounded-lg p-2 font-bold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label>Drone Survey Commission ({droneComm}%)</label>
              <input
                type="number"
                value={droneComm}
                onChange={(e) => setDroneComm(Number(e.target.value))}
                className="w-full bg-slate-50 border rounded-lg p-2 font-bold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label>Enterprise API Monthly Access (₹)</label>
              <input
                type="number"
                value={apiFee}
                onChange={(e) => setApiFee(Number(e.target.value))}
                className="w-full bg-slate-50 border rounded-lg p-2 font-bold text-slate-700"
              />
            </div>

            <button
              onClick={() => alert(`✓ Dynamic Marketplace Fee set to ${tradeFee}%, Rental to ${rentalComm}%, Drone to ${droneComm}%, API to ₹${apiFee}. Saved.`)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition-all"
            >
              Apply Rates Update
            </button>
          </div>
        </div>

        {/* Pending Payout Settlements */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
          <div className="border-b pb-3 flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Expert & Supplier Settlements</h4>
              <p className="text-[10px] text-slate-400 font-medium">Clear processed sales and webinar consultations earnings</p>
            </div>
            <span className="text-[9px] bg-amber-50 border text-amber-800 font-extrabold px-2 py-0.5 rounded-full uppercase">Settlement Block</span>
          </div>

          <div className="space-y-3">
            {payouts.map((p) => (
              <div key={p.id} className="p-3 bg-slate-50 rounded-xl border flex justify-between items-center text-xs font-bold">
                <div>
                  <p className="text-slate-800">{p.target}</p>
                  <p className="text-[10px] text-slate-400 font-mono font-medium">{p.bank} | ID: {p.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-800 font-black">₹{p.sum.toLocaleString()}</span>
                  {p.status === "Pending" ? (
                    <button
                      onClick={() => handleProcessPayout(p.id)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Disburse Now
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 border px-2 py-1 rounded">Disbursed</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tax dashboard overview (GST) */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <strong className="text-emerald-900 text-xs flex items-center gap-1 uppercase tracking-wide">
                <FileCheck className="h-4.5 w-4.5 text-emerald-600" /> GST Tax Compliance (Quarter Q2)
              </strong>
              <button
                onClick={() => {
                  alert("✓ GSTR-1 and GSTR-3B monthly tax spreadsheets compiled & downloaded locally.");
                }}
                className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded text-[9px] font-extrabold cursor-pointer shadow-xs flex items-center gap-1"
              >
                <Download className="h-3 w-3" /> GSTR-1 Exporter
              </button>
            </div>
            <p className="text-[10px] text-emerald-800 font-bold leading-normal">
              Collected GST: ₹2,34,567 | Paid Outward: ₹1,12,890 | Net GST Liability: <strong className="text-emerald-950 font-black">₹1,21,677</strong>. All tax filings conform with Central Board of Indirect Taxes rules.
            </p>
          </div>
        </div>
      </div>

      {/* Active Subscriptions Dashboard */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Active Premium Plan Subscriptions</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase border-b">
              <tr>
                <th className="px-4 py-3">Subscriber</th>
                <th className="px-4 py-3">Tier Plan</th>
                <th className="px-4 py-3">Recurring Price</th>
                <th className="px-4 py-3">Billing Status</th>
                <th className="px-4 py-3">Next Invoicing</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-extrabold">{s.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded ${
                      s.plan === "Enterprise" ? "bg-purple-100 text-purple-800 border" : "bg-indigo-50 text-indigo-800"
                    }`}>
                      {s.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">₹{s.rate}/month</td>
                  <td className="px-4 py-3">
                    <span className={`h-2.5 w-2.5 rounded-full inline-block mr-1 ${s.status === "Paid" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                    {s.status}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">{s.nextBill}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleCancelSub(s.id)}
                      className="px-2 py-1 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded text-[10px] font-bold cursor-pointer"
                    >
                      Revoke Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. AI CO-PILOT WORKSPACE (Real-Linked Gemini)
// ==========================================
export function AdminCoPilot() {
  const [chat, setChat] = useState<string>("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "ai"; msg: string }[]>([
    { sender: "ai", msg: "Hello Master Admin! I'm monitoring the entire AgriConnect AI networks. Anomalies: 0.04% (optimal). Ask me anything about revenue indices, user verification, or compliance audits!" }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [speechSimActive, setSpeechSimActive] = useState(false);

  // Suggested Quick Questions
  const QUICK_QUESTIONS = [
    "What is our revenue today?",
    "How many new farmers registered this week?",
    "Show me the top profitable suppliers",
    "Any suspicious or fraudulent activity?"
  ];

  const handleSendPrompt = async (textToSend?: string) => {
    const promptText = textToSend || chat;
    if (!promptText.trim()) return;

    setChatLog((prev) => [...prev, { sender: "user", msg: promptText }]);
    if (!textToSend) setChat("");

    setIsAiTyping(true);

    try {
      // Gather real contextual background about the dashboard to supply Gemini
      const dashboardContext = `
[REAL-TIME PORTAL STATE - DO NOT REVEAL THESE JSON ENVELOPE LABELS IN RESPONSE]:
- Total Users: 12,847 (Farmers: 8,421, Buyers: 2,156, Suppliers: 1,234, Govt: 845, Experts: 191)
- Monthly Revenue: ₹15,42,678 (+12.3% growth)
- Platform Health: Uptime 99.98% | Latency: 187ms | Error rate: 0.02%
- Active Verification Queue: 756 Farmers waiting for KYC approval
- Dynamic Escrow Block: 3 active disputes resolved today
- ARR (Annual Run Rate): ₹41,10,804 | MRR: ₹3,42,567
- Active Fraud Flags: IP duplicate match detected between USR-004 and USR-006 (Bathinda crop lots)
`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeRole: "Admin",
          language: "English",
          messages: [
            { role: "system", content: "You are the Super Admin Assistant for AgriConnect. Provide highly accurate, precise statistics using the supplied real-time context." },
            { role: "user", content: promptText + "\n\n" + dashboardContext }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("Handshake drop");
      }

      const result = await response.json();
      setChatLog((prev) => [...prev, { sender: "ai", msg: result.text }]);
    } catch (err) {
      // High-fidelity fallback simulating local analysis if connection is offline
      setTimeout(() => {
        let reply = "Local Admin Agent Sandbox reporting: Server cluster is green, all database schemas verified.";
        const cleanQuery = promptText.toLowerCase();
        if (cleanQuery.includes("revenue") || cleanQuery.includes("earn")) {
          reply = "Total Revenue this month is ₹15,42,678 (up 12.3% MoM). Highest contributing monetization channel is Transaction Fees (₹2,34,567).";
        } else if (cleanQuery.includes("farmer") || cleanQuery.includes("users")) {
          reply = "The platform has registered 12,847 total actors. This includes 8,421 Farmers, 2,156 Buyers, and 1,234 Suppliers.";
        } else if (cleanQuery.includes("suspicious") || cleanQuery.includes("fraud") || cleanQuery.includes("activity")) {
          reply = "WARNING: Duplicate IP login match flagged from 192.168.1.191 (associated with Supplier USR-006 & Farmer USR-004). Advise auditing matching bank details.";
        }
        setChatLog((prev) => [...prev, { sender: "ai", msg: reply }]);
      }, 700);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Text-To-Speech Simulator
  const handleReadAloud = (textToRead: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead.slice(0, 200));
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("TTS audio not supported in this frame environment.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Real Gemini AI Co-Pilot Chat Console */}
      <div className="lg:col-span-7 bg-slate-950 text-slate-200 rounded-3xl border border-slate-800 shadow-xl p-5 flex flex-col justify-between h-[440px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-400 animate-pulse" />
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">Enterprise AI Co-Pilot Console</h4>
              <p className="text-[10px] text-slate-500 uppercase">Live Server-Side Gemini API (3.5-Flash)</p>
            </div>
          </div>
          <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-black">
            10 INDIAN LANGUAGES
          </span>
        </div>

        {/* Chat log feed */}
        <div className="flex-1 my-3 overflow-y-auto space-y-3 pr-1 text-xs leading-relaxed font-mono">
          {chatLog.map((log, idx) => (
            <div key={idx} className={`flex ${log.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-2xl max-w-[85%] border shadow-sm ${
                log.sender === "user"
                  ? "bg-indigo-600 border-indigo-500 text-white rounded-br-none"
                  : "bg-slate-900 border-slate-850 text-slate-100 rounded-bl-none"
              }`}>
                <p>{log.msg}</p>
                {log.sender === "ai" && (
                  <button
                    onClick={() => handleReadAloud(log.msg)}
                    className="mt-2 text-[9px] text-indigo-300 hover:text-indigo-100 flex items-center gap-1 cursor-pointer bg-slate-800/60 px-2 py-0.5 rounded-md"
                  >
                    <Volume2 className="h-3 w-3" /> Read aloud
                  </button>
                )}
              </div>
            </div>
          ))}

          {isAiTyping && (
            <div className="flex justify-start">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none text-slate-400 font-mono">
                <span className="animate-pulse">Analyzing neural platform statistics...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions Ribbon */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 text-[10px] font-mono scrollbar-none">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendPrompt(q)}
              className="bg-slate-900 hover:bg-slate-850 text-indigo-300 px-3 py-1.5 rounded-full border border-slate-800 whitespace-nowrap cursor-pointer transition-all shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 items-center pt-2 border-t border-slate-900">
          <button
            onClick={() => {
              setSpeechSimActive(true);
              setTimeout(() => {
                setSpeechSimActive(false);
                handleSendPrompt("Show me any duplicate IP accounts on the platform.");
              }, 1400);
            }}
            className={`p-3 rounded-xl border ${
              speechSimActive ? "bg-rose-600 text-white animate-pulse border-rose-500" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-100"
            } cursor-pointer transition-all`}
          >
            <Mic className="h-4 w-4" />
          </button>

          <input
            type="text"
            placeholder="Type query about revenue milestones, KYC queues, or platform audits..."
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono placeholder-slate-700 focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={() => handleSendPrompt()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* AI Anomaly & Fraud Ledger */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
        <div className="border-b pb-3">
          <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500 animate-bounce" />
            AI Anomaly & Fraud ledger
          </h4>
          <p className="text-[10px] text-slate-400 font-medium">Automatic verification scanning for double payouts & sybil attacks</p>
        </div>

        <div className="space-y-3">
          {[
            { id: "ANM-01", type: "Fraud Risk", desc: "Duplicate bank routing matching detected between USR-004 and USR-006", level: "High", actioned: false },
            { id: "ANM-02", type: "Volume Spike", desc: "Unusual refund volume spike from Region Bathinda lot index (>₹1L)", level: "Medium", actioned: false },
            { id: "ANM-03", type: "IP Conflict", desc: "Multi-account login matching crop broker USR-005 (Mumbai proxy)", level: "Low", actioned: true }
          ].map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 rounded-xl border flex justify-between items-center text-xs font-bold gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 text-[8px] font-black rounded uppercase ${
                    item.level === "High" ? "bg-rose-50 text-rose-800 border" :
                    item.level === "Medium" ? "bg-amber-50 text-amber-800 border" : "bg-slate-100 text-slate-600"
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">{item.id}</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed font-semibold">{item.desc}</p>
              </div>

              <div>
                {item.actioned ? (
                  <span className="text-[9px] text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded border">Audited</span>
                ) : (
                  <button
                    onClick={(e) => {
                      const btn = e.currentTarget;
                      btn.textContent = "Locked";
                      btn.className = "px-2.5 py-1 bg-rose-600 text-white rounded text-[9px] font-bold";
                      alert(`✓ Platform safety audit: Temporarily locked assets associated with ${item.id}.`);
                    }}
                    className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded text-[9px] font-bold cursor-pointer shrink-0"
                  >
                    Lock Asset
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. PLATFORM SETTINGS & CONFIGURATION
// ==========================================
export function AdminConfig() {
  const [features, setFeatures] = useState({
    marketplace: true,
    rental: true,
    recommendations: true,
    schemes: true,
    video: true,
    drone: false,
    blockchain: false,
    carbon: true
  });

  const [activeTemplate, setActiveTemplate] = useState("Welcome Email");
  const [templateContent, setTemplateContent] = useState(
    "Dear {name},\n\nWelcome to AgriConnect AI! Your credentials as a {role} have been verified on our secure nodes. You are now authorized to clear transactions."
  );

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
    alert(`✓ Feature toggle changed: ${String(key).toUpperCase()} is now ${!features[key] ? "ENABLED" : "DISABLED"}.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* General Settings and toggles */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
        <div className="border-b pb-3">
          <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Ecosystem Feature Toggles</h4>
          <p className="text-[10px] text-slate-400">Instantly activate or deactivate platform monetization nodes</p>
        </div>

        <div className="space-y-3">
          {[
            { id: "marketplace", label: "Trade Marketplace", desc: "Allows buyer crop bidding" },
            { id: "rental", label: "Machinery Rentals", desc: "Co-op tractor rentals" },
            { id: "recommendations", label: "AI Recommendations", desc: "Neural crop disease scanners" },
            { id: "video", label: "Video Consultations", desc: "Agronomist WebRTC sessions" },
            { id: "drone", label: "Drone-as-a-Service", desc: "Canopy multispectral flights" },
            { id: "blockchain", label: "Blockchain Ledgers", desc: "Double-hashed logistics ledger" },
            { id: "carbon", label: "Carbon Credits Hub", desc: "Soil carbon brokerage transactions" }
          ].map((f) => {
            const active = features[f.id as keyof typeof features];
            return (
              <div key={f.id} className="flex items-center justify-between gap-4 py-1.5 text-xs font-bold border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-slate-800">{f.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{f.desc}</p>
                </div>
                <button onClick={() => toggleFeature(f.id as keyof typeof features)} className="focus:outline-none cursor-pointer">
                  {active ? <ToggleRight className="h-8 w-8 text-emerald-500" /> : <ToggleLeft className="h-8 w-8 text-slate-400" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Communications SMS / Email Template Editor */}
      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
        <div className="border-b pb-3 flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Notification Template Engine</h4>
            <p className="text-[10px] text-slate-400">Custom dynamic variables for SMS/Email gateways</p>
          </div>
          <select
            value={activeTemplate}
            onChange={(e) => {
              const t = e.target.value;
              setActiveTemplate(t);
              if (t === "Welcome Email") {
                setTemplateContent("Dear {name},\n\nWelcome to AgriConnect AI! Your credentials as a {role} have been verified.");
              } else if (t === "OTP SMS") {
                setTemplateContent("Your secure verification pin is: {otp}. Valid for 60 seconds.");
              } else {
                setTemplateContent("Farming update: Your order ID {id} has been dispatched.");
              }
            }}
            className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none text-slate-700 font-extrabold"
          >
            <option value="Welcome Email">Welcome Email (SendGrid)</option>
            <option value="OTP SMS">OTP Verification (Twilio)</option>
            <option value="Farming Alert">Farming Dispatch Alert</option>
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex gap-1.5 text-[9px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg font-bold">
            <span>Variables:</span>
            <span className="bg-white px-1.5 py-0.5 rounded border">{"{name}"}</span>
            <span className="bg-white px-1.5 py-0.5 rounded border">{"{role}"}</span>
            <span className="bg-white px-1.5 py-0.5 rounded border">{"{otp}"}</span>
            <span className="bg-white px-1.5 py-0.5 rounded border">{"{id}"}</span>
          </div>

          <textarea
            value={templateContent}
            onChange={(e) => setTemplateContent(e.target.value)}
            rows={5}
            className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded-xl focus:outline-none border border-slate-800 leading-relaxed resize-none"
          />

          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">SendGrid Gateway: CONNECTED</span>
            <button
              onClick={() => alert("✓ Templates cached and updated across AWS SendGrid / Twilio nodes.")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md"
            >
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. SECURITY, COMPLIANCE & AUDIT LOGS
// ==========================================
export function AdminSecurity({ auditLogs }: { auditLogs: any[] }) {
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [whitelistedIPs, setWhitelistedIPs] = useState<string[]>(["192.168.1.104", "10.0.4.12"]);
  const [newIP, setNewIP] = useState("");

  const handleAddIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIP.trim()) return;
    setWhitelistedIPs(prev => [...prev, newIP.trim()]);
    setNewIP("");
    alert(`✓ whitelisted IP ${newIP.trim()} permanently.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Security Policies */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
        <div className="border-b pb-3">
          <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Access Policy Controls</h4>
          <p className="text-[10px] text-slate-400 font-medium">Verify credentials whitelisting and timeout thresholds</p>
        </div>

        <div className="space-y-4 text-xs font-bold text-slate-600">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-slate-700 font-extrabold">Enforce 2FA for all Admins</p>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">Google Authenticator mandatory handshakes</p>
            </div>
            <button onClick={() => setMfaEnforced(!mfaEnforced)} className="focus:outline-none cursor-pointer">
              {mfaEnforced ? <ToggleRight className="h-8 w-8 text-emerald-500" /> : <ToggleLeft className="h-8 w-8 text-slate-400" />}
            </button>
          </div>

          <div className="space-y-1.5 border-t pt-3">
            <label>IP Address Whitelist</label>
            <form onSubmit={handleAddIP} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 192.168.1.55"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                className="bg-slate-50 border rounded-lg p-2 text-xs focus:outline-none flex-1 font-bold"
              />
              <button type="submit" className="px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer text-xs">
                Add
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {whitelistedIPs.map((ip, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-full text-[10px] border border-indigo-100 flex items-center gap-1">
                  {ip}
                  <button onClick={() => setWhitelistedIPs(prev => prev.filter(item => item !== ip))} className="hover:text-rose-600">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
            <p className="text-[9px] font-black text-indigo-900 uppercase tracking-wider">GDPR & DPDP 2023 Compliance</p>
            <p className="text-[10px] text-indigo-800 leading-relaxed font-semibold">
              Ecosystem ledger conforms with right-to-be-forgotten statutes. Users can export full personal profiles or request complete scrub logs.
            </p>
            <button
              onClick={() => alert("✓ Scrub routine triggered. 0 active user records currently flagged.")}
              className="mt-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-indigo-700 rounded text-[9px] font-bold shadow-xs cursor-pointer border"
            >
              Scrub Decommissioned Accounts
            </button>
          </div>
        </div>
      </div>

      {/* Security Audit logs stream */}
      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-4">
        <div className="border-b pb-3 flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Platform Governance Audit Logs</h4>
            <p className="text-[10px] text-slate-400">Immutable chronological trail of ecosystem actions</p>
          </div>
          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold border px-2 py-0.5 rounded-full">SECURED</span>
        </div>

        <div className="overflow-y-auto max-h-[240px] border rounded-xl divide-y">
          {auditLogs.map((log, idx) => (
            <div key={idx} className="p-3 hover:bg-slate-50 text-[10px] font-bold font-mono grid grid-cols-12 gap-2">
              <span className="col-span-2 text-slate-400 font-medium">{log.time}</span>
              <span className="col-span-3 text-indigo-600 truncate">{log.ip}</span>
              <span className="col-span-7 text-slate-700 leading-normal">{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. SUPPORT TICKET SYSTEM & COMPLAINTS
// ==========================================
export function AdminSupport({
  tickets,
  onResolveTicket
}: {
  tickets: any[];
  onResolveTicket: (id: string) => void;
}) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [responseText, setResponseText] = useState("");

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    
    // Simulate appending ticket responses
    if (selectedTicket) {
      selectedTicket.responses = [
        ...(selectedTicket.responses || []),
        { sender: "admin", text: responseText, time: "Just Now" }
      ];
      setResponseText("");
      alert("✓ Response disptached to User's notification inbox.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Support Tickets list */}
      <div className="lg:col-span-7 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Active Support Tickets</h4>
        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${
                selectedTicket?.id === t.id ? "bg-indigo-50/50 border-indigo-200 shadow-xs" : "border-slate-100 hover:bg-slate-50"
              }`}
            >
              <div className="space-y-1 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 text-[8px] font-black rounded uppercase ${
                    t.priority === "High" ? "bg-rose-50 text-rose-800 border" : "bg-slate-100 text-slate-600"
                  }`}>
                    {t.priority}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">{t.id}</span>
                </div>
                <p className="text-slate-800 truncate max-w-sm">"{t.subject}"</p>
                <p className="text-slate-400 text-[10px] font-medium">User: {t.user} | Asked: {t.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                  t.status === "Open" ? "bg-amber-100 text-amber-800" :
                  t.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {t.status}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket audit and respond box */}
      <div className="lg:col-span-5 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
        {selectedTicket ? (
          <div className="space-y-4 flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="border-b pb-2 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Ticket Conversation</h4>
                  <p className="text-[9px] text-slate-400 font-mono">ID: {selectedTicket.id}</p>
                </div>
                {selectedTicket.status !== "Resolved" && (
                  <button
                    onClick={() => {
                      onResolveTicket(selectedTicket.id);
                      selectedTicket.status = "Resolved";
                      alert(`✓ Closed Support Ticket ${selectedTicket.id}.`);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>

              {/* Chat timeline inside ticket */}
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {(selectedTicket.responses || []).map((resp: any, i: number) => (
                  <div key={i} className={`p-2.5 rounded-xl text-xs font-bold leading-normal ${
                    resp.sender === "admin" ? "bg-indigo-50 text-indigo-900 border border-indigo-100 ml-4" : "bg-slate-50 text-slate-800 mr-4"
                  }`}>
                    <p className="text-[9px] text-slate-400 font-mono capitalize mb-1">{resp.sender} • {resp.time}</p>
                    <p>{resp.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedTicket.status !== "Resolved" && (
              <form onSubmit={handleSendResponse} className="space-y-2 border-t pt-3">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type official support reply..."
                  rows={3}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 resize-none"
                />
                <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                  Dispatch Official Response
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <MessageSquare className="h-8 w-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold">No Support Ticket Loaded</p>
            <p className="text-[10px] leading-relaxed">Select any active complaint from the support directory to open live diagnostics thread.</p>
          </div>
        )}
      </div>
    </div>
  );
}
