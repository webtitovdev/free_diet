/**
 * use-toast hook
 *
 * Хук для показа toast уведомлений в приложении.
 * Использует shadcn/ui Toast компонент.
 */

"use client";

import { useState, useCallback } from "react";

export type ToastVariant = "default" | "destructive" | "success";

export interface ToastOptions {
  /** Заголовок уведомления */
  title?: string;

  /** Описание (основной текст) */
  description?: string;

  /** Вариант отображения */
  variant?: ToastVariant;

  /** Длительность показа в мс (по умолчанию 3000) */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

let toastCounter = 0;
const listeners = new Set<(toasts: ToastItem[]) => void>();
let toastsState: ToastItem[] = [];

/**
 * Функция для показа toast уведомления
 */
function showToast(options: ToastOptions): string {
  const id = `toast-${++toastCounter}`;
  const toast: ToastItem = {
    id,
    variant: options.variant || "default",
    title: options.title,
    description: options.description,
    duration: options.duration || 3000,
  };

  toastsState = [...toastsState, toast];
  listeners.forEach((listener) => listener(toastsState));

  // Автоматическое удаление через duration
  if (toast.duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, toast.duration);
  }

  return id;
}

/**
 * Функция для удаления toast уведомления
 */
function dismissToast(id: string) {
  toastsState = toastsState.filter((t) => t.id !== id);
  listeners.forEach((listener) => listener(toastsState));
}

/**
 * Хук для работы с toast уведомлениями
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 *
 * // Показать успешное уведомление
 * toast({
 *   title: "Успех!",
 *   description: "Данные успешно сохранены",
 *   variant: "success"
 * });
 *
 * // Показать ошибку
 * toast({
 *   title: "Ошибка",
 *   description: "Не удалось сохранить данные",
 *   variant: "destructive"
 * });
 * ```
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(toastsState);

  // Подписка на изменения
  const subscribe = useCallback(() => {
    listeners.add(setToasts);
    return () => listeners.delete(setToasts);
  }, []);

  // Подписываемся при монтировании
  if (typeof window !== "undefined") {
    subscribe();
  }

  const toast = useCallback((options: ToastOptions) => {
    return showToast(options);
  }, []);

  const dismiss = useCallback((id: string) => {
    dismissToast(id);
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}

/**
 * Удобные методы для частых случаев
 */
export const toast = {
  success: (description: string, title?: string) =>
    showToast({ variant: "success", description, title: title || "Успех" }),

  error: (description: string, title?: string) =>
    showToast({ variant: "destructive", description, title: title || "Ошибка" }),

  info: (description: string, title?: string) =>
    showToast({ variant: "default", description, title: title || "Информация" }),
};
