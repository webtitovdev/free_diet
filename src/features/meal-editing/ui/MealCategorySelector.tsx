// Компонент для выбора категории приема пищи
// T093: Create MealCategorySelector component (Ant Design Select)

"use client";

import React, { useEffect } from "react";
import { Coffee, Utensils, Moon, Apple } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select/Select";
import { MealCategory } from "@/entities/meal/model/types";
import { useMealEditingStore } from "../model/meal-store";
import { suggestMealCategory, getClientTimezoneOffset } from "@/entities/meal/lib/suggest-category";

const categoryLabels = {
  [MealCategory.BREAKFAST]: "Завтрак",
  [MealCategory.LUNCH]: "Обед",
  [MealCategory.DINNER]: "Ужин",
  [MealCategory.SNACK]: "Перекус",
};

const categoryIcons = {
  [MealCategory.BREAKFAST]: <Coffee className="h-4 w-4" />,
  [MealCategory.LUNCH]: <Utensils className="h-4 w-4" />,
  [MealCategory.DINNER]: <Moon className="h-4 w-4" />,
  [MealCategory.SNACK]: <Apple className="h-4 w-4" />,
};

export const MealCategorySelector: React.FC = () => {
  const { category, setCategory } = useMealEditingStore();

  // Автоматически предлагаем категорию при монтировании если не выбрана
  useEffect(() => {
    if (!category) {
      const suggested = suggestMealCategory(getClientTimezoneOffset());
      setCategory(suggested);
    }
  }, [category, setCategory]);

  const handleCategoryChange = (value: string) => {
    setCategory(value as MealCategory);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2">Категория приема пищи:</label>
      <Select value={category || undefined} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите категорию" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(MealCategory).map((cat) => (
            <SelectItem key={cat} value={cat}>
              <div className="flex items-center gap-2">
                {categoryIcons[cat]}
                <span>{categoryLabels[cat]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
