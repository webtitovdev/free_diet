import type { Config } from "tailwindcss";
import { designTokens } from "./src/shared/config/tokens";

export default {
  darkMode: ["class"],
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
      spacing: designTokens.spacing,
      // Typography
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,
      lineHeight: designTokens.typography.lineHeight,
      letterSpacing: designTokens.typography.letterSpacing,
      // Border Radius
      borderRadius: designTokens.borderRadius,
      // Shadows
      boxShadow: designTokens.shadows,
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
