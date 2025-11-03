// Логика обновления DailyLog при изменении meals
// T088: Implement DailyLog update logic (recalculate daily totals from all meals)

import { PrismaClient } from "@prisma/client";

/**
 * Пересчитывает и обновляет DailyLog для указанной даты и пользователя
 *
 * Architecture: Эта функция вызывается в Prisma transaction context
 * из meal CRUD операций (src/app/api/meals/route.ts POST/PATCH/DELETE).
 * Обеспечивает атомарные обновления: meal change + DailyLog recalculation
 * происходят вместе или оба fail.
 *
 * @param tx Prisma transaction client
 * @param userId ID пользователя
 * @param date Дата для обновления (без времени)
 */
export async function updateDailyLog(tx: PrismaClient, userId: string, date: Date): Promise<void> {
  // Нормализуем дату - убираем время, оставляем только день
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  // Получаем все meals пользователя за этот день
  const dayStart = new Date(normalizedDate);
  const dayEnd = new Date(normalizedDate);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const meals = await tx.meal.findMany({
    where: {
      userId,
      date: {
        gte: dayStart,
        lt: dayEnd,
      },
    },
  });

  // Рассчитываем суммарные значения
  const totals = meals.reduce(
    (acc, meal) => ({
      totalCalories: acc.totalCalories + meal.totalCalories,
      totalProtein: acc.totalProtein + meal.totalProtein,
      totalFats: acc.totalFats + meal.totalFats,
      totalCarbs: acc.totalCarbs + meal.totalCarbs,
    }),
    { totalCalories: 0, totalProtein: 0, totalFats: 0, totalCarbs: 0 }
  );

  // Получаем targetCalories пользователя
  const profile = await tx.userProfile.findUnique({
    where: { userId },
    select: { targetCalories: true },
  });

  const targetCalories = profile?.targetCalories || 2000; // Default fallback

  // Рассчитываем отклонение в процентах
  const deviationPercent =
    targetCalories > 0 ? ((totals.totalCalories - targetCalories) / targetCalories) * 100 : 0;

  // Цель достигнута если отклонение в пределах ±10% (FR-019)
  const goalAchieved = Math.abs(deviationPercent) <= 10;

  // Upsert DailyLog
  await tx.dailyLog.upsert({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    create: {
      userId,
      date: normalizedDate,
      totalCalories: totals.totalCalories,
      totalProtein: totals.totalProtein,
      totalFats: totals.totalFats,
      totalCarbs: totals.totalCarbs,
      deviationPercent,
      goalAchieved,
    },
    update: {
      totalCalories: totals.totalCalories,
      totalProtein: totals.totalProtein,
      totalFats: totals.totalFats,
      totalCarbs: totals.totalCarbs,
      deviationPercent,
      goalAchieved,
    },
  });
}

/**
 * Удаляет DailyLog если нет meals за этот день
 * Вызывается после удаления meal
 *
 * @param tx Prisma transaction client
 * @param userId ID пользователя
 * @param date Дата для проверки
 */
export async function deleteDailyLogIfEmpty(
  tx: PrismaClient,
  userId: string,
  date: Date
): Promise<void> {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  const dayStart = new Date(normalizedDate);
  const dayEnd = new Date(normalizedDate);
  dayEnd.setDate(dayEnd.getDate() + 1);

  // Проверяем есть ли еще meals за этот день
  const mealCount = await tx.meal.count({
    where: {
      userId,
      date: {
        gte: dayStart,
        lt: dayEnd,
      },
    },
  });

  // Если meals нет, удаляем DailyLog
  if (mealCount === 0) {
    await tx.dailyLog.deleteMany({
      where: {
        userId,
        date: normalizedDate,
      },
    });
  }
}
