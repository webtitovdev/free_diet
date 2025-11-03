// Типы для User entity
// Соответствует Prisma schema и data-model.md

import { AuthMethod as PrismaAuthMethod } from "@prisma/client";

/**
 * Метод аутентификации пользователя
 * Используем тип из Prisma для совместимости
 */
export type AuthMethod = PrismaAuthMethod;

/**
 * Константы для методов аутентификации
 */
export const AuthMethod = {
  GOOGLE: "GOOGLE" as const,
  EMAIL_PASSWORD: "EMAIL_PASSWORD" as const,
} as const;

/**
 * Базовая информация о пользователе
 */
export interface User {
  id: string;
  email: string;
  emailVerified: Date | null;
  hashedPassword: string | null; // null для Google OAuth
  authMethod: AuthMethod;
  verificationToken: string | null;
  tokenExpiresAt: Date | null;
  createdAt: Date;
}

/**
 * Данные для создания нового пользователя (email/password)
 */
export interface CreateUserData {
  email: string;
  password: string; // plain text, будет захеширован
}

/**
 * Данные для создания пользователя через Google OAuth
 */
export interface CreateGoogleUserData {
  email: string;
  emailVerified: Date;
}

/**
 * Данные сессии пользователя (для NextAuth)
 */
export interface UserSession {
  id: string;
  email: string;
  emailVerified: boolean;
  authMethod: AuthMethod;
}

/**
 * Токен верификации email
 */
export interface VerificationToken {
  token: string;
  expiresAt: Date;
}
