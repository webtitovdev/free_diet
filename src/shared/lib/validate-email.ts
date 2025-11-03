/**
 * Email Validation Utility
 * Утилита для валидации email адресов
 */

/**
 * RFC 5322 compliant email regex (упрощенная версия)
 * Валидирует большинство корректных email адресов
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Строгая валидация email согласно RFC 5322
 */
const STRICT_EMAIL_REGEX =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

/**
 * Валидирует email адрес (простая проверка)
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  // Убираем пробелы
  const trimmedEmail = email.trim();

  // Проверяем базовый формат
  return EMAIL_REGEX.test(trimmedEmail);
}

/**
 * Строгая валидация email (RFC 5322 compliant)
 */
export function validateEmailStrict(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  const trimmedEmail = email.trim().toLowerCase();
  return STRICT_EMAIL_REGEX.test(trimmedEmail);
}

/**
 * Возвращает сообщение об ошибке валидации email
 */
export function getEmailValidationError(email: string): string | null {
  if (!email || email.trim() === "") {
    return "Email обязателен для заполнения";
  }

  if (email.trim().length < 3) {
    return "Email слишком короткий";
  }

  if (email.trim().length > 254) {
    return "Email слишком длинный (максимум 254 символа)";
  }

  if (!email.includes("@")) {
    return "Email должен содержать символ @";
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return "Email должен содержать только один символ @";
  }

  const [localPart, domainPart] = parts;

  if (!localPart || localPart.length === 0) {
    return "Часть email перед @ не может быть пустой";
  }

  if (!domainPart || domainPart.length === 0) {
    return "Часть email после @ не может быть пустой";
  }

  if (!domainPart.includes(".")) {
    return "Домен email должен содержать точку";
  }

  if (!validateEmail(email)) {
    return "Неверный формат email адреса";
  }

  return null; // Email валиден
}

/**
 * Нормализует email (приводит к нижнему регистру, убирает пробелы)
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }

  return email.trim().toLowerCase();
}

/**
 * Проверяет, является ли email временным/одноразовым
 * (упрощенная проверка по списку популярных сервисов)
 */
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    "tempmail.com",
    "guerrillamail.com",
    "10minutemail.com",
    "mailinator.com",
    "throwaway.email",
    "temp-mail.org",
  ];

  const normalizedEmail = normalizeEmail(email);
  const domain = normalizedEmail.split("@")[1];

  return disposableDomains.includes(domain);
}

/**
 * Извлекает домен из email
 */
export function getEmailDomain(email: string): string {
  const normalizedEmail = normalizeEmail(email);
  const parts = normalizedEmail.split("@");

  if (parts.length !== 2) {
    return "";
  }

  return parts[1];
}

/**
 * Маскирует email для безопасного отображения (например, u***@example.com)
 */
export function maskEmail(email: string): string {
  const normalizedEmail = normalizeEmail(email);
  const parts = normalizedEmail.split("@");

  if (parts.length !== 2) {
    return email;
  }

  const [localPart, domainPart] = parts;

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domainPart}`;
  }

  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domainPart}`;
}
