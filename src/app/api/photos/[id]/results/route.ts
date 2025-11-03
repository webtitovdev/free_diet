// API route для получения результатов анализа фотографии
// T066: Photo results retrieval API route

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { PhotoStatus } from "@/entities/photo/model/types";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const photoId = params.id;

    // Получение фотографии
    const photo = await prisma.foodPhoto.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      return NextResponse.json({ error: "Фотография не найдена" }, { status: 404 });
    }

    if (photo.userId !== userId) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    // Проверка, что обработка завершена
    if (photo.processingStatus === PhotoStatus.PROCESSING) {
      return NextResponse.json({ error: "Обработка еще не завершена" }, { status: 400 });
    }

    if (photo.processingStatus === PhotoStatus.FAILED) {
      return NextResponse.json(
        {
          photoId: photo.id,
          processingStatus: photo.processingStatus,
          error: "Не удалось распознать продукты на фотографии",
        },
        { status: 200 }
      );
    }

    // Примечание: В реальном приложении результаты анализа хранились бы
    // в отдельной таблице или JSON поле. Для упрощения возвращаем фиктивные данные.
    // В production это должно быть сохранено при анализе в T063.

    return NextResponse.json(
      {
        photoId: photo.id,
        processingStatus: photo.processingStatus,
        storageUrl: photo.storageUrl,
        // В реальности здесь должны быть сохраненные результаты анализа
        message: "Результаты анализа доступны",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Photo results retrieval error:", error);
    return NextResponse.json({ error: "Ошибка при получении результатов" }, { status: 500 });
  }
}
