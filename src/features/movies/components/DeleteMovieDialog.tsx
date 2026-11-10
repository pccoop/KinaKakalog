import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { siteConfig } from "@/config/site.config";
import type { Movie } from "../types";
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
import { ApiError } from "@/shared/api/types";

interface DeleteMovieDialogProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (movie: Movie) => Promise<unknown>;
}

export function DeleteMovieDialog({
  movie,
  open,
  onOpenChange,
  onConfirmDelete,
}: DeleteMovieDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const texts = siteConfig.texts.movies.deleteDialog;

  if (!movie) return null;

  const handleClose = () => {
    setError(null);
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirmDelete(movie);
      handleClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Не удалось удалить фильм. Попробуйте снова.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDescription = texts.description.replace("{title}", movie.title);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            <DialogTitle>{texts.title}</DialogTitle>
          </div>
          <DialogDescription className="leading-relaxed">
            {formattedDescription}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <AlertBanner variant="error" title="Ошибка удаления" onClose={() => setError(null)}>
            {error}
          </AlertBanner>
        )}

        <div className="rounded-lg bg-muted/60 p-3 text-xs space-y-1">
          <p className="font-semibold text-foreground">{movie.title}</p>
          <p className="text-muted-foreground">
            {movie.year} г. • {movie.director} • Рейтинг: {movie.rating}
          </p>
        </div>

        <DialogFooter className="mt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isDeleting}>
            {texts.cancelButton}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting && <Spinner size="sm" className="text-destructive-foreground" />}
            {texts.confirmButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
