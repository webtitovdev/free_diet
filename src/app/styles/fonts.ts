/**
 * Font Configuration - System Fonts
 *
 * Использование системных шрифтов для оптимальной производительности.
 * Fallback на популярные system fonts.
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/design-token-contracts.ts
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T042)
 */

/**
 * System Font Configuration
 *
 * Использует нативные системные шрифты для максимальной производительности
 * и избегания проблем с сетевым подключением.
 */
export const inter = {
  variable: "--font-inter",
  className: "font-sans",
  style: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

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
