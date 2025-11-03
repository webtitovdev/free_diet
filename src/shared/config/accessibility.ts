/**
 * Accessibility Configuration - Design Token System
 *
 * Конфигурация для соответствия WCAG AA стандартам.
 * FR-002: Touch targets >= 44x44px
 * FR-016: Контрастность >= 4.5:1 (текст), >= 3:1 (UI)
 *
 * @see specs/001-mobile-first-ui-redesign/data-model.md
 */

export interface AccessibilityConfig {
  /** Touch Targets (WCAG, Apple HIG) */
  touchTargets: {
    mobile: {
      /** Минимальная ширина (FR-002) */
      minWidth: number;
      /** Минимальная высота (FR-002) */
      minHeight: number;
      /** Минимальный spacing между targets */
      spacing: number;
    };
    desktop: {
      minWidth: number;
      minHeight: number;
      spacing: number;
    };
  };

  /** Color Contrast (WCAG AA) */
  contrast: {
    /** Обычный текст */
    normalText: {
      /** Минимальная контрастность (FR-016) */
      min: number;
      wcagLevel: "AA";
    };
    /** Крупный текст (19px+ bold или 24px+ normal) */
    largeText: {
      min: number;
      wcagLevel: "AA";
    };
    /** UI компоненты (FR-016) */
    uiComponents: {
      min: number;
      wcagLevel: "AA";
    };
  };

  /** Focus Indicators */
  focusIndicator: {
    /** Outline стиль */
    outline: string;
    /** Отступ от элемента */
    outlineOffset: string;
    /** Скругление углов */
    borderRadius: string;
  };

  /** Screen Reader */
  screenReader: {
    /** CSS класс для visually hidden текста */
    srOnlyClass: string;
    /** Использовать aria-live для dynamic content */
    ariaLiveRegions: boolean;
  };

  /** Motion Preferences */
  motion: {
    /** Учитывать prefers-reduced-motion */
    respectReducedMotion: boolean;
    /** CSS класс для reduced motion */
    reducedMotionClass: string;
  };

  /** Font Sizes */
  fontSize: {
    /** Минимум на мобильном (FR-009) */
    mobileMin: number;
    /** Минимум на десктопе (FR-009) */
    desktopMin: number;
  };
}

/**
 * Accessibility Configuration
 *
 * Все настройки соответствуют WCAG AA и лучшим практикам accessibility.
 */
export const accessibilityConfig: AccessibilityConfig = {
  // Touch Targets (WCAG 2.5.5, Apple HIG)
  touchTargets: {
    mobile: {
      minWidth: 44, // FR-002: минимум 44x44px
      minHeight: 44,
      spacing: 8, // Минимум между targets
    },
    desktop: {
      minWidth: 32,
      minHeight: 32,
      spacing: 4,
    },
  },

  // Color Contrast (WCAG 2.1.4.3)
  contrast: {
    normalText: {
      min: 4.5, // FR-016: минимум 4.5:1
      wcagLevel: "AA",
    },
    largeText: {
      min: 3.0, // 19px+ bold или 24px+ normal
      wcagLevel: "AA",
    },
    uiComponents: {
      min: 3.0, // FR-016: минимум 3:1
      wcagLevel: "AA",
    },
  },

  // Focus Indicators (WCAG 2.4.7)
  focusIndicator: {
    outline: "2px solid #2D6A4F", // brand.DEFAULT color
    outlineOffset: "2px",
    borderRadius: "4px",
  },

  // Screen Reader
  screenReader: {
    srOnlyClass: "sr-only",
    ariaLiveRegions: true,
  },

  // Motion Preferences (WCAG 2.3.3)
  motion: {
    respectReducedMotion: true,
    reducedMotionClass: "motion-reduce",
  },

  // Font Sizes (WCAG 1.4.4)
  fontSize: {
    mobileMin: 14, // FR-009: минимум 14-16px
    desktopMin: 16, // FR-009: минимум 16-18px
  },
} as const;

/**
 * Утилита для проверки минимального touch target size
 */
export const validateTouchTarget = (
  width: number,
  height: number,
  breakpoint: "mobile" | "desktop"
): boolean => {
  const config = accessibilityConfig.touchTargets[breakpoint];
  return width >= config.minWidth && height >= config.minHeight;
};

/**
 * Утилита для генерации sr-only класса
 */
export const getSrOnlyStyles = (): React.CSSProperties => {
  return {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  };
};
