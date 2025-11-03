// API route для поиска продуктов в базе USDA
// T079: USDA food search API endpoint

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { searchFoodNutrition } from "@/shared/api/usda-food-api";

export async function GET(request: NextRequest) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "query параметр обязателен" }, { status: 400 });
    }

    // Поиск в USDA API
    const results = await searchFoodNutrition(query);

    return NextResponse.json(
      {
        results,
        count: results.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Food search error:", error);
    return NextResponse.json({ error: "Ошибка при поиске продуктов" }, { status: 500 });
  }
}
