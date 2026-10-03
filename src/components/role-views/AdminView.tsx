import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Sliders,
  CheckCircle,
  Database,
  Activity,
  UserCheck,
  AlertTriangle,
  FileCheck,
  Percent,
  TrendingUp,
  XCircle,
  Terminal,
  Code2,
  Play,
  Download,
  RefreshCw,
  Plus,
  HelpCircle,
  FileText,
  Table,
  Link2,
  Lock,
  Users,
  ShoppingBag,
  DollarSign,
  Cpu,
  Shield,
  MessageSquare,
  Wrench,
  Settings
} from "lucide-react";

import MLPredictionHub from "../analytics/MLPredictionHub";
import FarmerProfiles from "../farmers/FarmerProfiles";
import {
  AdminDashboard,
  AdminUserDirectory,
  AdminMarketplace,
  AdminFinance,
  AdminCoPilot,
  AdminConfig,
  AdminSecurity,
  AdminSupport,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_DISPUTES,
  INITIAL_TICKETS
} from "./AdminModules";

// Original SQL Database Seed
const INITIAL_MYSQL_TABLES = {
  farmers: [
    { id: 1, name: "Amir Patel", email: "amir.patel@agrifarm.org", location: "Andhra Pradesh Block 4", joined_date: "2026-01-10", land_size_acres: 12.5 },
    { id: 2, name: "Vikram Singh", email: "vikram@singhcrops.com", location: "Haryana Sector 2", joined_date: "2026-03-15", land_size_acres: 24.0 },
    { id: 3, name: "Siddharth Roy", email: "siddharth@royagri.edu", location: "West Bengal Zone C", joined_date: "2026-04-20", land_size_acres: 8.2 },
    { id: 4, name: "Rajesh Grewal", email: "rajesh@grewalfarms.net", location: "Andhra Pradesh Block 3", joined_date: "2026-05-02", land_size_acres: 15.0 }
  ],
  sensors: [
    { id: "sens-1", name: "Soil Probe A", type: "soil_moisture", current_value: 42.0, battery: 92, signal_dbm: -65, location: "Block C (Maize)" },
    { id: "sens-2", name: "Meteorology Node", type: "temperature", current_value: 28.5, battery: 85, signal_dbm: -58, location: "North Pivot" },
    { id: "sens-3", name: "Reservoir Level Sensor", type: "water_level", current_value: 75.0, battery: 94, signal_dbm: -70, location: "Water Intake" },
    { id: "sens-4", name: "Canopy Air Sensor", type: "humidity", current_value: 62.0, battery: 88, signal_dbm: -62, location: "South Orchard" }
  ],
  market_bids: [
    { id: "bid-1", buyer_id: 101, crop_type: "Basmati Rice", quantity_tons: 25.0, price_per_ton: 450, status: "Active" },
    { id: "bid-2", buyer_id: 102, crop_type: "Organic Wheat", quantity_tons: 10.0, price_per_ton: 380, status: "Accepted" },
    { id: "bid-3", buyer_id: 103, crop_type: "Rainfed Maize", quantity_tons: 40.0, price_per_ton: 290, status: "Countered" }
  ],
  crop_diagnostics: [
    { id: "diag-1", crop_name: "Tomato", symptoms: "Yellow leaves with concentric rings", status: "AI Diagnosed", confidence_score: 94 },
    { id: "diag-2", crop_name: "Rice Paddy", symptoms: "Reddish streaks parallel to veins", status: "Expert Verified", confidence_score: 88 }
  ]
};

type DbTable = keyof typeof INITIAL_MYSQL_TABLES;

interface AdminViewProps {
  actors: { id: string; name: string; email: string; role: string; status: string }[];
  onVerifyActor: (id: string, status: string) => void;
}

