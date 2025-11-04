/**
 * DayDetailModal Component
 *
 * Модальное окно с детальной информацией о дне: приемы пищи и отклонение от цели.
 */

"use client";

import React from "react";
import { Dialog } from "@/shared/ui/shadcn/Dialog";
import { Badge } from "@/shared/ui/shadcn/Badge";
import { Alert } from "@/shared/ui/shadcn/Alert";
import { LoadingSpinner } from "@/shared/ui/shadcn/LoadingSpinner";
import type { DayDetails } from "@/entities/daily-log/model/types";

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

export function DayDetailModal({
  visible,
  dayDetails,
  isLoading,
  error,
  onClose,
}: DayDetailModalProps) {
  return (
    <Dialog open={visible} onClose={onClose} title="Детали дня" maxWidth="lg">
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner label="Загрузка..." />
        </div>
      )}

      {error && <Alert type="error" message="Ошибка" description={error} showIcon />}

      {dayDetails && !isLoading && !error && (
        <div className="space-y-6">
          {/* DailyLog Summary */}
          {dayDetails.dailyLog ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Итого за день
              </h3>

              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Калории:</span>{" "}
                  {Math.round(dayDetails.dailyLog.totalCalories)} ккал
                  {dayDetails.dailyLog.goalAchieved ? (
                    <Badge variant="success" size="sm" className="ml-2">
                      Цель достигнута
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm" className="ml-2">
                      Отклонение: {dayDetails.dailyLog.deviationPercent.toFixed(1)}%
                    </Badge>
                  )}
                </p>

                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">БЖУ:</span> Б:{" "}
                  {Math.round(dayDetails.dailyLog.totalProtein)}г, Ж:{" "}
                  {Math.round(dayDetails.dailyLog.totalFats)}г, У:{" "}
                  {Math.round(dayDetails.dailyLog.totalCarbs)}г
                </p>
              </div>
            </div>
          ) : (
            <Alert type="info" message="Нет данных за этот день" showIcon />
          )}

          {/* Meals List */}
          {dayDetails.meals.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Приемы пищи
              </h3>

              <div className="space-y-4">
                {dayDetails.meals.map((meal, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" size="sm">
                        {MEAL_CATEGORY_LABELS[meal.category]}
                      </Badge>

                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {new Date(meal.time).toLocaleTimeString("ru-RU")}
                        </div>

                        <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {Math.round(meal.totalCalories)} ккал • {meal.foodItemsCount} продуктов
                        </div>

                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Б: {Math.round(meal.totalProtein)}г, Ж: {Math.round(meal.totalFats)}г, У:{" "}
                          {Math.round(meal.totalCarbs)}г
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
