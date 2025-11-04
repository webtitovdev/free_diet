// Карточка для отображения распознанного продукта
// T072: FoodItemCard component

"use client";

import React, { useState } from "react";
import { Trash2, Edit, Check, X } from "lucide-react";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";
import { Card } from "@/shared/ui/shadcn/Card";
import { Button } from "@/shared/ui/shadcn/Button";
import { Input } from "@/shared/ui/shadcn/Input";
import { cn } from "@/shared/lib/utils";

interface FoodItemCardProps {
  item: RecognizedFoodItem;
  onWeightChange?: (newWeight: number) => void;
  onDelete?: () => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onWeightChange, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeight, setEditedWeight] = useState(item.weight_grams);

  // Расчет питательной ценности на основе текущего веса
  const calculateNutrition = (weight: number) => {
    const multiplier = weight / 100;
    return {
      calories: Math.round(item.calories_per_100g * multiplier),
      protein: Math.round(item.protein_per_100g * multiplier * 10) / 10,
      fats: Math.round(item.fats_per_100g * multiplier * 10) / 10,
      carbs: Math.round(item.carbs_per_100g * multiplier * 10) / 10,
    };
  };

  const nutrition = calculateNutrition(editedWeight);

  const handleSaveWeight = () => {
    onWeightChange?.(editedWeight);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedWeight(item.weight_grams);
    setIsEditing(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-success-light text-success-dark border-success-DEFAULT";
    if (confidence >= 0.6) return "bg-warning-light text-warning-dark border-warning-DEFAULT";
    return "bg-error-light text-error-dark border-error-DEFAULT";
  };

  return (
    <Card className="mb-4">
      {/* Заголовок карточки */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {item.name}
          </h3>
          <span
            className={cn(
              "inline-block px-2 py-1 text-xs font-medium rounded border",
              getConfidenceColor(item.confidence)
            )}
          >
            Уверенность: {Math.round(item.confidence * 100)}%
          </span>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-2 ml-4">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSaveWeight} className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Сохранить
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Отмена
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="text-error-DEFAULT hover:text-error-dark"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Вес продукта */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-medium text-gray-700 dark:text-gray-300">Вес:</span>
        {isEditing ? (
          <div className="relative">
            <Input
              label="Вес (г)"
              type="number"
              min={1}
              max={10000}
              value={String(editedWeight)}
              onChange={(value) => setEditedWeight(Number(value) || 0)}
              className="w-32"
            />
          </div>
        ) : (
          <span className="text-gray-900 dark:text-gray-100">{editedWeight} г</span>
        )}
      </div>

      {/* Питательная ценность */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-200 dark:divide-gray-700">
          <div className="col-span-2 p-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Калории</span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {nutrition.calories} ккал
              </span>
            </div>
          </div>
          <div className="p-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">Белки</div>
            <div className="text-base font-medium text-gray-900 dark:text-gray-100">
              {nutrition.protein} г
            </div>
          </div>
          <div className="p-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">Жиры</div>
            <div className="text-base font-medium text-gray-900 dark:text-gray-100">
              {nutrition.fats} г
            </div>
          </div>
          <div className="col-span-2 p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Углеводы</span>
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                {nutrition.carbs} г
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Информация на 100г */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        На 100г: {item.calories_per_100g} ккал, Б: {item.protein_per_100g}г, Ж: {item.fats_per_100g}
        г, У: {item.carbs_per_100g}г
      </div>
    </Card>
  );
};
