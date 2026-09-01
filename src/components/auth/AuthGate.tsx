import React from "react";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import LoginScreen from "./LoginScreen";

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Demo mode: set VITE_DEMO_MODE=true (build-time env var, matches the
  // backend's DEMO_MODE) to skip the login screen entirely - e.g. for a
  // pitch where signup friction would hurt more than open access costs.
  // Leave unset for real usage.
  const demoMode = (import.meta as any).env?.VITE_DEMO_MODE === "true";
  if (demoMode) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}

/**
 * Wraps the app in real authentication. Kept as a single drop-in wrapper
 * (see src/main.tsx) rather than reworking App.tsx's internals, so the
 * existing 18 role dashboards continue to work exactly as before once a
 * user is signed in - the only new requirement is a login first.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}
