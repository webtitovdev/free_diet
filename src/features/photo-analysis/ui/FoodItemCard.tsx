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
    if (confidence >= 0.8) return "from-green-500 to-emerald-500 text-white";
    if (confidence >= 0.6) return "from-amber-500 to-yellow-500 text-white";
    return "from-red-500 to-pink-500 text-white";
  };

  return (
    <div className="relative group mb-6">
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] overflow-hidden bg-white dark:bg-slate-800">
        {/* Gradient overlay на hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative z-10 p-6">
          {/* Заголовок карточки */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {item.name}
              </h3>
              <div
                className={cn(
                  "inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r shadow-md",
                  getConfidenceColor(item.confidence)
                )}
              >
                ✓ Уверенность: {Math.round(item.confidence * 100)}%
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-2 ml-4">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={handleSaveWeight}
                    className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  >
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
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Вес продукта */}
          <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Вес:</span>
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
              <span className="text-lg font-bold text-gray-900 dark:text-white">{editedWeight} г</span>
            )}
          </div>

          {/* Питательная ценность с градиентами */}
          <div className="space-y-3">
            {/* Калории - главный показатель */}
            <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white/90">Калории</span>
                <span className="text-2xl font-bold text-white">
                  {nutrition.calories} ккал
                </span>
              </div>
            </div>

            {/* Макронутриенты с градиентами */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800">
                <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Белки</div>
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {nutrition.protein} г
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-200 dark:border-orange-800">
                <div className="text-xs font-medium text-orange-700 dark:text-orange-300 mb-1">Жиры</div>
                <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
                  {nutrition.fats} г
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl p-3 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-200 dark:border-amber-800">
                <div className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">Углеводы</div>
                <div className="text-lg font-bold text-amber-900 dark:text-amber-100">
                  {nutrition.carbs} г
                </div>
              </div>
            </div>
          </div>

          {/* Информация на 100г */}
          <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">На 100г:</span> {item.calories_per_100g} ккал · Б: {item.protein_per_100g}г · Ж: {item.fats_per_100g}г · У: {item.carbs_per_100g}г
          </div>
        </div>
      </Card>
    </div>
  );
};
