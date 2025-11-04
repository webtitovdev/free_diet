import type { Config } from "tailwindcss";
import { designTokens } from "./src/shared/config/tokens";

// Утилита для преобразования readonly типов в изменяемые для Tailwind
type Mutable<T> = { -readonly [K in keyof T]: T[K] extends object ? Mutable<T[K]> : T[K] };

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
      fontWeight: designTokens.typography.fontWeight as unknown as Mutable<
        typeof designTokens.typography.fontWeight
      >,
      lineHeight: designTokens.typography.lineHeight as unknown as Mutable<
        typeof designTokens.typography.lineHeight
      >,
      letterSpacing: designTokens.typography.letterSpacing as unknown as Mutable<
        typeof designTokens.typography.letterSpacing
      >,
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
