// Логика предложения категории приема пищи на основе времени
// T084: Implement meal category suggestion logic (time-based: breakfast/lunch/dinner/snack)

import { MealCategory } from "../model/types";

/**
 * Предлагает категорию приема пищи на основе времени дня
 *
 * Per FR-012, использует client-side timezone:
 * 1. Клиент отправляет meal creation request с `clientTimezoneOffset` (например, -180 для UTC+3)
 * 2. Сервер вычисляет локальный час: localHour = new Date().getUTCHours() + (clientTimezoneOffset / 60)
 * 3. Предлагает категорию:
 *    - 6-11h = BREAKFAST
 *    - 11-16h = LUNCH
 *    - 16-21h = DINNER
 *    - другое время = SNACK
 *
 * @param clientTimezoneOffset Смещение часового пояса клиента в минутах (например, -180 для UTC+3)
 * @returns Предлагаемая категория приема пищи
 */
export function suggestMealCategory(clientTimezoneOffset?: number): MealCategory {
  const now = new Date();

  // Если clientTimezoneOffset не предоставлен, используем UTC+0 (сервер)
  const offset = clientTimezoneOffset !== undefined ? clientTimezoneOffset : 0;

  // Вычисляем локальный час клиента
  const utcHours = now.getUTCHours();
  const localHour = utcHours + offset / 60;

  // Нормализуем час в диапазон 0-23
  const normalizedHour = ((localHour % 24) + 24) % 24;

  // Определяем категорию на основе времени
  if (normalizedHour >= 6 && normalizedHour < 11) {
    return MealCategory.BREAKFAST;
  } else if (normalizedHour >= 11 && normalizedHour < 16) {
    return MealCategory.LUNCH;
  } else if (normalizedHour >= 16 && normalizedHour < 21) {
    return MealCategory.DINNER;
  } else {
    return MealCategory.SNACK;
  }
}

/**
 * Получает смещение часового пояса из объекта Date
 * Используется на клиенте для получения clientTimezoneOffset
 *
 * @returns Смещение в минутах (например, -180 для UTC+3)
 */
export function getClientTimezoneOffset(): number {
  return -new Date().getTimezoneOffset();
}

/**
 * Форматирует смещение часового пояса в читаемую строку
 * @param offset Смещение в минутах
 * @returns Строка вида "UTC+3" или "UTC-5"
 */
export function formatTimezoneOffset(offset: number): string {
  const hours = Math.abs(offset / 60);
  const sign = offset >= 0 ? "+" : "-";
  return `UTC${sign}${hours}`;
}

/**
 * Проверяет, является ли время подходящим для указанной категории
 * Используется для валидации или UI подсказок
 *
 * @param category Категория приема пищи
 * @param clientTimezoneOffset Смещение часового пояса клиента в минутах
 * @returns true если текущее время соответствует категории
 */
export function isTimeAppropriateForCategory(
  category: MealCategory,
  clientTimezoneOffset?: number
): boolean {
  const suggested = suggestMealCategory(clientTimezoneOffset);
  return suggested === category;
}
