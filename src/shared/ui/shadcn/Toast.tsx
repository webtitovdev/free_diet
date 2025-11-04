/**
 * Toast Notification Component
 *
 * Всплывающие уведомления для отображения success, error, warning, info сообщений.
 * С поддержкой auto-close, действий и позиционирования.
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T046)
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export interface ToastProps {
  /** Тип уведомления */
  type: "success" | "error" | "warning" | "info";

  /** Сообщение */
  message: string;

  /** Описание (дополнительный текст) */
  description?: string;

  /** Длительность показа в мс (0 = бесконечно) */
  duration?: number;

  /** Действие (кнопка) */
  action?: {
    label: string;
    onClick: () => void;
  };

  /** Обработчик закрытия */
  onClose?: () => void;

  /** Позиция на экране */
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

  /** CSS класс */
  className?: string;

  /** Visible state (controlled) */
  visible?: boolean;
}

/**
 * Иконки для типов уведомлений
 */
const typeIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/**
 * Цветовые схемы для типов
 */
const typeColors = {
  success:
    "bg-success-light dark:bg-success-dark/20 border-success-DEFAULT text-success-dark dark:text-success-light",
  error:
    "bg-error-light dark:bg-error-dark/20 border-error-DEFAULT text-error-dark dark:text-error-light",
  warning:
    "bg-warning-light dark:bg-warning-dark/20 border-warning-DEFAULT text-warning-dark dark:text-warning-light",
  info: "bg-info-light dark:bg-info-dark/20 border-info-DEFAULT text-info-dark dark:text-info-light",
};

/**
 * Позиционирование Toast
 */
const positionClasses = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
};

/**
 * Toast - Всплывающее уведомление
 *
 * Features:
 * - 4 типа: success, error, warning, info
 * - Auto-close через заданное время (default 3s)
 * - Действие (action button)
 * - 6 позиций на экране
 * - Slide-in анимация
 *
 * @example
 * ```tsx
 * <Toast
 *   type="success"
 *   message="Изменения сохранены"
 *   description="Ваш профиль успешно обновлен"
 *   duration={3000}
 *   onClose={() => console.log("Toast closed")}
 * />
 * ```
 */
export function Toast({
  type,
  message,
  description,
  duration = 3000,
  action,
  onClose,
  position = "top-right",
  className,
  visible = true,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(visible);
  const Icon = typeIcons[type];

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200); // Delay для завершения анимации
  }, [onClose]);

  useEffect(() => {
    if (duration > 0 && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        // Базовые стили
        "fixed z-50",
        "flex items-start gap-3",
        "min-w-[300px] max-w-md",
        "p-4 rounded-lg",
        "border-l-4",
        "shadow-lg dark:shadow-xl",
        "transition-all duration-200",

        // Анимация появления
        isVisible ? "animate-slide-in opacity-100" : "animate-slide-out opacity-0",

        // Цвета по типу
        typeColors[type],

        // Позиция
        positionClasses[position],

        className
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Иконка */}
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />

      {/* Контент */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{message}</p>
        {description && <p className="text-xs mt-1 opacity-90">{description}</p>}

        {/* Action button */}
        {action && (
          <button
            onClick={() => {
              action.onClick();
              handleClose();
            }}
            className={cn(
              "mt-2 text-xs font-medium underline",
              "hover:opacity-80",
              "transition-opacity duration-200"
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className={cn(
          "flex-shrink-0",
          "hover:opacity-60",
          "transition-opacity duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
        )}
        aria-label="Закрыть уведомление"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
