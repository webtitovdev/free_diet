// Компонент выбора цели пользователя
// T106: Create GoalSelector component (BULK/MAINTAIN/CUT/SUGAR_CONTROL)
// Spec: §FR-016

"use client";

import { Form, Select } from "antd";
import { GoalType, GOAL_METADATA } from "@/entities/profile/model/types";

const { Option } = Select;

interface GoalSelectorProps {
  disabled?: boolean;
}

export function GoalSelector({ disabled = false }: GoalSelectorProps) {
  return (
    <Form.Item
      label="Цель"
      name="goal"
      rules={[{ required: true, message: "Выберите вашу цель" }]}
      tooltip="Цель влияет на расчет рекомендуемой калорийности"
    >
      <Select placeholder="Выберите цель" disabled={disabled}>
        {Object.values(GoalType).map((goalType) => {
          const metadata = GOAL_METADATA[goalType];
          return (
            <Option key={goalType} value={goalType}>
              <div>
                <strong>{metadata.label}</strong>
                <div style={{ fontSize: "12px", color: "#666" }}>{metadata.description}</div>
              </div>
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );
}
