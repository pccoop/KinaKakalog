import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { Button } from "@/shared/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught render error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const texts = siteConfig.texts.errorBoundary;

      return (
        <div
          role="alert"
          className="my-6 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-lg font-semibold">{texts.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{texts.description}</p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {texts.retry}
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
