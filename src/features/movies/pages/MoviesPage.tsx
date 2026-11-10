import { useState } from "react";
import { Film, Plus } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import { useAuth } from "@/features/auth/auth-context";
import {
  useCreateMovieMutation,
  useDeleteMovieMutation,
  useMovies,
  useUpdateMovieMutation,
} from "../hooks/useMovies";
import type { CreateMovieInput, Movie, MovieFilter } from "../types";
import { MovieCard } from "../components/MovieCard";
import { MovieFilters } from "../components/MovieFilters";
import { MovieDialog } from "../components/MovieDialog";
import { DeleteMovieDialog } from "../components/DeleteMovieDialog";
import { AlertBanner } from "@/shared/ui/alert-banner";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { Pagination } from "@/shared/ui/pagination";

export function MoviesPage() {
  const { isAdmin } = useAuth();
  const texts = siteConfig.texts.movies;

  const [filters, setFilters] = useState<MovieFilter>({
    page: 1,
    limit: 8,
    sortBy: "rating_desc",
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    title: string;
    text: string;
  } | null>(null);

  const { data, isLoading, isFetching } = useMovies(filters);
  const createMutation = useCreateMovieMutation();
  const updateMutation = useUpdateMovieMutation();
  const deleteMutation = useDeleteMovieMutation();

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddSubmit = async (values: CreateMovieInput) => {
    const res = await createMutation.mutateAsync(values);
    setFeedback({
      type: "success",
      title: "Фильм добавлен",
      text: `Фильм «${res.title}» (${res.year}) успешно добавлен в каталог.`,
    });
  };

  const handleEditSubmit = async (values: CreateMovieInput) => {
    if (!editingMovie) return;
    const res = await updateMutation.mutateAsync({
      id: editingMovie.id,
      data: values,
    });
    setFeedback({
      type: "success",
      title: "Изменения сохранены",
      text: `Данные фильма «${res.title}» успешно обновлены.`,
    });
  };

  const handleDeleteConfirm = async (movie: Movie) => {
    await deleteMutation.mutateAsync(movie.id);
    setFeedback({
      type: "success",
      title: "Фильм удалён",
      text: `Фильм «${movie.title}» успешно удалён из каталога.`,
    });
  };

  const movies = data?.items ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;
  const availableGenres = data?.availableGenres ?? [];

  return (
    <section className="container py-8 sm:py-12">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <Film className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>{texts.title}</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {total}
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">{texts.description}</p>
          </div>
        </div>

        {isAdmin && (
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            <span>{texts.addMovieButton}</span>
          </Button>
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

      
      <div className="mb-8">
        <MovieFilters
          filters={filters}
          onChange={(newFilters) => setFilters(newFilters)}
          availableGenres={availableGenres}
        />
      </div>

      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Spinner size="lg" className="mb-3" />
          <p className="text-sm">Загрузка каталога фильмов…</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <Film className="mx-auto h-12 w-12 stroke-1 opacity-40 mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Ничего не найдено</h3>
          <p className="text-sm max-w-sm mx-auto">{texts.emptyList}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isAdmin={isAdmin}
                onEdit={(m) => setEditingMovie(m)}
                onDelete={(m) => setDeletingMovie(m)}
              />
            ))}
          </div>

          
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={filters.limit ?? 8}
            itemLabel="фильмы"
            onPageChange={handlePageChange}
            disabled={isFetching}
            className="mt-10"
          />
        </>
      )}

      
      <MovieDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmitMovie={handleAddSubmit}
      />

      
      <MovieDialog
        open={Boolean(editingMovie)}
        onOpenChange={(open) => !open && setEditingMovie(null)}
        movieToEdit={editingMovie}
        onSubmitMovie={handleEditSubmit}
      />

      
      <DeleteMovieDialog
        movie={deletingMovie}
        open={Boolean(deletingMovie)}
        onOpenChange={(open) => !open && setDeletingMovie(null)}
        onConfirmDelete={handleDeleteConfirm}
      />
    </section>
  );
}

export default MoviesPage;
