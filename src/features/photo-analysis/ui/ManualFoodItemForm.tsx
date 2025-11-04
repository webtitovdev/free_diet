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
      <Input
        label="Название продукта"
        id="name"
        placeholder="Например: Куриная грудка"
        value={formValues.name}
        onChange={(value) => handleChange("name", value)}
        error={errors.name}
      />

      {/* Калории */}
      <Input
        label="Калории (на 100г)"
        id="calories"
        type="number"
        placeholder="165"
        value={formValues.caloriesPer100g}
        onChange={(value) => handleChange("caloriesPer100g", value)}
        error={errors.caloriesPer100g}
      />

      {/* Белки */}
      <Input
        label="Белки (на 100г)"
        id="protein"
        type="number"
        placeholder="31"
        value={formValues.proteinPer100g}
        onChange={(value) => handleChange("proteinPer100g", value)}
        error={errors.proteinPer100g}
      />

      {/* Жиры */}
      <Input
        label="Жиры (на 100г)"
        id="fats"
        type="number"
        placeholder="3.6"
        value={formValues.fatsPer100g}
        onChange={(value) => handleChange("fatsPer100g", value)}
        error={errors.fatsPer100g}
      />

      {/* Углеводы */}
      <Input
        label="Углеводы (на 100г)"
        id="carbs"
        type="number"
        placeholder="0"
        value={formValues.carbsPer100g}
        onChange={(value) => handleChange("carbsPer100g", value)}
        error={errors.carbsPer100g}
      />

      {/* Кнопка отправки */}
      <div className="flex justify-end">
        <Button type="submit">Добавить продукт</Button>
      </div>
    </form>
  );
};
