/**
 * Dialog Component
 *
 * Модальное окно для отображения контента поверх основного интерфейса.
 * Компонент на основе shadcn/ui паттернов.
 */

"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DialogProps {
  /** Открыто ли модальное окно */
  open: boolean;

  /** Callback при закрытии */
  onClose: () => void;

  /** Заголовок */
  title?: string;

  /** Описание */
  description?: string;

  /** Контент */
  children: React.ReactNode;

  /** Футер с кнопками */
  footer?: React.ReactNode;

  /** Максимальная ширина */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /** CSS класс */
  className?: string;

  /** Отключить закрытие по клику на backdrop */
  disableBackdropClose?: boolean;

  /** Отключить закрытие по Escape */
  disableEscapeClose?: boolean;
}

/**
 * Размеры модального окна
 */
const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

/**
 * Dialog - Модальное окно
 *
 * Features:
 * - Backdrop с затемнением
 * - Закрытие по клику на backdrop или Escape
 * - Анимация появления/скрытия
 * - Адаптивный дизайн
 * - Заголовок, описание, контент, футер
 *
 * @example
 * ```tsx
 * <Dialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Заголовок"
 *   description="Описание модального окна"
 *   footer={
 *     <div className="flex gap-2">
 *       <Button onClick={handleSave}>Сохранить</Button>
 *       <Button variant="outline" onClick={onClose}>Отмена</Button>
 *     </div>
 *   }
 * >
 *   <p>Контент модального окна</p>
 * </Dialog>
 * ```
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
  className,
  disableBackdropClose = false,
  disableEscapeClose = false,
}: DialogProps) {
  // Закрытие по Escape
  useEffect(() => {
    if (!open || disableEscapeClose) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose, disableEscapeClose]);

  // Блокировка скролла body при открытом модальном окне
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !disableBackdropClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "dialog-title" : undefined}
      aria-describedby={description ? "dialog-description" : undefined}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0" />

      {/* Dialog Content */}
      <div
        className={cn(
          // Базовые стили
          "relative z-50",
          "w-full",
          maxWidthClasses[maxWidth],
          "bg-white dark:bg-gray-800",
          "rounded-lg shadow-xl",
          "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4",
          "duration-200",

          // Внутренние отступы и структура
          "flex flex-col",
          "max-h-[90vh]",

          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              {title && (
                <h2
                  id="dialog-title"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="dialog-description"
                  className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                >
                  {description}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                "ml-4 rounded-md p-1",
                "text-gray-400 hover:text-gray-600",
                "dark:text-gray-500 dark:hover:text-gray-300",
                "transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-DEFAULT"
              )}
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * DialogHeader - Хедер для кастомной разметки
 */
export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
      {children}
    </div>
  );
}

/**
 * DialogTitle - Заголовок для кастомной разметки
 */
export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  );
}

/**
 * DialogDescription - Описание для кастомной разметки
 */
export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("text-sm text-gray-600 dark:text-gray-400", className)}>{children}</p>;
}

/**
 * DialogFooter - Футер для кастомной разметки
 */
export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>
      {children}
    </div>
  );
}
