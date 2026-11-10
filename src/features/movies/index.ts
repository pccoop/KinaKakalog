import { siteConfig } from "@/config/site.config";
import type { FeatureModule } from "@/features/types";
import { moviesRoutes } from "./routes";

export * from "./types";
export * from "./schemas";
export { moviesService } from "./api/movies.service";
export { MovieCard } from "./components/MovieCard";

export const moviesModule: FeatureModule = {
  id: "movies",
  nav: [
    {
      label: siteConfig.texts.nav.movies,
      to: "/movies",
      requiresAuth: true,
      order: 5,
    },
  ],
  protectedRoutes: moviesRoutes,
};
