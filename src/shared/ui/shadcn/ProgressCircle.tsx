/**
 * ProgressCircle Component - shadcn/ui
 *
 * Круговой индикатор прогресса (Yazio-style) для отображения
 * калорий, макронутриентов и других метрик.
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 */

import React from "react";
import { cn } from "@/shared/lib/utils";

export type ProgressCircleSize = "sm" | "md" | "lg" | "xl";
export type ColorVariant = "brand" | "success" | "error" | "warning" | "info";

export interface ProgressCircleProps {
  /** Текущее значение */
  value: number;

  /** Максимальное значение */
  max: number;

  /** Label текст */
  label: string;

  /** Размер круга */
  size?: ProgressCircleSize;

  /** Цвет прогресса */
  color?: ColorVariant;

  /** Показывать процент в центре */
  showPercentage?: boolean;

  /** Показывать значение вместо процента */
  showValue?: boolean;

  /** Толщина линии прогресса */
  strokeWidth?: number;

  /** CSS класс */
  className?: string;

  /** Анимировать при изменении значения */
  animated?: boolean;
}

/**
 * Размеры круга (SVG размеры)
 */
const sizes: Record<ProgressCircleSize, { size: number; stroke: number }> = {
  sm: { size: 60, stroke: 4 },
  md: { size: 80, stroke: 6 },
  lg: { size: 120, stroke: 8 },
  xl: { size: 160, stroke: 10 },
};

/**
 * Цвета прогресса (используем Tailwind цвета из tokens)
 */
const colorMap: Record<ColorVariant, string> = {
  brand: "#2D6A4F", // brand.DEFAULT
  success: "#10B981", // semantic.success
  error: "#EF4444", // semantic.error
  warning: "#F59E0B", // semantic.warning
  info: "#3B82F6", // semantic.info
};

/**
 * ProgressCircle компонент
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  max,
  label,
  size = "md",
  color = "brand",
  showPercentage = true,
  showValue = false,
  strokeWidth,
  className,
  animated = true,
}) => {
  const { size: svgSize, stroke: defaultStroke } = sizes[size];
  const stroke = strokeWidth || defaultStroke;

  // Расчет процента
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Расчет параметров круга
  const radius = (svgSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn("flex flex-col items-center gap-2", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      {/* SVG Circle */}
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="#E5E7EB" // gray-200 light mode
            className="dark:stroke-gray-700" // dark mode
            strokeWidth={stroke}
            fill="none"
          />

          {/* Progress Circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={colorMap[color]}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(animated && "transition-all duration-300 ease-in-out")}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {showPercentage && (
              <span className="text-sm font-semibold text-text-primary dark:text-gray-100">
                {Math.round(percentage)}%
              </span>
            )}
            {showValue && !showPercentage && (
              <span className="text-sm font-semibold text-text-primary dark:text-gray-100">
                {value}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Label */}
      <span className="text-xs text-text-secondary dark:text-gray-400 text-center max-w-[120px]">
        {label}
      </span>
    </div>
  );
};

ProgressCircle.displayName = "ProgressCircle";
