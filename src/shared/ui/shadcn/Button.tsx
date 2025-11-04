/**
 * Button Component - shadcn/ui
 *
 * Универсальный компонент кнопки с поддержкой вариантов, размеров,
 * loading состояния и touch-friendly дизайна для мобильных устройств.
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 */

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант отображения кнопки */
  variant?: ButtonVariant;

  /** Размер кнопки */
  size?: ButtonSize;

  /** Disabled состояние */
  disabled?: boolean;

  /** Loading состояние (показывает спиннер) */
  loading?: boolean;

  /** Полная ширина */
  fullWidth?: boolean;

  /** Дочерние элементы (текст, иконки) */
  children: React.ReactNode;

  /** ARIA label */
  ariaLabel?: string;

  /** CSS класс */
  className?: string;

  /** Иконка слева */
  iconLeft?: React.ReactNode;

  /** Иконка справа */
  iconRight?: React.ReactNode;

  /** FAB (Floating Action Button) стиль - круглая кнопка с фиксированным позиционированием */
  fab?: boolean;
}

/**
 * Варианты стилей кнопок
 */
const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-DEFAULT text-text-inverse hover:bg-brand-dark active:scale-[0.98] shadow-sm dark:bg-brand-dark dark:hover:bg-brand-DEFAULT",
  secondary:
    "bg-background-secondary text-text-primary hover:bg-background-tertiary active:scale-[0.98] shadow-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
  outline:
    "border-2 border-border-default text-text-primary hover:bg-background-secondary active:scale-[0.98] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
  ghost:
    "text-text-primary hover:bg-background-secondary active:scale-[0.98] dark:text-gray-200 dark:hover:bg-gray-800",
  danger:
    "bg-semantic-error text-text-inverse hover:brightness-110 active:scale-[0.98] shadow-sm dark:bg-red-600 dark:hover:bg-red-700",
};

/**
 * Размеры кнопок с учетом touch targets (44x44px минимум на мобильном)
 */
const buttonSizes: Record<ButtonSize, string> = {
  sm: "mobile:min-h-[44px] desktop:min-h-[32px] px-3 py-2 text-sm gap-1.5",
  md: "mobile:min-h-[44px] desktop:min-h-[40px] px-4 py-2.5 text-base gap-2",
  lg: "mobile:min-h-[48px] desktop:min-h-[44px] px-6 py-3 text-lg gap-2.5",
};

/**
 * Button компонент
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      fullWidth = false,
      fab = false,
      children,
      ariaLabel,
      className,
      iconLeft,
      iconRight,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={loading}
        className={cn(
          // Базовые стили
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-DEFAULT focus-visible:ring-offset-2 dark:focus-visible:ring-brand-light dark:focus-visible:ring-offset-gray-900",

          // FAB (Floating Action Button) стили
          fab
            ? [
                "rounded-full", // Круглая форма
                "w-14 h-14 mobile:w-[56px] mobile:h-[56px]", // 56x56px на мобильном
                "fixed bottom-20 right-4 mobile:bottom-24 mobile:right-6", // Fixed positioning
                "shadow-lg hover:shadow-xl", // Большая тень
                "z-[100]", // Высокий z-index
                "hover:scale-110 active:scale-95", // Animated scale
              ]
            : [
                "rounded-DEFAULT",
                // Размер (только если не FAB)
                buttonSizes[size],
                // Полная ширина
                fullWidth && "w-full",
              ],

          // Вариант
          buttonVariants[variant],

          // Disabled состояние
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          // Кастомные классы
          className
        )}
        {...props}
      >
        {/* Иконка слева */}
        {iconLeft && !loading && <span className="flex-shrink-0">{iconLeft}</span>}

        {/* Loading спиннер */}
        {loading && (
          <Loader2
            className="flex-shrink-0 animate-spin"
            size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
          />
        )}

        {/* Текст */}
        <span className="flex-shrink-0">{children}</span>

        {/* Иконка справа */}
        {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
