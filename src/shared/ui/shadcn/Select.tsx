/**
 * Select Component - shadcn/ui
 *
 * Универсальный компонент select (выпадающий список) с поддержкой
 * поиска, валидации и desktop оптимизаций.
 *
 * Task: T061 [P] [US3], T062 [US3] - Desktop optimizations
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 */

import React from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronDown, Search } from "lucide-react";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  /** Label текст */
  label: string;

  /** Placeholder */
  placeholder?: string;

  /** Опции для выбора */
  options: SelectOption<T>[];

  /** Выбранное значение */
  value: T | null;

  /** Обработчик изменения */
  onChange: (value: T) => void;

  /** Disabled состояние */
  disabled?: boolean;

  /** Required поле */
  required?: boolean;

  /** Текст ошибки */
  error?: string;

  /** CSS класс */
  className?: string;

  /** Разрешить поиск внутри select */
  searchable?: boolean;

  /** Multiple select (TODO: future enhancement) */
  multiple?: boolean;
}

/**
 * Select компонент
 */
export const Select = <T extends string = string>({
  label,
  placeholder = "Выберите...",
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  className,
  searchable = false,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const selectRef = React.useRef<HTMLDivElement>(null);

  const selectId = React.useId();
  const errorId = error ? `${selectId}-error` : undefined;

  // Закрытие при клике вне
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Фильтрация опций при поиске
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, searchable]);

  // Найти выбранную опцию
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={selectRef} className={cn("relative flex flex-col gap-1.5", className)}>
      {/* Label */}
      <label
        htmlFor={selectId}
        className={cn(
          "text-sm font-medium text-text-primary dark:text-gray-200",
          required && "after:content-['*'] after:ml-0.5 after:text-semantic-error",
          disabled && "text-text-disabled dark:text-gray-500"
        )}
      >
        {label}
      </label>

      {/* Select button */}
      <button
        id={selectId}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        aria-expanded={isOpen}
        className={cn(
          // Base styles
          "flex items-center justify-between w-full",
          "rounded-DEFAULT px-3 py-2 text-base text-left",
          "border-2 border-border-default",
          "bg-background-primary text-text-primary",
          "transition-all duration-200 ease-in-out",

          // Dark mode
          "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600",

          // Focus state (T062: desktop focus ring)
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

          // Desktop optimizations (T062)
          "desktop:min-h-[32px]",
          "mobile:min-h-[44px]"
        )}
      >
        <span className={!selectedOption ? "text-text-disabled dark:text-gray-500" : ""}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-secondary dark:text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1 top-full",
            "bg-background-primary border-2 border-border-default",
            "rounded-DEFAULT shadow-lg overflow-hidden",
            "dark:bg-gray-800 dark:border-gray-600"
          )}
        >
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-border-default dark:border-gray-600">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary dark:text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  className={cn(
                    "w-full pl-8 pr-2 py-1.5 text-sm",
                    "bg-background-secondary rounded-sm",
                    "border border-border-default",
                    "focus:outline-none focus:ring-1 focus:ring-border-focus",
                    "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  )}
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  disabled={option.disabled}
                  className={cn(
                    "w-full px-3 py-2 text-left text-base",
                    "transition-colors duration-150",
                    // Selected state
                    option.value === value && "bg-brand-pastel dark:bg-gray-700 font-medium",
                    // Hover state (T062: desktop hover)
                    !option.disabled &&
                      "desktop:hover:bg-background-secondary dark:desktop:hover:bg-gray-700",
                    // Disabled state
                    option.disabled && "text-text-disabled cursor-not-allowed dark:text-gray-500"
                  )}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-8 text-center text-text-secondary dark:text-gray-400">
                Ничего не найдено
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p id={errorId} className="text-sm text-semantic-error dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

Select.displayName = "Select";
