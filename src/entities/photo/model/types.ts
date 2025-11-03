// Типы для FoodPhoto entity
// T055: FoodPhoto entity model types (PhotoStatus enum)

/**
 * Статус обработки фотографии
 */
export enum PhotoStatus {
  UPLOADING = "UPLOADING", // Загрузка в процессе
  PROCESSING = "PROCESSING", // Анализ OpenRouter API
  COMPLETED = "COMPLETED", // Анализ завершен, результаты доступны
  FAILED = "FAILED", // Ошибка обработки (низкое качество, еда не обнаружена, ошибка API)
}

/**
 * Фотография еды
 */
export interface FoodPhoto {
  id: string;
  userId: string;
  storageUrl: string; // URL в Vercel Blob storage
  uploadedAt: Date;
  autoDeleteAt: Date; // uploadedAt + 30 дней (FR-005a)
  processingStatus: PhotoStatus;
}

/**
 * Данные для создания фотографии
 */
export interface CreateFoodPhotoData {
  userId: string;
  storageUrl: string;
  autoDeleteAt: Date;
}

/**
 * Данные для обновления статуса фотографии
 */
export interface UpdatePhotoStatusData {
  processingStatus: PhotoStatus;
}
