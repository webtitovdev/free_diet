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
  protein: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30", // Синий для белков
  carbs: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30", // Желтый для углеводов
  fat: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30", // Оранжевый для жиров
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
    <div className="relative group">
      <Card
        interactive={!!onClick}
        onClick={onClick}
        borderRadius="lg"
        shadow="lg"
        className={cn(
          "overflow-hidden transition-all duration-300 border-0",
          "hover:shadow-2xl hover:scale-105",
          "bg-white dark:bg-slate-800",
          className
        )}
      >
        {/* Gradient overlay на hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className={cn("flex gap-4 relative z-10", isCompact ? "flex-row" : "flex-col")}>
          {/* Image */}
          {imageUrl && (
            <div
              className={cn(
                "relative overflow-hidden",
                isCompact ? "h-24 w-24 flex-shrink-0 rounded-xl" : "h-48 w-full rounded-t-xl"
              )}
            >
              {/* Image с градиентом сверху */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                }}
                role="img"
                aria-label={`Фото: ${title}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col gap-3 p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
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
                      className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
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
                      className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Calories с градиентом */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {calories}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">ккал</span>
            </div>

            {/* Macros с градиентами */}
            {!isCompact && (
              <div className="flex flex-wrap gap-2">
                {/* Protein */}
                <div className="relative overflow-hidden rounded-lg px-3 py-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Белки</span>
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-100">{macros.protein}г</span>
                  </div>
                </div>

                {/* Carbs */}
                <div className="relative overflow-hidden rounded-lg px-3 py-2 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Углеводы</span>
                    <span className="text-sm font-bold text-amber-900 dark:text-amber-100">{macros.carbs}г</span>
                  </div>
                </div>

                {/* Fat */}
                <div className="relative overflow-hidden rounded-lg px-3 py-2 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Жиры</span>
                    <span className="text-sm font-bold text-orange-900 dark:text-orange-100">{macros.fat}г</span>
                  </div>
                </div>
              </div>
            )}

            {/* Compact Macros */}
            {isCompact && (
              <div className="flex gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                <span>Б: {macros.protein}г</span>
                <span>У: {macros.carbs}г</span>
                <span>Ж: {macros.fat}г</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

MealCard.displayName = "MealCard";
