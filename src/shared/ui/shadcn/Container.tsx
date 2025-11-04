/**
 * Container Component - Desktop Layout Component
 *
 * Центрирует контент с максимальной шириной для desktop экранов.
 * Обеспечивает консистентный layout на всех страницах.
 *
 * Feature: 001-mobile-first-ui-redesign
 * Task: T054 [P] [US3]
 */

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { ContainerProps } from "@/specs/001-mobile-first-ui-redesign/contracts/component-contracts";

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = "desktop", padding = 4, centered = true, children, className, ...props }, ref) => {
    // Max width mapping (FR-013: desktop max-width 1200-1400px)
    const maxWidthStyles = {
      mobile: "max-w-full",
      tablet: "max-w-full",
      desktop: "max-w-[1200px]", // 1200px согласно plan.md
      full: "max-w-none",
    };

    // Padding mapping (используем spacing tokens)
    const paddingMap: Record<number, string> = {
      0: "p-0",
      1: "p-1",
      2: "p-2",
      3: "p-3",
      4: "p-4",
      5: "p-5",
      6: "p-6",
      8: "p-8",
      10: "p-10",
      12: "p-12",
      16: "p-16",
      20: "p-20",
      24: "p-24",
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "w-full",

          // Max width
          maxWidthStyles[maxWidth],

          // Центрирование
          centered && "mx-auto",

          // Padding
          paddingMap[padding],

          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export { Container };
