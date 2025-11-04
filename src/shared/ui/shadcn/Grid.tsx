/**
 * Grid Component - Responsive Grid Layout
 *
 * Создает responsive grid layout с configurable количеством колонок
 * для разных breakpoints (mobile/tablet/desktop).
 *
 * Feature: 001-mobile-first-ui-redesign
 * Task: T055 [P] [US3]
 */

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import type { GridProps } from "@/specs/001-mobile-first-ui-redesign/contracts/component-contracts";

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    { columns = { mobile: 1, tablet: 2, desktop: 3 }, gap = 4, children, className, ...props },
    ref
  ) => {
    // Gap mapping (используем spacing tokens)
    const gapMap: Record<number, string> = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
      20: "gap-20",
      24: "gap-24",
    };

    // Columns mapping для responsive
    const getColumnClasses = () => {
      const classes: string[] = [];

      // Mobile columns (default)
      if (columns.mobile) {
        classes.push(`grid-cols-${columns.mobile}`);
      }

      // Tablet columns
      if (columns.tablet) {
        classes.push(`tablet:grid-cols-${columns.tablet}`);
      }

      // Desktop columns
      if (columns.desktop) {
        classes.push(`desktop:grid-cols-${columns.desktop}`);
      }

      return classes.join(" ");
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base grid
          "grid",

          // Gap
          gapMap[gap],

          // Responsive columns
          getColumnClasses(),

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

Grid.displayName = "Grid";

export { Grid };
