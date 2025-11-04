// Форма для ручного ввода данных о продукте
// T078: ManualFoodItemForm component

"use client";

import React, { useState } from "react";
import { USDAFoodSearchResult } from "@/entities/food-item/model/types";
import { Button } from "@/shared/ui/shadcn/Button";
import { Input } from "@/shared/ui/shadcn/Input";
import { toast } from "@/shared/hooks/use-toast";

interface ManualFoodItemFormProps {
  onSubmit: (food: USDAFoodSearchResult) => void;
}

interface FormValues {
  name: string;
  caloriesPer100g: string;
  proteinPer100g: string;
  fatsPer100g: string;
  carbsPer100g: string;
}

export const ManualFoodItemForm: React.FC<ManualFoodItemFormProps> = ({ onSubmit }) => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    caloriesPer100g: "0",
    proteinPer100g: "0",
    fatsPer100g: "0",
    carbsPer100g: "0",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};

    if (!formValues.name.trim()) {
      newErrors.name = "Введите название продукта";
    }

    const calories = parseFloat(formValues.caloriesPer100g);
    if (isNaN(calories) || calories < 0) {
      newErrors.caloriesPer100g = "Введите корректное значение";
    }

    const protein = parseFloat(formValues.proteinPer100g);
    if (isNaN(protein) || protein < 0) {
      newErrors.proteinPer100g = "Введите корректное значение";
    }

    const fats = parseFloat(formValues.fatsPer100g);
    if (isNaN(fats) || fats < 0) {
      newErrors.fatsPer100g = "Введите корректное значение";
    }

    const carbs = parseFloat(formValues.carbsPer100g);
    if (isNaN(carbs) || carbs < 0) {
      newErrors.carbsPer100g = "Введите корректное значение";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Пожалуйста, заполните все поля корректно");
      return;
    }

    onSubmit({
      name: formValues.name,
      caloriesPer100g: parseFloat(formValues.caloriesPer100g),
      proteinPer100g: parseFloat(formValues.proteinPer100g),
      fatsPer100g: parseFloat(formValues.fatsPer100g),
      carbsPer100g: parseFloat(formValues.carbsPer100g),
    });

    // Сброс формы
    setFormValues({
      name: "",
      caloriesPer100g: "0",
      proteinPer100g: "0",
      fatsPer100g: "0",
      carbsPer100g: "0",
    });
    setErrors({});
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Название продукта */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Название продукта
        </label>
        <Input
          id="name"
          placeholder="Например: Куриная грудка"
          value={formValues.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
        />
        {errors.name && <p className="mt-1 text-xs text-error-DEFAULT">{errors.name}</p>}
      </div>

      {/* Калории */}
      <div>
        <label
          htmlFor="calories"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Калории (на 100г)
        </label>
        <div className="relative">
          <Input
            id="calories"
            type="number"
            placeholder="165"
            min="0"
            step="0.1"
            value={formValues.caloriesPer100g}
            onChange={(e) => handleChange("caloriesPer100g", e.target.value)}
            error={errors.caloriesPer100g}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            ккал
          </span>
        </div>
        {errors.caloriesPer100g && (
          <p className="mt-1 text-xs text-error-DEFAULT">{errors.caloriesPer100g}</p>
        )}
      </div>

      {/* Белки */}
      <div>
        <label
          htmlFor="protein"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Белки (на 100г)
        </label>
        <div className="relative">
          <Input
            id="protein"
            type="number"
            placeholder="31"
            min="0"
            step="0.1"
            value={formValues.proteinPer100g}
            onChange={(e) => handleChange("proteinPer100g", e.target.value)}
            error={errors.proteinPer100g}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">г</span>
        </div>
        {errors.proteinPer100g && (
          <p className="mt-1 text-xs text-error-DEFAULT">{errors.proteinPer100g}</p>
        )}
      </div>

      {/* Жиры */}
      <div>
        <label
          htmlFor="fats"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Жиры (на 100г)
        </label>
        <div className="relative">
          <Input
            id="fats"
            type="number"
            placeholder="3.6"
            min="0"
            step="0.1"
            value={formValues.fatsPer100g}
            onChange={(e) => handleChange("fatsPer100g", e.target.value)}
            error={errors.fatsPer100g}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">г</span>
        </div>
        {errors.fatsPer100g && (
          <p className="mt-1 text-xs text-error-DEFAULT">{errors.fatsPer100g}</p>
        )}
      </div>

      {/* Углеводы */}
      <div>
        <label
          htmlFor="carbs"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Углеводы (на 100г)
        </label>
        <div className="relative">
          <Input
            id="carbs"
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
            value={formValues.carbsPer100g}
            onChange={(e) => handleChange("carbsPer100g", e.target.value)}
            error={errors.carbsPer100g}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">г</span>
        </div>
        {errors.carbsPer100g && (
          <p className="mt-1 text-xs text-error-DEFAULT">{errors.carbsPer100g}</p>
        )}
      </div>

      {/* Кнопка отправки */}
      <div className="flex justify-end">
        <Button type="submit">Добавить продукт</Button>
      </div>
    </form>
  );
};
