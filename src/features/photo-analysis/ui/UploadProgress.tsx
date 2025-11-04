// Компонент для отображения прогресса загрузки и обработки фото
// T070 + T070a: UploadProgress with status polling (2-second intervals)

"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Loader2, CheckCircle, XCircle, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card/Card";
import { Button } from "@/shared/ui/button/Button";
import { Progress } from "@/shared/ui/progress/Progress";
import { Alert, AlertDescription } from "@/shared/ui/alert/Alert";
import { PhotoStatus } from "@/entities/photo/model/types";
import { usePhotoAnalysisStore } from "../model/photo-store";
import { getPhotoStatus } from "../api/photo-api";

const POLLING_INTERVAL_MS = 2000; // 2 секунды согласно T070a

const statusMessages = {
  [PhotoStatus.UPLOADING]: "Загрузка фотографии...",
  [PhotoStatus.PROCESSING]: "Обработка фотографии...",
  [PhotoStatus.COMPLETED]: "Анализ завершен!",
  [PhotoStatus.FAILED]: "Ошибка при обработке",
};

export const UploadProgress: React.FC = () => {
  const {
    isUploading,
    uploadProgress,
    photoId,
    processingStatus,
    setProcessingStatus,
    setError,
    reset,
  } = usePhotoAnalysisStore();

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Функция для проверки статуса
  const checkStatus = useCallback(async () => {
    if (!photoId) return;

    try {
      const statusResult = await getPhotoStatus(photoId);
      setProcessingStatus(statusResult.processingStatus);

      // Если обработка завершена, останавливаем polling
      if (statusResult.processingStatus === PhotoStatus.COMPLETED) {
        // Результаты уже сохранены в store из PhotoUploadButton после вызова analyzePhoto
        stopPolling();
      } else if (statusResult.processingStatus === PhotoStatus.FAILED) {
        setError("Не удалось распознать продукты на фотографии");
        stopPolling();
      }
    } catch (error) {
      console.error("Status polling error:", error);
      setError("Ошибка при проверке статуса");
      stopPolling();
    }
  }, [photoId, setProcessingStatus, setError, stopPolling]);

  // Запуск polling при статусе PROCESSING
  useEffect(() => {
    if (processingStatus === PhotoStatus.PROCESSING) {
      // Немедленная первая проверка
      checkStatus();

      // Затем проверка каждые 2 секунды
      pollingIntervalRef.current = setInterval(checkStatus, POLLING_INTERVAL_MS);
    }

    return () => {
      stopPolling();
    };
  }, [processingStatus, checkStatus, stopPolling]);

  // Не показываем компонент если нет активной загрузки/обработки
  if (!isUploading && !processingStatus) {
    return null;
  }

  const getIcon = () => {
    if (processingStatus === PhotoStatus.COMPLETED) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    if (processingStatus === PhotoStatus.FAILED) {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
  };

  const getMessage = () => {
    if (processingStatus) {
      return statusMessages[processingStatus];
    }
    if (isUploading) {
      return "Загрузка фотографии...";
    }
    return "";
  };

  const handleRetry = () => {
    reset();
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-4">
          {getIcon()}
          <p className="font-semibold">{getMessage()}</p>
        </div>

        <Progress value={uploadProgress} className="h-2" />

        {processingStatus === PhotoStatus.PROCESSING && (
          <Alert className="mt-4">
            <AlertDescription>Это может занять несколько секунд</AlertDescription>
          </Alert>
        )}

        {processingStatus === PhotoStatus.FAILED && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Не удалось распознать продукты на фотографии</p>
                <p className="text-sm">Попробуйте сделать фото еще раз с лучшим освещением</p>
                <Button size="sm" variant="outline" onClick={handleRetry}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Попробовать снова
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
