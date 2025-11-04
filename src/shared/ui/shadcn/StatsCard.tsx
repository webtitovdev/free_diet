/**
 * StatsCard Component
 *
 * Карточка статистики с иконкой, значением, единицей измерения и трендом.
 * Используется для отображения ключевых метрик (калории, макронутриенты, вес).
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 */

import React from "react";
import { cn } from "@/shared/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type ColorVariant = "brand" | "success" | "error" | "warning" | "info";

export interface StatsCardProps {
  /** Заголовок */
  title: string;

  /** Значение */
  value: number | string;

  /** Единица измерения */
  unit?: string;

  /** Иконка */
  icon?: React.ReactNode;

  /** Цвет акцента */
  color?: ColorVariant;

  /** Тренд (изменение за период) */
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };

  /** CSS класс */
  className?: string;

  /** Обработчик клика */
  onClick?: () => void;
}

/**
 * Цветовые схемы для вариантов
 */
const colorVariants: Record<ColorVariant, string> = {
  brand: "bg-brand-pastel dark:bg-brand-dark/20 text-brand-DEFAULT dark:text-brand-light",
  success: "bg-success-light dark:bg-success-dark/20 text-success-DEFAULT dark:text-success-light",
  error: "bg-error-light dark:bg-error-dark/20 text-error-DEFAULT dark:text-error-light",
  warning: "bg-warning-light dark:bg-warning-dark/20 text-warning-DEFAULT dark:text-warning-light",
  info: "bg-info-light dark:bg-info-dark/20 text-info-DEFAULT dark:text-info-light",
};

/**
 * StatsCard - Карточка статистики
 *
 * Features:
 * - Иконка с цветным background
 * - Крупное значение с единицей измерения
 * - Тренд с направлением (вверх/вниз/нейтрально)
 * - Адаптивные размеры
 * - Интерактивность (опционально)
 *
 * @example
 * ```tsx
 * <StatsCard
 *   title="Белки"
 *   value={45}
 *   unit="г"
 *   icon={<Protein />}
 *   color="info"
 *   trend={{ value: 5, direction: "up" }}
 * />
 * ```
 */
export function StatsCard({
  title,
  value,
  unit,
  icon,
  color = "brand",
  trend,
  className,
  onClick,
}: StatsCardProps) {
  const isInteractive = !!onClick;

  return (
    <div
      onClick={onClick}
      className={cn(
        // Базовые стили
        "flex flex-col",
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "rounded-lg",
        "p-4 mobile:p-6",
        "transition-all duration-200",

        // Shadow
        "shadow-sm dark:shadow-md",

        // Интерактивность
        isInteractive && [
          "cursor-pointer",
          "hover:shadow-md hover:scale-[1.02]",
          "active:scale-[0.98]",
          "dark:hover:shadow-lg",
        ],

        className
      )}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {/* Header: Иконка и Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Иконка с цветным background */}
          {icon && (
            <div
              className={cn(
                "flex items-center justify-center",
                "w-10 h-10 rounded-lg",
                "transition-colors duration-200",
                colorVariants[color]
              )}
            >
              {icon}
            </div>
          )}

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        </div>

        {/* Тренд */}
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1",
              "text-xs font-semibold",
              trend.direction === "up" && "text-success-DEFAULT dark:text-success-light",
              trend.direction === "down" && "text-error-DEFAULT dark:text-error-light",
              trend.direction === "neutral" && "text-gray-500 dark:text-gray-400"
            )}
          >
            {trend.direction === "up" && <TrendingUp className="w-4 h-4" />}
            {trend.direction === "down" && <TrendingDown className="w-4 h-4" />}
            {trend.direction === "neutral" && <Minus className="w-4 h-4" />}
            <span>{Math.abs(trend.value)}</span>
          </div>
        )}
      </div>

      {/* Значение и единица измерения */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
        {unit && (
          <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{unit}</span>
        )}
      </div>
    </div>
  );
}
