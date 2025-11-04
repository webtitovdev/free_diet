// Кнопка для сохранения meal в профиль
// T094: Create SaveMealButton component

"use client";

import React, { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/shared/ui/button/Button";
import { useToast } from "@/shared/hooks/use-toast";
import { useMealEditingStore } from "../model/meal-store";
import { createMeal } from "../api/meal-api";
import { getClientTimezoneOffset } from "@/entities/meal/lib/suggest-category";

interface SaveMealButtonProps {
  onSuccess?: (mealId: string) => void;
  onError?: (error: string) => void;
}

export const SaveMealButton: React.FC<SaveMealButtonProps> = ({ onSuccess, onError }) => {
  const { toast } = useToast();
  const { category, foodItems, photoId, setError, reset } = useMealEditingStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // Валидация
    if (!category) {
      const errorMsg = "Выберите категорию приема пищи";
      toast({ variant: "destructive", description: errorMsg });
      setError(errorMsg);
      return;
    }

    if (foodItems.length === 0) {
      const errorMsg = "Добавьте хотя бы один продукт";
      toast({ variant: "destructive", description: errorMsg });
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

      toast({ description: "Прием пищи успешно сохранен!" });
      reset();
      onSuccess?.(meal.id);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Ошибка при сохранении";
      toast({ variant: "destructive", description: errorMsg });
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleSave}
      disabled={foodItems.length === 0 || !category || isSaving}
      className="w-full"
    >
      {isSaving ? (
        <>Сохранение...</>
      ) : (
        <>
          <Save className="h-5 w-5" />
          Сохранить в дневник
        </>
      )}
    </Button>
  );
};
