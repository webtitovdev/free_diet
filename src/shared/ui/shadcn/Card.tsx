/**
 * Card Component - shadcn/ui
 *
 * Универсальный компонент карточки для отображения контента с поддержкой
 * вариантов, настраиваемых отступов, скруглений и теней.
 *
 * @see specs/001-mobile-first-ui-redesign/contracts/component-contracts.ts
 */

import React from "react";
import { cn } from "@/shared/lib/utils";

export type CardVariant = "default" | "outlined" | "elevated";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Вариант отображения карточки */
  variant?: CardVariant;

  /** Скругление углов */
  borderRadius?: "sm" | "default" | "md" | "lg" | "xl";

  /** Тень */
  shadow?: "none" | "sm" | "default" | "md" | "lg";

  /** Дочерние элементы */
  children: React.ReactNode;

  /** CSS класс для кастомизации */
  className?: string;

  /** Делает карточку интерактивной (hover эффекты) */
  interactive?: boolean;
}

/**
 * Варианты стилей карточек
 */
const cardVariants: Record<CardVariant, string> = {
  default:
    "bg-background-primary border border-border-default dark:bg-gray-800 dark:border-gray-700",
  outlined: "bg-transparent border-2 border-border-default dark:border-gray-600 dark:text-gray-100",
  elevated: "bg-background-primary border-0 dark:bg-gray-800",
};

/**
 * Скругление углов (используем Tailwind классы из borderRadius tokens)
 */
const borderRadiusMap: Record<string, string> = {
  sm: "rounded-sm",
  default: "rounded-DEFAULT",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

/**
 * Тени (используем Tailwind классы из shadow tokens)
 */
const shadowMap: Record<string, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  default: "shadow-DEFAULT",
  md: "shadow-md",
  lg: "shadow-lg",
};

/**
 * Card компонент
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      borderRadius = "default",
      shadow = "default",
      children,
      className,
      interactive = false,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          // Базовые стили
          "p-4 mobile:p-6 transition-all duration-200 ease-in-out",
          // Вариант
          cardVariants[variant],
          // Скругление
          borderRadiusMap[borderRadius],
          // Тень
          shadowMap[shadow],
          // Интерактивность (T057: desktop hover эффекты)
          interactive && [
            "cursor-pointer",
            "desktop:hover:shadow-lg desktop:hover:scale-[1.02]",
            "active:scale-[0.98]",
          ],
          // Кастомные классы
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/**
 * Card Header - опциональный компонент для заголовка карточки
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mb-4 flex flex-col gap-1.5", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

/**
 * Card Title - заголовок карточки
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-lg font-semibold text-text-primary dark:text-gray-100", className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

/**
 * Card Description - описание карточки
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-text-secondary dark:text-gray-400", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = "CardDescription";

/**
 * Card Content - контент карточки
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

/**
 * Card Footer - футер карточки
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mt-4 flex items-center gap-2", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";
