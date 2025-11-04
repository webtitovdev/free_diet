/**
 * Progress Page - Страница прогресса и статистики
 *
 * Отображает визуализацию прогресса пользователя с использованием:
 * - ProgressCircle компонентов для макронутриентов
 * - StatsCard для weekly/monthly trends
 * - Цветовая кодировка согласно research.md (Lifesum pattern)
 *
 * @see specs/001-mobile-first-ui-redesign/research.md
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T041)
 */

"use client";

import React from "react";
import { ProgressCircle } from "@/shared/ui/shadcn/ProgressCircle";
import { StatsCard } from "@/shared/ui/shadcn/StatsCard";
import { Activity, Flame, TrendingUp, Target } from "lucide-react";

export default function ProgressPage() {
  // TODO: Получить реальные данные из API/store
  const mockData = {
    calories: {
      consumed: 1650,
      goal: 2000,
      burned: 350,
    },
    macros: {
      protein: { current: 85, goal: 120 }, // Синий
      carbs: { current: 180, goal: 250 }, // Желтый
      fat: { current: 50, goal: 65 }, // Оранжевый
    },
    weeklyStats: {
      avgCalories: 1800,
      avgProtein: 90,
      workoutsCompleted: 4,
      weightChange: -0.5, // кг
    },
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Прогресс</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Отслеживайте свои результаты и достижения
        </p>
      </div>

      {/* Калории - главный индикатор */}
      <div className="flex justify-center mb-8">
        <ProgressCircle
          value={mockData.calories.consumed}
          max={mockData.calories.goal}
          label="Калории"
          size="xl"
          color="brand"
          showValue
          animated
        />
      </div>

      {/* Макронутриенты с цветовой кодировкой (Lifesum pattern) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Макронутриенты сегодня
        </h2>
        <div className="grid grid-cols-1 mobile:grid-cols-3 gap-4">
          {/* Белки - синий */}
          <div className="flex flex-col items-center">
            <ProgressCircle
              value={mockData.macros.protein.current}
              max={mockData.macros.protein.goal}
              label="Белки"
              size="md"
              color="info"
              showPercentage
              animated
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {mockData.macros.protein.current} / {mockData.macros.protein.goal} г
            </p>
          </div>

          {/* Углеводы - желтый (warning) */}
          <div className="flex flex-col items-center">
            <ProgressCircle
              value={mockData.macros.carbs.current}
              max={mockData.macros.carbs.goal}
              label="Углеводы"
              size="md"
              color="warning"
              showPercentage
              animated
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {mockData.macros.carbs.current} / {mockData.macros.carbs.goal} г
            </p>
          </div>

          {/* Жиры - оранжевый (info или создать отдельный вариант) */}
          <div className="flex flex-col items-center">
            <ProgressCircle
              value={mockData.macros.fat.current}
              max={mockData.macros.fat.goal}
              label="Жиры"
              size="md"
              color="warning"
              showPercentage
              animated
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {mockData.macros.fat.current} / {mockData.macros.fat.goal} г
            </p>
          </div>
        </div>
      </div>

      {/* Weekly/Monthly Trends - StatsCard */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Статистика за неделю
        </h2>
        <div className="grid grid-cols-1 mobile:grid-cols-2 gap-4">
          <StatsCard
            title="Средние калории"
            value={mockData.weeklyStats.avgCalories}
            unit="ккал"
            icon={<Flame className="w-5 h-5" />}
            color="brand"
            trend={{ value: 100, direction: "up" }}
          />

          <StatsCard
            title="Средний белок"
            value={mockData.weeklyStats.avgProtein}
            unit="г"
            icon={<Activity className="w-5 h-5" />}
            color="info"
            trend={{ value: 5, direction: "up" }}
          />

          <StatsCard
            title="Тренировки"
            value={mockData.weeklyStats.workoutsCompleted}
            unit="раз"
            icon={<TrendingUp className="w-5 h-5" />}
            color="success"
            trend={{ value: 1, direction: "up" }}
          />

          <StatsCard
            title="Изменение веса"
            value={mockData.weeklyStats.weightChange}
            unit="кг"
            icon={<Target className="w-5 h-5" />}
            color={mockData.weeklyStats.weightChange < 0 ? "success" : "error"}
            trend={{
              value: Math.abs(mockData.weeklyStats.weightChange),
              direction: mockData.weeklyStats.weightChange < 0 ? "down" : "up",
            }}
          />
        </div>
      </div>

      {/* Placeholder для графиков (будущее развитие) */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Графики прогресса появятся в следующих версиях
          <br />
          (Weight chart, Calories trend, etc.)
        </p>
      </div>
    </div>
  );
}
