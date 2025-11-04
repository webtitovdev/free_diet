/**
 * Diary Route
 * Роут дневника питания
 */

import DiaryPage from "@/pages/diary/ui/DiaryPage";

// Отключаем статическую генерацию для страницы с аутентификацией
export const dynamic = "force-dynamic";

export default function Diary() {
  return <DiaryPage />;
}
