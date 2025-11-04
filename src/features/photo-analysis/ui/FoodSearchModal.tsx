// Модальное окно для поиска продуктов по USDA и ручного ввода
// T077: FoodSearchModal component

"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { USDAFoodSearchResult } from "@/entities/food-item/model/types";
import { ManualFoodItemForm } from "./ManualFoodItemForm";
import { Dialog } from "@/shared/ui/shadcn/Dialog";
import { Tabs } from "@/shared/ui/shadcn/Tabs";
import { Input } from "@/shared/ui/shadcn/Input";
import { Button } from "@/shared/ui/shadcn/Button";
import { LoadingSpinner } from "@/shared/ui/shadcn/LoadingSpinner";
import { EmptyState } from "@/shared/ui/shadcn/EmptyState";
import { toast } from "@/shared/hooks/use-toast";

interface FoodSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelectFood: (food: USDAFoodSearchResult) => void;
}

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  open,
  onClose,
  onSelectFood,
}) => {
  const [activeTab, setActiveTab] = useState<string>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<USDAFoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      toast.error("Введите название продукта");
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get<{ results: USDAFoodSearchResult[] }>("/api/food/search", {
        params: { query },
      });
      const results = response.data.results;
      setSearchResults(results);
      if (results.length === 0) {
        toast.info("Продукты не найдены. Попробуйте изменить запрос или добавить вручную.");
      }
    } catch (error) {
      toast.error("Ошибка при поиске продуктов");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (food: USDAFoodSearchResult) => {
    onSelectFood(food);
    onClose();
    // Сброс состояния
    setSearchQuery("");
    setSearchResults([]);
    setActiveTab("search");
  };

  const handleManualAdd = (food: USDAFoodSearchResult) => {
    onSelectFood(food);
    onClose();
    // Сброс состояния
    setActiveTab("search");
  };

  const handleCancel = () => {
    onClose();
    // Сброс состояния
    setSearchQuery("");
    setSearchResults([]);
    setActiveTab("search");
  };

  return (
    <Dialog open={open} onClose={handleCancel} title="Добавить продукт" maxWidth="lg">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Поиск по базе USDA" key="search">
          <div className="space-y-4">
            {/* Поисковая строка */}
            <div className="flex gap-2">
              <Input
                label="Поиск продукта"
                placeholder="Например: chicken breast, apple, rice"
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Поиск
              </Button>
            </div>

            {/* Индикатор загрузки */}
            {isSearching && (
              <div className="flex justify-center py-10">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Пустое состояние */}
            {!isSearching && searchResults.length === 0 && searchQuery && (
              <EmptyState
                title="Продукты не найдены"
                description="Попробуйте изменить запрос или добавить продукт вручную"
              />
            )}

            {/* Результаты поиска */}
            {!isSearching && searchResults.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {searchResults.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.caloriesPer100g} ккал | Б: {item.proteinPer100g}г | Ж:{" "}
                        {item.fatsPer100g}г | У: {item.carbsPer100g}г (на 100г)
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleSelectResult(item)}
                      className="ml-4"
                    >
                      Выбрать
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Ввести вручную" key="manual">
          <ManualFoodItemForm onSubmit={handleManualAdd} />
        </Tabs.TabPane>
      </Tabs>
    </Dialog>
  );
};
