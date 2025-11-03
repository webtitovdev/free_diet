// Auth feature store с использованием Zustand
// T043: Auth store (login, logout, session state)

import { create } from "zustand";
import { UserSession } from "@/entities/user/model/types";

interface AuthState {
  // Состояние
  user: UserSession | null;
  isLoading: boolean;
  error: string | null;

  // Действия
  setUser: (user: UserSession | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

/**
 * Auth store для управления состоянием аутентификации
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Начальное состояние
  user: null,
  isLoading: false,
  error: null,

  // Установить пользователя после успешного login
  setUser: (user) =>
    set({
      user,
      error: null,
    }),

  // Установить состояние загрузки
  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  // Установить ошибку
  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  // Очистить ошибку
  clearError: () =>
    set({
      error: null,
    }),

  // Выход из системы
  logout: () =>
    set({
      user: null,
      error: null,
      isLoading: false,
    }),
}));

// Селекторы для оптимизации re-renders
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.user !== null;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;
