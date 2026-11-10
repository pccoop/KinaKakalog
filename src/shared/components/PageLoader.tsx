import { siteConfig } from "@/config/site.config";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";

interface PageLoaderProps {
  
  message?: string;
  className?: string;
  fullscreen?: boolean;
}

export function PageLoader({
  message,
  className,
  fullscreen = false,
}: PageLoaderProps) {
  const text = message ?? siteConfig.texts.loading.page;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground",
        fullscreen ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" : "min-h-[50vh]",
        className,
      )}
    >
      <Spinner size="lg" label={text} />
      <p className="text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
}
