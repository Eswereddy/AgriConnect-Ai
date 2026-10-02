// Detects SIMULATED (fallback) AI answers from the backend. The server marks them
// with an "X-AI-Simulated: true" header (see server.ts). We wrap window.fetch once
// and broadcast an event so the UI can warn the user. Nothing else about fetch changes.

export const AI_SIMULATED_EVENT = "agriconnect:ai-simulated";

let installed = false;

export function installAiStatusWatcher(): void {
  if (installed || typeof window === "undefined" || typeof window.fetch !== "function") return;
  installed = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const response = await originalFetch(...args);
    try {
      if (response.headers.get("X-AI-Simulated") === "true") {
        window.dispatchEvent(new CustomEvent(AI_SIMULATED_EVENT));
      }
    } catch {
      // never let monitoring break a real request
    }
    return response;
  };
}
