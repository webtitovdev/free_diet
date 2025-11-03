/**
 * Calendar Page Component
 * Страница календаря прогресса
 */

"use client";

import React from "react";
import { Typography } from "antd";
import { CalendarView } from "@/widgets/calendar-view/CalendarView";

const { Title } = Typography;

export function CalendarPage() {
  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Календарь Прогресса</Title>
      <CalendarView />
    </div>
  );
}
