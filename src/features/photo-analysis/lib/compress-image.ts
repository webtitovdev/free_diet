// Client-side image compression перед загрузкой
// T058: Image compression using browser-image-compression

import imageCompression from "browser-image-compression";

/**
 * Сжимает изображение перед загрузкой для ускорения upload
 * @param file Исходный файл изображения
 * @returns Сжатый файл
 */
export async function compressPhotoBeforeUpload(file: File): Promise<File> {
  const options = {
    maxSizeMB: 5, // Максимум 5MB (спека позволяет 10MB, но сжимаем для скорости)
    maxWidthOrHeight: 1920, // Достаточно для распознавания еды
    useWebWorker: true, // Использовать Web Worker для performance
    fileType: "image/jpeg", // Нормализация в JPEG
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(
      `Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
    );
    return compressedFile;
  } catch (error) {
    console.error("Compression failed, using original:", error);
    // Fallback к оригинальному файлу если сжатие не удалось
    return file;
  }
}

/**
 * Валидирует размер файла перед загрузкой (FR-021: 10 MB max)
 * @param file Файл для валидации
 * @returns true если размер допустимый
 */
export function validateFileSize(file: File): { valid: boolean; error?: string } {
  const maxSizeMB = 10;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)}MB). Максимальный размер: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Валидирует тип файла (только изображения)
 * @param file Файл для валидации
 * @returns true если тип допустимый
 */
export function validateFileType(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"];

  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Недопустимый формат файла. Поддерживаются: JPG, PNG, HEIC",
    };
  }

  return { valid: true };
}
