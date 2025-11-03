// Компонент для редактирования веса продукта с пересчетом
// T092: Create WeightEditor component with real-time recalculation

"use client";

import React from "react";
import { InputNumber, Typography } from "antd";
import { useMealEditingStore } from "../model/meal-store";

const { Text } = Typography;

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

  const handleWeightChange = (value: number | null) => {
    if (value !== null && value > 0) {
      updateFoodItemWeight(index, value);
    }
  };

  // Расчет калорий для текущего веса (для подсказки)
  const currentCalories = Math.round((currentWeight / 100) * caloriesPer100g);

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Text>{label}:</Text>
        <InputNumber
          min={1}
          max={10000}
          value={currentWeight}
          onChange={handleWeightChange}
          addonAfter="г"
          style={{ width: 120 }}
          step={10}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          ≈ {currentCalories} ккал
        </Text>
      </div>
    </div>
  );
};
