import { Search, RefreshCw, Shield, Film, Users, Layers } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import type { ActivityLogFilter } from "../types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface ActivityLogFiltersProps {
  filters: ActivityLogFilter;
  onChange: (filters: ActivityLogFilter) => void;
  onRefresh: () => void;
  isFetching?: boolean;
}

export function ActivityLogFilters({
  filters,
  onChange,
  onRefresh,
  isFetching = false,
}: ActivityLogFiltersProps) {
  const texts = siteConfig.texts.activityLog;

  const categories = [
    { id: "all", label: texts.filterEntityAll, icon: Layers },
    { id: "auth", label: texts.filterEntityAuth, icon: Shield },
    { id: "movie", label: texts.filterEntityMovie, icon: Film },
    { id: "user", label: texts.filterEntityUser, icon: Users },
  ];

  const handleCategorySelect = (entityType: string) => {
    onChange({
      ...filters,
      entityType: entityType === "all" ? undefined : entityType,
      page: 1,
    });
  };

  const handleSearchChange = (val: string) => {
    onChange({ ...filters, search: val, page: 1 });
  };

  const currentCategory = filters.entityType || "all";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={texts.searchPlaceholder}
            value={filters.search ?? ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-10 text-xs"
            aria-label={texts.searchPlaceholder}
          />
        </div>

        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="gap-1.5 h-10 px-3 text-xs self-end sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span>{texts.refreshButton}</span>
        </Button>
      </div>

      
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = currentCategory === cat.id;
          return (
            <Button
              key={cat.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategorySelect(cat.id)}
              className="h-7 rounded-full px-3 text-xs font-medium gap-1.5"
            >
              <Icon className="h-3 w-3" />
              <span>{cat.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
