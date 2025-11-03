/**
 * Design Token Contracts
 *
 * TypeScript интерфейсы для Design Token System. Эти типы обеспечивают
 * type-safety при использовании design tokens в компонентах.
 *
 * Feature: 001-mobile-first-ui-redesign
 * Date: 2025-11-04
 */

// ============================================================================
// Color Tokens
// ============================================================================

export interface ColorPalette {
  /** HEX color value */
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string; // DEFAULT
  600?: string;
  700?: string;
  800?: string;
  900?: string;
  950?: string;
}

export interface BrandColorTokens {
  /** Pastel green для decorative elements (#A8E6A3 or similar) */
  pastel: string;

  /** Light green для hover states (#C8F0C5 or similar) */
  light: string;

  /** WCAG Green для текста и UI (#2D6A4F or similar) - MUST meet 4.5:1 contrast */
  DEFAULT: string;

  /** Dark green для hover на интерактивных элементах (#1F4A37 or similar) */
  dark: string;
}

export interface SemanticColorTokens {
  /** Success color (Green) - MUST meet 4.5:1 contrast on white */
  success: string;

  /** Error color (Red) - MUST meet 4.5:1 contrast on white */
  error: string;

  /** Warning color (Amber) - MUST meet 4.5:1 contrast on white */
  warning: string;

  /** Info color (Blue) - MUST meet 4.5:1 contrast on white */
  info: string;
}

export interface BackgroundColorTokens {
  /** Primary background (White) */
  primary: string;

  /** Secondary background (Gray-50) */
  secondary: string;

  /** Tertiary background для cards, sections (Gray-100) */
  tertiary: string;
}

export interface TextColorTokens {
  /** Primary text (Gray-800) - MUST have 4.5:1 contrast on white */
  primary: string;

  /** Secondary text (Gray-600) - MUST have 4.5:1 contrast on white */
  secondary: string;

  /** Disabled text (Gray-400) - decorative only, no text */
  disabled: string;

  /** Inverse text (White) - для текста на темных фонах */
  inverse: string;
}

export interface BorderColorTokens {
  /** Default border (Gray-200) */
  default: string;

  /** Focus border (использует brand.DEFAULT) */
  focus: string;

  /** Error border (использует semantic.error) */
  error: string;
}

export interface ColorTokens {
  brand: BrandColorTokens;
  semantic: SemanticColorTokens;
  background: BackgroundColorTokens;
  text: TextColorTokens;
  border: BorderColorTokens;
}

export interface DarkThemeColorTokens {
  brand: BrandColorTokens;
  background: {
    primary: string; // Dark gray
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string; // Light gray
    secondary: string;
    disabled: string;
    inverse: string; // Black
  };
  border: BorderColorTokens;
}

// ============================================================================
// Spacing Tokens
// ============================================================================

export type SpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

export interface SpacingTokens {
  0: "0px";
  1: "4px";
  2: "8px";
  3: "12px";
  4: "16px"; // Base padding для карточек
  5: "20px";
  6: "24px"; // Max padding для мобильных карточек
  8: "32px";
  10: "40px";
  12: "48px";
  16: "64px";
  20: "80px";
  24: "96px";
}

/**
 * Validation:
 * - Все значения ДОЛЖНЫ быть кратны 4px
 * - Минимальный spacing между интерактивными элементами: 8px
 */

// ============================================================================
// Typography Tokens
// ============================================================================

export interface FontFamilyTokens {
  /** Sans-serif stack (рекомендуется Inter) */
  sans: string[];

  /** Monospace stack */
  mono: string[];
}

export interface FontSizeTokens {
  xs: "12px"; // Вспомогательный текст
  sm: "14px"; // Маленький текст (мобильный основной)
  base: "16px"; // Основной текст (десктоп)
  lg: "18px"; // Крупный текст
  xl: "20px"; // Подзаголовки
  "2xl": "24px"; // H3 (мобильный)
  "3xl": "28px"; // H2 (мобильный)
  "4xl": "32px"; // H1 (мобильный)
  "5xl": "36px"; // H1 (десктоп)
}

export interface FontWeightTokens {
  normal: 400;
  medium: 500;
  semibold: 600;
  bold: 700;
}

export interface LineHeightTokens {
  tight: 1.25; // Заголовки
  normal: 1.5; // Основной текст (WCAG рекомендует минимум 1.5)
  relaxed: 1.75; // Длинный текст
}

export interface LetterSpacingTokens {
  tight: "-0.01em";
  normal: "0em";
  wide: "0.025em";
}

export interface TypographyTokens {
  fontFamily: FontFamilyTokens;
  fontSize: FontSizeTokens;
  fontWeight: FontWeightTokens;
  lineHeight: LineHeightTokens;
  letterSpacing: LetterSpacingTokens;
}

/**
 * Validation:
 * - fontFamily ДОЛЖНЫ иметь fallback fonts
 * - fontSize для основного текста >= 14px (mobile), >= 16px (desktop)
 * - lineHeight для основного текста >= 1.5
 */

// ============================================================================
// Border Radius Tokens
// ============================================================================

export interface BorderRadiusTokens {
  none: "0px";
  sm: "4px"; // Small elements (badges)
  DEFAULT: "8px"; // Cards, buttons
  md: "12px"; // Medium cards
  lg: "16px"; // Large images
  xl: "24px"; // Modals
  full: "9999px"; // Circles (avatars, indicators)
}

/**
 * Validation:
 * - Значения ДОЛЖНЫ быть кратны 4px (кроме 'full')
 * - Рекомендуемое значение для карточек: 8px или 16px
 */

