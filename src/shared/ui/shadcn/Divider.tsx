/**
 * Divider Component - shadcn/ui
 *
 * Простой разделитель с опциональным текстом по центру
 */

import React from "react";
import { cn } from "@/shared/lib/utils";

export interface DividerProps {
  /** Текст по центру (опционально) */
  children?: React.ReactNode;

  /** CSS класс */
  className?: string;

  /** Ориентация */
  orientation?: "horizontal" | "vertical";
}

/**
 * Divider компонент
 */
export const Divider: React.FC<DividerProps> = ({
  children,
  className,
  orientation = "horizontal",
}) => {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("w-px h-full bg-border-default dark:bg-gray-600", className)}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (children) {
    return (
      <div
        className={cn("flex items-center gap-4 my-6", className)}
        role="separator"
        aria-orientation="horizontal"
      >
        <div className="flex-1 h-px bg-border-default dark:bg-gray-600" />
        <span className="text-sm text-text-secondary dark:text-gray-400">{children}</span>
        <div className="flex-1 h-px bg-border-default dark:bg-gray-600" />
      </div>
    );
  }

  return (
    <hr
      className={cn("border-0 h-px bg-border-default dark:bg-gray-600 my-6", className)}
      role="separator"
      aria-orientation="horizontal"
    />
  );
};
