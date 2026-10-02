import React, { useEffect, useRef, useState } from "react";
import { AI_SIMULATED_EVENT } from "../utils/aiStatus";

/**
 * Shown whenever the backend had to use a simulated fallback instead of real AI.
 * Prevents estimates from being mistaken for real agronomic or financial advice.
 */
export default function SimulatedAIBanner() {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onSimulated = () => {
      setVisible(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 15000);
    };
    window.addEventListener(AI_SIMULATED_EVENT, onSimulated);
    return () => {
      window.removeEventListener(AI_SIMULATED_EVENT, onSimulated);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] max-w-xl w-[92%] flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-lg"
    >
      <span className="text-lg leading-none">⚠️</span>
      <p className="flex-1 text-xs font-semibold text-amber-900 leading-relaxed">
        Live AI is unavailable right now, so this answer is a <b>simulated estimate</b> — not real advice.
        Please verify with an agronomist or official source before acting on it.
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="text-amber-700 hover:text-amber-900 text-sm font-bold cursor-pointer"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
