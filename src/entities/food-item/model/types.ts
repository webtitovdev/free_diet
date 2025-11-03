// Типы для FoodItem entity
// T056: FoodItem entity model types

/**
 * Продукт питания в приеме пищи
 */
export interface FoodItem {
  id: string;
  mealId: string;
  name: string; // Название продукта (русский)
  weight: number; // Вес в граммах
  caloriesPer100g: number; // Калории на 100г
  proteinPer100g: number; // Белки на 100г (граммы)
  fatsPer100g: number; // Жиры на 100г (граммы)
  carbsPer100g: number; // Углеводы на 100г (граммы)
  addedManually: boolean; // true если добавлен вручную, false если распознан API
}

/**
 * Данные для создания продукта
 */
export interface CreateFoodItemData {
  mealId: string;
  name: string;
  weight: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
  addedManually: boolean;
}

/**
 * Результат распознавания продукта из фотографии (OpenRouter API)
 */
export interface RecognizedFoodItem {
  name: string;
  weight_grams: number; // Оценка веса из визуального анализа (точность ±20-30%)
  calories_per_100g: number;
  protein_per_100g: number;
  fats_per_100g: number;
  carbs_per_100g: number;
  confidence: number; // 0-1, уверенность распознавания
}

/**
 * Результат поиска продукта в базе USDA
 */
export interface USDAFoodSearchResult {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
}
