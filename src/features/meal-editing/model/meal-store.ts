// Zustand store для управления состоянием редактирования meal
// T090: Create meal editing feature store (editedMeal, recalculate)

import { create } from "zustand";
import { MealCategory, CreateFoodItemDto, MealStats } from "@/entities/meal/model/types";
import { calculateTotalNutrition } from "@/entities/food-item/lib/calculate-nutrition";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";

interface MealEditingState {
  // Состояние meal
  category: MealCategory | null;
  foodItems: CreateFoodItemDto[];
  photoId: string | null;

  // Вычисляемая статистика
  stats: MealStats;

  // Ошибки
  error: string | null;

  // Методы
  setCategory: (category: MealCategory) => void;
  setFoodItems: (items: RecognizedFoodItem[]) => void;
  updateFoodItemWeight: (index: number, newWeight: number) => void;
  removeFoodItem: (index: number) => void;
  addFoodItem: (item: CreateFoodItemDto) => void;
  setPhotoId: (photoId: string | null) => void;
  recalculateStats: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  category: null,
  foodItems: [],
  photoId: null,
  stats: {
    totalCalories: 0,
    totalProtein: 0,
    totalFats: 0,
    totalCarbs: 0,
  },
  error: null,
};

export const useMealEditingStore = create<MealEditingState>((set, get) => ({
  ...initialState,

  setCategory: (category) => {
    set({ category, error: null });
  },

  setFoodItems: (items) => {
    const foodItems: CreateFoodItemDto[] = items.map((item) => ({
      name: item.name,
      weight: item.weight_grams,
      caloriesPer100g: item.calories_per_100g,
      proteinPer100g: item.protein_per_100g,
      fatsPer100g: item.fats_per_100g,
      carbsPer100g: item.carbs_per_100g,
      addedManually: false,
    }));

    set({ foodItems, error: null });
    get().recalculateStats();
  },

  updateFoodItemWeight: (index, newWeight) => {
    const foodItems = [...get().foodItems];
    if (index >= 0 && index < foodItems.length) {
      foodItems[index] = {
        ...foodItems[index],
        weight: newWeight,
      };
      set({ foodItems, error: null });
      get().recalculateStats();
    }
  },

  removeFoodItem: (index) => {
    const foodItems = get().foodItems.filter((_, i) => i !== index);
    set({ foodItems, error: null });
    get().recalculateStats();
  },

  addFoodItem: (item) => {
    const foodItems = [...get().foodItems, item];
    set({ foodItems, error: null });
    get().recalculateStats();
  },

  setPhotoId: (photoId) => {
    set({ photoId, error: null });
  },

  recalculateStats: () => {
    const { foodItems } = get();
    const totals = calculateTotalNutrition(foodItems);

    set({
      stats: {
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalFats: totals.fats,
        totalCarbs: totals.carbs,
      },
    });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => {
    set(initialState);
  },
}));
