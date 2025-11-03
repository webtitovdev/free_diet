// Утилита для расчета питательной ценности на основе веса
// T083: Implement calorie calculation utility (weight-based macro calculation)

import { CreateFoodItemDto, UpdateFoodItemDto } from "@/entities/meal/model/types";

/**
 * Интерфейс для продукта с питательными данными на 100г
 */
export interface NutritionData {
  caloriesPer100g: number;
  proteinPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
}

/**
 * Результат расчета питательной ценности
 */
export interface CalculatedNutrition {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

/**
 * Рассчитывает фактическую питательную ценность продукта на основе его веса
 * @param weight Вес продукта в граммах
 * @param nutritionPer100g Питательная ценность на 100г
 * @returns Фактическая питательная ценность для заданного веса
 */
export function calculateNutrition(
  weight: number,
  nutritionPer100g: NutritionData
): CalculatedNutrition {
  if (weight <= 0) {
    throw new Error("Weight must be greater than 0");
  }

  const multiplier = weight / 100;

  return {
    calories: Math.round(nutritionPer100g.caloriesPer100g * multiplier * 10) / 10,
    protein: Math.round(nutritionPer100g.proteinPer100g * multiplier * 10) / 10,
    fats: Math.round(nutritionPer100g.fatsPer100g * multiplier * 10) / 10,
    carbs: Math.round(nutritionPer100g.carbsPer100g * multiplier * 10) / 10,
  };
}

/**
 * Рассчитывает суммарную питательную ценность массива продуктов
 * @param foodItems Массив продуктов с весом и питательной ценностью
 * @returns Суммарная питательная ценность
 */
export function calculateTotalNutrition(
  foodItems: Array<CreateFoodItemDto | UpdateFoodItemDto>
): CalculatedNutrition {
  return foodItems.reduce(
    (totals, item) => {
      if (!item.weight) return totals;

      const itemNutrition = calculateNutrition(item.weight, {
        caloriesPer100g: item.caloriesPer100g || 0,
        proteinPer100g: item.proteinPer100g || 0,
        fatsPer100g: item.fatsPer100g || 0,
        carbsPer100g: item.carbsPer100g || 0,
      });

      return {
        calories: totals.calories + itemNutrition.calories,
        protein: totals.protein + itemNutrition.protein,
        fats: totals.fats + itemNutrition.fats,
        carbs: totals.carbs + itemNutrition.carbs,
      };
    },
    { calories: 0, protein: 0, fats: 0, carbs: 0 }
  );
}

/**
 * Пересчитывает питательную ценность при изменении веса
 * @param oldWeight Старый вес
 * @param newWeight Новый вес
 * @param oldNutrition Старая питательная ценность
 * @returns Новая питательная ценность
 */
export function recalculateNutritionOnWeightChange(
  oldWeight: number,
  newWeight: number,
  oldNutrition: CalculatedNutrition
): CalculatedNutrition {
  if (oldWeight <= 0) {
    throw new Error("Old weight must be greater than 0");
  }

  // Вычисляем питательность на 100г из старых данных
  const nutritionPer100g: NutritionData = {
    caloriesPer100g: (oldNutrition.calories / oldWeight) * 100,
    proteinPer100g: (oldNutrition.protein / oldWeight) * 100,
    fatsPer100g: (oldNutrition.fats / oldWeight) * 100,
    carbsPer100g: (oldNutrition.carbs / oldWeight) * 100,
  };

  // Рассчитываем новую питательность на основе нового веса
  return calculateNutrition(newWeight, nutritionPer100g);
}
