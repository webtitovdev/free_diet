// Модальное окно для поиска продуктов по USDA и ручного ввода
// T077: FoodSearchModal component

"use client";

import React, { useState } from "react";
import { Modal, Input, Button, List, Spin, Empty, Tabs, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { USDAFoodSearchResult } from "@/entities/food-item/model/types";
import { ManualFoodItemForm } from "./ManualFoodItemForm";

const { Search } = Input;
const { TabPane } = Tabs;

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

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      message.warning("Введите название продукта");
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
        message.info("Продукты не найдены. Попробуйте изменить запрос или добавить вручную.");
      }
    } catch (error) {
      message.error("Ошибка при поиске продуктов");
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
    <Modal title="Добавить продукт" open={open} onCancel={handleCancel} footer={null} width={600}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Поиск по базе USDA" key="search">
          <div style={{ marginBottom: 16 }}>
            <Search
              placeholder="Например: chicken breast, apple, rice"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
              loading={isSearching}
            />
          </div>

          {isSearching && (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          )}

          {!isSearching && searchResults.length === 0 && searchQuery && (
            <Empty description="Продукты не найдены" />
          )}

          {!isSearching && searchResults.length > 0 && (
            <List
              dataSource={searchResults}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Button
                      key={`select-${index}`}
                      type="link"
                      onClick={() => handleSelectResult(item)}
                    >
                      Выбрать
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.caloriesPer100g} ккал | Б: ${item.proteinPer100g}г | Ж: ${item.fatsPer100g}г | У: ${item.carbsPer100g}г (на 100г)`}
                  />
                </List.Item>
              )}
              style={{ maxHeight: 400, overflow: "auto" }}
            />
          )}
        </TabPane>

        <TabPane tab="Ввести вручную" key="manual">
          <ManualFoodItemForm onSubmit={handleManualAdd} />
        </TabPane>
      </Tabs>
    </Modal>
  );
};
