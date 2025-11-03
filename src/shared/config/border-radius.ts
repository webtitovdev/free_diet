/**
 * Border Radius Tokens - Design Token System
 *
 * Система скруглений углов для визуальной консистентности.
 * Все значения кратны 4px (кроме 'full').
 *
 * @see specs/001-mobile-first-ui-redesign/data-model.md
 */

export interface BorderRadiusTokens {
  /** 0px - без скруглений */
  none: string;
  /** 4px - маленькие элементы (badges) */
  sm: string;
  /** 8px - карточки, кнопки (default) */
  DEFAULT: string;
  /** 12px - средние карточки */
  md: string;
  /** 16px - крупные изображения */
  lg: string;
  /** 24px - модальные окна */
  xl: string;
  /** 9999px - круглые элементы (аватары, индикаторы) */
  full: string;
}

/**
 * Border Radius Tokens
 *
 * Согласно research.md, современные приложения используют:
 * - 8-16px для карточек (Lifesum, Yazio)
 * - Скругленные углы для создания friendly, approachable интерфейса
 */
export const borderRadiusTokens: BorderRadiusTokens = {
  none: "0px",
  sm: "4px", // Маленькие badges
  DEFAULT: "8px", // Стандарт для карточек, кнопок
  md: "12px", // Средние карточки
  lg: "16px", // Крупные карточки, изображения
  xl: "24px", // Модальные окна
  full: "9999px", // Круглые элементы (аватары, progress circles)
} as const;

/**
 * Type для border radius keys
 */
export type BorderRadiusKey = keyof BorderRadiusTokens;

/**
 * Утилита для получения border radius значения
 */
export const getBorderRadius = (key: BorderRadiusKey): string => {
  return borderRadiusTokens[key];
};
