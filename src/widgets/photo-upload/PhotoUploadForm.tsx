// Главный виджет для загрузки и анализа фотографий еды
// T071: PhotoUploadForm widget
// T096: Integrate MealEditor into photo upload page

"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card/Card";
import { useToast } from "@/shared/hooks/use-toast";
import { PhotoUploadButton } from "@/features/photo-analysis/ui/PhotoUploadButton";
import { UploadProgress } from "@/features/photo-analysis/ui/UploadProgress";
import { FoodItemsList } from "@/features/photo-analysis/ui/FoodItemsList";
import { usePhotoAnalysisStore } from "@/features/photo-analysis/model/photo-store";
import { PhotoStatus } from "@/entities/photo/model/types";
import { RecognizedFoodItem } from "@/entities/food-item/model/types";
import { MealEditor } from "@/widgets/meal-editor/MealEditor";
import { useMealEditingStore } from "@/features/meal-editing/model/meal-store";

interface PhotoUploadFormProps {
  onSaveToJournal?: (items: RecognizedFoodItem[]) => void;
  onAddManually?: () => void;
}

export const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({
  onSaveToJournal,
  onAddManually,
}) => {
  const { toast } = useToast();
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
    toast({ description: "Прием пищи успешно сохранен в дневник!" });
    // Сбрасываем оба store
    reset();
    resetMealEditor();
  };

  const handleSaveError = (error: string) => {
    toast({ variant: "destructive", description: `Ошибка при сохранении: ${error}` });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Заголовок */}
      <Card className="mb-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Анализ фотографии еды</CardTitle>
          <p className="text-muted-foreground mt-2">
            Загрузите фотографию вашей еды, и мы автоматически определим продукты и их питательную
            ценность
          </p>
        </CardHeader>
      </Card>

      {/* Кнопка загрузки */}
      {!processingStatus && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <PhotoUploadButton
                onUploadComplete={() => {
                  // Загрузка завершена, polling начнется автоматически
                }}
              />
              <p className="text-sm text-muted-foreground text-center">
                Поддерживаемые форматы: JPG, PNG, HEIC
                <br />
                Максимальный размер: 10 МБ
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Прогресс обработки */}
      <UploadProgress />

      {/* Результаты анализа */}
      {showResults && (
        <div className="mt-4">
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
        <Card className="mt-4">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Начните с загрузки фотографии вашей еды</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
