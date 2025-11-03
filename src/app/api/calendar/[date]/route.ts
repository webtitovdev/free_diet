/**
 * Calendar Day Details API Route - GET
 *
 * Возвращает детальную информацию о конкретном дне: DailyLog + список приемов пищи.
 * Spec: §US5, §FR-020
 *
 * @endpoint GET /api/calendar/[date]
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth/auth-options";
import { prisma } from "@/shared/lib/db/prisma";
import { normalizeDate } from "@/entities/daily-log/lib/calculate-daily-log";
import type { DayDetails, DayMeal } from "@/entities/daily-log/model/types";

type RouteContext = {
  params: Promise<{
    date: string;
  }>;
};

/**
 * GET /api/calendar/[date]
 *
 * Path Parameter:
 * - date: строка в формате YYYY-MM-DD (например, "2025-11-03")
 *
 * Response:
 * - 200: DayDetails с DailyLog и приемами пищи
 * - 400: Невалидная дата
 * - 401: Пользователь не аутентифицирован
 * - 404: Нет данных за указанный день
 * - 500: Ошибка сервера
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userId = session.user.id;

    // Извлечение и валидация параметра даты
    const params = await context.params;
    const dateStr = params.date;

    if (!dateStr) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    // Парсинг даты из строки YYYY-MM-DD
    const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      return NextResponse.json(
        { error: "Invalid date format. Expected YYYY-MM-DD (e.g., 2025-11-03)." },
        { status: 400 }
      );
    }

    const year = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    const day = parseInt(dateMatch[3], 10);

    const requestedDate = new Date(year, month - 1, day);

    // Проверка валидности даты
    if (
      isNaN(requestedDate.getTime()) ||
      requestedDate.getFullYear() !== year ||
      requestedDate.getMonth() !== month - 1 ||
      requestedDate.getDate() !== day
    ) {
      return NextResponse.json(
        { error: "Invalid date. Please provide a valid date in YYYY-MM-DD format." },
        { status: 400 }
      );
    }

    const dateOnly = normalizeDate(requestedDate);

    // Получаем DailyLog для этой даты
    const dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: dateOnly,
        },
      },
    });

    // Получаем все приемы пищи за этот день
    const meals = await prisma.meal.findMany({
      where: {
        userId,
        date: {
          gte: dateOnly,
          lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000), // Следующий день
        },
      },
      include: {
        _count: {
          select: {
            foodItems: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Маппинг приемов пищи в DayMeal формат
    const dayMeals: DayMeal[] = meals.map((meal) => ({
      id: meal.id,
      category: meal.category,
      time: meal.date,
      totalCalories: meal.totalCalories,
      totalProtein: meal.totalProtein,
      totalFats: meal.totalFats,
      totalCarbs: meal.totalCarbs,
      foodItemsCount: meal._count.foodItems,
    }));

    // Формируем ответ
    const dayDetails: DayDetails = {
      date: dateOnly,
      dailyLog: dailyLog
        ? {
            id: dailyLog.id,
            userId: dailyLog.userId,
            date: dailyLog.date,
            totalCalories: dailyLog.totalCalories,
            totalProtein: dailyLog.totalProtein,
            totalFats: dailyLog.totalFats,
            totalCarbs: dailyLog.totalCarbs,
            deviationPercent: dailyLog.deviationPercent,
            goalAchieved: dailyLog.goalAchieved,
          }
        : null,
      meals: dayMeals,
    };

    return NextResponse.json(dayDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching day details:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching day details" },
      { status: 500 }
    );
  }
}
