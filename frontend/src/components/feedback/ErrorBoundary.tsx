import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-surface-700/50 bg-surface-800/50 p-8 text-center">
          <AlertTriangle className="mb-4 h-12 w-12 text-warning-400" />
          <h2 className="mb-2 text-lg font-semibold text-surface-100">
            Something went wrong
          </h2>
          <p className="mb-4 max-w-md text-sm text-surface-400">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <Button
            onClick={() => this.setState({ hasError: false, error: null })}
            variant="secondary"
            size="sm"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
