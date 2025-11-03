/**
 * Calendar Route
 * Роут календаря прогресса
 */

import CalendarPage from "@/pages/calendar-page/CalendarPage";

// Отключаем статическую генерацию для страницы с аутентификацией
export const dynamic = "force-dynamic";

export default function Calendar() {
  return <CalendarPage />;
}
