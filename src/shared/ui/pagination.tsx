import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/shared/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  itemLabel?: string;
  onPageChange: (newPage: number) => void;
  disabled?: boolean;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize = 10,
  itemLabel = "элементов",
  onPageChange,
  disabled = false,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const from = totalItems !== undefined ? (page - 1) * pageSize + 1 : undefined;
  const to = totalItems !== undefined ? Math.min(page * pageSize, totalItems) : undefined;

  return (
    <nav
      role="navigation"
      aria-label="Навигация по страницам"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground",
        className,
      )}
    >
      {totalItems !== undefined ? (
        <p>
          Показаны {itemLabel} {from}–{to} из {totalItems}
        </p>
      ) : (
        <p>
          Страница {page} из {totalPages}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || disabled}
          className="gap-1 h-8 px-2.5"
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Назад</span>
        </Button>

        <div className="flex items-center gap-1 px-2 font-mono text-xs" aria-current="page">
          <span className="font-bold text-foreground">{page}</span>
          <span>/</span>
          <span>{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || disabled}
          className="gap-1 h-8 px-2.5"
          aria-label="Следующая страница"
        >
          <span className="hidden sm:inline">Вперёд</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
