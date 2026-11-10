import { Shield, Film, Users, HelpCircle } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/shared/lib/utils";

interface ActivityCategoryBadgeProps {
  entityType: string;
  className?: string;
}

export function ActivityCategoryBadge({
  entityType,
  className,
}: ActivityCategoryBadgeProps) {
  const texts = siteConfig.texts.activityLog;
  const typeLower = entityType.toLowerCase();

  let label = entityType;
  let Icon = HelpCircle;
  let colorClasses = "bg-muted text-muted-foreground border-border";

  if (typeLower === "auth") {
    label = texts.filterEntityAuth;
    Icon = Shield;
    colorClasses = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
  } else if (typeLower === "movie") {
    label = texts.filterEntityMovie;
    Icon = Film;
    colorClasses = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  } else if (typeLower === "user") {
    label = texts.filterEntityUser;
    Icon = Users;
    colorClasses = "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        colorClasses,
        className,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
