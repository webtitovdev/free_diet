// API route для верификации email по токену
// T039: Email verification с tokenExpiresAt validation (FR-003a, FR-004)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { isTokenExpired } from "@/entities/user/lib/generate-token";

export async function GET(request: NextRequest) {
  try {
    // Получение токена из query параметров
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Токен верификации отсутствует" }, { status: 400 });
    }

    // Поиск пользователя по токену
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: "Неверный токен верификации" }, { status: 400 });
    }

    // Проверка, верифицирован ли уже email
    if (user.emailVerified) {
      return NextResponse.json(
        {
          message: "Email уже был верифицирован ранее. Вы можете войти в систему.",
        },
        { status: 200 }
      );
    }

    // КРИТИЧНО (FR-003a): Проверка истечения токена (24h TTL)
    if (!user.tokenExpiresAt || isTokenExpired(user.tokenExpiresAt)) {
      return NextResponse.json(
        {
          error: "Ссылка верификации истекла. Пожалуйста, запросите новую ссылку через профиль.",
        },
        { status: 400 }
      );
    }

    // Верификация email: установить emailVerified и очистить токен
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        tokenExpiresAt: null,
      },
    });

    return NextResponse.json(
      {
        message: "Email успешно верифицирован! Теперь вы можете войти в систему.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Ошибка при верификации email. Пожалуйста, попробуйте снова." },
      { status: 500 }
    );
  }
}
