import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { captureClientError } from "../utils/monitoring";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    captureClientError(error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white p-6">
          <div className="max-w-sm text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-rose-500" />
            </div>
            <h2 className="text-base font-black text-slate-800">Something went wrong</h2>
            <p className="text-xs text-slate-500">
              This error has been reported automatically. Reloading the page usually fixes it.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
