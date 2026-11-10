import { useState } from "react";
import { Film } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface MoviePosterProps {
  src?: string | null;
  alt: string;
  ageRating?: string;
  className?: string;
  aspectRatio?: "poster" | "video";
  hoverZoom?: boolean;
}

export function MoviePoster({
  src,
  alt,
  ageRating,
  className,
  aspectRatio = "poster",
  hoverZoom = true,
}: MoviePosterProps) {
  const [hasError, setHasError] = useState(false);

  const ratioClass = aspectRatio === "poster" ? "aspect-[2/3]" : "aspect-video";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-muted select-none",
        ratioClass,
        className,
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className={cn(
            "h-full w-full object-cover transition-transform duration-300",
            hoverZoom && "group-hover:scale-105",
          )}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground bg-muted/70">
          <Film className="h-10 w-10 stroke-1 opacity-50" />
          <span className="text-xs font-medium line-clamp-2 px-2">{alt}</span>
        </div>
      )}

      
      {ageRating && (
        <div className="absolute top-2.5 right-2.5 rounded-md border border-black/25 bg-black/65 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm shadow-sm pointer-events-none">
          {ageRating}
        </div>
      )}
    </div>
  );
}
