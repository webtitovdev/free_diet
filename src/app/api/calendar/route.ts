/**
 * Calendar API Route - GET Month Data
 *
 * Возвращает DailyLog записи за месяц с агрегированной статистикой.
 * Spec: §US5, §FR-018, §SC-009 (должен завершиться < 2s)
 *
 * @endpoint GET /api/calendar?year=2025&month=11
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth/auth-options";
import { prisma } from "@/shared/lib/db/prisma";
import { getMonthRange, calculateMonthStats } from "@/entities/daily-log/lib/calculate-daily-log";
import type { MonthData } from "@/entities/daily-log/model/types";

/**
 * GET /api/calendar
 *
 * Query Parameters:
 * - year: число (например, 2025)
 * - month: число 1-12 (например, 11 для ноября)
 *
 * Response:
 * - 200: MonthData с DailyLog записями и статистикой
 * - 400: Невалидные параметры
 * - 401: Пользователь не аутентифицирован
 * - 500: Ошибка сервера
 */
export async function GET(request: NextRequest) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userId = session.user.id;

    // Извлечение и валидация параметров
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    if (!yearParam || !monthParam) {
      return NextResponse.json(
        { error: "Missing required parameters: year and month" },
        { status: 400 }
      );
    }

    const year = parseInt(yearParam, 10);
    const month = parseInt(monthParam, 10);

    // Валидация года и месяца
    if (isNaN(year) || isNaN(month) || year < 2000 || year > 2100 || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Invalid year or month. Year must be 2000-2100, month must be 1-12." },
        { status: 400 }
      );
    }

    // Получаем диапазон дат для месяца
    const { startDate, endDate } = getMonthRange(year, month);

    // Запрос DailyLog записей за месяц (§SC-009: должно быть < 2s)
    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        id: true,
        userId: true,
        date: true,
        totalCalories: true,
        totalProtein: true,
        totalFats: true,
        totalCarbs: true,
        deviationPercent: true,
        goalAchieved: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Рассчитываем статистику за месяц
    const stats = calculateMonthStats(dailyLogs);

    // Формируем ответ
    const monthData: MonthData = {
      year,
      month,
      dailyLogs: dailyLogs.map((log) => ({
        ...log,
        date: log.date,
      })),
      stats,
    };

    return NextResponse.json(monthData, { status: 200 });
  } catch (error) {
    console.error("Error fetching calendar month data:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching calendar data" },
      { status: 500 }
    );
  }
}
