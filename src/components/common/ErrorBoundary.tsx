import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary [${this.props.name || "Global"}] caught:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center my-4">
          <div className="flex items-center justify-center gap-2 text-destructive font-medium text-sm">
            <AlertCircle className="size-4" />
            <span>Something went wrong in {this.props.name || "this component"}</span>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" />
            <span>Try again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
