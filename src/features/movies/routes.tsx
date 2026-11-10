import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const MoviesPage = lazy(() => import("./pages/MoviesPage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));

export const moviesRoutes: RouteObject[] = [
  {
    path: "movies",
    element: <MoviesPage />,
  },
  {
    path: "movies/:id",
    element: <MovieDetailPage />,
  },
];
