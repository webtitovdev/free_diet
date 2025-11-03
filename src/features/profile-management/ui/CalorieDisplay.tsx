// Компонент отображения рассчитанной целевой калорийности
// T107: Create CalorieDisplay component showing calculated target
// Spec: §FR-017

"use client";

import { Card, Statistic } from "antd";
import { FireOutlined } from "@ant-design/icons";

interface CalorieDisplayProps {
  targetCalories: number | null;
  loading?: boolean;
}

export function CalorieDisplay({ targetCalories, loading = false }: CalorieDisplayProps) {
  if (!targetCalories && !loading) {
    return null;
  }

  return (
    <Card
      style={{
        backgroundColor: "#f0f5ff",
        borderColor: "#1890ff",
        marginBottom: 24,
      }}
      loading={loading}
    >
      <Statistic
        title="Рекомендуемая дневная калорийность"
        value={targetCalories || 0}
        suffix="ккал"
        prefix={<FireOutlined />}
        valueStyle={{ color: "#1890ff", fontSize: "32px", fontWeight: "bold" }}
      />
      <div style={{ marginTop: 8, fontSize: "14px", color: "#666" }}>
        Рассчитано по формуле Mifflin-St Jeor с учетом вашей цели
      </div>
    </Card>
  );
}
