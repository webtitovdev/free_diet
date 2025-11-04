"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { TopHeaderProps } from "@/specs/001-mobile-first-ui-redesign/contracts/component-contracts";

/**
 * TopHeader - Верхний заголовок страницы
 *
 * Отображает заголовок страницы с опциональными действиями слева и справа.
 * Поддерживает sticky positioning и показ тени при скролле.
 */
export function TopHeader({
  title,
  leftAction,
  rightAction,
  sticky = false,
  showShadowOnScroll = false,
  className,
}: TopHeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!showShadowOnScroll) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showShadowOnScroll]);

  return (
    <header
      className={cn(
        "w-full bg-background-primary dark:bg-gray-900",
        "flex items-center justify-between",
        "px-4 py-3",
        "mobile:px-6 mobile:py-4",
        "z-40",
        sticky && "sticky top-0",
        showShadowOnScroll && isScrolled && "shadow-md dark:shadow-lg",
        "transition-shadow duration-200 ease-in-out",
        className
      )}
      role="banner"
    >
      <div className="flex items-center min-w-[44px]">
        {leftAction && (
          <div
            className={cn(
              "flex items-center justify-center",
              "min-w-[44px] min-h-[44px]",
              "mobile:min-w-[48px] mobile:min-h-[48px]"
            )}
          >
            {leftAction}
          </div>
        )}
      </div>

      <h1
        className={cn(
          "text-lg font-semibold text-text-primary dark:text-gray-100",
          "mobile:text-xl",
          "desktop:text-2xl",
          "text-center flex-1",
          "truncate px-2"
        )}
      >
        {title}
      </h1>

      <div className="flex items-center min-w-[44px] justify-end">
        {rightAction && (
          <div
            className={cn(
              "flex items-center justify-center",
              "min-w-[44px] min-h-[44px]",
              "mobile:min-w-[48px] mobile:min-h-[48px]"
            )}
          >
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
}
