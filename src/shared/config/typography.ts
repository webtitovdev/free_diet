/**
 * Typography Tokens - Design Token System
 *
 * Система типографики для обеспечения консистентной типографической иерархии.
 * FR-009: Адаптивные размеры (14-16px mobile, 16-18px desktop).
 *
 * @see specs/001-mobile-first-ui-redesign/data-model.md
 */

export interface TypographyTokens {
  /** Семейства шрифтов */
  fontFamily: {
    /** Sans-serif для основного текста */
    sans: string[];
    /** Monospace для кода */
    mono: string[];
  };

  /** Размеры шрифтов */
  fontSize: {
    /** 12px - вспомогательный текст */
    xs: string;
    /** 14px - маленький текст (мобильный основной) */
    sm: string;
    /** 16px - основной текст (десктоп) */
    base: string;
    /** 18px - крупный текст */
    lg: string;
    /** 20px - подзаголовки */
    xl: string;
    /** 24px - H3 (мобильный) */
    "2xl": string;
    /** 28px - H2 (мобильный) */
    "3xl": string;
    /** 32px - H1 (мобильный) */
    "4xl": string;
    /** 36px - H1 (десктоп) */
    "5xl": string;
  };

  /** Начертания шрифта */
  fontWeight: {
    /** 400 - обычный текст */
    normal: number;
    /** 500 - средний */
    medium: number;
    /** 600 - полужирный */
    semibold: number;
    /** 700 - жирный */
    bold: number;
  };

  /** Высота строки */
  lineHeight: {
    /** 1.25 - для заголовков */
    tight: number;
    /** 1.5 - для основного текста */
    normal: number;
    /** 1.75 - для длинного текста */
    relaxed: number;
  };

  /** Межбуквенный интервал */
  letterSpacing: {
    /** -0.01em - плотный */
    tight: string;
    /** 0em - нормальный */
    normal: string;
    /** 0.025em - широкий */
    wide: string;
  };
}

/**
 * Typography Tokens
 *
 * Font Family:
 * - Inter - рекомендуемый sans-serif шрифт для modern UI
 * - System fonts fallback для оптимальной производительности
 */
export const typographyTokens: TypographyTokens = {
  fontFamily: {
    sans: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Oxygen",
      "Ubuntu",
      "Cantarell",
      "Helvetica Neue",
      "sans-serif",
    ],
    mono: [
      "Fira Code",
      "ui-monospace",
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace",
    ],
  },

  fontSize: {
    xs: "12px", // Caption, helper text
    sm: "14px", // FR-009: минимум на мобильном
    base: "16px", // FR-009: стандарт на десктопе
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "28px",
    "4xl": "32px",
    "5xl": "36px",
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25, // Заголовки
    normal: 1.5, // Основной текст (минимум для accessibility)
    relaxed: 1.75, // Длинные параграфы
  },

  letterSpacing: {
    tight: "-0.01em",
    normal: "0em",
    wide: "0.025em",
  },
} as const;

/**
 * Type для font size keys
 */
export type FontSizeKey = keyof TypographyTokens["fontSize"];

/**
 * Type для font weight keys
 */
export type FontWeightKey = keyof TypographyTokens["fontWeight"];

/**
 * Утилита для получения responsive font size
 * Возвращает мобильный и десктопный размеры
 */
export const getResponsiveFontSize = (mobileSize: FontSizeKey, desktopSize: FontSizeKey) => {
  return {
    mobile: typographyTokens.fontSize[mobileSize],
    desktop: typographyTokens.fontSize[desktopSize],
  };
};
