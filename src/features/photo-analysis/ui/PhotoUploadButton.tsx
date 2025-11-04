// Кнопка для загрузки и анализа фотографии еды
// T069: PhotoUploadButton component

"use client";

import React from "react";
import { Camera } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button/Button";
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
  const { toast } = useToast();
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
      toast({ description: "Подготовка фото..." });
      const compressedFile = await compressPhotoBeforeUpload(file);
      setUploading(true, 30);

      // Загрузка на сервер
      toast({ description: "Загрузка фото..." });
      const uploadResult = await uploadPhoto(compressedFile);
      setUploading(true, 60);

      // Сохранение информации о фото
      setPhoto(uploadResult.photoId, uploadResult.storageUrl, uploadResult.processingStatus);

      // Запуск анализа
      toast({ description: "Анализ фото..." });
      const analyzeResult = await analyzePhoto(uploadResult.photoId);

      // Сохраняем результаты анализа
      if (analyzeResult.recognizedItems) {
        setRecognizedItems(analyzeResult.recognizedItems);
      }
      setProcessingStatus(analyzeResult.processingStatus);
      setUploading(true, 100);

      toast({ description: "Фото успешно загружено!" });
      onUploadComplete?.(uploadResult.photoId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ошибка при загрузке фото";
      toast({
        variant: "destructive",
        description: errorMessage,
      });
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
      <Button size="lg" onClick={handleButtonClick} className="w-full">
        <Camera className="h-5 w-5" />
        Загрузить фото еды
      </Button>
    </>
  );
};
