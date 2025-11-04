/**
 * LoadingSpinner Component - shadcn/ui
 *
 * Индикатор загрузки (спиннер) для использования в Button loading состояниях
 * и других местах, где требуется показать процесс загрузки.
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 */

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";

export type LoadingSpinnerSize = "sm" | "md" | "lg";
export type ColorVariant = "brand" | "success" | "error" | "warning" | "info" | "current";

export interface LoadingSpinnerProps {
  /** Размер */
  size?: LoadingSpinnerSize;

  /** Цвет */
  color?: ColorVariant;

  /** Текст рядом со спиннером */
  label?: string;

  /** CSS класс */
  className?: string;

  /** Центрировать на всю область */
  fullScreen?: boolean;
}

/**
 * Размеры спиннера
 */
const spinnerSizes: Record<LoadingSpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

/**
 * Цвета спиннера (Tailwind классы)
 */
const colorMap: Record<ColorVariant, string> = {
  brand: "text-brand-DEFAULT",
  success: "text-semantic-success",
  error: "text-semantic-error",
  warning: "text-semantic-warning",
  info: "text-semantic-info",
  current: "text-current",
};

/**
 * LoadingSpinner компонент
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "brand",
  label,
  className,
  fullScreen = false,
}) => {
  const Spinner = (
    <div
      className={cn(
        "flex items-center justify-center gap-2",
        fullScreen && "min-h-screen w-full",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label || "Loading"}
    >
      {/* Loader Icon */}
      <Loader2 className={cn("animate-spin", colorMap[color])} size={spinnerSizes[size]} />

      {/* Optional Label */}
      {label && (
        <span className={cn("text-text-secondary dark:text-gray-400", colorMap[color])}>
          {label}
        </span>
      )}

      {/* Screen Reader Text */}
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );

  return Spinner;
};

LoadingSpinner.displayName = "LoadingSpinner";

/**
 * LoadingOverlay - полноэкранный оверлей с LoadingSpinner
 */
export interface LoadingOverlayProps {
  /** Показывать оверлей */
  show: boolean;

  /** Текст загрузки */
  label?: string;

  /** CSS класс */
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, label, className }) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/20 backdrop-blur-sm",
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-background-primary dark:bg-gray-800 p-6 shadow-lg dark:shadow-xl">
        <LoadingSpinner size="lg" label={label} />
      </div>
    </div>
  );
};

LoadingOverlay.displayName = "LoadingOverlay";
