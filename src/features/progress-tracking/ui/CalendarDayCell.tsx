/**
 * CalendarDayCell Component
 *
 * Отображает ячейку дня в календаре с визуальной индикацией достижения цели.
 * Зеленый цвет = цель достигнута, серый = цель не достигнута (§FR-018).
 */

"use client";

import React from "react";
import { Badge } from "@/shared/ui/shadcn/Badge";
import type { DailyLog } from "@/entities/daily-log/model/types";

interface CalendarDayCellProps {
  date: Date;
  dailyLog: DailyLog | null;
  onClick?: () => void;
}

export function CalendarDayCell({ dailyLog, onClick }: CalendarDayCellProps) {
  // Определение статуса бейджа на основе goalAchieved
  const badgeStatus = dailyLog?.goalAchieved ? "success" : dailyLog ? "default" : undefined;

  if (!dailyLog) return null;

  return (
    <div onClick={onClick} className="cursor-pointer p-1">
      <Badge status={badgeStatus} dot />
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        {Math.round(dailyLog.totalCalories)} ккал
      </div>
    </div>
  );
}
