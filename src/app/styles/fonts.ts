/**
 * Font Configuration - Inter Font Family
 *
 * Загрузка и настройка Inter font с оптимизацией через @next/font.
 * Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold).
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/design-token-contracts.ts
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T042)
 */

import { Inter } from "next/font/google";

/**
 * Inter Variable Font
 *
 * Variable font для оптимизации bundle size.
 * Поддерживает все font weights от 100 до 900.
 *
 * @see https://fonts.google.com/specimen/Inter
 */
export const inter = Inter({
  subsets: ["latin", "cyrillic"], // Latin + Cyrillic для русского языка
  variable: "--font-inter", // CSS variable для использования в Tailwind
  display: "swap", // Font display strategy для лучшей производительности
  // Примечание: Inter - variable font, поддерживает все веса (100-900) автоматически
  // Fallback шрифты автоматически добавляются Next.js
  // (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)
});

/**
 * CSS Variable для использования в компонентах
 *
 * @example
 * ```tsx
 * <div className={inter.className}>
 *   Текст с Inter font
 * </div>
 * ```
 */
export const interClassName = inter.className;

/**
 * CSS Variable для использования в Tailwind config
 *
 * В tailwind.config.ts добавить:
 * ```typescript
 * fontFamily: {
 *   sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
 * }
 * ```
 */
export const interVariable = inter.variable;
