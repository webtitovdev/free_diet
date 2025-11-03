// API routes для управления профилем пользователя
// T100: Create profile creation API route in src/app/api/profile/route.ts POST
// T101: Create profile update API route in src/app/api/profile/route.ts PATCH
// T102: Create profile retrieval API route in src/app/api/profile/route.ts GET
// Spec: §US4, §FR-015 to §FR-017, contracts/profile.yaml

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { ProfileInput, Gender, GoalType } from "@/entities/profile/model/types";
import {
  validateProfileInput,
  validateProfileUpdate,
} from "@/entities/profile/lib/validate-profile";
import { calculateTargetCalories } from "@/entities/profile/lib/calculate-calories";

/**
 * GET /api/profile
 * Получение профиля текущего пользователя
 *
 * @returns 200 + profile data | 404 если профиль не создан | 401 если не авторизован
 */
export async function GET() {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Поиск профиля
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Профиль не найден. Пожалуйста, создайте ваш профиль." },
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Ошибка при получении профиля" }, { status: 500 });
  }
}

/**
 * POST /api/profile
 * Создание профиля пользователя с расчетом целевой калорийности
 *
 * Body: { weight, age, gender, height, goal }
 * @returns 201 + created profile | 400 validation error | 409 if profile exists | 401 unauthorized
 */
export async function POST(request: NextRequest) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body: ProfileInput = await request.json();

    // Валидация входных данных
    const validation = validateProfileInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(", ") }, { status: 400 });
    }

    // Проверка существования профиля
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Профиль уже существует. Используйте PATCH для обновления." },
        { status: 409 }
      );
    }

    // Расчет целевой калорийности по формуле Mifflin-St Jeor
    const targetCalories = calculateTargetCalories(
      body.weight,
      body.height,
      body.age,
      body.gender,
      body.goal
    );

    // Создание профиля
    const profile = await prisma.userProfile.create({
      data: {
        userId,
        weight: body.weight,
        age: body.age,
        gender: body.gender,
        height: body.height,
        goal: body.goal,
        targetCalories,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Ошибка при создании профиля" }, { status: 500 });
  }
}

/**
 * PATCH /api/profile
 * Обновление профиля пользователя с пересчетом калорийности
 *
 * Body: Partial<{ weight, age, gender, height, goal }>
 * @returns 200 + updated profile | 400 validation error | 404 if profile not found | 401 unauthorized
 */
export async function PATCH(request: NextRequest) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body: Partial<ProfileInput> = await request.json();

    // Валидация обновления
    const validation = validateProfileUpdate(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(", ") }, { status: 400 });
    }

    // Получение существующего профиля
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 });
    }

    // Объединение существующих данных с обновлениями
    const updatedData = {
      weight: body.weight ?? existingProfile.weight,
      age: body.age ?? existingProfile.age,
      gender: (body.gender ?? existingProfile.gender) as Gender,
      height: body.height ?? existingProfile.height,
      goal: (body.goal ?? existingProfile.goal) as GoalType,
    };

    // Пересчет калорийности (если изменились параметры, влияющие на расчет)
    const targetCalories = calculateTargetCalories(
      updatedData.weight,
      updatedData.height,
      updatedData.age,
      updatedData.gender,
      updatedData.goal
    );

    // Обновление профиля
    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data: {
        ...updatedData,
        targetCalories,
      },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Ошибка при обновлении профиля" }, { status: 500 });
  }
}

/**
 * DELETE /api/profile
 * Удаление профиля пользователя
 *
 * @returns 204 no content | 404 if profile not found | 401 unauthorized
 */
export async function DELETE() {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Удаление профиля
    await prisma.userProfile.delete({
      where: { userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    // Проверка на ошибку "профиль не найден"
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 });
    }

    console.error("Profile DELETE error:", error);
    return NextResponse.json({ error: "Ошибка при удалении профиля" }, { status: 500 });
  }
}
