"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import type { BottomNavigationProps } from "@/specs/001-mobile-first-ui-redesign/contracts/component-contracts";

/**
 * BottomNavigation - Нижняя навигационная панель для мобильных устройств
 *
 * Следует паттернам MyFitnessPal/Instagram для thumb-friendly навигации.
 * Располагается внизу экрана для легкого доступа большим пальцем.
 */
export function BottomNavigation({
  items,
  activeItem,
  onItemClick,
  position = "fixed",
  className,
  showLabels = true,
}: BottomNavigationProps) {
  const pathname = usePathname();
  const currentActive = activeItem || pathname;

  return (
    <nav
      className={cn(
        "w-full bg-background-primary dark:bg-gray-900 border-t border-border-default dark:border-gray-700",
        "flex items-center justify-around",
        "z-50",
        "h-16 px-2",
        "mobile:h-[72px]",
        position === "fixed" && "fixed bottom-0 left-0 right-0",
        position === "sticky" && "sticky bottom-0",
        "shadow-md dark:shadow-lg",
        // T059: Скрыть на desktop
        "desktop:hidden",
        className
      )}
      role="navigation"
      aria-label="Главная навигация"
    >
      {items.map((item) => {
        const isActive = currentActive === item.href || currentActive === item.id;
        // Центральный item (кнопка "Добавить")
        const isCentralCTA = item.id === "add-meal";

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={(e) => {
              if (onItemClick) {
                e.preventDefault();
                onItemClick(item.id);
              }
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              "relative",
              "transition-all duration-200 ease-in-out",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-DEFAULT dark:focus-visible:outline-brand-light",

              // Центральная CTA кнопка - выделяется
              isCentralCTA
                ? [
                    // Больший размер для CTA
                    "min-w-[56px] min-h-[56px]",
                    "mobile:min-w-[64px] mobile:min-h-[64px]",
                    // Круглая форма
                    "rounded-full",
                    // Brand background
                    "bg-brand-DEFAULT text-white dark:bg-brand-dark dark:hover:bg-brand-DEFAULT",
                    // Elevated shadow
                    "shadow-lg dark:shadow-xl",
                    // Hover эффект
                    "hover:bg-brand-dark hover:shadow-xl hover:scale-110",
                    // Поднимаем визуально вверх
                    "-translate-y-2",
                  ]
                : [
                    // Обычные items
                    "min-w-[44px] min-h-[44px]",
                    "mobile:min-w-[56px] mobile:min-h-[56px]",
                    "flex-1",
                    item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                    isActive && "scale-105",
                    !item.disabled &&
                      "desktop:hover:bg-background-secondary dark:desktop:hover:bg-gray-800 desktop:rounded-md",
                  ]
            )}
            aria-label={item.ariaLabel || item.label}
            aria-current={isActive ? "page" : undefined}
            tabIndex={item.disabled ? -1 : 0}
          >
            <div
              className={cn(
                "flex items-center justify-center",
                "transition-colors duration-200",

                // Размер иконки - больше для CTA
                isCentralCTA ? "w-8 h-8" : "w-6 h-6",

                // Цвет иконки
                isCentralCTA
                  ? "text-white" // Белая иконка для CTA
                  : isActive
                    ? "text-brand-DEFAULT dark:text-brand-light"
                    : "text-text-secondary dark:text-gray-400"
              )}
            >
              {item.icon}
            </div>

            {/* Label скрываем для CTA кнопки */}
            {showLabels && !isCentralCTA && (
              <span
                className={cn(
                  "text-xs font-medium",
                  "transition-colors duration-200",
                  "text-center",
                  isActive
                    ? "text-brand-DEFAULT dark:text-brand-light"
                    : "text-text-secondary dark:text-gray-400"
                )}
              >
                {item.label}
              </span>
            )}

            {item.badge !== undefined && item.badge > 0 && (
              <div
                className={cn(
                  "absolute top-0 right-2",
                  "min-w-[18px] h-[18px]",
                  "flex items-center justify-center",
                  "bg-error dark:bg-red-600 text-white",
                  "rounded-full",
                  "text-xs font-semibold",
                  "px-1"
                )}
                aria-label={`${item.badge} уведомлений`}
              >
                {item.badge > 99 ? "99+" : item.badge}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
