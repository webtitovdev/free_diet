// Главный виджет для редактирования и сохранения meal
// T095: Create MealEditor widget composing weight editing and category selection

"use client";

import React from "react";
import { Card, Typography, Statistic, Row, Col, Button, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMealEditingStore } from "@/features/meal-editing/model/meal-store";
import { MealCategorySelector } from "@/features/meal-editing/ui/MealCategorySelector";
import { WeightEditor } from "@/features/meal-editing/ui/WeightEditor";
import { SaveMealButton } from "@/features/meal-editing/ui/SaveMealButton";

const { Title, Text } = Typography;

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
    <Card style={{ marginTop: 16 }}>
      <Title level={4}>Редактирование приема пищи</Title>

      {/* Выбор категории */}
      <MealCategorySelector />

      <Divider />

      {/* Общая статистика */}
      <Card type="inner" style={{ marginBottom: 16 }}>
        <Title level={5}>Итого:</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Калории"
              value={Math.round(stats.totalCalories)}
              suffix="ккал"
              valueStyle={{ color: "#3f8600" }}
            />
          </Col>
          <Col span={6}>
            <Statistic title="Белки" value={Math.round(stats.totalProtein * 10) / 10} suffix="г" />
          </Col>
          <Col span={6}>
            <Statistic title="Жиры" value={Math.round(stats.totalFats * 10) / 10} suffix="г" />
          </Col>
          <Col span={6}>
            <Statistic title="Углеводы" value={Math.round(stats.totalCarbs * 10) / 10} suffix="г" />
          </Col>
        </Row>
      </Card>

      {/* Список продуктов с редакторами весов */}
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Продукты ({foodItems.length}):</Title>
        {foodItems.map((item, index) => (
          <Card
            key={index}
            type="inner"
            size="small"
            style={{ marginBottom: 8 }}
            extra={
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => removeFoodItem(index)}
              />
            }
          >
            <Text strong>{item.name}</Text>
            <WeightEditor
              index={index}
              currentWeight={item.weight}
              caloriesPer100g={item.caloriesPer100g}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              На 100г: {item.caloriesPer100g} ккал | Б: {item.proteinPer100g}г | Ж:{" "}
              {item.fatsPer100g}г | У: {item.carbsPer100g}г
            </Text>
          </Card>
        ))}
      </div>

      {/* Кнопка сохранения */}
      <SaveMealButton onSuccess={onSaveSuccess} onError={onSaveError} />
    </Card>
  );
};
