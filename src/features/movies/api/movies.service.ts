import { apiFetch } from "@/shared/api/client";
import type {
  CreateMovieInput,
  Movie,
  MovieFilter,
  MovieListResult,
  UpdateMovieInput,
} from "../types";

interface BackendMovie {
  id: number;
  title: string;
  original_title?: string | null;
  description: string;
  year: number;
  director: string;
  genres: string;
  country?: string | null;
  duration_minutes: number;
  rating: number;
  age_rating: string;
  poster_url?: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendMovieListResponse {
  items: BackendMovie[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  available_genres: string[];
}

interface BackendMessageResponse {
  message: string;
}

function mapMovie(m: BackendMovie): Movie {
  return {
    id: m.id,
    title: m.title,
    originalTitle: m.original_title,
    description: m.description,
    year: m.year,
    director: m.director,
    genres: m.genres,
    country: m.country,
    durationMinutes: m.duration_minutes,
    rating: m.rating,
    ageRating: m.age_rating,
    posterUrl: m.poster_url,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  };
}

export const moviesService = {
  async getMovies(filters: MovieFilter = {}): Promise<MovieListResult> {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.genre && filters.genre !== "all") params.append("genre", filters.genre);
    if (filters.yearFrom !== undefined && filters.yearFrom !== null) {
      params.append("year_from", String(filters.yearFrom));
    }
    if (filters.yearTo !== undefined && filters.yearTo !== null) {
      params.append("year_to", String(filters.yearTo));
    }
    if (filters.minRating !== undefined && filters.minRating !== null) {
      params.append("min_rating", String(filters.minRating));
    }
    if (filters.sortBy) params.append("sort_by", filters.sortBy);
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const res = await apiFetch<BackendMovieListResponse>(`/api/movies${queryStr}`);

    return {
      items: res.items.map(mapMovie),
      total: res.total,
      page: res.page,
      limit: res.limit,
      totalPages: res.total_pages,
      availableGenres: res.available_genres,
    };
  },

  async getMovieById(id: number | string): Promise<Movie> {
    const res = await apiFetch<BackendMovie>(`/api/movies/${id}`);
    return mapMovie(res);
  },

  async createMovie(data: CreateMovieInput): Promise<Movie> {
    const res = await apiFetch<BackendMovie>("/api/movies", {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        original_title: data.originalTitle || null,
        description: data.description,
        year: data.year,
        director: data.director,
        genres: data.genres,
        country: data.country || null,
        duration_minutes: data.durationMinutes,
        rating: data.rating,
        age_rating: data.ageRating,
        poster_url: data.posterUrl || null,
      }),
    });
    return mapMovie(res);
  },

  async updateMovie(id: number | string, data: UpdateMovieInput): Promise<Movie> {
    const payload: Record<string, unknown> = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.originalTitle !== undefined) payload.original_title = data.originalTitle || null;
    if (data.description !== undefined) payload.description = data.description;
    if (data.year !== undefined) payload.year = data.year;
    if (data.director !== undefined) payload.director = data.director;
    if (data.genres !== undefined) payload.genres = data.genres;
    if (data.country !== undefined) payload.country = data.country || null;
    if (data.durationMinutes !== undefined) payload.duration_minutes = data.durationMinutes;
    if (data.rating !== undefined) payload.rating = data.rating;
    if (data.ageRating !== undefined) payload.age_rating = data.ageRating;
    if (data.posterUrl !== undefined) payload.poster_url = data.posterUrl || null;

    const res = await apiFetch<BackendMovie>(`/api/movies/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapMovie(res);
  },

  async deleteMovie(id: number | string): Promise<{ message: string }> {
    return await apiFetch<BackendMessageResponse>(`/api/movies/${id}`, {
      method: "DELETE",
    });
  },
};
