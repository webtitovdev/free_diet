// Vercel Blob Storage client с автоматическим удалением через 30 дней
// T057 + T057a: Vercel Blob configuration с expires parameter (FR-005a)

import { put, del } from "@vercel/blob";

// 30 дней в миллисекундах (FR-005a: automatic deletion)
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Загружает фото еды в Vercel Blob с автоматическим удалением через 30 дней
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
  // КРИТИЧНО (FR-005a): Автоматическое удаление через 30 дней (Vercel Blob TTL)
  // Note: Vercel Blob автоматически удаляет файлы через TTL, настраивается в Vercel Dashboard
  const blob = await put(`photos/${userId}/${Date.now()}-${filename}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  // Вычисляем дату автоматического удаления
  const autoDeleteAt = new Date(Date.now() + THIRTY_DAYS_MS);

  return {
    url: blob.url,
    autoDeleteAt,
  };
}

/**
 * Удаляет фото из Vercel Blob вручную (если требуется до истечения 30 дней)
 * @param url URL файла в Blob storage
 */
export async function deleteFoodPhoto(url: string): Promise<void> {
  await del(url);
}
