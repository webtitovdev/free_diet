/**
 * Common API Types
 * Общие типы для работы с API endpoints
 */

/**
 * Стандартный формат ответа от API
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Формат ошибки от API
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

/**
 * Пагинированный ответ от API
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Параметры пагинации для запросов
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Параметры фильтрации
 */
export interface FilterParams {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * HTTP методы
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Статусы запросов (для UI state management)
 */
export type RequestStatus = "idle" | "loading" | "success" | "error";
