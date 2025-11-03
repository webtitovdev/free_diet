/**
 * MealCard Widget - карточка приема пищи
 *
 * Виджет для отображения приема пищи с фото, калориями,
 * макронутриентами и действиями (редактирование, удаление).
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 */

"use client";

import React from "react";
import { Card } from "@/shared/ui/shadcn/Card";
import { Button } from "@/shared/ui/shadcn/Button";
import { Edit2, Trash2, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface MealCardProps {
  /** ID приема пищи */
  id: string;

  /** Название приема пищи */
  title: string;

  /** Фото еды */
  imageUrl?: string;

  /** Калории */
  calories: number;

  /** Макронутриенты */
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };

  /** Время приема пищи */
  timestamp: Date;

  /** Обработчик клика на карточку */
  onClick?: () => void;

  /** Обработчик редактирования */
  onEdit?: () => void;

  /** Обработчик удаления */
  onDelete?: () => void;

  /** CSS класс */
  className?: string;

  /** Вариант отображения */
  variant?: "compact" | "detailed";
}

/**
 * Цветовая кодировка макронутриентов (согласно Lifesum pattern)
 */
const macroColors = {
  protein: "text-blue-600 bg-blue-50", // Синий для белков
  carbs: "text-amber-600 bg-amber-50", // Желтый для углеводов
  fat: "text-orange-600 bg-orange-50", // Оранжевый для жиров
};

/**
 * Форматирование времени
 */
const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * MealCard компонент
 */
export const MealCard: React.FC<MealCardProps> = ({
  title,
  imageUrl,
  calories,
  macros,
  timestamp,
  onClick,
  onEdit,
  onDelete,
  className,
  variant = "detailed",
}) => {
  const isCompact = variant === "compact";

  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      borderRadius="md"
      shadow="md"
      className={cn("overflow-hidden transition-all duration-200", "hover:shadow-lg", className)}
    >
      <div className={cn("flex gap-4", isCompact ? "flex-row" : "flex-col")}>
        {/* Image */}
        {imageUrl && (
          <div
            className={cn(
              "relative overflow-hidden bg-background-tertiary",
              isCompact ? "h-24 w-24 flex-shrink-0 rounded-DEFAULT" : "h-48 w-full rounded-lg"
            )}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            role="img"
            aria-label={`Фото: ${title}`}
          />
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                <Clock size={14} />
                <span>{formatTime(timestamp)}</span>
              </div>
            </div>

            {/* Actions */}
            {(onEdit || onDelete) && (
              <div className="flex items-center gap-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    ariaLabel="Редактировать прием пищи"
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 size={16} />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    ariaLabel="Удалить прием пищи"
                    className="h-8 w-8 p-0 hover:text-semantic-error"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Calories */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">{calories}</span>
            <span className="text-sm text-text-secondary">ккал</span>
          </div>

          {/* Macros */}
          {!isCompact && (
            <div className="flex flex-wrap gap-2">
              {/* Protein */}
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-DEFAULT px-3 py-1.5",
                  macroColors.protein
                )}
              >
                <span className="text-xs font-medium">Белки</span>
                <span className="text-sm font-semibold">{macros.protein}г</span>
              </div>

              {/* Carbs */}
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-DEFAULT px-3 py-1.5",
                  macroColors.carbs
                )}
              >
                <span className="text-xs font-medium">Углеводы</span>
                <span className="text-sm font-semibold">{macros.carbs}г</span>
              </div>

              {/* Fat */}
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-DEFAULT px-3 py-1.5",
                  macroColors.fat
                )}
              >
                <span className="text-xs font-medium">Жиры</span>
                <span className="text-sm font-semibold">{macros.fat}г</span>
              </div>
            </div>
          )}

          {/* Compact Macros */}
          {isCompact && (
            <div className="flex gap-3 text-xs text-text-secondary">
              <span>Б: {macros.protein}г</span>
              <span>У: {macros.carbs}г</span>
              <span>Ж: {macros.fat}г</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

MealCard.displayName = "MealCard";
