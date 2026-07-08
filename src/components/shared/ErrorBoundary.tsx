import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
          <div className="w-full max-w-2xl border-2 border-critical bg-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-critical" />
              <div>
                <h1 className="font-mono text-xl font-bold text-foreground">
                  Something went wrong
                </h1>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  An unexpected error occurred while rendering this page.
                </p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-4 border-l-4 border-critical bg-critical/10 p-4">
                <div className="mb-2 font-mono text-xs uppercase tracking-widest text-critical">
                  Error Message
                </div>
                <pre className="overflow-x-auto font-mono text-sm text-foreground">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            {this.state.errorInfo && (
              <details className="mb-4">
                <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  Component Stack
                </summary>
                <pre className="mt-2 overflow-x-auto border-2 border-border-strong bg-black p-3 font-mono text-xs text-green-400">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 border-2 border-border-strong bg-primary px-4 py-2 font-mono text-sm text-primary-foreground hover:bg-primary/90"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </button>
              <a
                href="/"
                className="flex items-center gap-2 border-2 border-border-strong bg-surface px-4 py-2 font-mono text-sm text-foreground hover:bg-zinc-800"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
