// Компонент для редактирования веса продукта с пересчетом
// T092: Create WeightEditor component with real-time recalculation

"use client";

import React from "react";
import { Input } from "@/shared/ui/input/Input";
import { useMealEditingStore } from "../model/meal-store";

interface WeightEditorProps {
  index: number;
  currentWeight: number;
  caloriesPer100g: number;
  label?: string;
}

export const WeightEditor: React.FC<WeightEditorProps> = ({
  index,
  currentWeight,
  caloriesPer100g,
  label = "Вес",
}) => {
  const { updateFoodItemWeight } = useMealEditingStore();

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateFoodItemWeight(index, value);
    }
  };

  // Расчет калорий для текущего веса (для подсказки)
  const currentCalories = Math.round((currentWeight / 100) * caloriesPer100g);

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">{label}:</span>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={1}
            max={10000}
            value={currentWeight}
            onChange={handleWeightChange}
            className="w-24"
          />
          <span className="text-sm">г</span>
        </div>
        <span className="text-xs text-muted-foreground">≈ {currentCalories} ккал</span>
      </div>
    </div>
  );
};
