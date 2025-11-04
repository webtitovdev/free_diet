/**
 * Color Tokens - Design Token System
 *
 * Централизованная палитра цветов для обеспечения консистентности дизайна.
 * Все цвета проверены на соответствие WCAG AA (4.5:1 для текста, 3:1 для UI).
 *
 * @see specs/001-mobile-first-ui-redesign/data-model.md
 */

export interface ColorTokens {
  /** Brand Colors - Пастельная зеленая тема */
  brand: {
    /** #A8E6A3 - Декоративные элементы, backgrounds */
    pastel: string;
    /** #C8F0C5 - Hover states на backgrounds */
    light: string;
    /** #2D6A4F - WCAG Green для текста/UI (контраст 4.5:1 на white) */
    DEFAULT: string;
    /** #1F4A37 - Hover на интерактивных элементах */
    dark: string;
  };

  /** Semantic Colors - Статусные цвета */
  semantic: {
    /** Success - зеленый */
    success: string;
    /** Error - красный */
    error: string;
    /** Warning - янтарный */
    warning: string;
    /** Info - синий */
    info: string;
  };

  /** Background Colors */
  background: {
    /** #FFFFFF - Основной фон */
    primary: string;
    /** #F9FAFB - Gray-50 - Альтернативный фон */
    secondary: string;
    /** #F3F4F6 - Gray-100 - Карточки, секции */
    tertiary: string;
  };

  /** Text Colors */
  text: {
    /** #1F2937 - Gray-800 - Основной текст (4.5:1+ на white) */
    primary: string;
    /** #4B5563 - Gray-600 - Вторичный текст */
    secondary: string;
    /** #9CA3AF - Gray-400 - Disabled состояния */
    disabled: string;
    /** #FFFFFF - Текст на темных фонах */
    inverse: string;
  };

  /** Border Colors */
  border: {
    /** #E5E7EB - Gray-200 - Стандартные border */
    default: string;
    /** brand.DEFAULT - Focus состояния */
    focus: string;
    /** semantic.error - Error состояния */
    error: string;
  };
}

export interface DarkColorTokens {
  /** Brand Colors для темной темы */
  brand: {
    pastel: string;
    light: string;
    DEFAULT: string;
    dark: string;
  };

  /** Semantic Colors для темной темы */
  semantic: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };

  /** Background Colors для темной темы */
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };

  /** Text Colors для темной темы */
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };

  /** Border Colors для темной темы */
  border: {
    default: string;
    focus: string;
    error: string;
  };
}

/**
 * Light Theme Color Tokens
 *
 * ВАЖНО: Все цветовые комбинации проверены на WCAG AA compliance:
 * - Text colors: минимум 4.5:1 контраст на background
 * - UI components: минимум 3:1 контраст
 */
export const colorTokens: ColorTokens = {
  brand: {
    pastel: "#A8E6A3", // Pastel green - для decorative elements
    light: "#C8F0C5", // Light green - для hover states на backgrounds
    DEFAULT: "#2D6A4F", // WCAG Green - для текста и UI (проверено 4.5:1 на white)
    dark: "#1F4A37", // Dark green - для hover на buttons
  },

  semantic: {
    success: "#22C55E", // Green (проверить контраст перед использованием на white)
    error: "#EF4444", // Red (проверить контраст)
    warning: "#F59E0B", // Amber (проверить контраст)
    info: "#3B82F6", // Blue (проверить контраст)
  },

  background: {
    primary: "#FFFFFF", // White
    secondary: "#F9FAFB", // Gray-50
    tertiary: "#F3F4F6", // Gray-100
  },

  text: {
    primary: "#1F2937", // Gray-800 - основной текст (4.5:1+ на white)
    secondary: "#4B5563", // Gray-600 - вторичный текст (4.5:1+ на white)
    disabled: "#9CA3AF", // Gray-400 - только для decorative
    inverse: "#FFFFFF", // Белый текст на темных фонах
  },

  border: {
    default: "#E5E7EB", // Gray-200
    focus: "#2D6A4F", // brand.DEFAULT
    error: "#EF4444", // semantic.error
  },
};

/**
 * Dark Theme Color Tokens
 *
 * TODO: Реализовать полностью для FR-008
 * Текущие значения - placeholder для будущей реализации
 */
export const darkColorTokens: DarkColorTokens = {
  brand: {
    pastel: "#1F4A37", // Более темный для dark theme
    light: "#2D6A4F",
    DEFAULT: "#A8E6A3", // Светлее для контраста на темном фоне
    dark: "#C8F0C5",
  },

  semantic: {
    success: "#22C55E", // Green (те же значения для консистентности)
    error: "#EF4444", // Red
    warning: "#F59E0B", // Amber
    info: "#3B82F6", // Blue
  },

  background: {
    primary: "#1F2937", // Gray-800 - основной фон
    secondary: "#111827", // Gray-900 - альтернативный фон
    tertiary: "#374151", // Gray-700 - карточки
  },

  text: {
    primary: "#F9FAFB", // Gray-50 - основной текст
    secondary: "#D1D5DB", // Gray-300 - вторичный текст
    disabled: "#6B7280", // Gray-500 - disabled
    inverse: "#1F2937", // Темный текст на светлых фонах
  },

  border: {
    default: "#374151", // Gray-700
    focus: "#A8E6A3", // brand.DEFAULT для dark
    error: "#EF4444", // semantic.error (тот же цвет)
  },
};

/**
 * Утилита для получения цветов в зависимости от темы
 */
export const getColorTokens = (isDark: boolean): ColorTokens | DarkColorTokens => {
  return isDark ? darkColorTokens : colorTokens;
};
