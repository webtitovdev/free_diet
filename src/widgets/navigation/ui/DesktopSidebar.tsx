/**
 * DesktopSidebar - Боковая навигационная панель для desktop
 *
 * T059 [US3]: Sidebar для desktop с теми же navigation items но в вертикальном layout.
 * Скрыта на мобильных устройствах, отображается только на desktop (>1024px).
 *
 * @see specs/001-mobile-first-ui-redesign/tasks.md (T059)
 * @see specs/001-mobile-first-ui-redesign/research.md (responsive navigation patterns)
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import type { NavigationItem } from "@/specs/001-mobile-first-ui-redesign/contracts/component-contracts";

export interface DesktopSidebarProps {
  /** Навигационные элементы */
  items: NavigationItem[];

  /** Активный элемент (опционально, auto-detect из pathname) */
  activeItem?: string;

  /** Обработчик клика на элемент */
  onItemClick?: (itemId: string) => void;

  /** CSS класс */
  className?: string;
}

/**
 * DesktopSidebar компонент
 */
export function DesktopSidebar({ items, activeItem, onItemClick, className }: DesktopSidebarProps) {
  const pathname = usePathname();
  const currentActive = activeItem || pathname;

  return (
    <aside
      className={cn(
        // Базовые стили
        "fixed left-0 top-0 h-screen w-64",
        "bg-background-primary dark:bg-gray-900",
        "border-r border-border-default dark:border-gray-700",
        "flex flex-col",
        "z-40",
        // Скрыт на мобильных и tablet, виден на desktop
        "hidden desktop:flex",
        className
      )}
      role="navigation"
      aria-label="Боковая навигация"
    >
      {/* Logo/Header */}
      <div className="p-6 border-b border-border-default dark:border-gray-700">
        <h1 className="text-2xl font-bold text-brand-DEFAULT dark:text-brand-light">Free Diet</h1>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">Трекер питания</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const isActive = currentActive === item.href || currentActive === item.id;
          // Центральный item (кнопка "Добавить") - делаем выделенным
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
                "flex items-center gap-3",
                "px-4 py-3",
                "rounded-DEFAULT",
                "transition-all duration-200 ease-in-out",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-DEFAULT dark:focus-visible:outline-brand-light",

                // Центральная CTA - выделяется
                isCentralCTA
                  ? [
                      "bg-brand-DEFAULT text-white dark:bg-brand-dark",
                      "hover:bg-brand-dark dark:hover:bg-brand-DEFAULT",
                      "shadow-md hover:shadow-lg",
                      "font-semibold",
                    ]
                  : [
                      // Обычные items
                      item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                      isActive && [
                        "bg-brand-pastel/50 dark:bg-brand-dark/30",
                        "text-brand-DEFAULT dark:text-brand-light",
                        "font-medium",
                      ],
                      !isActive && [
                        "text-text-secondary dark:text-gray-400",
                        "hover:bg-background-secondary dark:hover:bg-gray-800",
                      ],
                    ]
              )}
              aria-label={item.ariaLabel || item.label}
              aria-current={isActive ? "page" : undefined}
              tabIndex={item.disabled ? -1 : 0}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex items-center justify-center",
                  "w-6 h-6",
                  "transition-colors duration-200",
                  isCentralCTA
                    ? "text-white"
                    : isActive
                      ? "text-brand-DEFAULT dark:text-brand-light"
                      : "text-text-secondary dark:text-gray-400"
                )}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span className="flex-1 text-base">{item.label}</span>

              {/* Badge */}
              {item.badge !== undefined && item.badge > 0 && (
                <div
                  className={cn(
                    "min-w-[20px] h-[20px]",
                    "flex items-center justify-center",
                    "bg-error dark:bg-red-600 text-white",
                    "rounded-full",
                    "text-xs font-semibold",
                    "px-1.5"
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

      {/* Footer */}
      <div className="p-4 border-t border-border-default dark:border-gray-700">
        <p className="text-xs text-text-secondary dark:text-gray-400 text-center">
          © 2025 Free Diet
        </p>
      </div>
    </aside>
  );
}
