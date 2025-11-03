// API route для проверки статуса обработки фотографии
// T065: Photo status polling API route

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/shared/lib/prisma";

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

    return NextResponse.json(
      {
        photoId: photo.id,
        processingStatus: photo.processingStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Photo status check error:", error);
    return NextResponse.json({ error: "Ошибка при проверке статуса" }, { status: 500 });
  }
}
