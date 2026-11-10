import { useState, useRef, useEffect } from "react";
import { CheckCircle2, RotateCcw, Move, Sparkles, AlertCircle } from "lucide-react";

import { captchaConfig, type CaptchaPiece } from "@/features/auth/config/captcha.config";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface PictureCaptchaProps {
  onSuccess: (isSuccess: boolean) => void;
  className?: string;
  hasError?: boolean;
  errorMessage?: string;
}

function getShuffledPieces(pieces: CaptchaPiece[]): CaptchaPiece[] {
  const array = [...pieces];
  let isSorted = true;

  while (isSorted && array.length > 1) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    isSorted = array.every((item, idx) => item.correctIndex === idx);
  }
  return array;
}

export function PictureCaptcha({
  onSuccess,
  className,
  hasError = false,
  errorMessage,
}: PictureCaptchaProps) {
  const [board, setBoard] = useState<CaptchaPiece[]>(() =>
    getShuffledPieces(captchaConfig.pieces),
  );

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);

  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const checkCompletion = (currentBoard: CaptchaPiece[]) => {
    const isCompleted = currentBoard.every(
      (piece, index) => piece.correctIndex === index,
    );

    if (isCompleted) {
      setIsSuccess(true);
      setSelectedForSwap(null);
      onSuccessRef.current(true);
    } else {
      setIsSuccess(false);
      onSuccessRef.current(false);
    }
  };

  const swapPieces = (indexA: number, indexB: number) => {
    if (indexA === indexB || isSuccess) return;

    const newBoard = [...board];
    const temp = newBoard[indexA];
    newBoard[indexA] = newBoard[indexB];
    newBoard[indexB] = temp;

    setBoard(newBoard);
    setSelectedForSwap(null);
    checkCompletion(newBoard);
  };

  const handleReset = () => {
    const reshuffled = getShuffledPieces(captchaConfig.pieces);
    setBoard(reshuffled);
    setIsSuccess(false);
    setSelectedForSwap(null);
    onSuccessRef.current(false);
  };

  const handleDragStart = (index: number, e: React.DragEvent) => {
    if (isSuccess) return;
    setDraggedIndex(index);
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    if (isSuccess) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (targetIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      swapPieces(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleClick = (index: number) => {
    if (isSuccess) return;

    if (selectedForSwap === null) {
      setSelectedForSwap(index);
    } else {
      swapPieces(selectedForSwap, index);
    }
  };

  return (
    <div
      role="group"
      aria-label="Интерактивная капча 2х2"
      className={cn(
        "rounded-xl border bg-muted/30 p-4 transition-all duration-200",
        isSuccess
          ? "border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/30"
          : hasError
          ? "border-destructive/80 bg-destructive/5 ring-1 ring-destructive/40"
          : "border-border",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Проверка капчи (пазл 2х2)
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          aria-label={captchaConfig.resetButton}
        >
          <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          {captchaConfig.resetButton}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {captchaConfig.instruction}
      </p>

      
      <div className="flex justify-center my-2">
        <div
          className={cn(
            "grid grid-cols-2 grid-rows-2 gap-1.5 w-64 h-64 p-2 rounded-xl border bg-background shadow-inner transition-all",
            isSuccess && "ring-2 ring-emerald-500 border-emerald-500 shadow-md",
            hasError && !isSuccess && "ring-2 ring-destructive border-destructive shadow-md",
          )}
        >
          {board.map((piece, index) => {
            const isDragging = draggedIndex === index;
            const isOver = dragOverIndex === index;
            const isSelected = selectedForSwap === index;

            return (
              <div
                key={piece.id}
                draggable={!isSuccess}
                onDragStart={(e) => handleDragStart(index, e)}
                onDragOver={(e) => handleDragOver(index, e)}
                onDrop={(e) => handleDrop(index, e)}
                onDragEnd={handleDragEnd}
                onClick={() => handleClick(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(index);
                  }
                }}
                aria-label={`${piece.alt}. Нажмите или перетащите для смены позиции.`}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border-2 bg-muted transition-all select-none",
                  !isSuccess && "cursor-grab active:cursor-grabbing hover:scale-[1.02] hover:shadow-md",
                  isDragging && "opacity-40 scale-95 border-dashed border-primary",
                  isOver && !isDragging && "border-primary ring-2 ring-primary/40 scale-105 z-10",
                  isSelected && "border-primary ring-4 ring-primary/30 z-10",
                  isSuccess ? "border-emerald-500 cursor-default" : "border-border/60",
                )}
                title={
                  isSuccess
                    ? "Собрано верно"
                    : isSelected
                    ? "Выбрано: нажмите на другой фрагмент для смены"
                    : "Перетащите мышью на другой фрагмент"
                }
              >
                <img
                  src={piece.src}
                  alt={piece.alt}
                  className="h-full w-full object-cover pointer-events-none"
                  draggable={false}
                />

                {!isSuccess && (
                  <div className="absolute bottom-1 right-1 rounded bg-black/60 p-0.5 text-white/80 opacity-60 group-hover:opacity-100">
                    <Move className="h-3 w-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      
      <div className="mt-2 text-center" aria-live="polite">
        {isSuccess ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>{captchaConfig.successMessage}</span>
          </div>
        ) : hasError ? (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-1.5 text-xs font-medium text-destructive animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage || "Пазл не собран! Соберите картинку 2х2 перед отправкой."}</span>
          </div>
        ) : selectedForSwap !== null ? (
          <p className="text-xs text-primary animate-pulse font-medium">
            Фрагмент выбран. Нажмите на второй фрагмент, чтобы поменять их местами.
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            Подсказка: перетащите фрагмент мышью на соседний, либо кликните на два фрагмента поочерёдно.
          </p>
        )}
      </div>
    </div>
  );
}
