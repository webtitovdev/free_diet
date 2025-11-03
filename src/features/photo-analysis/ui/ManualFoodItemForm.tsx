// Форма для ручного ввода данных о продукте
// T078: ManualFoodItemForm component

"use client";

import React from "react";
import { Form, Input, InputNumber, Button, Space } from "antd";
import { USDAFoodSearchResult } from "@/entities/food-item/model/types";

interface ManualFoodItemFormProps {
  onSubmit: (food: USDAFoodSearchResult) => void;
}

interface FormValues {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatsPer100g: number;
  carbsPer100g: number;
}

export const ManualFoodItemForm: React.FC<ManualFoodItemFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      caloriesPer100g: values.caloriesPer100g,
      proteinPer100g: values.proteinPer100g,
      fatsPer100g: values.fatsPer100g,
      carbsPer100g: values.carbsPer100g,
    });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        caloriesPer100g: 0,
        proteinPer100g: 0,
        fatsPer100g: 0,
        carbsPer100g: 0,
      }}
    >
      <Form.Item
        label="Название продукта"
        name="name"
        rules={[{ required: true, message: "Введите название продукта" }]}
      >
        <Input placeholder="Например: Куриная грудка" />
      </Form.Item>

      <Form.Item
        label="Калории (на 100г)"
        name="caloriesPer100g"
        rules={[
          { required: true, message: "Введите калории" },
          { type: "number", min: 0, message: "Значение должно быть положительным" },
        ]}
      >
        <InputNumber placeholder="165" style={{ width: "100%" }} min={0} addonAfter="ккал" />
      </Form.Item>

      <Form.Item
        label="Белки (на 100г)"
        name="proteinPer100g"
        rules={[
          { required: true, message: "Введите белки" },
          { type: "number", min: 0, message: "Значение должно быть положительным" },
        ]}
      >
        <InputNumber placeholder="31" style={{ width: "100%" }} min={0} addonAfter="г" />
      </Form.Item>

      <Form.Item
        label="Жиры (на 100г)"
        name="fatsPer100g"
        rules={[
          { required: true, message: "Введите жиры" },
          { type: "number", min: 0, message: "Значение должно быть положительным" },
        ]}
      >
        <InputNumber placeholder="3.6" style={{ width: "100%" }} min={0} addonAfter="г" />
      </Form.Item>

      <Form.Item
        label="Углеводы (на 100г)"
        name="carbsPer100g"
        rules={[
          { required: true, message: "Введите углеводы" },
          { type: "number", min: 0, message: "Значение должно быть положительным" },
        ]}
      >
        <InputNumber placeholder="0" style={{ width: "100%" }} min={0} addonAfter="г" />
      </Form.Item>

      <Form.Item>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button type="primary" htmlType="submit">
            Добавить продукт
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
