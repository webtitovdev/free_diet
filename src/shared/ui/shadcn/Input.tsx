/**
 * Input Component - shadcn/ui
 *
 * Универсальный компонент input поля с поддержкой валидации,
 * иконок, helper текста и desktop оптимизаций.
 *
 * Task: T060 [P] [US3], T062 [US3] - Desktop optimizations
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 */

import React from "react";
import { cn } from "@/shared/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Label текст */
  label: string;

  /** Placeholder текст */
  placeholder?: string;

  /** Текст ошибки валидации */
  error?: string;

  /** Helper текст под input */
  helperText?: string;

  /** Disabled состояние */
  disabled?: boolean;

  /** Required поле */
  required?: boolean;

  /** Значение */
  value: string;

  /** Обработчик изменения */
  onChange: (value: string) => void;

  /** Обработчик blur (для валидации) */
  onBlur?: () => void;

  /** Обработчик focus */
  onFocus?: () => void;

  /** ID для aria-describedby (связь с error message) */
  ariaDescribedBy?: string;

  /** CSS класс */
  className?: string;

  /** Иконка внутри input */
  icon?: React.ReactNode;

  /** Позиция иконки */
  iconPosition?: "left" | "right";
}

/**
 * Input компонент
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      error,
      helperText,
      disabled = false,
      required = false,
      value,
      onChange,
      onBlur,
      onFocus,
      ariaDescribedBy,
      className,
      icon,
      iconPosition = "left",
      type = "text",
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {/* Label */}
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium text-text-primary dark:text-gray-200",
            required && "after:content-['*'] after:ml-0.5 after:text-semantic-error",
            disabled && "text-text-disabled dark:text-gray-500"
          )}
        >
          {label}
        </label>

        {/* Input wrapper */}
        <div className="relative">
          {/* Icon слева */}
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-400">
              {icon}
            </div>
          )}

          {/* Input поле */}
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy || errorId || helperId}
            className={cn(
              // Base styles
              "w-full rounded-DEFAULT px-3 py-2 text-base",
              "border-2 border-border-default",
              "bg-background-primary text-text-primary",
              "transition-all duration-200 ease-in-out",

              // Dark mode
              "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600",

              // Icon padding
              icon && iconPosition === "left" && "pl-10",
              icon && iconPosition === "right" && "pr-10",

              // Focus state (T062: desktop focus ring optimization)
              "focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus",
              "desktop:focus:ring-offset-2",

              // Hover state (T062: desktop hover)
              "desktop:hover:border-gray-400 dark:desktop:hover:border-gray-500",

              // Error state
              error && [
                "border-border-error",
                "focus:ring-semantic-error focus:border-semantic-error",
                "dark:border-red-500",
              ],

              // Disabled state
              disabled && [
                "bg-background-tertiary cursor-not-allowed",
                "text-text-disabled",
                "dark:bg-gray-700 dark:text-gray-500",
              ],

              // Desktop optimizations (T062: min 32x32px)
              "desktop:min-h-[32px]",
              "mobile:min-h-[44px]"
            )}
            {...props}
          />

          {/* Icon справа */}
          {icon && iconPosition === "right" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-400">
              {icon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id={errorId} className="text-sm text-semantic-error dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-text-secondary dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
