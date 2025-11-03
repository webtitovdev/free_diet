// Auth API methods с использованием Axios
// T044: Auth API (register, login, verifyEmail)

import axios from "axios";
import { UserSession } from "@/entities/user/model/types";

const API_BASE = "/api/auth";

/**
 * Данные для регистрации
 */
export interface RegisterData {
  email: string;
  password: string;
}

/**
 * Данные для логина
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Ответ при регистрации
 */
export interface RegisterResponse {
  message: string;
  userId: string;
}

/**
 * Ответ при логине
 */
export interface LoginResponse {
  user: UserSession;
  accessToken: string;
}

/**
 * Ответ при верификации email
 */
export interface VerifyEmailResponse {
  message: string;
}

/**
 * Регистрация нового пользователя
 */
export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await axios.post<RegisterResponse>(`${API_BASE}/register`, data);
  return response.data;
}

/**
 * Верификация email по токену
 */
export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  const response = await axios.get<VerifyEmailResponse>(`${API_BASE}/verify-email?token=${token}`);
  return response.data;
}

/**
 * Получение текущей сессии
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const response = await axios.get<{ user: UserSession }>(`${API_BASE}/session`);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null; // Не авторизован
    }
    throw error;
  }
}

/**
 * Повторная отправка verification email
 */
export async function resendVerificationEmail(email: string): Promise<{ message: string }> {
  const response = await axios.post<{ message: string }>(`${API_BASE}/resend-verification`, {
    email,
  });
  return response.data;
}
