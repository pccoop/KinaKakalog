import { Link } from "react-router-dom";
import { Clock, Calendar, Edit2, Trash2 } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import type { Movie } from "../types";
import { MoviePoster } from "./MoviePoster";
import { MovieRatingBadge } from "./MovieRatingBadge";
import { Button } from "@/shared/ui/button";

interface MovieCardProps {
  movie: Movie;
  isAdmin?: boolean;
  onEdit?: (movie: Movie) => void;
  onDelete?: (movie: Movie) => void;
}

export function MovieCard({
  movie,
  isAdmin = false,
  onEdit,
  onDelete,
}: MovieCardProps) {
  const texts = siteConfig.texts.movies;

  const genresList = movie.genres
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      
      <Link
        to={`/movies/${movie.id}`}
        className="relative block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <MoviePoster
          src={movie.posterUrl}
          alt={movie.title}
          ageRating={movie.ageRating}
        />

        
        <div className="absolute top-2.5 left-2.5 z-10">
          <MovieRatingBadge rating={movie.rating} size="sm" />
        </div>
      </Link>

      
      <div className="flex flex-1 flex-col p-4">
        
        <div className="flex flex-wrap gap-1 mb-2">
          {genresList.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
            >
              {genre}
            </span>
          ))}
        </div>

        
        <h3 className="text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
          <Link to={`/movies/${movie.id}`} className="focus-visible:outline-none focus-visible:underline">
            {movie.title}
          </Link>
        </h3>

        
        {movie.originalTitle && (
          <p className="text-xs text-muted-foreground italic line-clamp-1">
            {movie.originalTitle}
          </p>
        )}

        
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{movie.year}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {movie.durationMinutes} {texts.minutesUnit}
            </span>
          </span>
        </div>

        
        <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {movie.description}
        </p>

        
        {isAdmin && (
          <div className="mt-4 pt-3 border-t flex items-center justify-end gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs gap-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit?.(movie);
              }}
              aria-label={`${texts.editMovieButton}: ${movie.title}`}
            >
              <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{texts.editMovieButton}</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs gap-1 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(movie);
              }}
              aria-label={`${texts.deleteMovieButton}: ${movie.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{texts.deleteMovieButton}</span>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
