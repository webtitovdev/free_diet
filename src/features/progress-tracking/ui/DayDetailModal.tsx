/**
 * DayDetailModal Component
 *
 * Модальное окно с детальной информацией о дне: приемы пищи и отклонение от цели.
 */

"use client";

import React from "react";
import { Modal, List, Tag, Spin, Alert } from "antd";
import type { DayDetails } from "@/entities/daily-log/model/types";

interface DayDetailModalProps {
  visible: boolean;
  dayDetails: DayDetails | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

const MEAL_CATEGORY_LABELS = {
  BREAKFAST: "Завтрак",
  LUNCH: "Обед",
  DINNER: "Ужин",
  SNACK: "Перекус",
};

export function DayDetailModal({
  visible,
  dayDetails,
  isLoading,
  error,
  onClose,
}: DayDetailModalProps) {
  return (
    <Modal title="Детали дня" open={visible} onCancel={onClose} footer={null} width={600}>
      {isLoading && <Spin tip="Загрузка..." />}

      {error && <Alert message="Ошибка" description={error} type="error" showIcon />}

      {dayDetails && !isLoading && !error && (
        <div>
          {/* DailyLog Summary */}
          {dayDetails.dailyLog ? (
            <div style={{ marginBottom: "16px" }}>
              <h3>Итого за день</h3>
              <p>
                <strong>Калории:</strong> {Math.round(dayDetails.dailyLog.totalCalories)} ккал
                {dayDetails.dailyLog.goalAchieved ? (
                  <Tag color="green" style={{ marginLeft: "8px" }}>
                    Цель достигнута
                  </Tag>
                ) : (
                  <Tag color="default" style={{ marginLeft: "8px" }}>
                    Отклонение: {dayDetails.dailyLog.deviationPercent.toFixed(1)}%
                  </Tag>
                )}
              </p>
              <p>
                <strong>БЖУ:</strong> Б: {Math.round(dayDetails.dailyLog.totalProtein)}г, Ж:{" "}
                {Math.round(dayDetails.dailyLog.totalFats)}г, У:{" "}
                {Math.round(dayDetails.dailyLog.totalCarbs)}г
              </p>
            </div>
          ) : (
            <Alert message="Нет данных за этот день" type="info" showIcon />
          )}

          {/* Meals List */}
          {dayDetails.meals.length > 0 && (
            <div>
              <h3>Приемы пищи</h3>
              <List
                dataSource={dayDetails.meals}
                renderItem={(meal) => (
                  <List.Item>
                    <div>
                      <Tag>{MEAL_CATEGORY_LABELS[meal.category]}</Tag>
                      <strong>{new Date(meal.time).toLocaleTimeString("ru-RU")}</strong>
                      <div>
                        {Math.round(meal.totalCalories)} ккал • {meal.foodItemsCount} продуктов
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Б: {Math.round(meal.totalProtein)}г, Ж: {Math.round(meal.totalFats)}г, У:{" "}
                        {Math.round(meal.totalCarbs)}г
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
