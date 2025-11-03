/**
 * Calendar Feature Store (Zustand)
 *
 * Управляет состоянием календаря прогресса: данные месяца, выбранный день, загрузка.
 * Spec: §US5, §FR-018 to §FR-020
 *
 * @module features/progress-tracking/model/calendar-store
 */

import { create } from "zustand";
import type { MonthData, DayDetails } from "@/entities/daily-log/model/types";

/**
 * Состояние календаря
 */
interface CalendarState {
  // Данные текущего месяца
  monthData: MonthData | null;

  // Детали выбранного дня
  selectedDayDetails: DayDetails | null;

  // Текущий год и месяц для отображения
  currentYear: number;
  currentMonth: number; // 1-12

  // Состояния загрузки
  isLoadingMonth: boolean;
  isLoadingDay: boolean;

  // Ошибки
  monthError: string | null;
  dayError: string | null;
}

/**
 * Действия календаря
 */
interface CalendarActions {
  // Установка данных месяца
  setMonthData: (data: MonthData) => void;

  // Установка деталей дня
  setDayDetails: (details: DayDetails | null) => void;

  // Переключение месяца
  setCurrentMonth: (year: number, month: number) => void;

  // Управление загрузкой месяца
  setLoadingMonth: (isLoading: boolean) => void;
  setMonthError: (error: string | null) => void;

  // Управление загрузкой дня
  setLoadingDay: (isLoading: boolean) => void;
  setDayError: (error: string | null) => void;

  // Сброс состояния
  reset: () => void;
}

/**
 * Начальное состояние
 */
const getInitialState = (): CalendarState => {
  const now = new Date();
  return {
    monthData: null,
    selectedDayDetails: null,
    currentYear: now.getFullYear(),
    currentMonth: now.getMonth() + 1, // 0-based → 1-based
    isLoadingMonth: false,
    isLoadingDay: false,
    monthError: null,
    dayError: null,
  };
};

/**
 * Zustand store для календаря прогресса
 */
export const useCalendarStore = create<CalendarState & CalendarActions>((set) => ({
  ...getInitialState(),

  setMonthData: (data) =>
    set({
      monthData: data,
      monthError: null,
    }),

  setDayDetails: (details) =>
    set({
      selectedDayDetails: details,
      dayError: null,
    }),

  setCurrentMonth: (year, month) =>
    set({
      currentYear: year,
      currentMonth: month,
      // Сбрасываем данные при смене месяца
      monthData: null,
      selectedDayDetails: null,
      monthError: null,
      dayError: null,
    }),

  setLoadingMonth: (isLoading) => set({ isLoadingMonth: isLoading }),

  setMonthError: (error) =>
    set({
      monthError: error,
      isLoadingMonth: false,
    }),

  setLoadingDay: (isLoading) => set({ isLoadingDay: isLoading }),

  setDayError: (error) =>
    set({
      dayError: error,
      isLoadingDay: false,
    }),

  reset: () => set(getInitialState()),
}));

/**
 * Селекторы для оптимизации re-renders
 */
export const selectMonthData = (state: CalendarState & CalendarActions) => state.monthData;
export const selectDayDetails = (state: CalendarState & CalendarActions) =>
  state.selectedDayDetails;
export const selectCurrentMonth = (state: CalendarState & CalendarActions) => ({
  year: state.currentYear,
  month: state.currentMonth,
});
export const selectIsLoading = (state: CalendarState & CalendarActions) => ({
  month: state.isLoadingMonth,
  day: state.isLoadingDay,
});
export const selectErrors = (state: CalendarState & CalendarActions) => ({
  month: state.monthError,
  day: state.dayError,
});
