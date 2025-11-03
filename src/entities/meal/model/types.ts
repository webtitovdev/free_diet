// Meal entity types для сохранения и управления приемами пищи
// T082: Meal entity model types (MealCategory enum)

import { FoodItem as PrismaFoodItem } from "@prisma/client";

// Категория приема пищи
export enum MealCategory {
  BREAKFAST = "BREAKFAST", // Завтрак (6:00-11:00)
  LUNCH = "LUNCH", // Обед (11:00-16:00)
  DINNER = "DINNER", // Ужин (16:00-21:00)
  SNACK = "SNACK", // Перекус (другое время)
}

// Основной тип Meal
export interface Meal {
  id: string;
  userId: string;
  photoId: string | null;
  date: Date;
  category: MealCategory;
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
  createdAt: Date;
  foodItems?: FoodItem[];
}

// FoodItem для meal
export interface FoodItem extends PrismaFoodItem {
  // Расширяем Prisma тип если нужно
}

// DTO для создания meal
export interface CreateMealDto {
  photoId?: string | null;
  category: MealCategory;
  foodItems: CreateFoodItemDto[];
  clientTimezoneOffset?: number; // Опционально для категории
}

// DTO для создания food item
export interface CreateFoodItemDto {
  name: string;
  weight: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
  addedManually?: boolean;
}

// DTO для обновления meal
export interface UpdateMealDto {
  category?: MealCategory;
  foodItems?: UpdateFoodItemDto[];
}

// DTO для обновления food item
export interface UpdateFoodItemDto {
  id?: string; // Если есть - обновление, если нет - создание
  name?: string;
  weight?: number;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  fatsPer100g?: number;
  carbsPer100g?: number;
  addedManually?: boolean;
}

// Meal с полной информацией (для детального просмотра)
export interface MealWithItems extends Meal {
  foodItems: FoodItem[];
}

// Response от API
export interface MealResponse {
  meal: MealWithItems;
  message?: string;
}

// Meal statistics
export interface MealStats {
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
}
