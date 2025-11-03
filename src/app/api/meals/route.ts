// API route для создания приема пищи
// T085: Create meal creation API route in src/app/api/meals/route.ts POST (create meal with food items)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { CreateMealDto } from "@/entities/meal/model/types";
import { calculateTotalNutrition } from "@/entities/food-item/lib/calculate-nutrition";
import { suggestMealCategory } from "@/entities/meal/lib/suggest-category";
import { updateDailyLog } from "@/entities/daily-log/lib/update-daily-log";

export async function POST(request: NextRequest) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body: CreateMealDto = await request.json();

    // Валидация
    if (!body.foodItems || body.foodItems.length === 0) {
      return NextResponse.json(
        { error: "Meal должен содержать хотя бы один продукт" },
        { status: 400 }
      );
    }

    // Рассчитываем суммарную питательную ценность
    const totals = calculateTotalNutrition(body.foodItems);

    // Определяем категорию (если не указана явно)
    let category = body.category;
    if (!category && body.clientTimezoneOffset !== undefined) {
      category = suggestMealCategory(body.clientTimezoneOffset);
    }
    if (!category) {
      category = suggestMealCategory(); // Default без timezone
    }

    // Создаем дату с учетом timezone клиента
    // Если clientTimezoneOffset не предоставлен, используем серверное время
    const mealDate = new Date();
    if (body.clientTimezoneOffset !== undefined) {
      // Конвертируем UTC время в локальное время клиента
      // clientTimezoneOffset в минутах (например, -180 для UTC+3)
      const clientTime = new Date(mealDate.getTime() + body.clientTimezoneOffset * 60 * 1000);

      // Нормализуем дату - убираем время, оставляем только день в локальном времени клиента
      const localYear = clientTime.getUTCFullYear();
      const localMonth = clientTime.getUTCMonth();
      const localDay = clientTime.getUTCDate();

      // Создаем дату в UTC, но с днем из локального времени клиента
      mealDate.setUTCFullYear(localYear, localMonth, localDay);
      mealDate.setUTCHours(0, 0, 0, 0);
    }

    // Создаем meal с food items в транзакции + обновляем DailyLog
    const meal = await prisma.$transaction(async (tx) => {
      // Создаем meal
      const createdMeal = await tx.meal.create({
        data: {
          userId,
          photoId: body.photoId || null,
          date: mealDate,
          category,
          totalCalories: totals.calories,
          totalProtein: totals.protein,
          totalFats: totals.fats,
          totalCarbs: totals.carbs,
          foodItems: {
            create: body.foodItems.map((item) => ({
              name: item.name,
              weight: item.weight,
              caloriesPer100g: item.caloriesPer100g,
              proteinPer100g: item.proteinPer100g,
              fatsPer100g: item.fatsPer100g,
              carbsPer100g: item.carbsPer100g,
              addedManually: item.addedManually || false,
            })),
          },
        },
        include: {
          foodItems: true,
        },
      });

      // Обновляем DailyLog для этой даты
      await updateDailyLog(tx as unknown as typeof prisma, userId, createdMeal.date);

      return createdMeal;
    });

    return NextResponse.json(
      {
        meal,
        message: "Прием пищи успешно сохранен",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Meal creation error:", error);
    return NextResponse.json({ error: "Ошибка при создании приема пищи" }, { status: 500 });
  }
}
