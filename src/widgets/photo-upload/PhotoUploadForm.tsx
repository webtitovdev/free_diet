// Главный виджет для загрузки и анализа фотографий еды
// T071: PhotoUploadForm widget

"use client";

import React from "react";
import { Card, Typography, Space } from "antd";
import { PhotoUploadButton } from "@/features/photo-analysis/ui/PhotoUploadButton";
import { UploadProgress } from "@/features/photo-analysis/ui/UploadProgress";
import { FoodItemsList } from "@/features/photo-analysis/ui/FoodItemsList";
import { usePhotoAnalysisStore } from "@/features/photo-analysis/model/photo-store";
import { PhotoStatus } from "@/entities/photo/model/types";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";

const { Title, Paragraph } = Typography;

interface PhotoUploadFormProps {
  onSaveToJournal?: (items: RecognizedFoodItem[]) => void;
  onAddManually?: () => void;
}

export const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({
  onSaveToJournal,
  onAddManually,
}) => {
  const { photoUrl, processingStatus, recognizedItems, setRecognizedItems, reset } =
    usePhotoAnalysisStore();

  const showResults = processingStatus === PhotoStatus.COMPLETED && recognizedItems.length > 0;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      {/* Заголовок */}
      <Card style={{ marginBottom: 16, textAlign: "center" }}>
        <Title level={2}>Анализ фотографии еды</Title>
        <Paragraph>
          Загрузите фотографию вашей еды, и мы автоматически определим продукты и их питательную
          ценность
        </Paragraph>
      </Card>

      {/* Кнопка загрузки */}
      {!processingStatus && (
        <Card style={{ textAlign: "center" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <PhotoUploadButton
              onUploadComplete={() => {
                // Загрузка завершена, polling начнется автоматически
              }}
            />
            <Paragraph type="secondary">
              Поддерживаемые форматы: JPG, PNG, HEIC
              <br />
              Максимальный размер: 10 МБ
            </Paragraph>
          </Space>
        </Card>
      )}

      {/* Прогресс обработки */}
      <UploadProgress />

      {/* Результаты анализа */}
      {showResults && (
        <div style={{ marginTop: 16 }}>
          <FoodItemsList
            items={recognizedItems}
            photoUrl={photoUrl || undefined}
            onItemsChange={setRecognizedItems}
            onSaveToJournal={onSaveToJournal}
            onAddManually={onAddManually}
          />
        </div>
      )}

      {/* Кнопка "Загрузить новое фото" после завершения */}
      {processingStatus === PhotoStatus.COMPLETED && (
        <Card style={{ marginTop: 16, textAlign: "center" }}>
          <PhotoUploadButton
            onUploadStart={reset}
            onUploadComplete={() => {
              // Новая загрузка
            }}
          />
        </Card>
      )}
    </div>
  );
};
