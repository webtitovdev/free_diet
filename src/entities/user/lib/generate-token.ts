// Генерация токена верификации email
// T035: UUID v4, 24h expiry

import { randomUUID } from "crypto";
import type { VerificationToken } from "../model/types";

/**
 * Генерирует токен верификации email с 24-часовым сроком действия
 * @returns Объект с токеном и датой истечения
 */
export function generateVerificationToken(): VerificationToken {
  const token = randomUUID(); // UUID v4
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 часа

  return {
    token,
    expiresAt,
  };
}

/**
 * Проверяет, истек ли токен
 * @param expiresAt Дата истечения токена
 * @returns true если токен истек
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
