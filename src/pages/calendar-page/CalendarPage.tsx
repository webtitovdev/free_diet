/**
 * Calendar Page Component
 * Страница календаря прогресса
 *
 * Updated: T056 [US3] - Wrapped в Container компонент для desktop центрирования
 */

"use client";

import React from "react";
import { Typography } from "antd";
import { CalendarView } from "@/widgets/calendar-view/CalendarView";
import { Container } from "@/shared/ui/shadcn/Container";

const { Title } = Typography;

export default function CalendarPage() {
  return (
    <Container maxWidth="desktop" padding={6} centered>
      <Title level={2}>Календарь Прогресса</Title>
      <CalendarView />
    </Container>
  );
}
