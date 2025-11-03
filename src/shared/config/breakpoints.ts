/**
 * Breakpoint Configuration - Design Token System
 *
 * Конфигурация точек переключения между мобильным, планшетным и десктопным видами.
 * FR-001: 3 брейкпоинта (mobile, tablet, desktop)
 *
 * @see specs/001-mobile-first-ui-redesign/data-model.md
 */

export interface BreakpointConfig {
  /** Breakpoint values (в пикселях) */
  mobile: {
    min: number;
    max: number;
  };
  tablet: {
    min: number;
    max: number;
  };
  desktop: {
    min: number;
    max: number;
  };

  /** Media queries для использования в CSS */
  mediaQueries: {
    mobile: string;
    tablet: string;
    desktop: string;
    tabletAndUp: string;
    desktopAndUp: string;
  };

  /** Container max-widths по брейкпоинтам */
  containerMaxWidth: {
    mobile: string;
    tablet: string;
    desktop: string; // FR-013: 1200-1400px
  };

  /** Touch target sizes по брейкпоинтам */
  touchTargetSize: {
    mobile: number; // FR-002: минимум 44px
    tablet: number;
    desktop: number;
  };
}

/**
 * Breakpoint Configuration
 *
 * Mobile-First подход:
 * - Базовые стили для мобильных
 * - Progressive enhancement для больших экранов
 */
export const breakpointConfig: BreakpointConfig = {
  // Breakpoint values
  mobile: {
    min: 0,
    max: 767, // <768px
  },
  tablet: {
    min: 768,
    max: 1023, // 768-1024px
  },
  desktop: {
    min: 1024,
    max: Infinity, // >1024px
  },

  // Media queries (для CSS/styled-components)
  mediaQueries: {
    mobile: "@media (max-width: 767px)",
    tablet: "@media (min-width: 768px) and (max-width: 1023px)",
    desktop: "@media (min-width: 1024px)",
    tabletAndUp: "@media (min-width: 768px)",
    desktopAndUp: "@media (min-width: 1024px)",
  },

  // Container max-widths
  containerMaxWidth: {
    mobile: "100%",
    tablet: "100%",
    desktop: "1200px", // FR-013: Max 1200-1400px
  },

  // Touch target sizes (FR-002)
  touchTargetSize: {
    mobile: 44, // WCAG, Apple HIG минимум
    tablet: 40,
    desktop: 32,
  },
} as const;

/**
 * Утилита для проверки текущего брейкпоинта
 */
export const getCurrentBreakpoint = (width: number): "mobile" | "tablet" | "desktop" => {
  if (width < breakpointConfig.tablet.min) return "mobile";
  if (width < breakpointConfig.desktop.min) return "tablet";
  return "desktop";
};

/**
 * Утилита для получения touch target size
 */
export const getTouchTargetSize = (breakpoint: "mobile" | "tablet" | "desktop"): number => {
  return breakpointConfig.touchTargetSize[breakpoint];
};
