// API route для запуска анализа фотографии
// T063: Photo analysis API orchestrating OpenRouter API call

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/shared/lib/prisma";
import { analyzeFoodPhoto } from "@/shared/api/openrouter";
import { PhotoStatus } from "@/entities/photo/model/types";

export async function POST(request: NextRequest) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { photoId } = await request.json();

    if (!photoId) {
      return NextResponse.json({ error: "photoId обязателен" }, { status: 400 });
    }

    // Проверка существования фотографии и прав доступа
    const photo = await prisma.foodPhoto.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      return NextResponse.json({ error: "Фотография не найдена" }, { status: 404 });
    }

    if (photo.userId !== userId) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    // Запуск анализа через OpenRouter API
    try {
      const recognizedItems = await analyzeFoodPhoto(photo.storageUrl);

      // Обновление статуса на COMPLETED
      await prisma.foodPhoto.update({
        where: { id: photoId },
        data: {
          processingStatus: PhotoStatus.COMPLETED,
        },
      });

      return NextResponse.json(
        {
          photoId,
          processingStatus: PhotoStatus.COMPLETED,
          recognizedItems,
        },
        { status: 200 }
      );
    } catch (error) {
      // Обновление статуса на FAILED при ошибке
      await prisma.foodPhoto.update({
        where: { id: photoId },
        data: {
          processingStatus: PhotoStatus.FAILED,
        },
      });

      return NextResponse.json(
        {
          photoId,
          processingStatus: PhotoStatus.FAILED,
          error: "Не удалось распознать продукты на фотографии",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Photo analysis error:", error);
    return NextResponse.json({ error: "Ошибка при анализе фотографии" }, { status: 500 });
  }
}
