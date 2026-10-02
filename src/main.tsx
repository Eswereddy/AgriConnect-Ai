import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import AuthGate from './components/auth/AuthGate';
import { initClientMonitoring } from './utils/monitoring';
import { installAiStatusWatcher } from './utils/aiStatus';
import SimulatedAIBanner from './components/SimulatedAIBanner';

// Error monitoring (Sentry if VITE_SENTRY_DSN is set, otherwise logged to the
// backend's /api/client-error -> SQLite + ./logs). See src/utils/monitoring.ts.
initClientMonitoring();
installAiStatusWatcher();

// Register Precision Farming Offline Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[Service Worker] Registered successfully with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("[Service Worker] Registration failed:", error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthGate>
        <SimulatedAIBanner />
        <App />
      </AuthGate>
    </ErrorBoundary>
  </StrictMode>,
);
