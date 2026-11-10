export interface Movie {
  id: number;
  title: string;
  originalTitle?: string | null;
  description: string;
  year: number;
  director: string;
  genres: string;
  country?: string | null;
  durationMinutes: number;
  rating: number;
  ageRating: string;
  posterUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MovieSortBy =
  | "rating_desc"
  | "rating_asc"
  | "year_desc"
  | "year_asc"
  | "title_asc";

export interface MovieFilter {
  search?: string;
  genre?: string;
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  sortBy?: MovieSortBy;
  page?: number;
  limit?: number;
}

export interface MovieListResult {
  items: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  availableGenres: string[];
}

export interface CreateMovieInput {
  title: string;
  originalTitle?: string;
  description: string;
  year: number;
  director: string;
  genres: string;
  country?: string;
  durationMinutes: number;
  rating: number;
  ageRating: string;
  posterUrl?: string;
}

export interface UpdateMovieInput extends Partial<CreateMovieInput> {}
