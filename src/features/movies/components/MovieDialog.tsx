import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { siteConfig } from "@/config/site.config";
import { zodResolver } from "@/shared/lib/zod-resolver";
import { ApiError } from "@/shared/api/types";
import { AlertBanner } from "@/shared/ui/alert-banner";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Spinner } from "@/shared/ui/spinner";
import {
  movieFormSchema,
  DEFAULT_MOVIE_FORM_VALUES,
  type MovieFormValues,
} from "../schemas";
import type { CreateMovieInput, Movie } from "../types";
import { MovieFormFields } from "./MovieFormFields";

interface MovieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieToEdit?: Movie | null;
  onSubmitMovie: (data: CreateMovieInput) => Promise<unknown>;
}

export function MovieDialog({
  open,
  onOpenChange,
  movieToEdit,
  onSubmitMovie,
}: MovieDialogProps) {
  const [modalError, setModalError] = useState<string | null>(null);
  const isEditing = Boolean(movieToEdit);
  const texts = isEditing
    ? siteConfig.texts.movies.editDialog
    : siteConfig.texts.movies.addDialog;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: DEFAULT_MOVIE_FORM_VALUES,
  });

  useEffect(() => {
    if (movieToEdit) {
      reset({
        title: movieToEdit.title,
        originalTitle: movieToEdit.originalTitle ?? "",
        description: movieToEdit.description,
        year: movieToEdit.year,
        director: movieToEdit.director,
        genres: movieToEdit.genres,
        country: movieToEdit.country ?? "",
        durationMinutes: movieToEdit.durationMinutes,
        rating: movieToEdit.rating,
        ageRating: movieToEdit.ageRating,
        posterUrl: movieToEdit.posterUrl ?? "",
      });
    } else {
      reset(DEFAULT_MOVIE_FORM_VALUES);
    }
    setModalError(null);
  }, [movieToEdit, open, reset]);

  const handleClose = () => {
    setModalError(null);
    reset(DEFAULT_MOVIE_FORM_VALUES);
    onOpenChange(false);
  };

  const onSubmit = async (values: MovieFormValues) => {
    setModalError(null);
    try {
      await onSubmitMovie({
        title: values.title,
        originalTitle: values.originalTitle || undefined,
        description: values.description,
        year: values.year,
        director: values.director,
        genres: values.genres,
        country: values.country || undefined,
        durationMinutes: values.durationMinutes,
        rating: values.rating,
        ageRating: values.ageRating,
        posterUrl: values.posterUrl || undefined,
      });
      handleClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setModalError(err.message);
      } else {
        setModalError("Не удалось сохранить данные фильма. Попробуйте снова.");
      }
    }
  };

  const onInvalid = () => {
    setModalError("Пожалуйста, проверьте правильность заполнения всех обязательных полей.");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{texts.title}</DialogTitle>
          <DialogDescription>{texts.description}</DialogDescription>
        </DialogHeader>

        {modalError && (
          <AlertBanner variant="error" title="Ошибка формы" onClose={() => setModalError(null)}>
            {modalError}
          </AlertBanner>
        )}

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-4">
          <MovieFormFields register={register} errors={errors} />

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {texts.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner size="sm" className="mr-2" />}
              {texts.submitButton}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MovieDialog;
