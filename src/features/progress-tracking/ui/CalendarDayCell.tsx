/**
 * CalendarDayCell Component
 *
 * Отображает ячейку дня в календаре с визуальной индикацией достижения цели.
 * Зеленый цвет = цель достигнута, серый = цель не достигнута (§FR-018).
 */

"use client";

import React from "react";
import { Badge } from "antd";
import type { DailyLog } from "@/entities/daily-log/model/types";

interface CalendarDayCellProps {
  date: Date;
  dailyLog: DailyLog | null;
  onClick?: () => void;
}

export function CalendarDayCell({ dailyLog, onClick }: CalendarDayCellProps) {
  // Определение цвета бейджа на основе goalAchieved
  const badgeStatus = dailyLog?.goalAchieved ? "success" : dailyLog ? "default" : undefined;

  return (
    <div
      onClick={onClick}
      style={{
        cursor: dailyLog ? "pointer" : "default",
        padding: "4px",
      }}
    >
      <Badge status={badgeStatus} />
      {dailyLog && (
        <div style={{ fontSize: "12px", color: "#666" }}>
          {Math.round(dailyLog.totalCalories)} ккал
        </div>
      )}
    </div>
  );
}
