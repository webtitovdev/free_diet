/**
 * DayDetailModal Component (shadcn/ui migration)
 *
 * Модальное окно с детальной информацией о дне: приемы пищи и отклонение от цели.
 * Мигрировано с Ant Design на shadcn/ui с добавлением ProgressCircle компонентов.
 *
 * Phase 3: T027, T028 - Mobile-First UI Redesign
 */

"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/shadcn/Card";
import { Button } from "@/shared/ui/shadcn/Button";
import { ProgressCircle } from "@/shared/ui/shadcn/ProgressCircle";
import { LoadingSpinner } from "@/shared/ui/shadcn/LoadingSpinner";
import { MealCard } from "@/widgets/meal-card/ui/MealCard";
import type { DayDetails } from "@/entities/daily-log/model/types";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DayDetailModalProps {
  visible: boolean;
  dayDetails: DayDetails | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

const MEAL_CATEGORY_LABELS = {
  BREAKFAST: "Завтрак",
  LUNCH: "Обед",
  DINNER: "Ужин",
  SNACK: "Перекус",
};

/**
 * DayDetailModal Component (shadcn/ui version)
 *
 * T027: Мигрирован с Ant Design на shadcn/ui
 * T028: Добавлены ProgressCircle для калорий и макронутриентов
 * T029: Плавная прокрутка реализована через scroll-smooth
 */
export function DayDetailModal({
  visible,
  dayDetails,
  isLoading,
  error,
  onClose,
}: DayDetailModalProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-sm",
        "animate-in fade-in duration-200"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full max-w-2xl max-h-[90vh]",
          "bg-background-primary rounded-lg shadow-xl",
          "animate-in slide-in-from-bottom duration-300"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-default">
          <h2 className="text-2xl font-semibold text-text-primary">Детали дня</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            ariaLabel="Закрыть"
            className="h-8 w-8 p-0"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 scroll-smooth">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" label="Загрузка..." />
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <Card
              variant="outlined"
              borderRadius="md"
              shadow="none"
              className="border-semantic-error"
            >
              <CardContent className="flex items-start gap-3 p-4">
                <AlertCircle className="text-semantic-error flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-semantic-error mb-1">Ошибка</h3>
                  <p className="text-sm text-text-secondary">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success */}
          {dayDetails && !isLoading && !error && (
            <div className="space-y-6">
              {/* DailyLog Summary with ProgressCircles */}
              {dayDetails.dailyLog ? (
                <Card variant="elevated" borderRadius="lg" shadow="md">
                  <CardHeader>
                    <CardTitle>Итого за день</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Goal Achievement Status */}
                    <div className="flex items-center gap-2">
                      {dayDetails.dailyLog.goalAchieved ? (
                        <>
                          <CheckCircle2 className="text-semantic-success" size={20} />
                          <span className="font-medium text-semantic-success">Цель достигнута</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="text-semantic-warning" size={20} />
                          <span className="font-medium text-text-secondary">
                            Отклонение: {dayDetails.dailyLog.deviationPercent.toFixed(1)}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Progress Circles (T028) */}
                    <div className="flex flex-wrap justify-around gap-6 pt-4">
                      {/* Calories */}
                      <ProgressCircle
                        value={dayDetails.dailyLog.totalCalories}
                        max={2000} // TODO: получить из user goal
                        label="Калории"
                        size="lg"
                        color="brand"
                        showValue
                        animated
                      />

                      {/* Protein */}
                      <ProgressCircle
                        value={dayDetails.dailyLog.totalProtein}
                        max={150} // TODO: получить из user goal
                        label="Белки (г)"
                        size="md"
                        color="info"
                        showValue
                        animated
                      />

                      {/* Carbs */}
                      <ProgressCircle
                        value={dayDetails.dailyLog.totalCarbs}
                        max={250} // TODO: получить из user goal
                        label="Углеводы (г)"
                        size="md"
                        color="warning"
                        showValue
                        animated
                      />

                      {/* Fats */}
                      <ProgressCircle
                        value={dayDetails.dailyLog.totalFats}
                        max={70} // TODO: получить из user goal
                        label="Жиры (г)"
                        size="md"
                        color="error"
                        showValue
                        animated
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  variant="outlined"
                  borderRadius="md"
                  shadow="none"
                  className="border-semantic-info"
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <AlertCircle className="text-semantic-info flex-shrink-0" size={20} />
                    <p className="text-sm text-text-secondary">Нет данных за этот день</p>
                  </CardContent>
                </Card>
              )}

              {/* Meals List (T027, T029) */}
              {dayDetails.meals.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-text-primary">Приемы пищи</h3>
                  <div className="space-y-3">
                    {dayDetails.meals.map((meal) => (
                      <MealCard
                        key={meal.id}
                        id={meal.id}
                        title={MEAL_CATEGORY_LABELS[meal.category]}
                        calories={Math.round(meal.totalCalories)}
                        macros={{
                          protein: Math.round(meal.totalProtein),
                          carbs: Math.round(meal.totalCarbs),
                          fat: Math.round(meal.totalFats),
                        }}
                        timestamp={new Date(meal.time)}
                        variant="detailed"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
