import { Link } from "react-router-dom";
import {
  Film,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  History,
  Lock,
  Star,
} from "lucide-react";

import { siteConfig, isModuleEnabled } from "@/config/site.config";
import { useAuth } from "@/features/auth/auth-context";
import { useMovies } from "@/features/movies/hooks/useMovies";
import { MovieCard } from "@/features/movies/components/MovieCard";
import { Button } from "@/shared/ui/button";

export function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const texts = siteConfig.texts.home;
  const moviesOn = isModuleEnabled("movies");

  const { data: topMoviesData } = useMovies(
    isAuthenticated && moviesOn
      ? { sortBy: "rating_desc", limit: 4 }
      : { limit: 0 },
  );

  const topMovies = topMoviesData?.items ?? [];
  const totalMovies = topMoviesData?.total ?? 10;
  const availableGenresCount = topMoviesData?.availableGenres?.length ?? 10;
  const maxRating = topMovies[0]?.rating ? topMovies[0].rating.toFixed(1) : "9.1";

  const features = [
    {
      icon: Film,
      title: texts.features.catalogTitle,
      description: texts.features.catalogDesc,
    },
    {
      icon: SlidersHorizontal,
      title: texts.features.filterTitle,
      description: texts.features.filterDesc,
    },
    {
      icon: ShieldCheck,
      title: texts.features.securityTitle,
      description: texts.features.securityDesc,
    },
    {
      icon: History,
      title: texts.features.auditTitle,
      description: texts.features.auditDesc,
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-background to-background py-16 sm:py-24">
        <div className="container relative z-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{texts.heroBadge}</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {texts.heroTitle}
          </h1>

          <p className="mt-4 text-base sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {texts.heroSubtitle}
          </p>

          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                {moviesOn && (
                  <Button asChild size="lg" className="gap-2 shadow-md">
                    <Link to="/movies">
                      <Film className="h-4 w-4" />
                      <span>{texts.exploreCatalog}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}

                <Button asChild variant="outline" size="lg">
                  <Link to={isAdmin ? "/dashboard" : "/profile"}>
                    {isAdmin
                      ? siteConfig.texts.dashboard.title
                      : siteConfig.texts.nav.profile}
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="gap-2 shadow-md">
                  <Link to="/login">
                    <Lock className="h-4 w-4" />
                    <span>{texts.signInPrompt}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <Link to="/register">
                    {siteConfig.texts.auth.register.submitButton}
                  </Link>
                </Button>
              </>
            )}
          </div>

          
          <div className="mt-12 grid grid-cols-3 gap-4 border-t pt-8 max-w-xl mx-auto">
            <div className="text-center">
              <p className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground">
                {totalMovies}+
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{texts.statsFilms}</p>
            </div>
            <div className="text-center border-x">
              <p className="font-mono text-2xl sm:text-3xl font-extrabold text-foreground">
                {availableGenresCount}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{texts.statsGenres}</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-2xl sm:text-3xl font-extrabold text-primary flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-current" />
                <span>{maxRating}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{texts.statsTopRating}</p>
            </div>
          </div>
        </div>
      </section>

      
      {moviesOn && (
        <section className="container max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {texts.topMoviesTitle}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {texts.topMoviesDescription}
              </p>
            </div>

            {isAuthenticated && (
              <Button asChild variant="outline" size="sm" className="gap-1.5 self-start sm:self-auto">
                <Link to="/movies">
                  <span>{texts.allMoviesButton}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>

          {isAuthenticated ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} isAdmin={isAdmin} />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-dashed p-8 sm:p-12 text-center bg-muted/30">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
                <Lock className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {texts.guestLockTitle}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                {texts.guestLockDesc}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild>
                  <Link to="/login" className="gap-2">
                    <span>{texts.guestSignIn}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/register">{texts.guestSignUp}</Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      )}

      
      <section className="container max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {texts.featuresTitle}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {texts.featuresDescription}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
