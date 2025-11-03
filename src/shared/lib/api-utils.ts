/**
 * API Utilities
 * Вспомогательные функции для работы с API
 */

import { AxiosError } from "axios";
import { ApiError, ApiResponse } from "@/shared/api/types";

/**
 * Извлечение сообщения об ошибке из Axios error
 */
export function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    // Ошибка от сервера (API response)
    if (error.response?.data) {
      const apiError = error.response.data as ApiError;
      return apiError.message || apiError.error || "Произошла ошибка на сервере";
    }

    // Network error
    if (error.request && !error.response) {
      return "Ошибка сети. Проверьте подключение к интернету.";
    }

    // Другие ошибки Axios
    return error.message || "Неизвестная ошибка";
  }

  // Generic error
  if (error instanceof Error) {
    return error.message;
  }

  return "Произошла неизвестная ошибка";
}

/**
 * Форматирование успешного ответа API
 */
export function formatSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    message,
    success: true,
  };
}

/**
 * Форматирование ошибки API
 */
export function formatErrorResponse(
  error: string,
  message: string,
  statusCode: number = 500,
  details?: Record<string, unknown>
): ApiError {
  return {
    error,
    message,
    statusCode,
    details,
  };
}

/**
 * Проверка, является ли ошибка API ошибкой
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    "message" in error &&
    "statusCode" in error
  );
}

/**
 * Получение HTTP статус кода из ошибки
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof AxiosError && error.response) {
    return error.response.status;
  }

  if (isApiError(error)) {
    return error.statusCode;
  }

  return 500; // Default Internal Server Error
}

/**
 * Проверка, является ли код статуса успешным (2xx)
 */
export function isSuccessStatus(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}

/**
 * Проверка, является ли код статуса ошибкой клиента (4xx)
 */
export function isClientError(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500;
}

/**
 * Проверка, является ли код статуса ошибкой сервера (5xx)
 */
export function isServerError(statusCode: number): boolean {
  return statusCode >= 500 && statusCode < 600;
}

/**
 * Создание query string из объекта параметров
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Задержка выполнения (для retry логики)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry функция с экспоненциальной задержкой
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Не повторять, если это client error (4xx)
      const statusCode = getErrorStatusCode(error);
      if (isClientError(statusCode)) {
        throw error;
      }

      // Задержка перед следующей попыткой (экспоненциальная)
      if (attempt < maxRetries - 1) {
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}
