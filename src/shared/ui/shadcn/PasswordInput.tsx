/**
 * PasswordInput Component - shadcn/ui
 *
 * Input для паролей с возможностью показать/скрыть пароль
 */

"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
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

  /** ID для aria-describedby (связь с error message) */
  ariaDescribedBy?: string;

  /** CSS класс */
  className?: string;
}

/**
 * PasswordInput компонент
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
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
      ariaDescribedBy,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
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
          {/* Input поле */}
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy || errorId || helperId}
            className={cn(
              // Base styles
              "w-full rounded-DEFAULT px-3 py-2 text-base pr-10",
              "border-2 border-border-default",
              "bg-background-primary text-text-primary",
              "transition-all duration-200 ease-in-out",

              // Dark mode
              "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600",

              // Focus state
              "focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus",
              "desktop:focus:ring-offset-2",

              // Hover state (desktop)
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

              // Touch targets
              "desktop:min-h-[32px]",
              "mobile:min-h-[44px]"
            )}
            {...props}
          />

          {/* Кнопка показать/скрыть пароль */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "text-text-secondary hover:text-text-primary",
              "dark:text-gray-400 dark:hover:text-gray-200",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT rounded",
              disabled && "cursor-not-allowed opacity-50"
            )}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
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

PasswordInput.displayName = "PasswordInput";
