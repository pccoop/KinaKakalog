import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { siteConfig } from "@/config/site.config";
import { FormField } from "@/shared/ui/form-field";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import type { MovieFormValues } from "../schemas";

interface MovieFormFieldsProps {
  register: UseFormRegister<MovieFormValues>;
  errors: FieldErrors<MovieFormValues>;
}

export function MovieFormFields({ register, errors }: MovieFormFieldsProps) {
  const texts = siteConfig.texts.movies;

  return (
    <div className="space-y-3.5">
      
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          id="movie-title"
          label={texts.titleLabel}
          required
          error={errors.title?.message}
        >
          <Input
            id="movie-title"
            placeholder="Интерстеллар"
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "movie-title-error" : undefined}
            className={cn(errors.title && "border-destructive focus-visible:ring-destructive")}
            {...register("title")}
          />
        </FormField>

        <FormField
          id="movie-original-title"
          label={texts.originalTitleLabel}
          error={errors.originalTitle?.message}
        >
          <Input
            id="movie-original-title"
            placeholder="Interstellar"
            aria-invalid={Boolean(errors.originalTitle)}
            aria-describedby={errors.originalTitle ? "movie-original-title-error" : undefined}
            {...register("originalTitle")}
          />
        </FormField>
      </div>

      
      <div className="grid gap-3 sm:grid-cols-3">
        <FormField
          id="movie-year"
          label={texts.yearLabel}
          required
          error={errors.year?.message}
        >
          <Input
            id="movie-year"
            type="number"
            placeholder="2014"
            aria-required="true"
            aria-invalid={Boolean(errors.year)}
            aria-describedby={errors.year ? "movie-year-error" : undefined}
            className={cn(errors.year && "border-destructive focus-visible:ring-destructive")}
            {...register("year")}
          />
        </FormField>

        <FormField
          id="movie-director"
          label={texts.directorLabel}
          required
          error={errors.director?.message}
        >
          <Input
            id="movie-director"
            placeholder="Кристофер Нолан"
            aria-required="true"
            aria-invalid={Boolean(errors.director)}
            aria-describedby={errors.director ? "movie-director-error" : undefined}
            className={cn(errors.director && "border-destructive focus-visible:ring-destructive")}
            {...register("director")}
          />
        </FormField>

        <FormField
          id="movie-country"
          label={texts.countryLabel}
          error={errors.country?.message}
        >
          <Input
            id="movie-country"
            placeholder="США, Великобритания"
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? "movie-country-error" : undefined}
            {...register("country")}
          />
        </FormField>
      </div>

      
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          id="movie-genres"
          label={texts.genresLabel}
          required
          error={errors.genres?.message}
        >
          <Input
            id="movie-genres"
            placeholder="фантастика, драма, приключения"
            aria-required="true"
            aria-invalid={Boolean(errors.genres)}
            aria-describedby={errors.genres ? "movie-genres-error" : undefined}
            className={cn(errors.genres && "border-destructive focus-visible:ring-destructive")}
            {...register("genres")}
          />
        </FormField>

        <FormField
          id="movie-poster"
          label={texts.posterUrlLabel}
          error={errors.posterUrl?.message}
        >
          <Input
            id="movie-poster"
            type="url"
            placeholder="https://example.com/poster.jpg"
            aria-invalid={Boolean(errors.posterUrl)}
            aria-describedby={errors.posterUrl ? "movie-poster-error" : undefined}
            className={cn(errors.posterUrl && "border-destructive focus-visible:ring-destructive")}
            {...register("posterUrl")}
          />
        </FormField>
      </div>

      
      <div className="grid gap-3 sm:grid-cols-3">
        <FormField
          id="movie-duration"
          label={`${texts.durationLabel} (${texts.minutesUnit})`}
          required
          error={errors.durationMinutes?.message}
        >
          <Input
            id="movie-duration"
            type="number"
            placeholder="169"
            aria-required="true"
            aria-invalid={Boolean(errors.durationMinutes)}
            aria-describedby={errors.durationMinutes ? "movie-duration-error" : undefined}
            className={cn(errors.durationMinutes && "border-destructive focus-visible:ring-destructive")}
            {...register("durationMinutes")}
          />
        </FormField>

        <FormField
          id="movie-rating"
          label={`${texts.ratingLabel} (0.0-10.0)`}
          required
          error={errors.rating?.message}
        >
          <Input
            id="movie-rating"
            type="number"
            step="0.1"
            placeholder="8.7"
            aria-required="true"
            aria-invalid={Boolean(errors.rating)}
            aria-describedby={errors.rating ? "movie-rating-error" : undefined}
            className={cn(errors.rating && "border-destructive focus-visible:ring-destructive")}
            {...register("rating")}
          />
        </FormField>

        <FormField
          id="movie-age-rating"
          label={texts.ageRatingLabel}
          required
          error={errors.ageRating?.message}
        >
          <select
            id="movie-age-rating"
            aria-required="true"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("ageRating")}
          >
            <option value="0+">0+</option>
            <option value="6+">6+</option>
            <option value="12+">12+</option>
            <option value="16+">16+</option>
            <option value="18+">18+</option>
          </select>
        </FormField>
      </div>

      
      <FormField
        id="movie-description"
        label={texts.descriptionLabel}
        required
        error={errors.description?.message}
      >
        <textarea
          id="movie-description"
          rows={4}
          placeholder="Синопсис и краткое описание сюжета фильма..."
          aria-required="true"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "movie-description-error" : undefined}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            errors.description && "border-destructive focus-visible:ring-destructive",
          )}
          {...register("description")}
        />
      </FormField>
    </div>
  );
}
