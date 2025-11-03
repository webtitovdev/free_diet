// Карточка для отображения распознанного продукта
// T072: FoodItemCard component

"use client";

import React, { useState } from "react";
import { Card, InputNumber, Button, Space, Typography, Tag, Descriptions } from "antd";
import { DeleteOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";

const { Title, Text } = Typography;

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
    if (confidence >= 0.8) return "green";
    if (confidence >= 0.6) return "orange";
    return "red";
  };

  return (
    <Card
      size="small"
      style={{ marginBottom: 16 }}
      extra={
        <Space>
          {isEditing ? (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={handleSaveWeight}
              >
                Сохранить
              </Button>
              <Button size="small" onClick={handleCancelEdit}>
                Отмена
              </Button>
            </>
          ) : (
            <>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
              />
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={onDelete}
              />
            </>
          )}
        </Space>
      }
    >
      <div style={{ marginBottom: 12 }}>
        <Title level={5} style={{ marginBottom: 4 }}>
          {item.name}
        </Title>
        <Tag color={getConfidenceColor(item.confidence)}>
          Уверенность: {Math.round(item.confidence * 100)}%
        </Tag>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Space align="center">
          <Text strong>Вес:</Text>
          {isEditing ? (
            <InputNumber
              min={1}
              max={10000}
              value={editedWeight}
              onChange={(value) => setEditedWeight(value || 0)}
              addonAfter="г"
              style={{ width: 120 }}
            />
          ) : (
            <Text>{editedWeight} г</Text>
          )}
        </Space>
      </div>

      <Descriptions size="small" column={2} bordered>
        <Descriptions.Item label="Калории" span={2}>
          <Text strong style={{ fontSize: 16 }}>
            {nutrition.calories} ккал
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Белки">{nutrition.protein} г</Descriptions.Item>
        <Descriptions.Item label="Жиры">{nutrition.fats} г</Descriptions.Item>
        <Descriptions.Item label="Углеводы" span={2}>
          {nutrition.carbs} г
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
        На 100г: {item.calories_per_100g} ккал, Б: {item.protein_per_100g}г, Ж: {item.fats_per_100g}
        г, У: {item.carbs_per_100g}г
      </div>
    </Card>
  );
};
