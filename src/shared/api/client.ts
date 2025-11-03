/**
 * Axios Client Instance
 * Настроенный HTTP клиент с interceptors для обработки auth токенов и ошибок
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Создаем instance Axios с базовыми настройками
export const apiClient = axios.create({
  baseURL: "/api", // Next.js API routes
  timeout: 30000, // 30 секунд timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - добавляем auth токен к каждому запросу
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: После интеграции NextAuth.js, добавить получение session token
    // const token = getSessionToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обрабатываем ошибки глобально
apiClient.interceptors.response.use(
  (response) => {
    // Успешный ответ - возвращаем как есть
    return response;
  },
  (error: AxiosError) => {
    // Обработка ошибок
    if (error.response) {
      // Сервер вернул ошибку (4xx, 5xx)
      switch (error.response.status) {
        case 401:
          // Unauthorized - редирект на страницу логина
          console.error("Unauthorized - redirecting to login");
          // TODO: После интеграции NextAuth.js, добавить redirect
          // window.location.href = '/auth/login';
          break;
        case 403:
          // Forbidden
          console.error("Forbidden - insufficient permissions");
          break;
        case 404:
          // Not Found
          console.error("Resource not found");
          break;
        case 429:
          // Rate limit exceeded
          console.error("Rate limit exceeded - please try again later");
          break;
        case 500:
        case 502:
        case 503:
          // Server errors
          console.error("Server error - please try again later");
          break;
        default:
          console.error("API error:", error.response.data);
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответ не получен (network error)
      console.error("Network error - check your internet connection");
    } else {
      // Ошибка при настройке запроса
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
