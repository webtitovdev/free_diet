/**
 * DailyLog Entity Types
 *
 * Представляет агрегированную дневную сводку по питанию для календаря прогресса.
 * Spec: §US5, §FR-018 to §FR-020
 */

/**
 * Дневная запись питания для календаря
 */
export interface DailyLog {
  id: string;
  userId: string;
  date: Date; // Дата без времени (только год-месяц-день)
  totalCalories: number; // Сумма калорий всех приемов пищи за день
  totalProtein: number; // Сумма белков (г)
  totalFats: number; // Сумма жиров (г)
  totalCarbs: number; // Сумма углеводов (г)
  deviationPercent: number; // Отклонение от targetCalories в процентах
  goalAchieved: boolean; // true если в пределах ±10% от цели (§FR-019)
}

/**
 * DTO для создания/обновления DailyLog
 */
export interface DailyLogInput {
  userId: string;
  date: Date;
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
  targetCalories: number; // Для расчета deviationPercent и goalAchieved
}

/**
 * Данные календаря за месяц
 */
export interface MonthData {
  year: number;
  month: number; // 1-12
  dailyLogs: DailyLog[];
  stats: MonthStats;
}

/**
 * Статистика за месяц
 */
export interface MonthStats {
  totalDays: number; // Количество дней с записями
  daysWithGoalAchieved: number; // Количество дней с достигнутой целью
  averageCalories: number; // Средняя калорийность за месяц
  successRate: number; // Процент дней с достигнутой целью (0-100)
}

/**
 * Детальная информация по дню
 */
export interface DayDetails {
  date: Date;
  dailyLog: DailyLog | null;
  meals: DayMeal[];
}

/**
 * Информация о приеме пищи для отображения в детальном виде дня
 */
export interface DayMeal {
  id: string;
  category: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  time: Date;
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
  foodItemsCount: number;
}
