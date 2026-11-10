import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import type { MovieFilter, MovieSortBy } from "../types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface MovieFiltersProps {
  filters: MovieFilter;
  onChange: (filters: MovieFilter) => void;
  availableGenres: string[];
}

const VALID_SORT_OPTIONS: MovieSortBy[] = [
  "rating_desc",
  "rating_asc",
  "year_desc",
  "year_asc",
  "title_asc",
];

function isMovieSortBy(value: string): value is MovieSortBy {
  return (VALID_SORT_OPTIONS as readonly string[]).includes(value);
}

export function MovieFilters({
  filters,
  onChange,
  availableGenres,
}: MovieFiltersProps) {
  const texts = siteConfig.texts.movies;

  const handleSearchChange = (value: string) => {
    onChange({ ...filters, search: value, page: 1 });
  };

  const handleGenreChange = (genre: string) => {
    onChange({
      ...filters,
      genre: genre === "all" ? undefined : genre,
      page: 1,
    });
  };

  const handleSortChange = (sortBy: MovieSortBy) => {
    onChange({ ...filters, sortBy, page: 1 });
  };

  const handleRatingChange = (ratingStr: string) => {
    const minRating = ratingStr ? parseFloat(ratingStr) : undefined;
    onChange({ ...filters, minRating, page: 1 });
  };

  const handleYearFromChange = (yearStr: string) => {
    const yearFrom = yearStr ? parseInt(yearStr, 10) : undefined;
    onChange({ ...filters, yearFrom, page: 1 });
  };

  const handleYearToChange = (yearStr: string) => {
    const yearTo = yearStr ? parseInt(yearStr, 10) : undefined;
    onChange({ ...filters, yearTo, page: 1 });
  };

  const handleReset = () => {
    onChange({
      search: "",
      genre: undefined,
      yearFrom: undefined,
      yearTo: undefined,
      minRating: undefined,
      sortBy: "rating_desc",
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.genre ||
      filters.yearFrom ||
      filters.yearTo ||
      filters.minRating ||
      (filters.sortBy && filters.sortBy !== "rating_desc"),
  );

  return (
    <div className="space-y-4 rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm">
      
      <div className="grid gap-3 sm:grid-cols-[1fr_240px]">
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={texts.searchPlaceholder}
            value={filters.search ?? ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-10"
            aria-label={texts.searchPlaceholder}
          />
        </div>

        
        <div className="flex items-center gap-2">
          <label htmlFor="movie-sort" className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {texts.sortByLabel}:
          </label>
          <select
            id="movie-sort"
            value={filters.sortBy ?? "rating_desc"}
            onChange={(e) => {
              const val = e.target.value;
              if (isMovieSortBy(val)) {
                handleSortChange(val);
              }
            }}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="rating_desc">{texts.sortOptions.ratingDesc}</option>
            <option value="rating_asc">{texts.sortOptions.ratingAsc}</option>
            <option value="year_desc">{texts.sortOptions.yearDesc}</option>
            <option value="year_asc">{texts.sortOptions.yearAsc}</option>
            <option value="title_asc">{texts.sortOptions.titleAsc}</option>
          </select>
        </div>
      </div>

      
      {availableGenres.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            {texts.genreLabel}:
          </span>

          <Button
            type="button"
            variant={!filters.genre ? "default" : "outline"}
            size="sm"
            onClick={() => handleGenreChange("all")}
            className="h-7 rounded-full px-2.5 text-xs font-medium"
          >
            {texts.allGenres}
          </Button>

          {availableGenres.map((g) => {
            const isSelected = filters.genre?.toLowerCase() === g.toLowerCase();
            return (
              <Button
                key={g}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleGenreChange(isSelected ? "all" : g)}
                className="h-7 rounded-full px-2.5 text-xs font-medium"
              >
                {g}
              </Button>
            );
          })}
        </div>
      )}

      
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-xs">
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-1.5">
            <label htmlFor="min-rating" className="font-medium text-muted-foreground">
              {texts.minRatingLabel}:
            </label>
            <select
              id="min-rating"
              value={filters.minRating ?? ""}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Все</option>
              <option value="8.5">8.5 и выше</option>
              <option value="8.0">8.0 и выше</option>
              <option value="7.5">7.5 и выше</option>
              <option value="7.0">7.0 и выше</option>
            </select>
          </div>

          
          <div className="flex items-center gap-1.5">
            <label htmlFor="year-from" className="font-medium text-muted-foreground">
              {texts.yearFromLabel}:
            </label>
            <Input
              id="year-from"
              type="number"
              placeholder="1990"
              min={1895}
              max={2100}
              value={filters.yearFrom ?? ""}
              onChange={(e) => handleYearFromChange(e.target.value)}
              className="h-8 w-20 text-xs"
            />
            <span className="text-muted-foreground">{texts.yearToLabel}</span>
            <Input
              id="year-to"
              type="number"
              placeholder="2026"
              min={1895}
              max={2100}
              value={filters.yearTo ?? ""}
              onChange={(e) => handleYearToChange(e.target.value)}
              className="h-8 w-20 text-xs"
            />
          </div>
        </div>

        
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{texts.resetFilters}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
