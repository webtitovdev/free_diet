/**
 * Spacing Tokens - Design Token System
 *
 * Система отступов для обеспечения консистентности layout.
 * Все значения кратны 4px для визуальной гармонии.
 *
 * @see specs/001-mobile-first-ui-redesign/data-model.md
 */

export interface SpacingTokens {
  /** 0px */
  0: string;
  /** 4px */
  1: string;
  /** 8px - минимальный spacing между интерактивными элементами */
  2: string;
  /** 12px */
  3: string;
  /** 16px - базовый padding для карточек */
  4: string;
  /** 20px */
  5: string;
  /** 24px - максимальный padding для мобильных карточек */
  6: string;
  /** 32px */
  8: string;
  /** 40px */
  10: string;
  /** 48px */
  12: string;
  /** 64px */
  16: string;
  /** 80px */
  20: string;
  /** 96px */
  24: string;
}

/**
 * Spacing Tokens
 *
 * Использование:
 * - spacing[2] (8px) - минимальный gap между интерактивными элементами
 * - spacing[4] (16px) - стандартный padding для карточек
 * - spacing[6] (24px) - максимальный padding на мобильных
 */
export const spacingTokens: SpacingTokens = {
  0: "0px",
  1: "4px",
  2: "8px", // FR-002: минимум между touch targets
  3: "12px",
  4: "16px", // Базовый padding
  5: "20px",
  6: "24px", // Max для мобильных карточек
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

/**
 * Утилита для получения spacing значения
 */
export const getSpacing = (key: keyof SpacingTokens): string => {
  return spacingTokens[key];
};

/**
 * Type для spacing keys (для использования в компонентах)
 */
export type SpacingKey = keyof SpacingTokens;
