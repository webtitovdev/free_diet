/**
 * Calendar Page Component
 * Страница календаря прогресса
 *
 * Updated: T056 [US3] - Wrapped в Container компонент для desktop центрирования
 */

"use client";

import React from "react";
import { CalendarView } from "@/widgets/calendar-view/CalendarView";
import { Container } from "@/shared/ui/shadcn/Container";

export default function CalendarPage() {
  return (
    <Container maxWidth="desktop" padding={6} centered>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Календарь Прогресса
      </h2>
      <CalendarView />
    </Container>
  );
}
