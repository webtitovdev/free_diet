// Валидация данных профиля пользователя
// Spec: research.md R006, data-model.md validation rules

import { ProfileInput, ProfileValidationResult } from "../model/types";

/**
 * Правила валидации параметров профиля
 * Источник: research.md R006, data-model.md
 */
export const PROFILE_VALIDATION_RULES = {
  weight: {
    min: 30,
    max: 300,
    unit: "кг",
    description: "Разумный диапазон веса человека",
  },
  height: {
    min: 100,
    max: 250,
    unit: "см",
    description: "Разумный диапазон роста человека",
  },
  age: {
    min: 10,
    max: 120,
    unit: "лет",
    description: "Возрастной диапазон для использования приложения",
  },
} as const;

/**
 * Валидация входных данных профиля
 *
 * Проверяет:
 * - Вес: 30-300 кг
 * - Рост: 100-250 см
 * - Возраст: 10-120 лет
 * - Наличие всех обязательных полей
 *
 * @param input - Данные профиля для валидации
 * @returns Результат валидации с массивом ошибок
 */
export function validateProfileInput(input: ProfileInput): ProfileValidationResult {
  const errors: string[] = [];

  // Валидация веса
  if (
    input.weight < PROFILE_VALIDATION_RULES.weight.min ||
    input.weight > PROFILE_VALIDATION_RULES.weight.max
  ) {
    errors.push(
      `Вес должен быть от ${PROFILE_VALIDATION_RULES.weight.min} до ${PROFILE_VALIDATION_RULES.weight.max} ${PROFILE_VALIDATION_RULES.weight.unit}`
    );
  }

  // Валидация роста
  if (
    input.height < PROFILE_VALIDATION_RULES.height.min ||
    input.height > PROFILE_VALIDATION_RULES.height.max
  ) {
    errors.push(
      `Рост должен быть от ${PROFILE_VALIDATION_RULES.height.min} до ${PROFILE_VALIDATION_RULES.height.max} ${PROFILE_VALIDATION_RULES.height.unit}`
    );
  }

  // Валидация возраста
  if (
    input.age < PROFILE_VALIDATION_RULES.age.min ||
    input.age > PROFILE_VALIDATION_RULES.age.max
  ) {
    errors.push(
      `Возраст должен быть от ${PROFILE_VALIDATION_RULES.age.min} до ${PROFILE_VALIDATION_RULES.age.max} ${PROFILE_VALIDATION_RULES.age.unit}`
    );
  }

  // Проверка на NaN и отрицательные значения
  if (isNaN(input.weight) || input.weight <= 0) {
    errors.push("Вес должен быть положительным числом");
  }

  if (isNaN(input.height) || input.height <= 0) {
    errors.push("Рост должен быть положительным числом");
  }

  if (isNaN(input.age) || input.age <= 0) {
    errors.push("Возраст должен быть положительным числом");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Валидация частичного обновления профиля (PATCH)
 *
 * Проверяет только переданные поля
 */
export function validateProfileUpdate(update: Partial<ProfileInput>): ProfileValidationResult {
  const errors: string[] = [];

  if (update.weight !== undefined) {
    if (
      update.weight < PROFILE_VALIDATION_RULES.weight.min ||
      update.weight > PROFILE_VALIDATION_RULES.weight.max
    ) {
      errors.push(
        `Вес должен быть от ${PROFILE_VALIDATION_RULES.weight.min} до ${PROFILE_VALIDATION_RULES.weight.max} ${PROFILE_VALIDATION_RULES.weight.unit}`
      );
    }
    if (isNaN(update.weight) || update.weight <= 0) {
      errors.push("Вес должен быть положительным числом");
    }
  }

  if (update.height !== undefined) {
    if (
      update.height < PROFILE_VALIDATION_RULES.height.min ||
      update.height > PROFILE_VALIDATION_RULES.height.max
    ) {
      errors.push(
        `Рост должен быть от ${PROFILE_VALIDATION_RULES.height.min} до ${PROFILE_VALIDATION_RULES.height.max} ${PROFILE_VALIDATION_RULES.height.unit}`
      );
    }
    if (isNaN(update.height) || update.height <= 0) {
      errors.push("Рост должен быть положительным числом");
    }
  }

  if (update.age !== undefined) {
    if (
      update.age < PROFILE_VALIDATION_RULES.age.min ||
      update.age > PROFILE_VALIDATION_RULES.age.max
    ) {
      errors.push(
        `Возраст должен быть от ${PROFILE_VALIDATION_RULES.age.min} до ${PROFILE_VALIDATION_RULES.age.max} ${PROFILE_VALIDATION_RULES.age.unit}`
      );
    }
    if (isNaN(update.age) || update.age <= 0) {
      errors.push("Возраст должен быть положительным числом");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
