// Storage client с поддержкой локальной разработки и Vercel Blob для production
// T057 + T057a: Vercel Blob configuration с expires parameter (FR-005a)

import { put, del } from "@vercel/blob";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// 30 дней в миллисекундах (FR-005a: automatic deletion)
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Проверка, работаем ли мы локально или на Vercel
const isProduction = process.env.VERCEL === "1";
const useVercelBlob = isProduction && !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Загружает фото еды в storage (Vercel Blob для production, локальная папка для development)
 * @param file File buffer или Blob
 * @param userId ID пользователя для организации файлов
 * @param filename Имя файла
 * @returns URL загруженного файла и дата автоматического удаления
 */
export async function uploadFoodPhoto(
  file: Buffer | Blob,
  userId: string,
  filename: string
): Promise<{ url: string; autoDeleteAt: Date }> {
  const autoDeleteAt = new Date(Date.now() + THIRTY_DAYS_MS);

  if (useVercelBlob) {
    // Production: используем Vercel Blob
    const blob = await put(`photos/${userId}/${Date.now()}-${filename}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      url: blob.url,
      autoDeleteAt,
    };
  } else {
    // Development: сохраняем локально в public/uploads
    const buffer = file instanceof Buffer ? file : Buffer.from(await (file as Blob).arrayBuffer());
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const relativePath = `uploads/photos/${userId}`;
    const publicDir = join(process.cwd(), "public", relativePath);
    const filePathOnDisk = join(publicDir, `${timestamp}-${sanitizedFilename}`);

    // Создаем директорию если не существует
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    // Сохраняем файл
    await writeFile(filePathOnDisk, buffer);

    // Возвращаем публичный URL
    const url = `/${relativePath}/${timestamp}-${sanitizedFilename}`;

    return {
      url,
      autoDeleteAt,
    };
  }
}

/**
 * Удаляет фото из storage (Vercel Blob или локальная папка)
 * @param url URL файла в storage
 */
export async function deleteFoodPhoto(url: string): Promise<void> {
  if (useVercelBlob) {
    // Production: удаляем из Vercel Blob
    await del(url);
  } else {
    // Development: удаляем локальный файл
    try {
      const filePath = join(process.cwd(), "public", url);
      await unlink(filePath);
    } catch (error) {
      console.error("Failed to delete local file:", error);
    }
  }
}
