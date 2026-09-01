import React, { useState } from "react";
import { Sprout, Mail, Lock, User as UserIcon, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const ROLE_OPTIONS = [
  "Farmer", "Buyer", "Government Officer", "Supplier", "Agriculture Expert",
  "Logistics Provider", "Warehouse Operator", "Insurance Agent", "Bank Officer",
  "Researcher", "Extension Officer"
  // "Admin" is intentionally excluded here - it can't be self-assigned via
  // public registration. See server/scripts/promote-admin.ts.
];

export default function LoginScreen() {
  const { login, register, error, clearError } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Farmer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ name, email, password, role });
      }
    } catch {
      // error is already captured in AuthContext state and rendered below
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-200 mb-3">
            <Sprout className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-black text-slate-800">AgriConnect AI</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Sign in to your workspace</p>
        </div>

        <div className="bg-white border border-slate-150 rounded-3xl shadow-sm p-6 sm:p-7">
          <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-1 mb-6">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  clearError();
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                  mode === m ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <UserIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditi Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">I am a...</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                <p className="text-xs text-rose-700 font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-5">
          Your session is protected by a secure, httpOnly cookie.
        </p>
      </div>
    </div>
  );
}
