// USDA FoodData Central API client для поиска продуктов
// T064: USDA API client для nutritional data fallback

import axios from "axios";
import { USDAFoodSearchResult } from "@/entities/food-item/model/types";

const usdaClient = axios.create({
  baseURL: "https://api.nal.usda.gov/fdc/v1",
  params: {
    api_key: process.env.USDA_API_KEY,
  },
});

// Типы для USDA API ответа
interface USDANutrient {
  nutrientName: string;
  unitName: string;
  value: number;
}

interface USDAFood {
  description: string;
  foodNutrients: USDANutrient[];
}

/**
 * Поиск продукта по названию в базе USDA
 * @param query Поисковый запрос (название продукта)
 * @returns Массив найденных продуктов с питательной ценностью
 */
export async function searchFoodNutrition(query: string): Promise<USDAFoodSearchResult[]> {
  try {
    const response = await usdaClient.get<{ foods: USDAFood[] }>("/foods/search", {
      params: {
        query,
        pageSize: 5,
        dataType: "Survey (FNDDS)", // Наиболее полные данные о питательности
      },
    });

    return response.data.foods.map((food) => ({
      name: food.description,
      caloriesPer100g: getNutrient(food, "Energy", "kcal"),
      proteinPer100g: getNutrient(food, "Protein", "g"),
      fatsPer100g: getNutrient(food, "Total lipid (fat)", "g"),
      carbsPer100g: getNutrient(food, "Carbohydrate, by difference", "g"),
    }));
  } catch (error) {
    console.error("USDA API error:", error);
    return [];
  }
}

/**
 * Извлекает значение питательного вещества из данных USDA
 */
function getNutrient(food: USDAFood, nutrientName: string, unit: string): number {
  const nutrient = food.foodNutrients.find(
    (n) => n.nutrientName === nutrientName && n.unitName === unit
  );
  return nutrient ? nutrient.value : 0;
}