export default function AdminView({ actors, onVerifyActor }: AdminViewProps) {
  // Authentication & Lock State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputEmail, setInputEmail] = useState("admin@agriconnect.ai");
  const [inputPassword, setInputPassword] = useState("admin123");
  const [inputMfa, setInputMfa] = useState("");
  const [currentMfaToken, setCurrentMfaToken] = useState("412 804");
  const [loginError, setLoginError] = useState("");

  // Role Hierarchy & Permission matrix
  const [adminSubRole, setAdminSubRole] = useState<
    "Super Admin" | "Finance Admin" | "User Admin" | "Content Admin" | "Analytics Admin" | "Support Admin"
  >("Super Admin");

  // Main UI Tab Toggle
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dynamic Modules States
  const [users, setUsers] = useState(INITIAL_USERS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [auditLogs, setAuditLogs] = useState([
    { time: "08:00:10", ip: "192.168.1.104", action: "System gateway started. Node cluster OK." },
    { time: "08:02:15", ip: "192.168.1.104", action: "Configured SendGrid & Twilio SMS relays." }
  ]);

  // Original SQL workbench State Simulation
  const [dbTables, setDbTables] = useState(INITIAL_MYSQL_TABLES);
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM farmers WHERE land_size_acres > 10;");
  const [queryResult, setQueryResult] = useState<{
    success: boolean;
    columns: string[];
    rows: any[];
    message: string;
    executionTimeMs: number;
  }>({
    success: true,
    columns: ["id", "name", "email", "location", "joined_date", "land_size_acres"],
    rows: INITIAL_MYSQL_TABLES.farmers.filter(f => f.land_size_acres > 10),
    message: "4 rows returned successfully.",
    executionTimeMs: 4
  });

  const [activeSchemaTab, setActiveSchemaTab] = useState<DbTable>("farmers");
  const [codeExportFormat, setCodeExportFormat] = useState<"sql" | "springboot" | "mern">("springboot");

  // Rotate MFA token simulation every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const code = Math.floor(100000 + Math.random() * 900000);
      const strCode = `${String(code).slice(0, 3)} ${String(code).slice(3)}`;
      setCurrentMfaToken(strCode);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const addAuditLog = (action: string) => {
    const time = new Date().toLocaleTimeString();
    setAuditLogs(prev => [{ time, ip: "192.168.1.104", action }, ...prev]);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputEmail === "admin@agriconnect.ai" && inputPassword === "admin123") {
      setIsLoggedIn(true);
      setLoginError("");
      addAuditLog(`Admin [${inputEmail}] authenticated successfully via MFA. Role: Super Admin`);
    } else {
      setLoginError("Invalid administrator credentials. Access Denied.");
      addAuditLog(`FAILED Access attempt: ${inputEmail} from IP: 192.168.1.104`);
    }
  };

  // State mutation actions that append audit logs
  const handleVerifyUser = (id: string, newStatus: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, accountStatus: newStatus } : u));
    const uName = users.find(u => u.id === id)?.name || id;
    addAuditLog(`Identity verified. Approved KYC documents for ${uName} (ID: ${id})`);
  };

  const handleStatusChange = (id: string, status: "Active" | "Suspended" | "Banned") => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, accountStatus: status } : u));
    const uName = users.find(u => u.id === id)?.name || id;
    addAuditLog(`Account status modified for ${uName} (ID: ${id}). New Status: ${status}`);
  };

  const handleImpersonateUser = (user: any) => {
    alert(`Success: Now impersonating [${user.name}] (${user.role}). Redirecting to sandboxed profile terminal...`);
    addAuditLog(`Impersonated Session opened for user: ${user.name} (ID: ${user.id})`);
  };

  const handleVerifyProduct = (id: string, approved: boolean) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, approved } : p));
    const pName = products.find(p => p.id === id)?.name || id;
    addAuditLog(`Product cert updated. Trust Badge [${approved ? "Approved" : "Revoked"}] for SKU: ${pName}`);
  };

  const handleUpdateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    addAuditLog(`Order status force overridden. Order ${id} is now set to ${status}`);
  };

  const handleResolveDispute = (id: string, resolution: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: "Resolved" } : d));
    addAuditLog(`Escrow Dispute resolved for ticket ${id}. Outcome: ${resolution}`);
  };

  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "Resolved" } : t));
    addAuditLog(`Support Ticket marked resolved: ${id}`);
  };

  // Original Workbench Query Processor
  const executeSimulatedQuery = () => {
    const startTime = performance.now();
    const queryClean = sqlQuery.trim().replace(/;$/, "");
    const lowerQuery = queryClean.toLowerCase();

    addAuditLog(`Executed raw database SQL statement: "${queryClean.slice(0, 50)}..."`);

    try {
      if (lowerQuery.startsWith("select")) {
        const fromMatch = queryClean.match(/from\s+([a-zA-Z0-9_]+)/i);
        if (!fromMatch) {
          throw new Error("Syntax Error: Missing FROM clause or invalid table name.");
        }
        const tableName = fromMatch[1].toLowerCase() as DbTable;
        if (!dbTables[tableName]) {
          throw new Error(`Table '${tableName}' does not exist in local schema.`);
        }

        let dataset = [...dbTables[tableName]];
        const whereMatch = queryClean.match(/where\s+([a-zA-Z0-9_]+)\s*([>=<]+|like)\s*(.+)/i);
        if (whereMatch) {
          const col = whereMatch[1].trim();
          const operator = whereMatch[2].trim();
          let rawVal = whereMatch[3].trim();
          
          if (rawVal.startsWith("'") && rawVal.endsWith("'")) {
            rawVal = rawVal.substring(1, rawVal.length - 1);
          } else if (rawVal.startsWith('"') && rawVal.endsWith('"')) {
            rawVal = rawVal.substring(1, rawVal.length - 1);
          }

          dataset = dataset.filter((row: any) => {
            const val = row[col];
            if (val === undefined) return false;
            if (operator === "=") return String(val).toLowerCase() === rawVal.toLowerCase();
            if (operator === ">") return Number(val) > Number(rawVal);
            if (operator === "<") return Number(val) < Number(rawVal);
            return true;
          });
        }

        let columns: string[] = dataset.length > 0 ? Object.keys(dataset[0]) : ["id"];
        const duration = Math.round((performance.now() - startTime) * 100) / 100;
        setQueryResult({
          success: true,
          columns,
          rows: dataset,
          message: `Query OK: ${dataset.length} row(s) returned.`,
          executionTimeMs: duration || 1
        });
      } else {
        throw new Error("Local query studio matches standard SELECT filters on tables (farmers, sensors, market_bids, crop_diagnostics).");
      }
    } catch (err: any) {
      setQueryResult({
        success: false,
        columns: ["Error Code", "Diagnosis"],
        rows: [["ERR_MYSQL_PARSER_1064", err.message]],
        message: `MySQL Error: ${err.message}`,
        executionTimeMs: 1
      });
    }
  };

  const getCodeSnippet = () => {
    if (codeExportFormat === "sql") {
      return `CREATE DATABASE IF NOT EXISTS agriconnect_db;
USE agriconnect_db;
CREATE TABLE IF NOT EXISTS farmers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  joined_date DATE
);`;
    } else if (codeExportFormat === "springboot") {
      return `package com.agriconnect.server.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "farmers")
@Getter @Setter @NoArgsConstructor
public class Farmer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
}`;
    } else {
      return `const mongoose = require('mongoose');
const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  joined_date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Farmer', FarmerSchema);`;
    }
  };

  // Secure Lockscreen Rendering
  if (!isLoggedIn) {
    return (
      <div id="admin-lockscreen" className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-8 space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">AgriConnect Secure Core</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Administrative Auth Gateway</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-slate-500">Official Admin Email</label>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className="w-full bg-slate-50 border rounded-xl p-2.5 focus:outline-none focus:border-slate-800 text-slate-700 font-bold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-500">Secure Password</label>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full bg-slate-50 border rounded-xl p-2.5 focus:outline-none focus:border-slate-800 text-slate-700 font-bold"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 border rounded-xl space-y-1 text-[10px] text-slate-500">
            <div className="flex justify-between font-bold">
              <span>Google Authenticator MFA Token:</span>
              <span className="text-indigo-600 font-black animate-pulse">{currentMfaToken}</span>
            </div>
            <p className="leading-relaxed">Verify with the 6-digit active token displayed above to complete credential handshakes.</p>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500">2FA Verification Code</label>
            <input
              type="text"
              placeholder="e.g. 412804"
              value={inputMfa}
              onChange={(e) => setInputMfa(e.target.value)}
              className="w-full bg-slate-50 border rounded-xl p-2.5 text-center font-mono text-xs font-bold tracking-widest focus:outline-none focus:border-indigo-500 text-slate-800"
              required
            />
          </div>

          {loginError && <p className="text-rose-600 font-bold text-center text-[11px]">{loginError}</p>}

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md hover:-translate-y-0.5"
          >
            Authenticate Credentials
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 text-center space-y-2 text-[10px] font-bold text-slate-400">
          <p>IP ADDRESS: <strong className="text-slate-600">192.168.1.104 (Whitelisted)</strong></p>
          <p>DEVICE BIND: <strong className="text-slate-600">AG-MAC-77X (Authorized)</strong></p>
        </div>
      </div>
    );
  }

  // Define tab mappings for active permission checks
  // User Admin: restricted from finances. Finance Admin: restricted from configuration / security.
  const isTabAccessible = (tab: string) => {
    if (adminSubRole === "Super Admin") return true;
    if (adminSubRole === "Finance Admin") {
      return ["dashboard", "marketplace", "finance", "sql"].includes(tab);
    }
    if (adminSubRole === "User Admin") {
      return ["dashboard", "users", "farmer_profiles", "copilot", "support"].includes(tab);
    }
    if (adminSubRole === "Content Admin") {
      return ["dashboard", "config"].includes(tab);
    }
    if (adminSubRole === "Analytics Admin") {
      return ["dashboard", "copilot", "security"].includes(tab);
    }
    if (adminSubRole === "Support Admin") {
      return ["dashboard", "support", "copilot"].includes(tab);
    }
    return true;
  };

  return (
    <div id="admin-workspace" className="space-y-6 animate-in fade-in">
      {/* Top Header Controls with Role & Lock State */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-800/60 rounded-xl">
              <ShieldAlert className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Ecosystem Administrative Governance</h2>
              <p className="text-slate-300 text-xs max-w-xl">
                Audit transactions, approve KYC folders, modify platform fees, and verify technical SQL records.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Admin Role Selector (Role Hierarchy & Permission Check) */}
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2">
            <span className="text-[10px] text-slate-300 font-bold uppercase">Admin View:</span>
            <select
              value={adminSubRole}
              onChange={(e) => {
                const newRole = e.target.value as any;
                setAdminSubRole(newRole);
                addAuditLog(`Admin sub-role swapped to [${newRole}]. Modifying permissions matrix.`);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer border-none"
            >
              <option value="Super Admin" className="text-slate-800">Super Admin</option>
              <option value="Finance Admin" className="text-slate-800">Finance Admin</option>
              <option value="User Admin" className="text-slate-800">User Admin</option>
              <option value="Content Admin" className="text-slate-800">Content Admin</option>
              <option value="Analytics Admin" className="text-slate-800">Analytics Admin</option>
              <option value="Support Admin" className="text-slate-800">Support Admin</option>
            </select>
          </div>

          <button
            onClick={() => {
              setIsLoggedIn(false);
              addAuditLog("Admin session ended. Lockscreen activated.");
            }}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Lock Session
          </button>
        </div>
      </div>

      {/* Primary Navigation Ribbon inside Admin Portal */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-xs flex flex-wrap gap-1.5">
        {[
          { id: "dashboard", label: "CEO Dashboard", icon: TrendingUp },
          { id: "users", label: "User Directory", icon: Users },
          { id: "farmer_profiles", label: "Farmer Profiles", icon: UserCheck },
          { id: "marketplace", label: "Marketplace & Escrow", icon: ShoppingBag },
          { id: "finance", label: "Financial Oversight", icon: DollarSign },
          { id: "copilot", label: "AI Co-Pilot Workspace", icon: Cpu },
          { id: "config", label: "Feature Toggles", icon: Settings },
          { id: "security", label: "Compliance & Audits", icon: Shield },
          { id: "support", label: "Support Tickets", icon: MessageSquare },
          { id: "sql", label: "SQL & JPA Workbench", icon: Database }
        ].map((tab) => {
          const Icon = tab.icon;
          const accessible = isTabAccessible(tab.id);
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => accessible && setActiveTab(tab.id)}
              disabled={!accessible}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                active
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : accessible
                  ? "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  : "border-transparent text-slate-300 cursor-not-allowed opacity-50"
              }`}
              title={!accessible ? "Access Denied by administrator sub-role permissions" : ""}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Render Space */}
      <div className="bg-[#f8fafc] border-transparent">
        {activeTab === "dashboard" && <AdminDashboard onSelectTab={setActiveTab} />}

        {activeTab === "farmer_profiles" && <FarmerProfiles mode="admin" />}

        {activeTab === "users" && (
          <AdminUserDirectory
            users={users}
            onVerify={handleVerifyUser}
            onStatusChange={handleStatusChange}
            onImpersonate={handleImpersonateUser}
          />
        )}

        {activeTab === "marketplace" && (
          <AdminMarketplace
            products={products}
            onVerifyProduct={handleVerifyProduct}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            disputes={disputes}
            onResolveDispute={handleResolveDispute}
          />
        )}

        {activeTab === "finance" && <AdminFinance />}

        {activeTab === "copilot" && <AdminCoPilot />}

        {activeTab === "config" && <AdminConfig />}

        {activeTab === "security" && <AdminSecurity auditLogs={auditLogs} />}

        {activeTab === "support" && <AdminSupport tickets={tickets} onResolveTicket={handleResolveTicket} />}

        {activeTab === "sql" && (
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  Relational Query Studio
                </span>
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 mt-1">
                  <Terminal className="h-5 w-5 text-indigo-600 animate-pulse" />
                  Live SQL Administrator Studio & JPA Entity Workbench
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Direct database replica queries. Supports SELECT operations on standard tables.
                </p>
              </div>
              <button
                onClick={() => {
                  setDbTables(INITIAL_MYSQL_TABLES);
                  alert("✓ Simulated MySQL database reseeded to initial state.");
                }}
                className="px-3 py-1.5 text-xs font-bold border rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset DB Tables
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-slate-50 border rounded-2xl p-4 space-y-4">
                  <h4 className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                    <Table className="h-4 w-4 text-emerald-600" />
                    Tables Explorer
                  </h4>
                  <div className="space-y-1.5">
                    {(Object.keys(dbTables) as DbTable[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveSchemaTab(tab);
                          setSqlQuery(`SELECT * FROM ${tab};`);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          activeSchemaTab === tab
                            ? "bg-white border-indigo-200 text-indigo-700 shadow-sm"
                            : "border-transparent text-slate-500 hover:bg-white/60"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${activeSchemaTab === tab ? "bg-indigo-600" : "bg-slate-300"}`}></span>
                          {tab}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {dbTables[tab].length} rows
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 text-slate-200 rounded-2xl p-4 space-y-3 border border-slate-800">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-indigo-400" />
                    MySQL Schema Diagram
                  </h4>
                  <div className="text-[10px] font-mono pl-2 text-slate-400 leading-relaxed">
                    <p className="text-emerald-400 font-bold">farmers (PK: id)</p>
                    <p>• id [INT], name [VARCHAR], land_size_acres [DECIMAL]</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col">
                  <div className="bg-slate-950 px-4 py-2 flex justify-between border-b border-slate-800">
                    <span className="text-xs font-mono text-slate-400 font-bold">MySQL Terminal v8.0</span>
                    <span className="text-[9px] text-indigo-400 font-bold">Online Session Connected</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <textarea
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      className="w-full h-24 bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSqlQuery(`SELECT * FROM farmers WHERE land_size_acres > 15;`)}
                        className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-[9px] font-mono cursor-pointer"
                      >
                        Sample Filter Query
                      </button>
                      <button
                        onClick={executeSimulatedQuery}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Execute SQL
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500">Output console ({queryResult.executionTimeMs} ms)</p>
                  <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-4 py-2 border-b text-[11px] font-mono text-slate-600 font-extrabold">
                      {queryResult.message}
                    </div>
                    <div className="overflow-x-auto max-h-[180px]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] border-b">
                          <tr>
                            {queryResult.columns.map((col, idx) => (
                              <th key={idx} className="px-4 py-2 border-r">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {queryResult.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {queryResult.columns.map((col, cIdx) => (
                                <td key={cIdx} className="px-4 py-2 border-r text-slate-600">
                                  {typeof row === "object" ? String(row[col] !== undefined ? row[col] : "") : String(row)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl border p-5 space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Code2 className="h-5 w-5 text-indigo-600" /> Enterprise Entity Exporter
                    </span>
                    <div className="flex gap-1.5 bg-slate-200 p-1 rounded-lg">
                      {["springboot", "sql", "mern"].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setCodeExportFormat(fmt as any)}
                          className={`px-3 py-1 text-[10px] font-bold rounded-lg ${codeExportFormat === fmt ? "bg-white text-slate-800" : "text-slate-500"}`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <pre className="text-[10px] font-mono bg-slate-900 text-slate-300 p-4 rounded-xl max-h-[160px] overflow-auto">
                    <code>{getCodeSnippet()}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic ML Co-Pilot predictions */}
      <MLPredictionHub currentPhase="Admin" />
    </div>
  );
}
