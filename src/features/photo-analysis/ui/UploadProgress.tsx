// Компонент для отображения прогресса загрузки и обработки фото
// T070 + T070a: UploadProgress with status polling (2-second intervals)

"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Progress, Card, Typography, Spin, Alert } from "antd";
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { PhotoStatus } from "@/entities/photo/model/types";
import { usePhotoAnalysisStore } from "../model/photo-store";
import { getPhotoStatus } from "../api/photo-api";

const { Text } = Typography;

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
    setRecognizedItems,
    setError,
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

      // Если обработка завершена, получаем результаты
      if (statusResult.processingStatus === PhotoStatus.COMPLETED) {
        // Результаты пока не возвращаются из API (см. комментарий в results/route.ts)
        // В будущем здесь будут recognizedItems
        setRecognizedItems([]);
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
  }, [photoId, setProcessingStatus, setRecognizedItems, setError, stopPolling]);

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

  const getProgressStatus = () => {
    if (processingStatus === PhotoStatus.COMPLETED) return "success";
    if (processingStatus === PhotoStatus.FAILED) return "exception";
    return "active";
  };

  const getIcon = () => {
    if (processingStatus === PhotoStatus.COMPLETED) {
      return <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />;
    }
    if (processingStatus === PhotoStatus.FAILED) {
      return <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 24 }} />;
    }
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
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

  return (
    <Card style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        {getIcon()}
        <Text strong>{getMessage()}</Text>
      </div>

      <Progress
        percent={uploadProgress}
        status={getProgressStatus()}
        strokeColor={{
          "0%": "#108ee9",
          "100%": "#87d068",
        }}
      />

      {processingStatus === PhotoStatus.PROCESSING && (
        <Alert
          message="Это может занять несколько секунд"
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {processingStatus === PhotoStatus.FAILED && (
        <Alert
          message="Не удалось распознать продукты на фотографии"
          description="Попробуйте сделать фото еще раз с лучшим освещением"
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Card>
  );
};
