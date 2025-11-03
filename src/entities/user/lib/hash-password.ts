// Хеширование и проверка паролей с использованием bcrypt
// T040: salt rounds = 10

import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Хеширует пароль с использованием bcrypt
 * @param password Пароль в открытом виде
 * @returns Хешированный пароль
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Проверяет соответствие пароля хешу
 * @param password Пароль в открытом виде
 * @param hashedPassword Хешированный пароль из БД
 * @returns true если пароль совпадает
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
