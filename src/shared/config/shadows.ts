/**
 * Shadow Tokens - Design Token System
 *
 * Система теней для создания визуальной глубины (elevation).
 * Все тени subtle (opacity 0.05-0.1) для современного minimal вида.
 *
 * @see specs/001-mobile-first-ui-redesign/data-model.md
 */

export interface ShadowTokens {
  /** none - без тени */
  none: string;
  /** sm - легкая тень для hover states */
  sm: string;
  /** DEFAULT - стандартная тень для карточек */
  DEFAULT: string;
  /** md - средняя тень для приподнятых элементов */
  md: string;
  /** lg - крупная тень для модальных окон */
  lg: string;
  /** xl - максимальная тень для floating элементов */
  xl: string;
}

/**
 * Shadow Tokens (Light Theme)
 *
 * Тени с opacity 0.05-0.1 для subtle эффекта согласно research.md.
 * На темной теме тени должны быть светлее или отключены.
 */
export const shadowTokens: ShadowTokens = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
} as const;

/**
 * Shadow Tokens для Dark Theme
 *
 * На темной теме используем более светлые тени или отключаем
 */
export const darkShadowTokens: ShadowTokens = {
  none: "none",
  sm: "0 1px 2px 0 rgba(255, 255, 255, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px -1px rgba(255, 255, 255, 0.1)",
  md: "0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -2px rgba(255, 255, 255, 0.1)",
  lg: "0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -4px rgba(255, 255, 255, 0.1)",
  xl: "0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 8px 10px -6px rgba(255, 255, 255, 0.1)",
} as const;

/**
 * Type для shadow keys
 */
export type ShadowKey = keyof ShadowTokens;

/**
 * Утилита для получения shadow в зависимости от темы
 */
export const getShadow = (key: ShadowKey, isDark: boolean): string => {
  return isDark ? darkShadowTokens[key] : shadowTokens[key];
};
