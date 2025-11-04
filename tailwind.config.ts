import type { Config } from "tailwindcss";
import { designTokens } from "./src/shared/config/tokens";

// Утилита для преобразования readonly типов в изменяемые для Tailwind
type Mutable<T> = { -readonly [K in keyof T]: T[K] extends object ? Mutable<T[K]> : T[K] };

// Преобразуем числовые значения в строки для Tailwind
const fontWeights = {
  normal: String(designTokens.typography.fontWeight.normal),
  medium: String(designTokens.typography.fontWeight.medium),
  semibold: String(designTokens.typography.fontWeight.semibold),
  bold: String(designTokens.typography.fontWeight.bold),
};

const lineHeights = {
  tight: String(designTokens.typography.lineHeight.tight),
  normal: String(designTokens.typography.lineHeight.normal),
  relaxed: String(designTokens.typography.lineHeight.relaxed),
};

const letterSpacings = {
  tight: `${designTokens.typography.letterSpacing.tight}em`,
  normal: `${designTokens.typography.letterSpacing.normal}em`,
  wide: `${designTokens.typography.letterSpacing.wide}em`,
};

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Colors из design tokens
      colors: {
        brand: designTokens.colors.brand,
        semantic: designTokens.colors.semantic,
        background: designTokens.colors.background,
        text: designTokens.colors.text,
        border: designTokens.colors.border,
      },
      // Spacing из design tokens
      spacing: designTokens.spacing as unknown as Mutable<typeof designTokens.spacing>,
      // Typography
      fontFamily: designTokens.typography.fontFamily as unknown as Mutable<
        typeof designTokens.typography.fontFamily
      >,
      fontSize: designTokens.typography.fontSize as unknown as Mutable<
        typeof designTokens.typography.fontSize
      >,
      fontWeight: fontWeights,
      lineHeight: lineHeights,
      letterSpacing: letterSpacings,
      // Border Radius
      borderRadius: designTokens.borderRadius as unknown as Mutable<
        typeof designTokens.borderRadius
      >,
      // Shadows
      boxShadow: designTokens.shadows as unknown as Mutable<typeof designTokens.shadows>,
      // Breakpoints (custom screens)
      screens: {
        mobile: { max: `${designTokens.breakpoints.mobile.max}px` },
        tablet: {
          min: `${designTokens.breakpoints.tablet.min}px`,
          max: `${designTokens.breakpoints.tablet.max}px`,
        },
        desktop: { min: `${designTokens.breakpoints.desktop.min}px` },
      },
    },
  },
  plugins: [],
} satisfies Config;
