/**
 * Calendar Component - shadcn/ui
 *
 * Компонент календаря с кастомной отрисовкой ячеек для каждого дня.
 * Используется для отображения прогресса и статусов дней.
 */

"use client";

import React, { useMemo } from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

export interface CalendarProps {
  /** Текущая выбранная дата */
  value?: Dayjs;

  /** Обработчик выбора даты */
  onSelect?: (date: Dayjs) => void;

  /** Обработчик изменения месяца/года */
  onPanelChange?: (date: Dayjs) => void;

  /** Кастомная отрисовка содержимого ячейки дня */
  cellRender?: (date: Dayjs) => React.ReactNode;

  /** CSS класс */
  className?: string;

  /** Минимальная дата для выбора */
  minDate?: Dayjs;

  /** Максимальная дата для выбора */
  maxDate?: Dayjs;

  /** Отключить выбор дат */
  disabled?: boolean;
}

/**
 * Названия дней недели (короткие)
 */
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

/**
 * Генерация дней для отображения в календаре
 */
function generateCalendarDays(currentDate: Dayjs): Dayjs[] {
  const startOfMonth = currentDate.startOf("month");

  // Определяем начало календаря (понедельник текущей недели первого дня месяца)
  const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1; // 0 = воскресенье -> 6
  const calendarStart = startOfMonth.subtract(startDay, "day");

  // Генерируем 42 дня (6 недель)
  const days: Dayjs[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(calendarStart.add(i, "day"));
  }

  return days;
}

/**
 * Calendar - Компонент календаря
 *
 * Features:
 * - Навигация по месяцам
 * - Кастомная отрисовка ячеек (cellRender)
 * - Выбор даты
 * - Поддержка минимальной и максимальной даты
 * - Адаптивный дизайн
 *
 * @example
 * ```tsx
 * <Calendar
 *   value={selectedDate}
 *   onSelect={(date) => setSelectedDate(date)}
 *   onPanelChange={(date) => fetchMonthData(date)}
 *   cellRender={(date) => <CustomDayCell date={date} />}
 * />
 * ```
 */
export function Calendar({
  value = dayjs(),
  onSelect,
  onPanelChange,
  cellRender,
  className,
  minDate,
  maxDate,
  disabled = false,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(value);

  // Генерируем дни для отображения
  const days = useMemo(() => generateCalendarDays(currentDate), [currentDate]);

  // Обработчик переключения месяца
  const handlePreviousMonth = () => {
    const newDate = currentDate.subtract(1, "month");
    setCurrentDate(newDate);
    onPanelChange?.(newDate);
  };

  const handleNextMonth = () => {
    const newDate = currentDate.add(1, "month");
    setCurrentDate(newDate);
    onPanelChange?.(newDate);
  };

  // Обработчик клика на день
  const handleDayClick = (date: Dayjs) => {
    if (disabled) return;

    // Проверка на минимальную и максимальную дату
    if (minDate && date.isBefore(minDate, "day")) return;
    if (maxDate && date.isAfter(maxDate, "day")) return;

    onSelect?.(date);
  };

  // Проверка, является ли день текущим месяцем
  const isCurrentMonth = (date: Dayjs) => {
    return date.month() === currentDate.month();
  };

  // Проверка, является ли день сегодняшним
  const isToday = (date: Dayjs) => {
    return date.isSame(dayjs(), "day");
  };

  // Проверка, является ли день выбранным
  const isSelected = (date: Dayjs) => {
    return value && date.isSame(value, "day");
  };

  // Проверка, является ли день отключенным
  const isDisabled = (date: Dayjs) => {
    if (disabled) return true;
    if (minDate && date.isBefore(minDate, "day")) return true;
    if (maxDate && date.isAfter(maxDate, "day")) return true;
    return false;
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Заголовок с месяцем и годом */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className={cn(
            "p-2 rounded-md",
            "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-DEFAULT"
          )}
          aria-label="Предыдущий месяц"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
          {currentDate.format("MMMM YYYY")}
        </h2>

        <button
          type="button"
          onClick={handleNextMonth}
          className={cn(
            "p-2 rounded-md",
            "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-DEFAULT"
          )}
          aria-label="Следующий месяц"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Сетка дней */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dayDisabled = isDisabled(date);
          const dayIsCurrentMonth = isCurrentMonth(date);
          const dayIsToday = isToday(date);
          const dayIsSelected = isSelected(date);

          return (
            <div
              key={index}
              onClick={() => handleDayClick(date)}
              className={cn(
                // Базовые стили
                "relative min-h-[60px] p-2 rounded-md",
                "transition-all duration-200",
                "border border-transparent",

                // Стили для текущего месяца
                dayIsCurrentMonth ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900/50",

                // Сегодняшний день
                dayIsToday && "border-primary-DEFAULT dark:border-primary-light",

                // Выбранный день
                dayIsSelected && [
                  "bg-primary-light dark:bg-primary-dark/20",
                  "border-primary-DEFAULT dark:border-primary-light",
                ],

                // Hover эффект (только для активных дней)
                !dayDisabled &&
                  dayIsCurrentMonth && [
                    "cursor-pointer",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "hover:border-gray-300 dark:hover:border-gray-600",
                  ],

                // Отключенный день
                dayDisabled && ["opacity-40", "cursor-not-allowed"]
              )}
            >
              {/* Номер дня */}
              <div
                className={cn(
                  "text-sm font-medium mb-1",
                  dayIsCurrentMonth
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-400 dark:text-gray-600"
                )}
              >
                {date.date()}
              </div>

              {/* Кастомный контент ячейки */}
              {cellRender && <div className="text-xs">{cellRender(date)}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
