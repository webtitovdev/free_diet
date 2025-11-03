// API route для загрузки фотографии еды
// T059 + T060: Photo upload с Vercel Blob integration и HEIC конверсией

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import sharp from "sharp";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { uploadFoodPhoto } from "@/shared/lib/storage/blob-client";
import { PhotoStatus } from "@/entities/photo/model/types";

export async function POST(request: NextRequest) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Проверяем, существует ли пользователь в БД
    // Это нужно на случай, если БД была очищена, но сессия осталась
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      console.error("User from session not found in DB:", userId);
      console.error("This likely means the database was reset but the JWT session is still valid");
      return NextResponse.json(
        {
          error: "Сессия устарела. Пожалуйста, выйдите и войдите заново.",
          code: "USER_NOT_FOUND",
        },
        { status: 401 }
      );
    }

    // Получение файла из FormData
    const formData = await request.formData();
    const file = formData.get("photo") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл не предоставлен" }, { status: 400 });
    }

    // Валидация размера файла (FR-021: 10 MB max)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        {
          error: `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)}MB). Максимум: 10MB`,
        },
        { status: 400 }
      );
    }

    // Конвертация файла в Buffer
    let buffer = Buffer.from(await file.arrayBuffer());

    // HEIC → JPEG конверсия если требуется (T060)
    if (file.type === "image/heic" || file.type === "image/heif" || file.name.endsWith(".heic")) {
      try {
        buffer = Buffer.from(await sharp(buffer).jpeg({ quality: 85 }).toBuffer());
      } catch (error) {
        console.error("HEIC conversion failed:", error);
        return NextResponse.json({ error: "Ошибка конверсии HEIC формата" }, { status: 400 });
      }
    }

    // Загрузка в Vercel Blob (с автоматическим удалением через 30 дней)
    const { url, autoDeleteAt } = await uploadFoodPhoto(buffer, userId, file.name);

    // Создание записи в БД
    const foodPhoto = await prisma.foodPhoto.create({
      data: {
        userId,
        storageUrl: url,
        uploadedAt: new Date(),
        autoDeleteAt,
        processingStatus: PhotoStatus.PROCESSING, // Начинаем обработку
      },
    });

    return NextResponse.json(
      {
        photoId: foodPhoto.id,
        storageUrl: url,
        processingStatus: foodPhoto.processingStatus,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json({ error: "Ошибка при загрузке фотографии" }, { status: 500 });
  }
}
