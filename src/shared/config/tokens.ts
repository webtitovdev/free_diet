/**
 * Design Token System - Main Export
 *
 * Централизованная точка экспорта всех design tokens.
 * Импортируется в Tailwind config и используется в компонентах.
 *
 * @see specs/001-mobile-first-ui-redesign/data-model.md
 * @see specs/001-mobile-first-ui-redesign/quickstart.md
 */

import { colorTokens, darkColorTokens, type ColorTokens, type DarkColorTokens } from "./colors";
import { spacingTokens, type SpacingTokens } from "./spacing";
import { typographyTokens, type TypographyTokens } from "./typography";
import { borderRadiusTokens, type BorderRadiusTokens } from "./border-radius";
import { shadowTokens, darkShadowTokens, type ShadowTokens } from "./shadows";
import { breakpointConfig, type BreakpointConfig } from "./breakpoints";
import { animationConfig, type AnimationConfig } from "./animations";
import { accessibilityConfig, type AccessibilityConfig } from "./accessibility";

/**
 * Design Token System Interface
 */
export interface DesignTokenSystem {
  /** Color tokens (light theme) */
  colors: ColorTokens;
  /** Color tokens (dark theme) */
  darkColors: DarkColorTokens;
  /** Spacing tokens */
  spacing: SpacingTokens;
  /** Typography tokens */
  typography: TypographyTokens;
  /** Border radius tokens */
  borderRadius: BorderRadiusTokens;
  /** Shadow tokens (light theme) */
  shadows: ShadowTokens;
  /** Shadow tokens (dark theme) */
  darkShadows: ShadowTokens;
  /** Breakpoint configuration */
  breakpoints: BreakpointConfig;
  /** Animation configuration */
  animations: AnimationConfig;
  /** Accessibility configuration */
  accessibility: AccessibilityConfig;
}

/**
 * Design Token System (главный экспорт)
 *
 * Использование:
 * ```typescript
 * import { designTokens } from '@/shared/config/tokens';
 *
 * const brandColor = designTokens.colors.brand.DEFAULT;
 * const spacing = designTokens.spacing[4];
 * ```
 */
export const designTokens: DesignTokenSystem = {
  colors: colorTokens,
  darkColors: darkColorTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  borderRadius: borderRadiusTokens,
  shadows: shadowTokens,
  darkShadows: darkShadowTokens,
  breakpoints: breakpointConfig,
  animations: animationConfig,
  accessibility: accessibilityConfig,
} as const;

/**
 * Экспортируем все tokens для прямого импорта
 */
export {
  // Colors
  colorTokens,
  darkColorTokens,
  type ColorTokens,
  type DarkColorTokens,
  // Spacing
  spacingTokens,
  type SpacingTokens,
  type SpacingKey,
  // Typography
  typographyTokens,
  type TypographyTokens,
  type FontSizeKey,
  type FontWeightKey,
  // Border Radius
  borderRadiusTokens,
  type BorderRadiusTokens,
  type BorderRadiusKey,
  // Shadows
  shadowTokens,
  darkShadowTokens,
  type ShadowTokens,
  type ShadowKey,
  // Breakpoints
  breakpointConfig,
  type BreakpointConfig,
  // Animations
  animationConfig,
  type AnimationConfig,
  type AnimationPreset,
  // Accessibility
  accessibilityConfig,
  type AccessibilityConfig,
};

/**
 * Утилита для получения токенов в зависимости от темы
 */
export const getTokens = (isDark: boolean): Partial<DesignTokenSystem> => {
  return {
    colors: isDark ? darkColorTokens : colorTokens,
    shadows: isDark ? darkShadowTokens : shadowTokens,
  };
};

/**
 * Type guard для проверки валидности spacing key
 */
export const isValidSpacingKey = (key: unknown): key is SpacingKey => {
  return typeof key === "string" && key in spacingTokens;
};

/**
 * Type guard для проверки валидности border radius key
 */
export const isValidBorderRadiusKey = (key: unknown): key is BorderRadiusKey => {
  return typeof key === "string" && key in borderRadiusTokens;
};
