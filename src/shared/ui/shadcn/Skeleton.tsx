/**
 * Skeleton Component
 *
 * Loading placeholder с анимацией для улучшения воспринимаемой производительности.
 * Используется при низкой скорости интернета (edge case) согласно FR-023.
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T045)
 */

import React from "react";
import { cn } from "@/shared/lib/utils";

export interface SkeletonProps {
  /** Вариант отображения */
  variant?: "text" | "circular" | "rectangular";

  /** Ширина */
  width?: string | number;

  /** Высота */
  height?: string | number;

  /** Тип анимации */
  animation?: "pulse" | "wave" | "none";

  /** CSS класс */
  className?: string;

  /** Количество строк (для variant='text') */
  lines?: number;
}

/**
 * Skeleton - Loading placeholder
 *
 * Features:
 * - 3 варианта: text, circular, rectangular
 * - 2 типа анимации: pulse, wave
 * - Настраиваемые размеры
 * - Multiple lines для text variant
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" lines={3} />
 * <Skeleton variant="circular" width={48} height={48} />
 * <Skeleton variant="rectangular" width="100%" height={200} />
 * ```
 */
export function Skeleton({
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
  className,
  lines = 1,
}: SkeletonProps) {
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]",
    none: "",
  };

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const baseStyles = cn(
    "bg-gray-200 dark:bg-gray-700",
    animationClasses[animation],
    variantClasses[variant],
    className
  );

  // Стили размеров
  const sizeStyles: React.CSSProperties = {
    width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
  };

  // Для text variant с multiple lines
  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={baseStyles}
            style={{
              ...sizeStyles,
              // Последняя строка короче (80%)
              width: index === lines - 1 ? "80%" : width || "100%",
              height: height || "1rem",
            }}
          />
        ))}
      </div>
    );
  }

  // Одиночный skeleton
  return (
    <div
      className={baseStyles}
      style={{
        ...sizeStyles,
        // Дефолтные размеры для вариантов
        width: width || (variant === "circular" ? "3rem" : "100%"),
        height: height || (variant === "circular" ? "3rem" : variant === "text" ? "1rem" : "8rem"),
      }}
    />
  );
}
