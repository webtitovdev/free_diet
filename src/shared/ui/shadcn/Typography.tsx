/**
 * Typography Components
 *
 * Компоненты типографики с адаптивными размерами шрифтов.
 * Mobile: 24-32px headings, 14-16px body
 * Desktop: 28-36px headings, 16-18px body
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T043)
 */

import React from "react";
import { cn } from "@/shared/lib/utils";

/**
 * Heading Component - h1-h6 с адаптивными размерами
 */
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Уровень заголовка */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /** Дочерние элементы */
  children: React.ReactNode;

  /** CSS класс */
  className?: string;

  /** Centered alignment */
  centered?: boolean;
}

export function Heading({ level = 1, children, className, centered, ...props }: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  // Адаптивные размеры согласно FR-009
  const sizeClasses = {
    1: "text-2xl mobile:text-3xl desktop:text-4xl font-bold", // mobile: 24px, tablet: 28px, desktop: 36px
    2: "text-xl mobile:text-2xl desktop:text-3xl font-bold", // mobile: 20px, tablet: 24px, desktop: 30px
    3: "text-lg mobile:text-xl desktop:text-2xl font-semibold", // mobile: 18px, tablet: 20px, desktop: 24px
    4: "text-base mobile:text-lg desktop:text-xl font-semibold", // mobile: 16px, tablet: 18px, desktop: 20px
    5: "text-sm mobile:text-base desktop:text-lg font-medium", // mobile: 14px, tablet: 16px, desktop: 18px
    6: "text-xs mobile:text-sm desktop:text-base font-medium", // mobile: 12px, tablet: 14px, desktop: 16px
  };

  return (
    <Tag
      className={cn(
        sizeClasses[level],
        "text-gray-900 dark:text-gray-100",
        centered && "text-center",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * Text Component - body text с адаптивными размерами
 */
export type TextSize = "sm" | "base" | "lg";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Размер текста */
  size?: TextSize;

  /** Дочерние элементы */
  children: React.ReactNode;

  /** CSS класс */
  className?: string;

  /** Цвет текста */
  variant?: "primary" | "secondary" | "disabled";

  /** Жирный текст */
  bold?: boolean;

  /** Centered alignment */
  centered?: boolean;
}

export function Text({
  size = "base",
  children,
  className,
  variant = "primary",
  bold,
  centered,
  ...props
}: TextProps) {
  // Адаптивные размеры согласно FR-009
  const sizeClasses = {
    sm: "text-xs mobile:text-sm desktop:text-sm", // 12px -> 14px
    base: "text-sm mobile:text-base desktop:text-base", // 14px -> 16px
    lg: "text-base mobile:text-lg desktop:text-lg", // 16px -> 18px
  };

  const variantClasses = {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-600 dark:text-gray-400",
    disabled: "text-gray-400 dark:text-gray-600",
  };

  return (
    <p
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        bold && "font-semibold",
        centered && "text-center",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Caption Component - вспомогательный текст (xs размер)
 */
export interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Дочерние элементы */
  children: React.ReactNode;

  /** CSS класс */
  className?: string;

  /** Цвет текста */
  variant?: "primary" | "secondary" | "disabled";
}

export function Caption({ children, className, variant = "secondary", ...props }: CaptionProps) {
  const variantClasses = {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-600 dark:text-gray-400",
    disabled: "text-gray-400 dark:text-gray-600",
  };

  return (
    <span className={cn("text-xs", variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}

/**
 * Link Component - стилизованная ссылка
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Дочерние элементы */
  children: React.ReactNode;

  /** CSS класс */
  className?: string;

  /** External link (открывается в новой вкладке) */
  external?: boolean;
}

export function Link({ children, className, external, ...props }: LinkProps) {
  return (
    <a
      className={cn(
        "text-brand-DEFAULT dark:text-brand-light",
        "underline underline-offset-2",
        "hover:text-brand-dark dark:hover:text-brand-DEFAULT",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-DEFAULT focus-visible:ring-offset-2 rounded",
        className
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Label Component - label для form элементов
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Дочерние элементы */
  children: React.ReactNode;

  /** CSS класс */
  className?: string;

  /** Required marker */
  required?: boolean;
}

export function Label({ children, className, required, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-gray-700 dark:text-gray-300", className)}
      {...props}
    >
      {children}
      {required && <span className="text-error-DEFAULT ml-1">*</span>}
    </label>
  );
}
