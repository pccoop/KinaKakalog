import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Film,
  Globe,
  User,
  Edit2,
  Trash2,
} from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { useAuth } from "@/features/auth/auth-context";
import {
  useDeleteMovieMutation,
  useMovie,
  useUpdateMovieMutation,
} from "../hooks/useMovies";
import type { CreateMovieInput } from "../types";
import { MoviePoster } from "../components/MoviePoster";
import { MovieRatingBadge } from "../components/MovieRatingBadge";
import { MovieDialog } from "../components/MovieDialog";
import { DeleteMovieDialog } from "../components/DeleteMovieDialog";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { AlertBanner } from "@/shared/ui/alert-banner";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const texts = siteConfig.texts.movies;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    title: string;
    text: string;
  } | null>(null);

  const { data: movie, isLoading, isError } = useMovie(id);
  const updateMutation = useUpdateMovieMutation();
  const deleteMutation = useDeleteMovieMutation();

  const handleEditSubmit = async (values: CreateMovieInput) => {
    if (!movie) return;
    const res = await updateMutation.mutateAsync({
      id: movie.id,
      data: values,
    });
    setFeedback({
      type: "success",
      title: "Изменения сохранены",
      text: `Данные фильма «${res.title}» успешно обновлены.`,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!movie) return;
    await deleteMutation.mutateAsync(movie.id);
    navigate("/movies", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-20 text-muted-foreground">
        <Spinner size="lg" className="mb-3" />
        <p className="text-sm">Загрузка информации о фильме…</p>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="container py-16 max-w-xl text-center">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8">
          <Film className="mx-auto h-12 w-12 text-destructive mb-3" />
          <h2 className="text-xl font-bold mb-2">Фильм не найден</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Запрошенный фильм не существует или был удалён из каталога.
          </p>
          <Button asChild>
            <Link to="/movies" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>{texts.backToList}</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const genresList = movie.genres
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  return (
    <article className="container py-8 sm:py-12 max-w-5xl">
      
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link to="/movies">
            <ArrowLeft className="h-4 w-4" />
            <span>{texts.backToList}</span>
          </Link>
        </Button>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{texts.editMovieButton}</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{texts.deleteMovieButton}</span>
            </Button>
          </div>
        )}
      </div>

      {feedback && (
        <div className="mb-6">
          <AlertBanner
            variant={feedback.type}
            title={feedback.title}
            onClose={() => setFeedback(null)}
          >
            {feedback.text}
          </AlertBanner>
        </div>
      )}

      
      <div className="grid gap-8 md:grid-cols-[300px_1fr] rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm">
        
        <div className="w-full max-w-[300px] mx-auto overflow-hidden rounded-xl shadow-md">
          <MoviePoster
            src={movie.posterUrl}
            alt={movie.title}
            ageRating={movie.ageRating}
            hoverZoom={false}
          />
        </div>

        
        <div className="flex flex-col justify-between space-y-6">
          <div>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <MovieRatingBadge rating={movie.rating} size="md" showMax />

              {genresList.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                >
                  {genre}
                </span>
              ))}
            </div>

            
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {movie.title}
            </h1>

            {movie.originalTitle && (
              <p className="mt-1 text-base text-muted-foreground italic font-medium">
                {movie.originalTitle}
              </p>
            )}

            
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 border-y py-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <dt className="text-muted-foreground">{texts.yearLabel}:</dt>
                <dd className="font-semibold text-foreground">{movie.year}</dd>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <dt className="text-muted-foreground">{texts.durationLabel}:</dt>
                <dd className="font-semibold text-foreground">
                  {movie.durationMinutes} {texts.minutesUnit}
                </dd>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary shrink-0" />
                <dt className="text-muted-foreground">{texts.directorLabel}:</dt>
                <dd className="font-semibold text-foreground">{movie.director}</dd>
              </div>

              {movie.country && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary shrink-0" />
                  <dt className="text-muted-foreground">{texts.countryLabel}:</dt>
                  <dd className="font-semibold text-foreground">{movie.country}</dd>
                </div>
              )}
            </dl>

            
            <div className="mt-6">
              <h2 className="text-lg font-bold text-foreground mb-2">
                {texts.descriptionLabel}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {movie.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <MovieDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        movieToEdit={movie}
        onSubmitMovie={handleEditSubmit}
      />

      
      <DeleteMovieDialog
        movie={movie}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirmDelete={handleDeleteConfirm}
      />
    </article>
  );
}

export default MovieDetailPage;
