/**
 * Diary Page - Страница дневника питания
 *
 * Отображает дневной журнал приемов пищи с:
 * - ProgressCircle компонентами для дневного прогресса калорий
 * - Списком MealCard компонентов
 * - Grid layout на desktop (2-3 колонки) - T058
 * - Vertical список на мобильном
 *
 * Updated:
 * - T027: Мигрирована с Ant Design на shadcn/ui
 * - T028: Добавлены ProgressCircle для дневного прогресса
 * - T029: Плавная прокрутка с анимациями
 * - T058: Desktop Grid layout для MealCard компонентов
 *
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T027-T029, T058)
 * @see specs/001-mobile-first-ui-redesign/research.md (Lifesum pattern)
 */

"use client";

import React from "react";
import { Container } from "@/shared/ui/shadcn/Container";
import { Grid } from "@/shared/ui/shadcn/Grid";
import { ProgressCircle } from "@/shared/ui/shadcn/ProgressCircle";
import { MealCard } from "@/widgets/meal-card/ui/MealCard";
import { Button } from "@/shared/ui/shadcn/Button";
import { Plus } from "lucide-react";
import { EmptyState } from "@/shared/ui/shadcn/EmptyState";

export default function DiaryPage() {
  // TODO: Получить реальные данные из API/store
  const mockData = {
    dailyGoals: {
      calories: 2000,
      consumed: 1650,
      burned: 350,
      remaining: 350 + 350, // remaining = goal - consumed + burned
    },
    meals: [
      {
        id: "1",
        title: "Завтрак",
        calories: 450,
        macros: { protein: 25, carbs: 50, fat: 15 },
        timestamp: new Date(2025, 10, 4, 8, 30),
        imageUrl: undefined,
      },
      {
        id: "2",
        title: "Перекус",
        calories: 200,
        macros: { protein: 10, carbs: 25, fat: 8 },
        timestamp: new Date(2025, 10, 4, 11, 0),
        imageUrl: undefined,
      },
      {
        id: "3",
        title: "Обед",
        calories: 650,
        macros: { protein: 40, carbs: 70, fat: 20 },
        timestamp: new Date(2025, 10, 4, 13, 30),
        imageUrl: undefined,
      },
      {
        id: "4",
        title: "Ужин",
        calories: 350,
        macros: { protein: 30, carbs: 35, fat: 12 },
        timestamp: new Date(2025, 10, 4, 19, 0),
        imageUrl: undefined,
      },
    ],
  };

  const hasMeals = mockData.meals.length > 0;

  return (
    <Container maxWidth="desktop" padding={6} centered className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Дневник питания
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* CTA: Добавить прием пищи */}
        <Button variant="primary" size="lg" className="gap-2">
          <Plus size={20} />
          <span className="hidden mobile:inline">Добавить еду</span>
        </Button>
      </div>

      {/* Дневной прогресс калорий - T028 (Lifesum pattern) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Калории сегодня
        </h2>

        {/* T058: Grid layout для ProgressCircle на desktop */}
        <div className="grid grid-cols-1 mobile:grid-cols-3 gap-6 justify-items-center">
          {/* Съедено */}
          <div className="flex flex-col items-center">
            <ProgressCircle
              value={mockData.dailyGoals.consumed}
              max={mockData.dailyGoals.calories}
              label="Съедено"
              size="lg"
              color="brand"
              showValue
              animated
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {mockData.dailyGoals.consumed} / {mockData.dailyGoals.calories} ккал
            </p>
          </div>

          {/* Осталось */}
          <div className="flex flex-col items-center">
            <ProgressCircle
              value={mockData.dailyGoals.remaining}
              max={mockData.dailyGoals.calories}
              label="Осталось"
              size="lg"
              color="success"
              showValue
              animated
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {mockData.dailyGoals.remaining} ккал
            </p>
          </div>

          {/* Сожжено */}
          <div className="flex flex-col items-center">
            <ProgressCircle
              value={mockData.dailyGoals.burned}
              max={mockData.dailyGoals.calories}
              label="Сожжено"
              size="lg"
              color="warning"
              showValue
              animated
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {mockData.dailyGoals.burned} ккал
            </p>
          </div>
        </div>
      </div>

      {/* Приемы пищи */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Приемы пищи</h2>

        {hasMeals ? (
          // T058: Grid layout с 2-3 колонками на desktop вместо vertical списка
          // T029: Плавная прокрутка с fade-in анимациями (scroll-smooth)
          <Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap={4} className="scroll-smooth">
            {mockData.meals.map((meal, index) => (
              <div
                key={meal.id}
                className="animate-fadeIn"
                style={{
                  animationDelay: `${index * 100}ms`, // Staggered animation
                  animationDuration: "200ms",
                  animationFillMode: "both",
                }}
              >
                <MealCard
                  id={meal.id}
                  title={meal.title}
                  calories={meal.calories}
                  macros={meal.macros}
                  timestamp={meal.timestamp}
                  imageUrl={meal.imageUrl}
                  variant="detailed"
                  onClick={() => console.log("Meal clicked:", meal.id)}
                  onEdit={() => console.log("Edit meal:", meal.id)}
                  onDelete={() => console.log("Delete meal:", meal.id)}
                />
              </div>
            ))}
          </Grid>
        ) : (
          <EmptyState
            title="Нет приемов пищи"
            description="Добавьте первый прием пищи, чтобы начать отслеживание"
            icon="🍽️"
            action={{
              label: "Добавить еду",
              onClick: () => console.log("Add meal clicked"),
            }}
          />
        )}
      </div>
    </Container>
  );
}
