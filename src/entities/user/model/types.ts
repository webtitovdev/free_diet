// Типы для User entity
// Соответствует Prisma schema и data-model.md

/**
 * Метод аутентификации пользователя
 */
export enum AuthMethod {
  GOOGLE = "GOOGLE", // Google OAuth
  EMAIL_PASSWORD = "EMAIL_PASSWORD", // Email + Password
}

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
