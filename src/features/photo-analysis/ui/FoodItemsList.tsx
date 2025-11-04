// Список распознанных продуктов с общей статистикой
// T073: FoodItemsList widget

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Save, Plus } from "lucide-react";
import { RecognizedFoodItem, USDAFoodSearchResult } from "@/entities/food-item/model/types";
import { FoodItemCard } from "./FoodItemCard";
import { FoodSearchModal } from "./FoodSearchModal";
import { Card } from "@/shared/ui/shadcn/Card";
import { Button } from "@/shared/ui/shadcn/Button";
import { EmptyState } from "@/shared/ui/shadcn/EmptyState";
import { StatsCard } from "@/shared/ui/shadcn/StatsCard";

interface FoodItemsListProps {
  items: RecognizedFoodItem[];
  photoUrl?: string;
  onItemsChange?: (items: RecognizedFoodItem[]) => void;
  onSaveToJournal?: (items: RecognizedFoodItem[]) => void;
  onAddManually?: () => void;
}

export const FoodItemsList: React.FC<FoodItemsListProps> = ({
  items: initialItems,
  photoUrl,
  onItemsChange,
  onSaveToJournal,
  onAddManually,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Обработка изменения веса продукта
  const handleWeightChange = (index: number, newWeight: number) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      weight_grams: newWeight,
    };
    setItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  // Удаление продукта из списка
  const handleDelete = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  // Добавление продукта из модального окна
  const handleAddFood = (food: USDAFoodSearchResult) => {
    // Преобразуем USDAFoodSearchResult в RecognizedFoodItem
    const newItem: RecognizedFoodItem = {
      name: food.name,
      weight_grams: 100, // По умолчанию 100г
      calories_per_100g: food.caloriesPer100g,
      protein_per_100g: food.proteinPer100g,
      fats_per_100g: food.fatsPer100g,
      carbs_per_100g: food.carbsPer100g,
      confidence: 1.0, // Вручную добавленные имеют полную уверенность
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  // Открытие модального окна
  const handleOpenModal = () => {
    setIsModalOpen(true);
    onAddManually?.();
  };

  // Расчет общей статистики
  const calculateTotals = () => {
    return items.reduce(
      (totals, item) => {
        const multiplier = item.weight_grams / 100;
        return {
          calories: totals.calories + item.calories_per_100g * multiplier,
          protein: totals.protein + item.protein_per_100g * multiplier,
          fats: totals.fats + item.fats_per_100g * multiplier,
          carbs: totals.carbs + item.carbs_per_100g * multiplier,
        };
      },
      { calories: 0, protein: 0, fats: 0, carbs: 0 }
    );
  };

  const totals = calculateTotals();

  if (items.length === 0) {
    return (
      <>
        <Card>
          <EmptyState
            title="Продукты не распознаны"
            description="Попробуйте добавить продукты вручную"
            action={{
              label: "Добавить вручную",
              onClick: handleOpenModal,
            }}
          />
        </Card>
        <FoodSearchModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectFood={handleAddFood}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      {/* Фотография */}
      {photoUrl && (
        <Card>
          <div className="relative w-full h-[400px]">
            <Image src={photoUrl} alt="Фото еды" fill className="object-contain rounded-lg" />
          </div>
        </Card>
      )}

      {/* Общая статистика */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Общая питательная ценность
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Калории"
            value={Math.round(totals.calories)}
            unit="ккал"
            color="brand"
          />
          <StatsCard title="Белки" value={Math.round(totals.protein * 10) / 10} unit="г" />
          <StatsCard title="Жиры" value={Math.round(totals.fats * 10) / 10} unit="г" />
          <StatsCard title="Углеводы" value={Math.round(totals.carbs * 10) / 10} unit="г" />
        </div>
      </Card>

      {/* Список продуктов */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Распознанные продукты ({items.length})
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleOpenModal} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Добавить вручную
            </Button>
            <Button onClick={() => onSaveToJournal?.(items)} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Сохранить в дневник
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <FoodItemCard
              key={index}
              item={item}
              onWeightChange={(newWeight) => handleWeightChange(index, newWeight)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      </Card>

      {/* Модальное окно для добавления продукта */}
      <FoodSearchModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectFood={handleAddFood}
      />
    </div>
  );
};
