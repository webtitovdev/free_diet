// API методы для работы с meal
// T091: Create meal API methods (create, update, delete meal)

import axios from "axios";
import {
  CreateMealDto,
  UpdateMealDto,
  MealResponse,
  MealWithItems,
} from "@/entities/meal/model/types";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Создать новый meal
 */
export async function createMeal(data: CreateMealDto): Promise<MealWithItems> {
  const response = await apiClient.post<MealResponse>("/meals", data);
  return response.data.meal;
}

/**
 * Обновить существующий meal
 */
export async function updateMeal(mealId: string, data: UpdateMealDto): Promise<MealWithItems> {
  const response = await apiClient.patch<MealResponse>(`/meals/${mealId}`, data);
  return response.data.meal;
}

/**
 * Получить meal по ID
 */
export async function getMeal(mealId: string): Promise<MealWithItems> {
  const response = await apiClient.get<{ meal: MealWithItems }>(`/meals/${mealId}`);
  return response.data.meal;
}

/**
 * Удалить meal
 */
export async function deleteMeal(mealId: string): Promise<void> {
  await apiClient.delete(`/meals/${mealId}`);
}
