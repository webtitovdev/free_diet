// Список распознанных продуктов с общей статистикой
// T073: FoodItemsList widget

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, Button, Space, Typography, Statistic, Row, Col, Empty } from "antd";
import { SaveOutlined, PlusOutlined } from "@ant-design/icons";
import { RecognizedFoodItem, USDAFoodSearchResult } from "@/entities/food-item/model/types";
import { FoodItemCard } from "./FoodItemCard";
import { FoodSearchModal } from "./FoodSearchModal";

const { Title } = Typography;

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
          <Empty description="Продукты не распознаны" image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
              Добавить вручную
            </Button>
          </Empty>
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
    <div>
      {/* Фотография */}
      {photoUrl && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ position: "relative", width: "100%", height: 400 }}>
            <Image
              src={photoUrl}
              alt="Фото еды"
              fill
              style={{
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </div>
        </Card>
      )}

      {/* Общая статистика */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={5}>Общая питательная ценность</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Калории"
              value={Math.round(totals.calories)}
              suffix="ккал"
              valueStyle={{ color: "#3f8600" }}
            />
          </Col>
          <Col span={6}>
            <Statistic title="Белки" value={Math.round(totals.protein * 10) / 10} suffix="г" />
          </Col>
          <Col span={6}>
            <Statistic title="Жиры" value={Math.round(totals.fats * 10) / 10} suffix="г" />
          </Col>
          <Col span={6}>
            <Statistic title="Углеводы" value={Math.round(totals.carbs * 10) / 10} suffix="г" />
          </Col>
        </Row>
      </Card>

      {/* Список продуктов */}
      <Card>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <Title level={5}>Распознанные продукты ({items.length})</Title>
          <Space>
            <Button icon={<PlusOutlined />} onClick={handleOpenModal}>
              Добавить вручную
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => onSaveToJournal?.(items)}>
              Сохранить в дневник
            </Button>
          </Space>
        </div>

        {items.map((item, index) => (
          <FoodItemCard
            key={index}
            item={item}
            onWeightChange={(newWeight) => handleWeightChange(index, newWeight)}
            onDelete={() => handleDelete(index)}
          />
        ))}
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
