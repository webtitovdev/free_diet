// Главный виджет для загрузки и анализа фотографий еды
// T071: PhotoUploadForm widget
// T096: Integrate MealEditor into photo upload page

"use client";

import React, { useEffect } from "react";
import { Card, Typography, Space, message } from "antd";
import { PhotoUploadButton } from "@/features/photo-analysis/ui/PhotoUploadButton";
import { UploadProgress } from "@/features/photo-analysis/ui/UploadProgress";
import { FoodItemsList } from "@/features/photo-analysis/ui/FoodItemsList";
import { usePhotoAnalysisStore } from "@/features/photo-analysis/model/photo-store";
import { PhotoStatus } from "@/entities/photo/model/types";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";
import { MealEditor } from "@/widgets/meal-editor/MealEditor";
import { useMealEditingStore } from "@/features/meal-editing/model/meal-store";

const { Title, Paragraph } = Typography;

interface PhotoUploadFormProps {
  onSaveToJournal?: (items: RecognizedFoodItem[]) => void;
  onAddManually?: () => void;
}

export const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({
  onSaveToJournal,
  onAddManually,
}) => {
  const { photoUrl, photoId, processingStatus, recognizedItems, setRecognizedItems, reset } =
    usePhotoAnalysisStore();

  const { setFoodItems, setPhotoId, reset: resetMealEditor } = useMealEditingStore();

  const showResults = processingStatus === PhotoStatus.COMPLETED && recognizedItems.length > 0;

  // Синхронизируем recognizedItems с meal editor store
  useEffect(() => {
    if (showResults) {
      setFoodItems(recognizedItems);
      setPhotoId(photoId);
    }
  }, [showResults, recognizedItems, photoId, setFoodItems, setPhotoId]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSaveSuccess = (_mealId: string) => {
    message.success("Прием пищи успешно сохранен в дневник!");
    // Сбрасываем оба store
    reset();
    resetMealEditor();
  };

  const handleSaveError = (error: string) => {
    message.error(`Ошибка при сохранении: ${error}`);
  };

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

          {/* MealEditor для редактирования и сохранения */}
          <MealEditor onSaveSuccess={handleSaveSuccess} onSaveError={handleSaveError} />
        </div>
      )}

      {/* Кнопка "Загрузить новое фото" если нет активной обработки */}
      {!processingStatus && recognizedItems.length === 0 && (
        <Card style={{ marginTop: 16, textAlign: "center" }}>
          <Paragraph type="secondary">Начните с загрузки фотографии вашей еды</Paragraph>
        </Card>
      )}
    </div>
  );
};
