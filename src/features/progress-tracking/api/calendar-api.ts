/**
 * Calendar API Client
 *
 * HTTP клиент для взаимодействия с calendar API endpoints.
 * Использует Axios для запросов (Принцип VI - Axios для HTTP).
 *
 * @module features/progress-tracking/api/calendar-api
 */

import { apiClient } from "@/shared/api/client";
import type { MonthData, DayDetails } from "@/entities/daily-log/model/types";

/**
 * Получает данные календаря за месяц.
 * Spec: §FR-018, §SC-009 (должно завершиться < 2s)
 *
 * @param year - Год (например, 2025)
 * @param month - Месяц 1-12 (например, 11 для ноября)
 * @returns Promise с данными месяца
 * @throws Error если запрос не удался
 */
export async function getMonthData(year: number, month: number): Promise<MonthData> {
  try {
    const response = await apiClient.get<MonthData>("/calendar", {
      params: {
        year,
        month,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching month data:", error);
    throw new Error("Не удалось загрузить данные календаря. Попробуйте позже.");
  }
}

/**
 * Получает детальную информацию о конкретном дне.
 * Spec: §FR-020
 *
 * @param date - Дата в формате Date
 * @returns Promise с деталями дня
 * @throws Error если запрос не удался
 */
export async function getDayDetails(date: Date): Promise<DayDetails> {
  try {
    // Форматируем дату в YYYY-MM-DD
    const dateStr = formatDateForAPI(date);

    const response = await apiClient.get<DayDetails>(`/calendar/${dateStr}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching day details:", error);
    throw new Error("Не удалось загрузить детали дня. Попробуйте позже.");
  }
}

/**
 * Форматирует Date объект в строку YYYY-MM-DD для API.
 *
 * @param date - Date объект
 * @returns Строка в формате YYYY-MM-DD
 */
function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Интегрированные функции с store для упрощения использования
 */
import { useCalendarStore } from "../model/calendar-store";

/**
 * Загружает данные месяца и обновляет store.
 *
 * @param year - Год
 * @param month - Месяц 1-12
 */
export async function fetchAndSetMonthData(year: number, month: number): Promise<void> {
  const store = useCalendarStore.getState();

  store.setLoadingMonth(true);
  store.setMonthError(null);

  try {
    const data = await getMonthData(year, month);
    store.setMonthData(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка при загрузке календаря";
    store.setMonthError(errorMessage);
  } finally {
    store.setLoadingMonth(false);
  }
}

/**
 * Загружает детали дня и обновляет store.
 *
 * @param date - Дата
 */
export async function fetchAndSetDayDetails(date: Date): Promise<void> {
  const store = useCalendarStore.getState();

  store.setLoadingDay(true);
  store.setDayError(null);

  try {
    const details = await getDayDetails(date);
    store.setDayDetails(details);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка при загрузке деталей дня";
    store.setDayError(errorMessage);
  } finally {
    store.setLoadingDay(false);
  }
}
