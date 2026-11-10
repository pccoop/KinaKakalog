import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface MovieRatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showMax?: boolean;
}

export function MovieRatingBadge({
  rating,
  size = "sm",
  className,
  showMax = false,
}: MovieRatingBadgeProps) {
  const ratingColor =
    rating >= 8.0
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      : rating >= 7.0
      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
      : "bg-muted text-muted-foreground border-border";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border font-bold shadow-sm backdrop-blur-md",
        ratingColor,
        sizeClasses[size],
        className,
      )}
    >
      <Star className={cn("fill-current", iconSizes[size])} aria-hidden="true" />
      <span>
        {rating.toFixed(1)}
        {showMax && <span className="opacity-70 font-normal text-[0.85em]"> / 10</span>}
      </span>
    </div>
  );
}
