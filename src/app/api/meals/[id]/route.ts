// API routes для получения, обновления и удаления meal
// T086: Create meal update API route PATCH (update food item weights)
// T087: Create meal retrieval API route GET
// T089: Create meal deletion API route DELETE

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { UpdateMealDto, MealCategory } from "@/entities/meal/model/types";
import { calculateTotalNutrition } from "@/entities/food-item/lib/calculate-nutrition";
import { updateDailyLog, deleteDailyLogIfEmpty } from "@/entities/daily-log/lib/update-daily-log";

/**
 * GET /api/meals/[id]
 * Получение meal со всеми food items
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id: mealId } = await params;

    // Получаем meal с food items
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
      include: {
        foodItems: true,
      },
    });

    if (!meal) {
      return NextResponse.json({ error: "Meal не найден" }, { status: 404 });
    }

    // Проверка прав доступа
    if (meal.userId !== userId) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    return NextResponse.json({ meal }, { status: 200 });
  } catch (error) {
    console.error("Meal retrieval error:", error);
    return NextResponse.json({ error: "Ошибка при получении meal" }, { status: 500 });
  }
}

/**
 * PATCH /api/meals/[id]
 * Обновление meal (категория, веса food items)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id: mealId } = await params;
    const body: UpdateMealDto = await request.json();

    // Проверяем существование meal и права доступа
    const existingMeal = await prisma.meal.findUnique({
      where: { id: mealId },
      include: { foodItems: true },
    });

    if (!existingMeal) {
      return NextResponse.json({ error: "Meal не найден" }, { status: 404 });
    }

    if (existingMeal.userId !== userId) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    // Обновляем meal в транзакции
    const updatedMeal = await prisma.$transaction(async (tx) => {
      const updateData: {
        category?: MealCategory;
        totalCalories?: number;
        totalProtein?: number;
        totalFats?: number;
        totalCarbs?: number;
      } = {};

      // Обновляем категорию если указана
      if (body.category) {
        updateData.category = body.category;
      }

      // Обновляем food items если указаны
      if (body.foodItems && body.foodItems.length > 0) {
        // Удаляем все существующие food items
        await tx.foodItem.deleteMany({
          where: { mealId },
        });

        // Создаем новые food items
        await tx.foodItem.createMany({
          data: body.foodItems.map((item) => ({
            mealId,
            name: item.name || "Unknown",
            weight: item.weight || 0,
            caloriesPer100g: item.caloriesPer100g || 0,
            proteinPer100g: item.proteinPer100g || 0,
            fatsPer100g: item.fatsPer100g || 0,
            carbsPer100g: item.carbsPer100g || 0,
            addedManually: item.addedManually || false,
          })),
        });

        // Пересчитываем суммарные значения
        const totals = calculateTotalNutrition(body.foodItems);
        updateData.totalCalories = totals.calories;
        updateData.totalProtein = totals.protein;
        updateData.totalFats = totals.fats;
        updateData.totalCarbs = totals.carbs;
      }

      // Обновляем meal
      const updated = await tx.meal.update({
        where: { id: mealId },
        data: updateData,
        include: {
          foodItems: true,
        },
      });

      // Обновляем DailyLog для этой даты
      await updateDailyLog(tx as unknown as typeof prisma, userId, updated.date);

      return updated;
    });

    return NextResponse.json(
      {
        meal: updatedMeal,
        message: "Meal успешно обновлен",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Meal update error:", error);
    return NextResponse.json({ error: "Ошибка при обновлении meal" }, { status: 500 });
  }
}

/**
 * DELETE /api/meals/[id]
 * Удаление meal и всех его food items
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { id: mealId } = await params;

    // Проверяем существование meal и права доступа
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
    });

    if (!meal) {
      return NextResponse.json({ error: "Meal не найден" }, { status: 404 });
    }

    if (meal.userId !== userId) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    // Удаляем meal и обновляем DailyLog в транзакции
    await prisma.$transaction(async (tx) => {
      const mealDate = meal.date;

      // Удаляем meal (food items удалятся автоматически через CASCADE)
      await tx.meal.delete({
        where: { id: mealId },
      });

      // Обновляем или удаляем DailyLog
      await deleteDailyLogIfEmpty(tx as unknown as typeof prisma, userId, mealDate);
    });

    return NextResponse.json({ message: "Meal успешно удален" }, { status: 200 });
  } catch (error) {
    console.error("Meal deletion error:", error);
    return NextResponse.json({ error: "Ошибка при удалении meal" }, { status: 500 });
  }
}
