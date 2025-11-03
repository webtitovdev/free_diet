// Расчет целевой калорийности по формуле Mifflin-St Jeor
// Spec: §FR-017, research.md R006

import { Gender, GoalType, GOAL_METADATA } from "../model/types";

/**
 * Множитель активности (для MVP используем Sedentary)
 * Sedentary (низкая активность): BMR × 1.2
 *
 * В будущем можно сделать настраиваемым в профиле
 */
const ACTIVITY_MULTIPLIER = 1.2;

/**
 * Расчет базального метаболизма (BMR) по формуле Mifflin-St Jeor
 *
 * Мужчины: BMR = (10 × вес_кг) + (6.25 × рост_см) - (5 × возраст) + 5
 * Женщины: BMR = (10 × вес_кг) + (6.25 × рост_см) - (5 × возраст) - 161
 *
 * @param weight - Вес в килограммах
 * @param height - Рост в сантиметрах
 * @param age - Возраст в годах
 * @param gender - Пол пользователя
 * @returns BMR (базальный метаболизм) в ккал/день
 */
function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;

  // Корректировка по полу
  const genderOffset = gender === Gender.MALE ? 5 : -161;

  return baseBMR + genderOffset;
}

/**
 * Расчет целевой калорийности на основе профиля и цели
 *
 * Формула:
 * 1. BMR = базальный метаболизм (Mifflin-St Jeor)
 * 2. TDEE = BMR × множитель_активности (1.2 для sedentary)
 * 3. Целевые_калории = TDEE × множитель_цели
 *
 * Множители целей:
 * - BULK (набор массы): 1.15 (+15% профицит)
 * - MAINTAIN (удержание): 1.0 (поддержание)
 * - CUT (похудение): 0.85 (-15% дефицит)
 * - SUGAR_CONTROL (контроль сахара): 1.0 (поддержание)
 *
 * @param weight - Вес в кг
 * @param height - Рост в см
 * @param age - Возраст в годах
 * @param gender - Пол
 * @param goal - Цель пользователя
 * @returns Целевая калорийность в ккал/день (округлено до целого)
 */
export function calculateTargetCalories(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  goal: GoalType
): number {
  // Шаг 1: Рассчитываем BMR
  const bmr = calculateBMR(weight, height, age, gender);

  // Шаг 2: Рассчитываем TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * ACTIVITY_MULTIPLIER;

  // Шаг 3: Применяем множитель цели
  const goalMultiplier = GOAL_METADATA[goal].calorieMultiplier;
  const targetCalories = tdee * goalMultiplier;

  // Округляем до целого числа
  return Math.round(targetCalories);
}

/**
 * Пример расчета для справки:
 *
 * Мужчина, 30 лет, 75 кг, 180 см, цель: похудение (CUT)
 *
 * 1. BMR = (10 × 75) + (6.25 × 180) - (5 × 30) + 5 = 1630 ккал
 * 2. TDEE = 1630 × 1.2 = 1956 ккал
 * 3. Целевые = 1956 × 0.85 = 1663 ккал/день
 */
