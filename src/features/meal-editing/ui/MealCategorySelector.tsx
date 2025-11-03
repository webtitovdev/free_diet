// Компонент для выбора категории приема пищи
// T093: Create MealCategorySelector component (Ant Design Select)

"use client";

import React, { useEffect } from "react";
import { Select, Typography } from "antd";
import { CoffeeOutlined, ApiOutlined, FieldTimeOutlined, AppleOutlined } from "@ant-design/icons";
import { MealCategory } from "@/entities/meal/model/types";
import { useMealEditingStore } from "../model/meal-store";
import { suggestMealCategory, getClientTimezoneOffset } from "@/entities/meal/lib/suggest-category";

const { Text } = Typography;

const categoryLabels = {
  [MealCategory.BREAKFAST]: "Завтрак",
  [MealCategory.LUNCH]: "Обед",
  [MealCategory.DINNER]: "Ужин",
  [MealCategory.SNACK]: "Перекус",
};

const categoryIcons = {
  [MealCategory.BREAKFAST]: <CoffeeOutlined />,
  [MealCategory.LUNCH]: <ApiOutlined />,
  [MealCategory.DINNER]: <FieldTimeOutlined />,
  [MealCategory.SNACK]: <AppleOutlined />,
};

export const MealCategorySelector: React.FC = () => {
  const { category, setCategory } = useMealEditingStore();

  // Автоматически предлагаем категорию при монтировании если не выбрана
  useEffect(() => {
    if (!category) {
      const suggested = suggestMealCategory(getClientTimezoneOffset());
      setCategory(suggested);
    }
  }, [category, setCategory]);

  const handleCategoryChange = (value: MealCategory) => {
    setCategory(value);
  };

  const options = Object.values(MealCategory).map((cat) => ({
    value: cat,
    label: (
      <span>
        {categoryIcons[cat]} {categoryLabels[cat]}
      </span>
    ),
  }));

  return (
    <div style={{ marginBottom: 16 }}>
      <Text strong style={{ display: "block", marginBottom: 8 }}>
        Категория приема пищи:
      </Text>
      <Select
        value={category}
        onChange={handleCategoryChange}
        options={options}
        style={{ width: "100%" }}
        size="large"
      />
    </div>
  );
};
