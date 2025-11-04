// Главный виджет для редактирования и сохранения meal
// T095: Create MealEditor widget composing weight editing and category selection

"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card/Card";
import { Button } from "@/shared/ui/button/Button";
import { Separator } from "@/shared/ui/separator/Separator";
import { useMealEditingStore } from "@/features/meal-editing/model/meal-store";
import { MealCategorySelector } from "@/features/meal-editing/ui/MealCategorySelector";
import { WeightEditor } from "@/features/meal-editing/ui/WeightEditor";
import { SaveMealButton } from "@/features/meal-editing/ui/SaveMealButton";

interface MealEditorProps {
  onSaveSuccess?: (mealId: string) => void;
  onSaveError?: (error: string) => void;
}

export const MealEditor: React.FC<MealEditorProps> = ({ onSaveSuccess, onSaveError }) => {
  const { foodItems, stats, removeFoodItem } = useMealEditingStore();

  if (foodItems.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Редактирование приема пищи</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Выбор категории */}
        <MealCategorySelector />

        <Separator />

        {/* Общая статистика */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Итого:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Калории</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(stats.totalCalories)} <span className="text-sm">ккал</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Белки</p>
                <p className="text-2xl font-bold">
                  {Math.round(stats.totalProtein * 10) / 10} <span className="text-sm">г</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Жиры</p>
                <p className="text-2xl font-bold">
                  {Math.round(stats.totalFats * 10) / 10} <span className="text-sm">г</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Углеводы</p>
                <p className="text-2xl font-bold">
                  {Math.round(stats.totalCarbs * 10) / 10} <span className="text-sm">г</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Список продуктов с редакторами весов */}
        <div>
          <h3 className="font-semibold mb-2">Продукты ({foodItems.length}):</h3>
          <div className="space-y-2">
            {foodItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">{item.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => removeFoodItem(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <WeightEditor
                    index={index}
                    currentWeight={item.weight}
                    caloriesPer100g={item.caloriesPer100g}
                  />
                  <p className="text-xs text-muted-foreground">
                    На 100г: {item.caloriesPer100g} ккал | Б: {item.proteinPer100g}г | Ж:{" "}
                    {item.fatsPer100g}г | У: {item.carbsPer100g}г
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Кнопка сохранения */}
        <SaveMealButton onSuccess={onSaveSuccess} onError={onSaveError} />
      </CardContent>
    </Card>
  );
};
