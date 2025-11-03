// Типы для сущности UserProfile
// Spec: §US4, §FR-015 to §FR-017

/**
 * Пол пользователя (для расчета калорий)
 */
export enum Gender {
  MALE = "MALE", // Мужской
  FEMALE = "FEMALE", // Женский
}

/**
 * Тип цели пользователя
 */
export enum GoalType {
  BULK = "BULK", // Набор массы (+15% калорий)
  MAINTAIN = "MAINTAIN", // Удержание веса (maintenance)
  CUT = "CUT", // Похудение (-15% калорий)
  SUGAR_CONTROL = "SUGAR_CONTROL", // Контроль сахара (maintenance)
}

/**
 * Метаданные для отображения целей в UI
 */
export const GOAL_METADATA: Record<
  GoalType,
  {
    label: string;
    description: string;
    calorieMultiplier: number;
  }
> = {
  [GoalType.BULK]: {
    label: "Набор массы",
    description: "Калории увеличены на 15% для набора мышечной массы",
    calorieMultiplier: 1.15,
  },
  [GoalType.MAINTAIN]: {
    label: "Удержание веса",
    description: "Калории на уровне поддержания текущего веса",
    calorieMultiplier: 1.0,
  },
  [GoalType.CUT]: {
    label: "Похудение",
    description: "Калории снижены на 15% для потери веса",
    calorieMultiplier: 0.85,
  },
  [GoalType.SUGAR_CONTROL]: {
    label: "Контроль сахара",
    description: "Калории на уровне поддержания, фокус на углеводах",
    calorieMultiplier: 1.0,
  },
};

/**
 * Интерфейс профиля пользователя
 */
export interface UserProfile {
  id: string;
  userId: string;
  weight: number; // Вес в килограммах
  age: number; // Возраст в годах
  gender: Gender; // Пол
  height: number; // Рост в сантиметрах
  goal: GoalType; // Цель
  targetCalories: number; // Рассчитанная целевая калорийность
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Данные для создания/обновления профиля
 */
export interface ProfileInput {
  weight: number;
  age: number;
  gender: Gender;
  height: number;
  goal: GoalType;
}

/**
 * Результат валидации профиля
 */
export interface ProfileValidationResult {
  valid: boolean;
  errors: string[];
}
