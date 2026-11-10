import * as React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const alertBannerVariants = cva(
  "relative flex w-full gap-3 rounded-lg border p-4 text-sm transition-all",
  {
    variants: {
      variant: {
        error:
          "border-destructive/40 bg-destructive/10 text-destructive dark:border-destructive/60",
        warning:
          "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200 dark:border-amber-500/60",
        info: "border-blue-500/40 bg-blue-500/10 text-blue-800 dark:text-blue-200 dark:border-blue-500/60",
        success:
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 dark:border-emerald-500/60",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

const icons = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

export interface AlertBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertBannerVariants> {
  title?: string;
  onClose?: () => void;
}

export function AlertBanner({
  className,
  variant = "info",
  title,
  children,
  onClose,
  ...props
}: AlertBannerProps) {
  const Icon = icons[variant || "info"];

  return (
    <div
      role="alert"
      className={cn(alertBannerVariants({ variant }), className)}
      {...props}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        {title && <h5 className="font-semibold leading-tight mb-1">{title}</h5>}
        <div className="text-xs sm:text-sm leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Закрыть уведомление"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