// ============================================================================
// Shadow Tokens
// ============================================================================

export interface ShadowTokens {
  none: "none";
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)";
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)";
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)";
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)";
}

/**
 * Validation:
 * - Shadows ДОЛЖНЫ быть subtle (opacity 0.05-0.1)
 * - На темных темах shadows ДОЛЖНЫ быть светлее или отключены
 */

// ============================================================================
// Breakpoint Tokens
// ============================================================================

export interface BreakpointValues {
  min: number;
  max: number;
}

export interface MediaQueryTokens {
  mobile: "@media (max-width: 767px)";
  tablet: "@media (min-width: 768px) and (max-width: 1023px)";
  desktop: "@media (min-width: 1024px)";
  tabletAndUp: "@media (min-width: 768px)";
  desktopAndUp: "@media (min-width: 1024px)";
}

export interface ContainerMaxWidthTokens {
  mobile: "100%";
  tablet: "100%";
  desktop: "1200px"; // Max 1200-1400px
}

export interface TouchTargetSizeTokens {
  mobile: 44; // 44x44px минимум (WCAG, Apple HIG)
  tablet: 40;
  desktop: 32;
}

export interface BreakpointTokens {
  mobile: BreakpointValues;
  tablet: BreakpointValues;
  desktop: BreakpointValues;
  mediaQueries: MediaQueryTokens;
  containerMaxWidth: ContainerMaxWidthTokens;
  touchTargetSize: TouchTargetSizeTokens;
}

/**
 * Validation:
 * - Breakpoints НЕ ДОЛЖНЫ пересекаться
 * - Touch target на мобильном >= 44px
 * - Container max-width на десктопе: 1200-1400px
 */

// ============================================================================
// Animation Tokens
// ============================================================================

export interface DurationTokens {
  fast: 150; // Micro-interactions (hover)
  normal: 200; // Стандартные transitions
  slow: 300; // Modal opening, slide-ins
}

export interface EasingTokens {
  ease: "ease";
  easeIn: "ease-in";
  easeOut: "ease-out";
  easeInOut: "ease-in-out"; // Рекомендуется по умолчанию
  linear: "linear";
}

export interface TransitionTokens {
  default: "all 200ms ease-in-out";
  color: "color 200ms ease-in-out";
  transform: "transform 200ms ease-in-out";
  opacity: "opacity 200ms ease-in-out";
  shadow: "box-shadow 200ms ease-in-out";
}

export interface AnimationPreset {
  duration: number;
  property: string;
  from: string;
  to: string;
  keyframes?: string;
  iteration?: "once" | "infinite";
}

export interface AnimationPresets {
  buttonPress: AnimationPreset;
  modalSlideUp: AnimationPreset;
  fadeIn: AnimationPreset;
  skeletonPulse: AnimationPreset;
}

export interface AnimationTokens {
  duration: DurationTokens;
  easing: EasingTokens;
  transitions: TransitionTokens;
  presets: AnimationPresets;
  respectReducedMotion: boolean;
}

/**
 * Validation:
 * - Длительность 200-300ms для основных transitions (FR-006)
 * - Visual feedback < 100ms (FR-007)
 * - Использовать transform и opacity для 60 FPS
 * - Поддержка prefers-reduced-motion
 */

// ============================================================================
// Accessibility Tokens
// ============================================================================

export interface TouchTargetConfig {
  minWidth: number;
  minHeight: number;
  spacing: number; // Минимальный spacing между targets
}

export interface ContrastRequirements {
  min: number;
  wcagLevel: "AA" | "AAA";
}

export interface AccessibilityTokens {
  touchTargets: {
    mobile: TouchTargetConfig;
    desktop: TouchTargetConfig;
  };

  contrast: {
    normalText: ContrastRequirements; // 4.5:1 для WCAG AA
    largeText: ContrastRequirements; // 3.0:1 для крупного текста
    uiComponents: ContrastRequirements; // 3.0:1 для UI
  };

  focusIndicator: {
    outline: string;
    outlineOffset: string;
    borderRadius: string;
  };

  screenReader: {
    srOnlyClass: string;
    ariaLiveRegions: boolean;
  };

  motion: {
    respectReducedMotion: boolean;
    reducedMotionClass: string;
  };

  fontSize: {
    mobileMin: number; // 14px минимум
    desktopMin: number; // 16px минимум
  };
}

/**
 * Validation:
 * - Touch targets >= 44x44px на мобильном (FR-002)
 * - Text contrast >= 4.5:1 (FR-016)
 * - UI components contrast >= 3:1 (FR-016)
 * - Font size >= 14px (mobile), >= 16px (desktop) (FR-009)
 */

// ============================================================================
// Complete Design Token System
// ============================================================================

export interface DesignTokenSystem {
  colors: ColorTokens;
  darkColors: DarkThemeColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  borderRadius: BorderRadiusTokens;
  shadows: ShadowTokens;
  breakpoints: BreakpointTokens;
  animations: AnimationTokens;
  accessibility: AccessibilityTokens;
}

/**
 * Utility функции для работы с tokens
 */

/** Проверить контрастность цветовой комбинации */
export type ContrastChecker = (
  foreground: string,
  background: string
) => {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
};

/** Получить responsive значение на основе breakpoint */
export type ResponsiveValueGetter = <T>(
  value: T | { mobile?: T; tablet?: T; desktop?: T },
  currentBreakpoint: "mobile" | "tablet" | "desktop"
) => T;

/** Применить animation preset */
export type ApplyAnimationPreset = (
  presetName: keyof AnimationPresets,
  element: HTMLElement
) => void;
