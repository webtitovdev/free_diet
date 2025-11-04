/**
 * EmptyState Component
 *
 * Отображение пустого состояния для списков (например, "Нет приемов пищи сегодня").
 * С иллюстрацией, заголовком, описанием и опциональной action кнопкой.
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T047)
 */

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "./Button";

export interface EmptyStateProps {
  /** Заголовок */
  title: string;

  /** Описание */
  description?: string;

  /** Иллюстрация или иконка */
  illustration?: React.ReactNode;

  /** Действие (кнопка) */
  action?: {
    label: string;
    onClick: () => void;
  };

  /** CSS класс */
  className?: string;
}

/**
 * EmptyState - Пустое состояние
 *
 * Features:
 * - Центрированный layout
 * - Иллюстрация/иконка (опционально)
 * - Заголовок и описание
 * - Action button (опционально)
 * - Адаптивные размеры
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="Нет приемов пищи сегодня"
 *   description="Начните добавлять свои приемы пищи, чтобы отслеживать калории"
 *   illustration={<ImageIcon className="w-16 h-16" />}
 *   action={{
 *     label: "Добавить прием пищи",
 *     onClick: () => router.push("/add-meal")
 *   }}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  illustration,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        // Layout
        "flex flex-col items-center justify-center",
        "text-center",
        "p-8 mobile:p-12",
        "min-h-[300px]",

        className
      )}
    >
      {/* Иллюстрация */}
      {illustration && <div className="mb-6 text-gray-400 dark:text-gray-600">{illustration}</div>}

      {/* Заголовок */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>

      {/* Описание */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">{description}</p>
      )}

      {/* Action button */}
      {action && (
        <Button variant="primary" onClick={action.onClick} size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
}
