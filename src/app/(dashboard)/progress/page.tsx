/**
 * Progress Page - Страница прогресса и статистики
 *
 * Отображает визуализацию прогресса пользователя с использованием:
 * - ProgressCircle компонентов для макронутриентов
 * - StatsCard для weekly/monthly trends
 * - Цветовая кодировка согласно research.md (Lifesum pattern)
 *
 * Updated: T056 [US3] - Wrapped в Container компонент для desktop центрирования
 *
 * @see specs/001-mobile-first-ui-redesign/research.md
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T041, T056)
 */

"use client";

import React from "react";
import { ProgressCircle } from "@/shared/ui/shadcn/ProgressCircle";
import { StatsCard } from "@/shared/ui/shadcn/StatsCard";
import { Container } from "@/shared/ui/shadcn/Container";
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
    <Container maxWidth="desktop" padding={6} centered className="space-y-8 animate-slideUp">
      {/* Заголовок с градиентом */}
      <div className="relative overflow-hidden rounded-3xl p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Прогресс 📊</h1>
          <p className="text-lg text-green-100">
            Отслеживайте свои результаты и достижения
          </p>
        </div>
      </div>

      {/* Калории - главный индикатор с градиентом */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-white dark:bg-slate-800 shadow-xl">
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500 to-pink-500" />
        <div className="relative z-10 flex justify-center">
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
      </div>

      {/* Макронутриенты с цветовой кодировкой */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Макронутриенты сегодня
        </h2>
        <div className="grid grid-cols-1 mobile:grid-cols-3 gap-6">
          {/* Белки - синий */}
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-4">
                  {mockData.macros.protein.current} / {mockData.macros.protein.goal} г
                </p>
              </div>
            </div>
          </div>

          {/* Углеводы - желтый */}
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-400 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-4">
                  {mockData.macros.carbs.current} / {mockData.macros.carbs.goal} г
                </p>
              </div>
            </div>
          </div>

          {/* Жиры - оранжевый */}
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-400 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-4">
                  {mockData.macros.fat.current} / {mockData.macros.fat.goal} г
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trends - с градиентами */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Статистика за неделю
        </h2>
        <div className="grid grid-cols-1 mobile:grid-cols-2 gap-6">
          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Средние калории
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockData.weeklyStats.avgCalories}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">ккал</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Flame className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Средний белок
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockData.weeklyStats.avgProtein}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">г</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-400 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Тренировки
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockData.weeklyStats.workoutsCompleted}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">раз</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Изменение веса
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockData.weeklyStats.weightChange}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">кг</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder для графиков */}
      <div className="relative overflow-hidden rounded-3xl p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700" />
        <div className="relative z-10 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            📈 Графики прогресса появятся в следующих версиях
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Weight chart, Calories trend, и многое другое
          </p>
        </div>
      </div>
    </Container>
  );
}
