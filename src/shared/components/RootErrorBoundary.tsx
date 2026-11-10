import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";

export function RootErrorBoundary() {
  const error = useRouteError();
  const texts = siteConfig.texts.errorBoundary;

  let title = texts.title;
  let description = texts.description;
  let details: string | null = null;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    description = error.data?.message || description;
  } else if (error instanceof Error) {
    details = error.message;
  }

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-lg border-destructive/20 text-center shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>

        {details && (
          <CardContent>
            <pre className="max-h-32 overflow-auto rounded-md bg-muted p-3 text-left font-mono text-xs text-muted-foreground">
              {details}
            </pre>
          </CardContent>
        )}

        <CardFooter className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={handleRetry} className="gap-2">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {texts.retry}
          </Button>
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              {texts.backHome}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
