/**
 * Badge Component - shadcn/ui
 *
 * Компонент для отображения статусов, меток и индикаторов.
 * Используется в календаре для визуальной индикации дней.
 */

import React from "react";
import { cn } from "@/shared/lib/utils";

export type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "outline";
export type BadgeStatus = "default" | "success" | "error" | "warning" | "processing";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Вариант отображения */
  variant?: BadgeVariant;

  /** Статус (для dot-индикатора) */
  status?: BadgeStatus;

  /** Размер */
  size?: "sm" | "md" | "lg";

  /** Контент */
  children?: React.ReactNode;

  /** CSS класс */
  className?: string;

  /** Только точка (без текста) */
  dot?: boolean;
}

/**
 * Варианты стилей бейджей
 */
const badgeVariants: Record<BadgeVariant, string> = {
  default:
    "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  success:
    "bg-success-light text-success-dark border-success-DEFAULT dark:bg-success-dark/20 dark:text-success-light",
  error:
    "bg-error-light text-error-dark border-error-DEFAULT dark:bg-error-dark/20 dark:text-error-light",
  warning:
    "bg-warning-light text-warning-dark border-warning-DEFAULT dark:bg-warning-dark/20 dark:text-warning-light",
  info: "bg-info-light text-info-dark border-info-DEFAULT dark:bg-info-dark/20 dark:text-info-light",
  outline: "bg-transparent border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
};

/**
 * Цвета для dot-индикатора
 */
const statusDotColors: Record<BadgeStatus, string> = {
  default: "bg-gray-400 dark:bg-gray-500",
  success: "bg-success-DEFAULT dark:bg-success-light",
  error: "bg-error-DEFAULT dark:bg-error-light",
  warning: "bg-warning-DEFAULT dark:bg-warning-light",
  processing: "bg-info-DEFAULT dark:bg-info-light animate-pulse",
};

/**
 * Размеры бейджей
 */
const badgeSizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

/**
 * Badge - Компонент метки/статуса
 *
 * Features:
 * - Варианты: default, success, error, warning, info, outline
 * - Размеры: sm, md, lg
 * - Dot-индикатор для статусов
 * - Поддержка темной темы
 *
 * @example
 * ```tsx
 * // С текстом
 * <Badge variant="success">Цель достигнута</Badge>
 *
 * // Только точка (для календаря)
 * <Badge status="success" dot />
 *
 * // С кастомным контентом
 * <Badge variant="info" size="lg">123 ккал</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      status = "default",
      size = "md",
      children,
      className,
      dot = false,
      ...props
    },
    ref
  ) => {
    // Если только точка - рендерим статус индикатор
    if (dot) {
      return (
        <span ref={ref} className={cn("inline-flex items-center gap-1", className)} {...props}>
          <span className={cn("w-2 h-2 rounded-full", statusDotColors[status])} />
        </span>
      );
    }

    // Обычный бейдж с текстом
    return (
      <span
        ref={ref}
        className={cn(
          // Базовые стили
          "inline-flex items-center justify-center",
          "rounded-full border",
          "font-medium",
          "transition-colors duration-200",

          // Вариант
          badgeVariants[variant],

          // Размер
          badgeSizes[size],

          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
