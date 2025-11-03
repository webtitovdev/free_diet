/**
 * DailyLog Calculation Logic
 *
 * Функции для расчета дневной сводки на основе приемов пищи.
 * Spec: §FR-018 to §FR-020
 *
 * @module entities/daily-log/lib/calculate-daily-log
 */

import { Prisma } from "@prisma/client";
import type { DailyLogInput, MonthStats } from "../model/types";

/**
 * Тип для приема пищи с агрегированными данными
 */
type MealWithTotals = {
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
};

/**
 * Рассчитывает DailyLog на основе всех приемов пищи за день.
 *
 * Формула отклонения (§FR-019):
 * deviationPercent = ((actualCalories - targetCalories) / targetCalories) * 100
 *
 * Формула достижения цели (§FR-019):
 * goalAchieved = Math.abs(deviationPercent) <= 10
 *
 * @param meals - Массив приемов пищи за день
 * @param targetCalories - Целевая калорийность пользователя
 * @returns Входные данные для создания/обновления DailyLog
 */
export function calculateDailyLog(
  meals: MealWithTotals[],
  targetCalories: number
): Omit<DailyLogInput, "userId" | "date"> {
  // Агрегирование данных из всех приемов пищи
  const totals = meals.reduce(
    (acc, meal) => ({
      totalCalories: acc.totalCalories + meal.totalCalories,
      totalProtein: acc.totalProtein + meal.totalProtein,
      totalFats: acc.totalFats + meal.totalFats,
      totalCarbs: acc.totalCarbs + meal.totalCarbs,
    }),
    {
      totalCalories: 0,
      totalProtein: 0,
      totalFats: 0,
      totalCarbs: 0,
    }
  );

  // Расчет отклонения от целевой калорийности
  const deviationPercent =
    targetCalories > 0 ? ((totals.totalCalories - targetCalories) / targetCalories) * 100 : 0;

  // Достижение цели: отклонение в пределах ±10% (§FR-019)
  const goalAchieved = Math.abs(deviationPercent) <= 10;

  return {
    ...totals,
    targetCalories,
    deviationPercent: Number(deviationPercent.toFixed(2)), // Округление до 2 знаков
    goalAchieved,
  };
}

/**
 * Создает или обновляет DailyLog для конкретной даты.
 * Используется в транзакциях при создании/обновлении/удалении приемов пищи.
 *
 * @param tx - Prisma транзакция или клиент
 * @param userId - ID пользователя
 * @param date - Дата (без времени)
 * @param targetCalories - Целевая калорийность пользователя
 */
export async function upsertDailyLog(
  tx: Prisma.TransactionClient,
  userId: string,
  date: Date,
  targetCalories: number
): Promise<void> {
  // Нормализация даты до начала дня (убираем время)
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Получаем все приемы пищи за этот день
  const meals = await tx.meal.findMany({
    where: {
      userId,
      date: {
        gte: dateOnly,
        lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000), // Следующий день
      },
    },
    select: {
      totalCalories: true,
      totalProtein: true,
      totalFats: true,
      totalCarbs: true,
    },
  });

  // Если нет приемов пищи, удаляем DailyLog (если существует)
  if (meals.length === 0) {
    await tx.dailyLog.deleteMany({
      where: {
        userId,
        date: dateOnly,
      },
    });
    return;
  }

  // Рассчитываем дневную сводку
  const calculatedData = calculateDailyLog(meals, targetCalories);

  // Создаем или обновляем DailyLog
  await tx.dailyLog.upsert({
    where: {
      userId_date: {
        userId,
        date: dateOnly,
      },
    },
    create: {
      userId,
      date: dateOnly,
      ...calculatedData,
    },
    update: calculatedData,
  });
}

/**
 * Рассчитывает статистику за месяц на основе DailyLog записей.
 *
 * @param dailyLogs - Массив DailyLog за месяц
 * @returns Статистика за месяц
 */
export function calculateMonthStats(
  dailyLogs: Array<{
    totalCalories: number;
    goalAchieved: boolean;
  }>
): MonthStats {
  if (dailyLogs.length === 0) {
    return {
      totalDays: 0,
      daysWithGoalAchieved: 0,
      averageCalories: 0,
      successRate: 0,
    };
  }

  const totalDays = dailyLogs.length;
  const daysWithGoalAchieved = dailyLogs.filter((log) => log.goalAchieved).length;
  const totalCalories = dailyLogs.reduce((sum, log) => sum + log.totalCalories, 0);
  const averageCalories = totalCalories / totalDays;
  const successRate = (daysWithGoalAchieved / totalDays) * 100;

  return {
    totalDays,
    daysWithGoalAchieved,
    averageCalories: Number(averageCalories.toFixed(2)),
    successRate: Number(successRate.toFixed(2)),
  };
}

/**
 * Получает первый и последний день месяца для запросов диапазона дат.
 *
 * @param year - Год (например, 2025)
 * @param month - Месяц (1-12)
 * @returns Объект с начальной и конечной датой месяца
 */
export function getMonthRange(
  year: number,
  month: number
): {
  startDate: Date;
  endDate: Date;
} {
  const startDate = new Date(year, month - 1, 1); // Первый день месяца
  const endDate = new Date(year, month, 1); // Первый день следующего месяца

  return { startDate, endDate };
}

/**
 * Нормализует дату до начала дня (убирает время).
 * Используется для консистентных сравнений дат в календаре.
 *
 * @param date - Исходная дата
 * @returns Дата без времени (00:00:00)
 */
export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
