"use client";

/**
 * Ant Design Theme Provider - Dual-Architecture Support
 *
 * Обертка для Ant Design компонентов с применением design tokens
 * для визуальной консистентности в переходный период миграции.
 *
 * FR-018: Постепенная миграция страница-за-страницей
 * @see specs/001-mobile-first-ui-redesign/quickstart.md section 5.4
 */

import React from "react";
import { ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";
import { designTokens } from "@/shared/config/tokens";

export interface AntdThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Ant Design Theme Configuration
 *
 * Применяет design tokens к Ant Design для визуальной консистентности
 */
const antdTheme: ThemeConfig = {
  token: {
    // Brand Colors
    colorPrimary: designTokens.colors.brand.DEFAULT, // #2D6A4F
    colorSuccess: designTokens.colors.semantic.success,
    colorWarning: designTokens.colors.semantic.warning,
    colorError: designTokens.colors.semantic.error,
    colorInfo: designTokens.colors.semantic.info,

    // Typography
    fontFamily: designTokens.typography.fontFamily.sans.join(", "),
    fontSize: 16, // Base font size

    // Border Radius
    borderRadius: 8, // designTokens.borderRadius.DEFAULT

    // Spacing
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    marginXL: 32,

    // Colors (backgrounds)
    colorBgContainer: designTokens.colors.background.primary,
    colorBgElevated: designTokens.colors.background.secondary,
    colorBgLayout: designTokens.colors.background.tertiary,

    // Text Colors
    colorText: designTokens.colors.text.primary,
    colorTextSecondary: designTokens.colors.text.secondary,
    colorTextDisabled: designTokens.colors.text.disabled,

    // Border Colors
    colorBorder: designTokens.colors.border.default,
  },

  components: {
    Button: {
      // Touch targets для мобильных (FR-002)
      controlHeight: 44, // Mobile touch target
      controlHeightLG: 48,
      controlHeightSM: 40,

      // Border Radius
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 4,
    },

    Card: {
      // Border Radius (8-16px согласно research)
      borderRadiusLG: 16,

      // Padding
      paddingLG: 24, // Max для мобильных карточек
    },

    Input: {
      // Touch targets
      controlHeight: 44,
      controlHeightLG: 48,
      controlHeightSM: 40,

      // Border Radius
      borderRadius: 8,
    },
  },
};

/**
 * Ant Design Theme Provider
 *
 * Использование (в переходный период):
 * ```tsx
 * <AntdThemeProvider>
 *   <AntdButton>Legacy Button</AntdButton>
 * </AntdThemeProvider>
 * ```
 *
 * ВАЖНО: Этот провайдер временный и будет удален после миграции (FR-019)
 */
export function AntdThemeProvider({ children }: AntdThemeProviderProps) {
  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
}
