import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { moviesService } from "../api/movies.service";
import type {
  CreateMovieInput,
  Movie,
  MovieFilter,
  MovieListResult,
  UpdateMovieInput,
} from "../types";

export const MOVIES_QUERY_KEY = ["movies"] as const;

export function useMovies(filters: MovieFilter = {}) {
  return useQuery<MovieListResult>({
    queryKey: [...MOVIES_QUERY_KEY, filters],
    queryFn: () => moviesService.getMovies(filters),
  });
}

export function useMovie(id: number | string | undefined) {
  return useQuery<Movie>({
    queryKey: [...MOVIES_QUERY_KEY, "detail", String(id)],
    queryFn: () => {
      if (!id) throw new Error("ID фильма не указан");
      return moviesService.getMovieById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCreateMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation<Movie, Error, CreateMovieInput>({
    mutationFn: (data) => moviesService.createMovie(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}

export function useUpdateMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation<Movie, Error, { id: number | string; data: UpdateMovieInput }>({
    mutationFn: ({ id, data }) => moviesService.updateMovie(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MOVIES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...MOVIES_QUERY_KEY, "detail", String(variables.id)],
      });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}

export function useDeleteMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, number | string>({
    mutationFn: (id) => moviesService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}
