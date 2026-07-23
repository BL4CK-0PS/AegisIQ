import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-900/20">
              <AlertTriangle className="h-6 w-6 text-danger-400" />
            </div>
            <h2 className="text-lg font-semibold text-surface-100">Something went wrong</h2>
            <p className="mt-2 text-sm text-surface-400">
              {this.state.error?.message || "An unexpected error occurred while loading this page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
            >
              Reload Page
            </button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
