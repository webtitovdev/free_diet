// Кнопка для сохранения meal в профиль
// T094: Create SaveMealButton component

"use client";

import React, { useState } from "react";
import { Button, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useMealEditingStore } from "../model/meal-store";
import { createMeal } from "../api/meal-api";
import { getClientTimezoneOffset } from "@/entities/meal/lib/suggest-category";

interface SaveMealButtonProps {
  onSuccess?: (mealId: string) => void;
  onError?: (error: string) => void;
}

export const SaveMealButton: React.FC<SaveMealButtonProps> = ({ onSuccess, onError }) => {
  const { category, foodItems, photoId, setError, reset } = useMealEditingStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // Валидация
    if (!category) {
      const errorMsg = "Выберите категорию приема пищи";
      message.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (foodItems.length === 0) {
      const errorMsg = "Добавьте хотя бы один продукт";
      message.error(errorMsg);
      setError(errorMsg);
      return;
    }

    setIsSaving(true);
    try {
      const meal = await createMeal({
        category,
        foodItems,
        photoId,
        clientTimezoneOffset: getClientTimezoneOffset(),
      });

      message.success("Прием пищи успешно сохранен!");
      reset();
      onSuccess?.(meal.id);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Ошибка при сохранении";
      message.error(errorMsg);
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      type="primary"
      size="large"
      icon={<SaveOutlined />}
      onClick={handleSave}
      loading={isSaving}
      disabled={foodItems.length === 0 || !category}
      block
    >
      Сохранить в дневник
    </Button>
  );
};
