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
    <Container maxWidth="desktop" padding={6} centered className="space-y-8 animate-slideUp">
      {/* Заголовок с градиентом */}
      <div className="relative overflow-hidden rounded-3xl p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Календарь Прогресса 📅</h1>
          <p className="text-lg text-orange-100">
            Отслеживайте достижения день за днем
          </p>
        </div>
      </div>

      {/* Calendar View с тенью */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl">
        <div className="bg-white dark:bg-slate-800 p-6">
          <CalendarView />
        </div>
      </div>
    </Container>
  );
}
