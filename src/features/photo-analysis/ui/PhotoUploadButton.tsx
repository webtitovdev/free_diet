// Кнопка для загрузки и анализа фотографии еды
// T069: PhotoUploadButton component

"use client";

import React from "react";
import { Button, message } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { compressPhotoBeforeUpload } from "../lib/compress-image";
import { uploadPhoto, analyzePhoto } from "../api/photo-api";
import { usePhotoAnalysisStore } from "../model/photo-store";

interface PhotoUploadButtonProps {
  onUploadStart?: () => void;
  onUploadComplete?: (photoId: string) => void;
  onError?: (error: string) => void;
}

export const PhotoUploadButton: React.FC<PhotoUploadButtonProps> = ({
  onUploadStart,
  onUploadComplete,
  onError,
}) => {
  const { setUploading, setPhoto, setError, setRecognizedItems, setProcessingStatus } =
    usePhotoAnalysisStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true, 10);
      onUploadStart?.();

      // Сжатие изображения
      message.loading("Подготовка фото...", 0);
      const compressedFile = await compressPhotoBeforeUpload(file);
      setUploading(true, 30);

      // Загрузка на сервер
      message.destroy();
      message.loading("Загрузка фото...", 0);
      const uploadResult = await uploadPhoto(compressedFile);
      setUploading(true, 60);

      // Сохранение информации о фото
      setPhoto(uploadResult.photoId, uploadResult.storageUrl, uploadResult.processingStatus);

      // Запуск анализа
      message.destroy();
      message.loading("Анализ фото...", 0);
      const analyzeResult = await analyzePhoto(uploadResult.photoId);

      // Сохраняем результаты анализа
      if (analyzeResult.recognizedItems) {
        setRecognizedItems(analyzeResult.recognizedItems);
      }
      setProcessingStatus(analyzeResult.processingStatus);
      setUploading(true, 100);

      message.destroy();
      message.success("Фото успешно загружено!");
      onUploadComplete?.(uploadResult.photoId);
    } catch (error) {
      message.destroy();
      const errorMessage = error instanceof Error ? error.message : "Ошибка при загрузке фото";
      message.error(errorMessage);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      // Сброс input для возможности загрузить тот же файл повторно
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/heic"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <Button type="primary" size="large" icon={<CameraOutlined />} onClick={handleButtonClick}>
        Загрузить фото еды
      </Button>
    </>
  );
};
