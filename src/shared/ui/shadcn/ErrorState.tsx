/**
 * ErrorState Component
 *
 * Отображение состояния ошибки с типом (network, server, not-found, generic).
 * Для обработки FR-020, FR-021 offline error с кнопкой "Попробовать снова".
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T048)
 */

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "./Button";
import { WifiOff, ServerCrash, FileQuestion, AlertCircle } from "lucide-react";

export interface ErrorStateProps {
  /** Заголовок ошибки */
  title: string;

  /** Описание ошибки */
  description?: string;

  /** Иллюстрация */
  illustration?: React.ReactNode;

  /** Действие повтора */
  onRetry?: () => void;

  /** Текст кнопки повтора */
  retryLabel?: string;

  /** CSS класс */
  className?: string;

  /** Тип ошибки */
  type?: "network" | "server" | "not-found" | "generic";
}

/**
 * Дефолтные иконки для типов ошибок
 */
const defaultIcons = {
  network: <WifiOff className="w-16 h-16" />,
  server: <ServerCrash className="w-16 h-16" />,
  "not-found": <FileQuestion className="w-16 h-16" />,
  generic: <AlertCircle className="w-16 h-16" />,
};

/**
 * Дефолтные сообщения для типов ошибок
 */
const defaultMessages = {
  network: {
    title: "Нет соединения с интернетом",
    description: "Проверьте подключение к сети и попробуйте снова",
  },
  server: {
    title: "Ошибка сервера",
    description: "Произошла ошибка на сервере. Мы уже работаем над её устранением",
  },
  "not-found": {
    title: "Страница не найдена",
    description: "Запрашиваемая страница не существует или была удалена",
  },
  generic: {
    title: "Что-то пошло не так",
    description: "Произошла непредвиденная ошибка. Попробуйте обновить страницу",
  },
};

/**
 * ErrorState - Состояние ошибки
 *
 * Features:
 * - 4 типа ошибок: network, server, not-found, generic
 * - Автоматические иллюстрации и сообщения для типов
 * - Кнопка "Попробовать снова"
 * - Кастомизируемые title, description, illustration
 *
 * @example
 * ```tsx
 * // Network error (offline - FR-020, FR-021)
 * <ErrorState
 *   type="network"
 *   onRetry={() => window.location.reload()}
 * />
 *
 * // Custom error
 * <ErrorState
 *   title="Ошибка загрузки данных"
 *   description="Не удалось загрузить список приемов пищи"
 *   onRetry={() => refetch()}
 *   retryLabel="Повторить попытку"
 * />
 * ```
 */
export function ErrorState({
  title,
  description,
  illustration,
  onRetry,
  retryLabel = "Попробовать снова",
  className,
  type = "generic",
}: ErrorStateProps) {
  // Использовать дефолтные значения если не заданы
  const displayTitle = title || defaultMessages[type].title;
  const displayDescription = description || defaultMessages[type].description;
  const displayIllustration = illustration || defaultIcons[type];

  return (
    <div
      className={cn(
        // Layout
        "flex flex-col items-center justify-center",
        "text-center",
        "p-8 mobile:p-12",
        "min-h-[400px]",

        className
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Иллюстрация */}
      <div className="mb-6 text-error-DEFAULT dark:text-error-light">{displayIllustration}</div>

      {/* Заголовок */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{displayTitle}</h2>

      {/* Описание */}
      {displayDescription && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          {displayDescription}
        </p>
      )}

      {/* Retry button */}
      {onRetry && (
        <Button variant="primary" onClick={onRetry} size="md">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
